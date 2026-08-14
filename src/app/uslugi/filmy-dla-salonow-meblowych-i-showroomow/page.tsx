import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { business } from "@/data/business";
import ServicePage from "@/components/ui/ServicePage";

const SLUG = "filmy-dla-salonow-meblowych-i-showroomow";

export const metadata: Metadata = {
  title: "Filmy dla salonów meblowych i showroomów | Set & Space",
  description:
    "Krótkie filmy dla salonów meblowych, showroomów i realizacji wnętrz. Instagram, Reels, strona salonu.",
  alternates: { canonical: `${business.url}/uslugi/${SLUG}` },
  openGraph: {
    title: "Filmy dla salonów meblowych i showroomów | Set & Space",
    description:
      "Prezentacja przestrzeni ekspozycyjnej i realizacji wnętrz w formacie dopasowanym do social mediów.",
    url: `${business.url}/uslugi/${SLUG}`,
  },
};

export default function FilmyDlaSalonowPage() {
  const service = getServiceBySlug(SLUG);
  if (!service) notFound();

  const relatedProjects = projects.filter((p) => p.category === "architektura");

  return <ServicePage service={service} relatedProjects={relatedProjects} />;
}
