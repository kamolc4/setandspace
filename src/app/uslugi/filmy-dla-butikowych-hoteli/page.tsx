import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { business } from "@/data/business";
import ServicePage from "@/components/ui/ServicePage";

const SLUG = "filmy-dla-butikowych-hoteli";

export const metadata: Metadata = {
  title: "Filmy dla butikowych hoteli | Set & Space",
  description:
    "Krótkie filmy promocyjne dla butikowych hoteli i obiektów z charakterem. Instagram, strona hotelu, kampanie sezonowe.",
  alternates: { canonical: `${business.url}/uslugi/${SLUG}` },
  openGraph: {
    title: "Filmy dla butikowych hoteli | Set & Space",
    description:
      "Materiał budujący nastrój miejsca. Pozwala poczuć atmosferę obiektu, zanim gość dokona rezerwacji.",
    url: `${business.url}/uslugi/${SLUG}`,
  },
};

export default function FilmyDlaButikowychHoteliPage() {
  const service = getServiceBySlug(SLUG);
  if (!service) notFound();

  const relatedProjects = projects.filter((p) => p.category === "hotele");

  return <ServicePage service={service} relatedProjects={relatedProjects} />;
}
