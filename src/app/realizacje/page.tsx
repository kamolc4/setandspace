import type { Metadata } from "next";
import { projects, categoryLabels } from "@/data/projects";
import { business } from "@/data/business";
import ProjectCard from "@/components/ui/ProjectCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Realizacje — portfolio filmów kinematograficznych",
  description:
    "Portfolio Set & Space — filmy dla hoteli, nieruchomości, architektury i marek premium. Kinematograficzne realizacje w Polsce.",
  alternates: { canonical: `${business.url}/realizacje` },
};

const categories = [
  { key: "all", label: "Wszystkie" },
  { key: "hotele", label: categoryLabels.hotele },
  { key: "nieruchomosci", label: categoryLabels.nieruchomosci },
  { key: "architektura", label: categoryLabels.architektura },
  { key: "marki", label: categoryLabels.marki },
] as const;

export default function RealizacjePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ label: "Realizacje", href: "/realizacje" }]} />

      <div style={{ paddingTop: "5.5rem", padding: "5.5rem 1.5rem 5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <Breadcrumb items={[{ label: "Realizacje" }]} />

        <header style={{ marginBottom: "3rem" }}>
          <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Portfolio
          </p>
          <h1 className="text-headline" style={{ color: "var(--text-primary)", maxWidth: "560px" }}>
            Realizacje.
          </h1>
          <p className="text-body" style={{ maxWidth: "520px", marginTop: "1rem" }}>
            Każdy projekt to osobna historia miejsca, atmosfery i narracji wizualnej.
          </p>
        </header>

        {/* Category nav — crawlable links */}
        <nav aria-label="Kategorie realizacji" style={{ marginBottom: "3.5rem" }}>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {categories.map((cat) => (
              <li key={cat.key}>
                {cat.key === "all" ? (
                  <span
                    className="text-label"
                    style={{
                      display: "inline-block",
                      padding: "0.4rem 1rem",
                      borderRadius: "99px",
                      backgroundColor: "var(--text-primary)",
                      color: "var(--surface)",
                    }}
                  >
                    {cat.label}
                  </span>
                ) : (
                  <Link
                    href={`/realizacje?kategoria=${cat.key}`}
                    className="text-label"
                    style={{
                      display: "inline-block",
                      padding: "0.4rem 1rem",
                      borderRadius: "99px",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {cat.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* All projects grid (all categories together for SSR crawlability) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "0.75rem",
          }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} priority={i < 2} />
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-body" style={{ textAlign: "center", padding: "4rem 0" }}>
            Realizacje wkrótce.
          </p>
        )}
      </div>
    </>
  );
}
