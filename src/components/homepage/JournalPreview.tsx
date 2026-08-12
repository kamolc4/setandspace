import Link from "next/link";
import type { JournalArticle } from "@/data/journal";

interface JournalPreviewProps {
  articles: JournalArticle[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function JournalPreview({ articles }: JournalPreviewProps) {
  return (
    <section
      aria-labelledby="journal-heading"
      style={{
        backgroundColor: "var(--surface)",
        padding: "5rem 1.5rem",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              className="text-label"
              style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}
            >
              Journal
            </p>
            <h2
              id="journal-heading"
              className="text-headline"
              style={{ color: "var(--text-primary)", margin: 0 }}
            >
              Z naszego warsztatu.
            </h2>
          </div>
          <Link
            href="/journal"
            className="text-label"
            style={{
              color: "var(--text-primary)",
              borderBottom: "1px solid var(--text-primary)",
              paddingBottom: "2px",
            }}
          >
            Wszystkie artykuły →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "0.625rem",
          }}
        >
          {articles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              style={{
                display: "block",
                borderRadius: "var(--radius-card)",
                backgroundColor: i === 0 ? "var(--text-primary)" : "var(--bg)",
                padding: "1.75rem 1.5rem",
                textDecoration: "none",
                color: "inherit",
                border: i !== 0 ? "1px solid var(--border)" : "none",
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
                <span
                  className="text-label"
                  style={{ color: i === 0 ? "var(--clay)" : "var(--text-muted)" }}
                >
                  {article.category}
                </span>
                <span
                  aria-hidden="true"
                  style={{ color: i === 0 ? "var(--clay)" : "var(--stone)", fontSize: "0.875rem" }}
                >
                  ↗
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.125rem, 2vw, 1.4rem)",
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: i === 0 ? "var(--surface)" : "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {article.title}
              </h3>

              <p
                style={{
                  fontSize: "0.875rem",
                  color: i === 0 ? "var(--clay)" : "var(--text-secondary)",
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
                style={{ color: i === 0 ? "rgba(241,233,224,0.4)" : "var(--stone)" }}
              >
                {formatDate(article.publishDate)}
              </time>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
