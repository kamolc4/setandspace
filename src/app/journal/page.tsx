import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/data/journal";
import { business } from "@/data/business";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Journal — wiedza o filmie, przestrzeni i procesie twórczym",
  description:
    "Set & Space Journal: artykuły o produkcji filmowej dla hoteli i nieruchomości, przygotowaniu do nagrań, roli światła i procesie twórczym.",
  alternates: { canonical: `${business.url}/journal` },
};

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

const sortedArticles = [...articles].sort(
  (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
);

export default function JournalPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ label: "Journal", href: "/journal" }]} />

      <div
        style={{
          paddingTop: "5.5rem",
          paddingBottom: "5rem",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "5.5rem 1.5rem 5rem",
        }}
      >
        <Breadcrumb items={[{ label: "Journal" }]} />

        <header style={{ marginBottom: "3.5rem" }}>
          <p
            className="text-label"
            style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}
          >
            Z naszego warsztatu
          </p>
          <h1
            className="text-headline"
            style={{ color: "var(--text-primary)", maxWidth: "560px" }}
          >
            Journal.
          </h1>
          <p className="text-body" style={{ maxWidth: "480px", marginTop: "1rem" }}>
            Piszemy o tym, co wiemy: o przygotowaniu do nagrań, roli światła, procesie produkcji
            i tym, co sprawia, że film dobrze służy przestrzeni i marce.
          </p>
        </header>

        {/* Featured article */}
        {sortedArticles[0] && (
          <Link
            href={`/journal/${sortedArticles[0].slug}`}
            style={{
              display: "block",
              backgroundColor: "var(--text-primary)",
              borderRadius: "var(--radius-panel)",
              padding: "clamp(1.5rem, 4vw, 3rem)",
              textDecoration: "none",
              color: "inherit",
              marginBottom: "0.625rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "2rem",
                alignItems: "end",
              }}
              className="featured-article-grid"
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span className="text-label" style={{ color: "var(--clay)" }}>
                    Wyróżniony artykuł
                  </span>
                  <span className="text-label" style={{ color: "rgba(241,233,224,0.3)" }}>
                    ·
                  </span>
                  <span className="text-label" style={{ color: "rgba(241,233,224,0.4)" }}>
                    {sortedArticles[0].category}
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.75rem, 4vw, 3rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    color: "var(--surface)",
                    marginBottom: "1.25rem",
                  }}
                >
                  {sortedArticles[0].title}
                </h2>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "rgba(241,233,224,0.65)",
                    lineHeight: 1.65,
                    maxWidth: "560px",
                  }}
                >
                  {sortedArticles[0].excerpt}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <time
                  dateTime={sortedArticles[0].publishDate}
                  className="text-label"
                  style={{ color: "rgba(241,233,224,0.5)" }}
                >
                  {formatDate(sortedArticles[0].publishDate)}
                </time>
                <span style={{ color: "var(--clay)", fontSize: "1.25rem" }}>↗</span>
              </div>
            </div>
          </Link>
        )}

        {/* Remaining articles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "0.625rem",
          }}
        >
          {sortedArticles.slice(1).map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              style={{
                display: "block",
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-card)",
                padding: "1.75rem 1.5rem",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <span className="text-label" style={{ color: "var(--text-muted)" }}>
                  {article.category}
                </span>
                <span style={{ color: "var(--stone)", fontSize: "0.875rem" }}>↗</span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.1rem, 2vw, 1.375rem)",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                  marginBottom: "0.75rem",
                }}
              >
                {article.title}
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "1.25rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {article.excerpt}
              </p>
              <time
                dateTime={article.publishDate}
                className="text-label"
                style={{ color: "var(--stone)" }}
              >
                {formatDate(article.publishDate)}
              </time>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .featured-article-grid {
            grid-template-columns: 1fr 280px !important;
          }
        }
      `}</style>
    </>
  );
}
