import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { business } from "@/data/business";
import ServicePage from "@/components/ui/ServicePage";

const SLUG = "video-nieruchomosci";

export const metadata: Metadata = {
  title: "Video nieruchomości i filmowanie apartamentów | Set & Space",
  description:
    "Filmy nieruchomości dla deweloperów, biur i prywatnych sprzedających. Pokaż przestrzeń z charakterem — kinematograficzne video na rynek premium. Polska.",
  alternates: { canonical: `${business.url}/uslugi/${SLUG}` },
};

export default function VideoNieruchomosciPage() {
  const service = getServiceBySlug(SLUG);
  if (!service) notFound();

  const relatedProjects = projects.filter((p) => p.category === "nieruchomosci");

  return <ServicePage service={service} relatedProjects={relatedProjects} />;
}
