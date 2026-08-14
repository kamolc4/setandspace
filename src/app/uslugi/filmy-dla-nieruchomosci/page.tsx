import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { business } from "@/data/business";
import ServicePage from "@/components/ui/ServicePage";

const SLUG = "filmy-dla-nieruchomosci";

export const metadata: Metadata = {
  title: "Filmy dla nieruchomości | Set & Space",
  description:
    "Krótkie, estetyczne filmy dla nieruchomości. Sprzedaż, wynajem i prezentacje inwestorskie. Instagram, social media, strona internetowa.",
  alternates: { canonical: `${business.url}/uslugi/${SLUG}` },
  openGraph: {
    title: "Filmy dla nieruchomości | Set & Space",
    description:
      "Filmy, które pokazują przestrzeń tak, jak wygląda naprawdę. Sprzedaż, wynajem, prezentacje inwestorskie.",
    url: `${business.url}/uslugi/${SLUG}`,
  },
};

export default function FilmyDlaNieruchomosciPage() {
  const service = getServiceBySlug(SLUG);
  if (!service) notFound();

  const relatedProjects = projects.filter((p) => p.category === "nieruchomosci");

  return <ServicePage service={service} relatedProjects={relatedProjects} />;
}
