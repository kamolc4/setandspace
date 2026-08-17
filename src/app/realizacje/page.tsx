import type { Metadata } from "next";
import { business } from "@/data/business";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Realizacje — Set & Space",
  description:
    "Portfolio filmów kinematograficznych Set & Space dla nieruchomości, hoteli, architektury i wnętrz.",
  alternates: { canonical: `${business.url}/realizacje` },
};

export default function RealizacjePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ label: "Realizacje", href: "/realizacje" }]} />

      <div
        style={{
          padding: "5.5rem 1.5rem 5rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <Breadcrumb items={[{ label: "Realizacje" }]} />

        <h1
          className="text-headline"
          style={{ color: "var(--text-primary)" }}
        >
          Realizacje.
        </h1>
      </div>
    </>
  );
}
