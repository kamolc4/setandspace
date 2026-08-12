import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticleBySlug } from "@/data/journal";
import { getServiceBySlug } from "@/data/services";
import { getProjectBySlug } from "@/data/projects";
import { business } from "@/data/business";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProjectCard from "@/components/ui/ProjectCard";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: {
      canonical: article.seo.canonical ?? `${business.url}/journal/${slug}`,
    },
    openGraph: {
      title: article.seo.title,
      description: article.seo.description,
      type: "article",
      publishedTime: article.publishDate,
      ...(article.modifiedDate && { modifiedTime: article.modifiedDate }),
      authors: [business.name],
      url: `${business.url}/journal/${slug}`,
    },
  };
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let keyCounter = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(<h2 key={keyCounter++}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={keyCounter++}>{line.slice(4)}</h3>);
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={keyCounter++}>
          {items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
      continue;
    } else if (line.trim() !== "") {
      elements.push(<p key={keyCounter++}>{line}</p>);
    }
    i++;
  }

  return elements;
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedService = article.relatedService
    ? getServiceBySlug(article.relatedService)
    : null;

  const relatedProjects = article.relatedProjectSlugs
    .map((s) => getProjectBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <>
      <ArticleJsonLd article={article} />
      <BreadcrumbJsonLd
        items={[
          { label: "Journal", href: "/journal" },
          { label: article.title },
        ]}
      />
      {article.faq && article.faq.length > 0 && <FaqJsonLd faq={article.faq} />}

      <div
        style={{
          paddingTop: "5.5rem",
          paddingBottom: "5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            padding: "0 1.5rem 3rem",
          }}
        >
          <Breadcrumb
            items={[
              { label: "Journal", href: "/journal" },
              { label: article.category, href: "/journal" },
            ]}
          />

          <header style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              <span className="text-label" style={{ color: "var(--clay)" }}>
                {article.category}
              </span>
              <span className="text-label" style={{ color: "var(--stone)" }}>·</span>
              <time
                dateTime={article.publishDate}
                className="text-label"
                style={{ color: "var(--text-muted)" }}
              >
                {formatDate(article.publishDate)}
              </time>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: "1.25rem",
              }}
            >
              {article.title}
            </h1>

            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.1rem, 2vw, 1.375rem)",
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {article.excerpt}
            </p>
          </header>

          {/* Prose content */}
          <div className="prose">{renderContent(article.content)}</div>

          {/* FAQ */}
          {article.faq && article.faq.length > 0 && (
            <div
              style={{
                marginTop: "3rem",
                borderTop: "1px solid var(--border)",
                paddingTop: "2rem",
              }}
            >
              <p
                className="text-label"
                style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}
              >
                Najczęstsze pytania
              </p>
              <dl>
                {article.faq.map((item) => (
                  <div
                    key={item.question}
                    style={{ borderBottom: "1px solid var(--border)", padding: "1.25rem 0" }}
                  >
                    <dt
                      style={{
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "0.5rem",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {item.question}
                    </dt>
                    <dd
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9375rem",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Contextual links */}
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {relatedService && (
              <Link
                href={`/uslugi/${relatedService.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "99px",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  textDecoration: "none",
                }}
              >
                ↗ Usługa: {relatedService.shortTitle}
              </Link>
            )}
            <Link
              href="/kontakt"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "var(--text-primary)",
                color: "var(--surface)",
                padding: "0.625rem 1.25rem",
                borderRadius: "99px",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                textDecoration: "none",
              }}
            >
              Zapytaj o realizację →
            </Link>
          </div>
        </div>

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 1.5rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "3rem",
            }}
          >
            <p
              className="text-label"
              style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}
            >
              Powiązane realizacje
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                gap: "0.75rem",
              }}
            >
              {relatedProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
