import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { business } from "@/data/business";
import ServicePage from "@/components/ui/ServicePage";

const SLUG = "filmy-dla-hoteli";

export const metadata: Metadata = {
  title: "Filmy dla hoteli i obiektów hospitality | Set & Space",
  description:
    "Kinematograficzne filmy promocyjne dla hoteli, pensjonatów, resortów i obiektów spa. Tworzymy materiały, które sprzedają atmosferę miejsca. Polska.",
  alternates: { canonical: `${business.url}/uslugi/${SLUG}` },
  openGraph: {
    title: "Filmy dla hoteli i obiektów hospitality | Set & Space",
    description:
      "Filmy, które pozwalają poczuć hotel zanim gość przekroczy próg. Kinematograficzne realizacje dla hospitality.",
    url: `${business.url}/uslugi/${SLUG}`,
  },
};

export default function FilmyDlaHoteliPage() {
  const service = getServiceBySlug(SLUG);
  if (!service) notFound();

  const relatedProjects = projects.filter((p) => p.category === "hotele");

  return <ServicePage service={service} relatedProjects={relatedProjects} />;
}
