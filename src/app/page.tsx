import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/data/business";
import { getFeaturedProjects, projects } from "@/data/projects";
import { services } from "@/data/services";
import { getLatestArticles } from "@/data/journal";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import HeroGrid from "@/components/homepage/HeroGrid";
import ServicesPreview from "@/components/homepage/ServicesPreview";
import JournalPreview from "@/components/homepage/JournalPreview";
import FinalCta from "@/components/homepage/FinalCta";

export const metadata: Metadata = {
  title: `${business.name} — Filmy kinematograficzne dla przestrzeni i marek`,
  description:
    "Set & Space tworzy filmy kinematograficzne dla hoteli, nieruchomości, architektury i marek premium. Opowiadamy przestrzeń obrazem.",
  alternates: { canonical: business.url },
  openGraph: {
    title: `${business.name} — Filmy kinematograficzne dla przestrzeni i marek`,
    description:
      "Filmy, które pozwalają poczuć miejsce. Hotele, nieruchomości, architektura i marki premium.",
    url: business.url,
  },
};

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const latestArticles = getLatestArticles(3);

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />

      {/* Hero / Bento editorial grid */}
      <HeroGrid featuredProjects={featuredProjects} allProjects={projects} />

      {/* Services preview */}
      <ServicesPreview services={services} />

      {/* About preview */}
      <section
        aria-labelledby="about-heading"
        style={{ padding: "4rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
            alignItems: "center",
          }}
          className="homepage-about-grid"
        >
          <div style={{ maxWidth: "560px" }}>
            <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              O Set & Space
            </p>
            <h2
              id="about-heading"
              className="text-headline"
              style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}
            >
              Traktujemy przestrzeń<br />
              <em>jako materiał filmowy.</em>
            </h2>
            <p className="text-body" style={{ marginBottom: "1.25rem" }}>
              Set & Space to studio filmowe, które skupiło się na jednym: kinematograficznym
              opowiadaniu o przestrzeni. Pracujemy z hotelami, deweloperami, architektami
              i wybranymi markami, którym zależy na tym, jak ich miejsce jest widziane.
            </p>
            <p className="text-body" style={{ marginBottom: "2rem" }}>
              Każdy projekt zaczyna się od rozmowy o tym, czym jest dane miejsce i jak
              chcemy, żeby się je czuło. Zanim w ogóle pomyślimy o kamerze.
            </p>
            <Link
              href="/o-nas"
              className="text-label"
              style={{
                color: "var(--text-primary)",
                borderBottom: "1px solid var(--text-primary)",
                paddingBottom: "2px",
              }}
            >
              Poznaj nasze podejście →
            </Link>
          </div>

          <blockquote
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.35,
              color: "var(--text-muted)",
              borderLeft: "2px solid var(--stone)",
              paddingLeft: "1.5rem",
              margin: 0,
            }}
          >
            &ldquo;Nie robimy filmów o przestrzeni. Robimy filmy, które pozwalają ją poczuć.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Journal preview */}
      <JournalPreview articles={latestArticles} />

      {/* Final CTA */}
      <FinalCta />
    </>
  );
}
