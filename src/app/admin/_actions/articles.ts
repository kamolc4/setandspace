"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";
import { Prisma } from "@prisma/client";
import type { Status } from "@prisma/client";

async function requireAuth() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
}

const ArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki"),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  category: z.string().default(""),
  author: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  publishedAt: z.string().optional(),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonical: z.string().optional(),
  ogImage: z.string().optional(),
  relatedService: z.string().optional(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
});

type FormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

function extractFormData(formData: FormData): Record<string, unknown> {
  const faqRaw = formData.get("faq") as string | null;
  let faq: { question: string; answer: string }[] = [];
  try {
    faq = faqRaw ? JSON.parse(faqRaw) : [];
  } catch {
    faq = [];
  }

  return {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: formData.get("excerpt") as string ?? "",
    content: formData.get("content") as string ?? "",
    category: formData.get("category") as string ?? "",
    author: (formData.get("author") as string | null) || undefined,
    status: formData.get("status") as string,
    publishedAt: (formData.get("publishedAt") as string | null) || undefined,
    featured: formData.get("featured") === "true",
    seoTitle: (formData.get("seoTitle") as string | null) || undefined,
    seoDescription: (formData.get("seoDescription") as string | null) || undefined,
    canonical: (formData.get("canonical") as string | null) || undefined,
    ogImage: (formData.get("ogImage") as string | null) || undefined,
    relatedService: (formData.get("relatedService") as string | null) || undefined,
    faq,
  };
}

export async function createArticleAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAuth();

  const raw = extractFormData(formData);
  const parsed = ArticleSchema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  if (data.status === "PUBLISHED" && (!data.seoTitle || !data.seoDescription || !data.excerpt)) {
    return { error: "Przed publikacją uzupełnij excerpt, SEO title i SEO description." };
  }

  const db = getPrisma();
  const existing = await db.article.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { fieldErrors: { slug: ["Ten slug jest już zajęty."] } };
  }

  const article = await db.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      author: data.author ?? null,
      status: data.status as Status,
      publishedAt: data.status === "PUBLISHED"
        ? (data.publishedAt ? new Date(data.publishedAt) : new Date())
        : null,
      featured: data.featured,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      canonical: data.canonical ?? null,
      ogImage: data.ogImage ?? null,
      relatedService: data.relatedService ?? null,
      faq: data.faq.length ? data.faq : Prisma.JsonNull,
    },
  });

  revalidatePath("/poradniki");
  if (data.status === "PUBLISHED") {
    revalidatePath(`/poradniki/${article.slug}`);
  }

  redirect(`/admin/poradniki/${article.id}`);
}

export async function updateArticleAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAuth();

  const raw = extractFormData(formData);
  const parsed = ArticleSchema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  if (data.status === "PUBLISHED" && (!data.seoTitle || !data.seoDescription || !data.excerpt)) {
    return { error: "Przed publikacją uzupełnij excerpt, SEO title i SEO description." };
  }

  const db = getPrisma();
  const current = await db.article.findUnique({ where: { id } });
  if (!current) return { error: "Artykuł nie istnieje." };

  const slugConflict = await db.article.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  if (slugConflict) {
    return { fieldErrors: { slug: ["Ten slug jest już zajęty przez inny artykuł."] } };
  }

  const article = await db.article.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      author: data.author ?? null,
      status: data.status as Status,
      publishedAt: data.status === "PUBLISHED"
        ? (current.publishedAt ?? (data.publishedAt ? new Date(data.publishedAt) : new Date()))
        : current.publishedAt,
      featured: data.featured,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      canonical: data.canonical ?? null,
      ogImage: data.ogImage ?? null,
      relatedService: data.relatedService ?? null,
      faq: data.faq.length ? data.faq : Prisma.JsonNull,
    },
  });

  revalidatePath("/poradniki");
  revalidatePath(`/poradniki/${article.slug}`);
  if (current.slug !== article.slug) {
    revalidatePath(`/poradniki/${current.slug}`);
  }

  return null;
}

export async function deleteArticleAction(id: string): Promise<void> {
  await requireAuth();
  const db = getPrisma();
  const article = await db.article.findUnique({ where: { id } });
  if (!article) return;
  await db.article.delete({ where: { id } });
  revalidatePath("/poradniki");
  revalidatePath(`/poradniki/${article.slug}`);
  redirect("/admin/poradniki");
}

export async function toggleStatusAction(id: string, status: Status): Promise<void> {
  await requireAuth();
  const db = getPrisma();
  const article = await db.article.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED"
        ? undefined
        : undefined,
    },
  });

  if (status === "PUBLISHED" && !article.publishedAt) {
    await db.article.update({ where: { id }, data: { publishedAt: new Date() } });
  }

  revalidatePath("/poradniki");
  revalidatePath(`/poradniki/${article.slug}`);
}

export async function generateSlugAction(title: string): Promise<string> {
  return generateSlug(title);
}
