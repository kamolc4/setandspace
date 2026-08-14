import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { business } from "@/data/business";
import ServicePage from "@/components/ui/ServicePage";

const SLUG = "filmy-dla-architektow-i-projektantow-wnetrz";

export const metadata: Metadata = {
  title: "Filmy dla architektów i projektantów wnętrz | Set & Space",
  description:
    "Krótkie filmy dokumentujące realizacje architektoniczne i projekty wnętrz. Portfolio w ruchu, social media, strona pracowni.",
  alternates: { canonical: `${business.url}/uslugi/${SLUG}` },
  openGraph: {
    title: "Filmy dla architektów i projektantów wnętrz | Set & Space",
    description:
      "Dokumentacja projektów architektonicznych i wnętrz. Przestrzeń zmienia się z ruchem kamery inaczej niż na zdjęciu.",
    url: `${business.url}/uslugi/${SLUG}`,
  },
};

export default function FilmyDlaArchitektoowPage() {
  const service = getServiceBySlug(SLUG);
  if (!service) notFound();

  const relatedProjects = projects.filter((p) => p.category === "architektura");

  return <ServicePage service={service} relatedProjects={relatedProjects} />;
}
