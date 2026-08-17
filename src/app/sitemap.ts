import type { MetadataRoute } from "next";
import { business } from "@/data/business";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { articles } from "@/data/journal";

const BASE = business.url;

// Update each path's date whenever its content changes meaningfully
const PAGE_DATES: Record<string, string> = {
  "/":                     "2026-08-17",
  "/realizacje":           "2026-08-17",
  "/uslugi":               "2026-08-17",
  "/wspolpraca":           "2026-08-17",
  "/poradniki":            "2026-05-14",
  "/o-mnie":               "2026-08-17",
  "/kontakt":              "2026-08-17",
  "/polityka-prywatnosci": "2026-08-17",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: PAGE_DATES["/"],
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/realizacje`,
      lastModified: PAGE_DATES["/realizacje"],
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/uslugi`,
      lastModified: PAGE_DATES["/uslugi"],
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/wspolpraca`,
      lastModified: PAGE_DATES["/wspolpraca"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/poradniki`,
      lastModified: PAGE_DATES["/poradniki"],
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/o-mnie`,
      lastModified: PAGE_DATES["/o-mnie"],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/kontakt`,
      lastModified: PAGE_DATES["/kontakt"],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/polityka-prywatnosci`,
      lastModified: PAGE_DATES["/polityka-prywatnosci"],
      changeFrequency: "yearly",
      priority: 0.3,
    },
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

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/poradniki/${a.slug}`,
    lastModified: a.modifiedDate ?? a.publishDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...articleRoutes,
  ];
}
