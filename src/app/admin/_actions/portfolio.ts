"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";
import { parseVideoUrl } from "@/lib/video-parser";
import type { Status, AspectRatio } from "@/generated/prisma/client";

async function requireAuth() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
}

const ProjectSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki"),
  shortDescription: z.string().default(""),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  category: z.string().default(""),
  location: z.string().optional(),
  clientName: z.string().optional(),
  videoUrl: z.string().optional(),
  videoAspectRatio: z.enum(["PORTRAIT", "LANDSCAPE", "SQUARE"]).default("PORTRAIT"),
  posterImage: z.string().optional(),
  posterAlt: z.string().optional(),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  publishedAt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonical: z.string().optional(),
});

type FormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

function extractFormData(formData: FormData): Record<string, unknown> {
  return {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    shortDescription: (formData.get("shortDescription") as string) ?? "",
    description: (formData.get("description") as string | null) || undefined,
    status: formData.get("status") as string,
    category: (formData.get("category") as string) ?? "",
    location: (formData.get("location") as string | null) || undefined,
    clientName: (formData.get("clientName") as string | null) || undefined,
    videoUrl: (formData.get("videoUrl") as string | null) || undefined,
    videoAspectRatio: (formData.get("videoAspectRatio") as string) || "PORTRAIT",
    posterImage: (formData.get("posterImage") as string | null) || undefined,
    posterAlt: (formData.get("posterAlt") as string | null) || undefined,
    featured: formData.get("featured") === "true",
    sortOrder: parseInt((formData.get("sortOrder") as string) || "0", 10) || 0,
    publishedAt: (formData.get("publishedAt") as string | null) || undefined,
    seoTitle: (formData.get("seoTitle") as string | null) || undefined,
    seoDescription: (formData.get("seoDescription") as string | null) || undefined,
    canonical: (formData.get("canonical") as string | null) || undefined,
  };
}

function resolveVideo(videoUrl?: string): { videoProvider: string | null; videoId: string | null } {
  if (!videoUrl) return { videoProvider: null, videoId: null };
  const parsed = parseVideoUrl(videoUrl);
  if (!parsed) return { videoProvider: null, videoId: null };
  return { videoProvider: parsed.provider, videoId: parsed.videoId };
}

export async function createPortfolioProjectAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAuth();

  const raw = extractFormData(formData);
  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  if (data.videoUrl && !parseVideoUrl(data.videoUrl)) {
    return { fieldErrors: { videoUrl: ["Nieprawidłowy URL. Wklej link z Vimeo lub YouTube."] } };
  }

  if (data.status === "PUBLISHED") {
    const missing: string[] = [];
    if (!data.title) missing.push("tytuł");
    if (!data.slug) missing.push("slug");
    if (!data.category) missing.push("kategoria");
    if (!data.shortDescription) missing.push("krótki opis");
    if (!data.videoUrl) missing.push("URL filmu");
    if (!data.seoTitle) missing.push("tytuł SEO");
    if (!data.seoDescription) missing.push("opis meta");
    if (missing.length) {
      return { error: `Przed publikacją uzupełnij: ${missing.join(", ")}.` };
    }
  }

  const db = getPrisma();
  const existing = await db.portfolioProject.findUnique({ where: { slug: data.slug } });
  if (existing) return { fieldErrors: { slug: ["Ten slug jest już zajęty."] } };

  const { videoProvider, videoId } = resolveVideo(data.videoUrl);

  const project = await db.portfolioProject.create({
    data: {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description ?? null,
      status: data.status as Status,
      category: data.category,
      location: data.location ?? null,
      clientName: data.clientName ?? null,
      videoUrl: data.videoUrl ?? null,
      videoProvider,
      videoId,
      videoAspectRatio: data.videoAspectRatio as AspectRatio,
      posterImage: data.posterImage ?? null,
      posterAlt: data.posterAlt ?? null,
      featured: data.featured,
      sortOrder: data.sortOrder,
      publishedAt: data.status === "PUBLISHED"
        ? (data.publishedAt ? new Date(data.publishedAt) : new Date())
        : null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      canonical: data.canonical ?? null,
    },
  });

  revalidatePath("/realizacje");
  if (data.status === "PUBLISHED") {
    revalidatePath(`/realizacje/${project.slug}`);
  }
  revalidatePath("/sitemap.xml");

  redirect(`/admin/realizacje/${project.id}`);
}

export async function updatePortfolioProjectAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAuth();

  const raw = extractFormData(formData);
  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  if (data.videoUrl && !parseVideoUrl(data.videoUrl)) {
    return { fieldErrors: { videoUrl: ["Nieprawidłowy URL. Wklej link z Vimeo lub YouTube."] } };
  }

  if (data.status === "PUBLISHED") {
    const missing: string[] = [];
    if (!data.title) missing.push("tytuł");
    if (!data.slug) missing.push("slug");
    if (!data.category) missing.push("kategoria");
    if (!data.shortDescription) missing.push("krótki opis");
    if (!data.videoUrl) missing.push("URL filmu");
    if (!data.seoTitle) missing.push("tytuł SEO");
    if (!data.seoDescription) missing.push("opis meta");
    if (missing.length) {
      return { error: `Przed publikacją uzupełnij: ${missing.join(", ")}.` };
    }
  }

  const db = getPrisma();
  const current = await db.portfolioProject.findUnique({ where: { id } });
  if (!current) return { error: "Realizacja nie istnieje." };

  const slugConflict = await db.portfolioProject.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (slugConflict) return { fieldErrors: { slug: ["Ten slug jest już zajęty przez inną realizację."] } };

  const { videoProvider, videoId } = resolveVideo(data.videoUrl);

  const project = await db.portfolioProject.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description ?? null,
      status: data.status as Status,
      category: data.category,
      location: data.location ?? null,
      clientName: data.clientName ?? null,
      videoUrl: data.videoUrl ?? null,
      videoProvider,
      videoId,
      videoAspectRatio: data.videoAspectRatio as AspectRatio,
      posterImage: data.posterImage ?? null,
      posterAlt: data.posterAlt ?? null,
      featured: data.featured,
      sortOrder: data.sortOrder,
      publishedAt: data.status === "PUBLISHED"
        ? (current.publishedAt ?? (data.publishedAt ? new Date(data.publishedAt) : new Date()))
        : current.publishedAt,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      canonical: data.canonical ?? null,
    },
  });

  revalidatePath("/realizacje");
  revalidatePath(`/realizacje/${project.slug}`);
  if (current.slug !== project.slug) {
    revalidatePath(`/realizacje/${current.slug}`);
  }
  revalidatePath("/sitemap.xml");

  return null;
}

export async function deletePortfolioProjectAction(id: string): Promise<void> {
  await requireAuth();
  const db = getPrisma();
  const project = await db.portfolioProject.findUnique({ where: { id } });
  if (!project) return;
  await db.portfolioProject.delete({ where: { id } });
  revalidatePath("/realizacje");
  revalidatePath(`/realizacje/${project.slug}`);
  revalidatePath("/sitemap.xml");
  redirect("/admin/realizacje");
}

export async function toggleProjectStatusAction(id: string, status: Status): Promise<void> {
  await requireAuth();
  const db = getPrisma();
  const project = await db.portfolioProject.update({
    where: { id },
    data: { status },
  });
  if (status === "PUBLISHED" && !project.publishedAt) {
    await db.portfolioProject.update({ where: { id }, data: { publishedAt: new Date() } });
  }
  revalidatePath("/realizacje");
  revalidatePath(`/realizacje/${project.slug}`);
  revalidatePath("/sitemap.xml");
}

export async function generateProjectSlugAction(title: string): Promise<string> {
  return generateSlug(title);
}
