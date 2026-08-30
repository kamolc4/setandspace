import type { MetadataRoute } from "next";
import { business } from "@/data/business";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { articles as staticArticles } from "@/data/journal";
import { getPrisma } from "@/lib/prisma";

const BASE = business.url;

const PAGE_DATES: Record<string, string> = {
  "/":                     "2026-08-17",
  "/realizacje":           "2026-08-17",
  "/uslugi":               "2026-08-17",
  "/wspolpraca":           "2026-08-17",
  "/poradniki":            "2026-08-19",
  "/o-mnie":               "2026-08-17",
  "/kontakt":              "2026-08-19",
  "/polityka-prywatnosci": "2026-08-30",
};

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                           lastModified: PAGE_DATES["/"],                     changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/realizacje`,           lastModified: PAGE_DATES["/realizacje"],           changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/uslugi`,               lastModified: PAGE_DATES["/uslugi"],               changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/wspolpraca`,           lastModified: PAGE_DATES["/wspolpraca"],           changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/poradniki`,            lastModified: PAGE_DATES["/poradniki"],            changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/o-mnie`,              lastModified: PAGE_DATES["/o-mnie"],              changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/kontakt`,              lastModified: PAGE_DATES["/kontakt"],              changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/polityka-prywatnosci`, lastModified: PAGE_DATES["/polityka-prywatnosci"], changeFrequency: "yearly",  priority: 0.3 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE}/uslugi/${s.slug}`,
    lastModified: PAGE_DATES["/uslugi"],
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/realizacje/${p.slug}`,
    lastModified: p.videoUploadDate ?? PAGE_DATES["/realizacje"],
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // Try to fetch published articles from DB; fall back to static data
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = getPrisma();
    const rows = await db.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, publishedAt: true, updatedAt: true },
    });
    articleRoutes = rows.map((a) => ({
      url: `${BASE}/poradniki/${a.slug}`,
      lastModified: (a.updatedAt ?? a.publishedAt ?? new Date()).toISOString().slice(0, 10),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    articleRoutes = staticArticles.map((a) => ({
      url: `${BASE}/poradniki/${a.slug}`,
      lastModified: a.modifiedDate ?? a.publishDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  // DB portfolio projects (PUBLISHED)
  let dbProjectRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = getPrisma();
    const rows = await db.portfolioProject.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, publishedAt: true, updatedAt: true },
    });
    dbProjectRoutes = rows.map((p) => ({
      url: `${BASE}/realizacje/${p.slug}`,
      lastModified: (p.updatedAt ?? p.publishedAt ?? new Date()).toISOString().slice(0, 10),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));
  } catch {
    // DB unavailable — static project routes already included above
  }

  // Merge: DB routes take precedence over static routes for same slug
  const dbSlugs = new Set(dbProjectRoutes.map((r) => r.url));
  const filteredStaticProjectRoutes = projectRoutes.filter((r) => !dbSlugs.has(r.url));

  return [...staticRoutes, ...serviceRoutes, ...filteredStaticProjectRoutes, ...dbProjectRoutes, ...articleRoutes];
}
