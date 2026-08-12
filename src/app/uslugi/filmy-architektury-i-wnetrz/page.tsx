import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { business } from "@/data/business";
import ServicePage from "@/components/ui/ServicePage";

const SLUG = "filmy-architektury-i-wnetrz";

export const metadata: Metadata = {
  title: "Filmy architektury i filmowanie wnętrz | Set & Space",
  description:
    "Kinematograficzne filmy dla pracowni architektonicznych i projektantów wnętrz. Portfolio w ruchu. Przestrzeń architektoniczna opowiedziana obrazem. Polska.",
  alternates: { canonical: `${business.url}/uslugi/${SLUG}` },
};

export default function FilmyArchitekturyPage() {
  const service = getServiceBySlug(SLUG);
  if (!service) notFound();

  const relatedProjects = projects.filter((p) => p.category === "architektura");

  return <ServicePage service={service} relatedProjects={relatedProjects} />;
}
