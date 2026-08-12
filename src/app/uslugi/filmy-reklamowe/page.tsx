import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { business } from "@/data/business";
import ServicePage from "@/components/ui/ServicePage";

const SLUG = "filmy-reklamowe";

export const metadata: Metadata = {
  title: "Filmy reklamowe i brand content | Set & Space",
  description:
    "Produkcja filmów reklamowych i brand contentu dla marek premium. Estetyczna komunikacja, kinematograficzne podejście do obrazu i narracji. Polska.",
  alternates: { canonical: `${business.url}/uslugi/${SLUG}` },
};

export default function FilmyReklamoweePage() {
  const service = getServiceBySlug(SLUG);
  if (!service) notFound();

  const relatedProjects = projects.filter((p) => p.category === "marki");

  return <ServicePage service={service} relatedProjects={relatedProjects} />;
}
