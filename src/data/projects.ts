export type VideoProvider = "vimeo" | "youtube" | "none";

export interface ProjectGalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  category: "hotele" | "nieruchomosci" | "architektura" | "marki";
  categoryLabel: string;
  location: string;
  year: number | null;
  shortDescription: string;
  story: string;
  scope: string[];
  posterImage: string;
  posterAlt: string;
  videoProvider: VideoProvider;
  vimeoId: string | null;
  youtubeId: string | null;
  videoDuration: string | null; // ISO 8601, e.g. "PT3M30S"
  videoUploadDate: string | null; // ISO 8601 date
  gallery: ProjectGalleryImage[];
  featured: boolean;
  relatedSlugs: string[];
  relatedService: string | null;
  seo: {
    title: string;
    description: string;
  };
}

export const projects: Project[] = [];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(
  category: Project["category"]
): Project[] {
  return projects.filter((p) => p.category === category);
}

export const categoryLabels: Record<Project["category"], string> = {
  hotele: "Hotele i hospitality",
  nieruchomosci: "Nieruchomości",
  architektura: "Architektura i wnętrza",
  marki: "Marki",
};
