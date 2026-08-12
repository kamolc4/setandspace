import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/data/projects";
import { getServiceBySlug } from "@/data/services";
import { business } from "@/data/business";
import VideoFacade from "@/components/ui/VideoFacade";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProjectCard from "@/components/ui/ProjectCard";
import { BreadcrumbJsonLd, VideoObjectJsonLd } from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.seo.title,
    description: project.seo.description,
    alternates: { canonical: `${business.url}/realizacje/${slug}` },
    openGraph: {
      title: project.seo.title,
      description: project.seo.description,
      url: `${business.url}/realizacje/${slug}`,
      type: "website",
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const relatedService = project.relatedService
    ? getServiceBySlug(project.relatedService)
    : null;

  const relatedProjects = project.relatedSlugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { label: "Realizacje", href: "/realizacje" },
          { label: project.title },
        ]}
      />
      <VideoObjectJsonLd project={project} />

      <article
        style={{
          paddingTop: "5.5rem",
          paddingBottom: "5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
            marginBottom: "2rem",
          }}
        >
          <Breadcrumb
            items={[
              { label: "Realizacje", href: "/realizacje" },
              { label: project.title },
            ]}
          />
        </div>

        {/* Video — full-width treatment */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto 2.5rem",
            padding: "0 1.5rem",
            borderRadius: "var(--radius-panel)",
            overflow: "hidden",
          }}
        >
          <div style={{ borderRadius: "var(--radius-panel)", overflow: "hidden" }}>
            <VideoFacade
              provider={project.videoProvider}
              videoId={project.vimeoId ?? project.youtubeId}
              posterAlt={project.posterAlt}
              title={project.title}
              aspectRatio="16/9"
            />
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
            }}
            className="project-layout"
          >
            {/* Main column */}
            <div>
              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem 1.5rem",
                  marginBottom: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span className="text-label" style={{ color: "var(--text-muted)" }}>
                  {project.categoryLabel}
                </span>
                <span className="text-label" style={{ color: "var(--stone)" }}>·</span>
                <span className="text-label" style={{ color: "var(--text-muted)" }}>
                  {project.location}
                </span>
                {project.year && (
                  <>
                    <span className="text-label" style={{ color: "var(--stone)" }}>·</span>
                    <span className="text-label" style={{ color: "var(--text-muted)" }}>
                      {project.year}
                    </span>
                  </>
                )}
              </div>

              <h1
                className="text-headline"
                style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}
              >
                {project.title}
              </h1>

              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "2rem",
                }}
              >
                {project.shortDescription}
              </p>

              <div className="prose">
                {project.story.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              {/* Scope */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "var(--radius-card)",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  className="text-label"
                  style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
                >
                  Zakres realizacji
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {project.scope.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        padding: "0.4rem 0",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.5rem",
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ color: "var(--clay)", flexShrink: 0, marginTop: "0.1rem" }}>
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related service */}
              {relatedService && (
                <div
                  style={{
                    backgroundColor: "var(--text-primary)",
                    borderRadius: "var(--radius-card)",
                    padding: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p className="text-label" style={{ color: "var(--clay)", marginBottom: "0.75rem" }}>
                    Usługa
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.125rem",
                      color: "var(--surface)",
                      marginBottom: "1rem",
                    }}
                  >
                    {relatedService.shortTitle}
                  </p>
                  <Link
                    href={`/uslugi/${relatedService.slug}`}
                    className="text-label"
                    style={{ color: "var(--clay)" }}
                  >
                    Dowiedz się więcej →
                  </Link>
                </div>
              )}

              {/* CTA */}
              <div
                style={{
                  borderRadius: "var(--radius-card)",
                  padding: "1.5rem",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.25rem",
                    color: "var(--text-primary)",
                    marginBottom: "1rem",
                    lineHeight: 1.3,
                  }}
                >
                  Realizujesz podobny projekt?
                </p>
                <Link
                  href="/kontakt"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "var(--text-primary)",
                    color: "var(--surface)",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "99px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                    textDecoration: "none",
                  }}
                >
                  Napisz do nas →
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <div
            style={{
              maxWidth: "1280px",
              margin: "4rem auto 0",
              padding: "0 1.5rem",
            }}
          >
            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "3rem",
              }}
            >
              <p
                className="text-label"
                style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}
              >
                Podobne realizacje
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
          </div>
        )}
      </article>

      <style>{`
        @media (min-width: 900px) {
          .project-layout {
            grid-template-columns: 1fr 360px !important;
          }
        }
      `}</style>
    </>
  );
}
