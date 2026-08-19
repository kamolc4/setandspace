import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/data/projects";
import { business } from "@/data/business";
import VideoFacade from "@/components/ui/VideoFacade";
import ProjectCard from "@/components/ui/ProjectCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd, VideoObjectJsonLd } from "@/components/seo/JsonLd";
import { getPrisma } from "@/lib/prisma";
import { aspectRatioToFacade, getYoutubeThumbnail } from "@/lib/video-parser";
import type { PortfolioProject } from "@/generated/prisma/client";
import type { VideoProvider } from "@/data/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getDbProject(slug: string): Promise<PortfolioProject | null> {
  try {
    const db = getPrisma();
    return db.portfolioProject.findFirst({ where: { slug, status: "PUBLISHED" } });
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const dbProject = await getDbProject(slug);
  if (dbProject) {
    const title = dbProject.seoTitle || dbProject.title;
    const description = dbProject.seoDescription || dbProject.shortDescription;
    const canonical = dbProject.canonical || `${business.url}/realizacje/${slug}`;
    const ogImage = dbProject.posterImage
      ? (dbProject.posterImage.startsWith("http") ? dbProject.posterImage : `${business.url}${dbProject.posterImage}`)
      : (dbProject.videoProvider === "youtube" && dbProject.videoId ? getYoutubeThumbnail(dbProject.videoId) : undefined);

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      },
    };
  }

  const staticProject = getProjectBySlug(slug);
  if (!staticProject) return {};

  return {
    title: staticProject.seo.title,
    description: staticProject.seo.description,
    alternates: { canonical: `${business.url}/realizacje/${slug}` },
    openGraph: {
      title: staticProject.seo.title,
      description: staticProject.seo.description,
      url: `${business.url}/realizacje/${slug}`,
      type: "website",
    },
  };
}

function CTA() {
  return (
    <aside>
      <div style={{ borderRadius: "var(--radius-card)", padding: "1.5rem", border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "1rem", lineHeight: 1.3 }}>
          Realizujesz podobny projekt?
        </p>
        <Link
          href="/kontakt"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--text-primary)", color: "var(--surface)", padding: "0.75rem 1.5rem", borderRadius: "99px", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" as const, textDecoration: "none" }}
        >
          Napisz do mnie →
        </Link>
      </div>
    </aside>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const dbProject = await getDbProject(slug);

  if (dbProject) {
    const ar = aspectRatioToFacade(dbProject.videoAspectRatio as "PORTRAIT" | "LANDSCAPE" | "SQUARE");
    const isPortrait = ar === "9/16";
    const posterSrc = dbProject.posterImage
      ? dbProject.posterImage
      : (dbProject.videoProvider === "youtube" && dbProject.videoId ? getYoutubeThumbnail(dbProject.videoId) : undefined);

    return (
      <>
        <BreadcrumbJsonLd
          items={[
            { label: "Realizacje", href: "/realizacje" },
            { label: dbProject.title },
          ]}
        />

        <article style={{ paddingTop: "5.5rem", paddingBottom: "5rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", marginBottom: "2rem" }}>
            <Breadcrumb items={[{ label: "Realizacje", href: "/realizacje" }, { label: dbProject.title }]} />
          </div>

          <div style={{ maxWidth: isPortrait ? "480px" : "1280px", margin: "0 auto 2.5rem", padding: "0 1.5rem" }}>
            <div style={{ borderRadius: "var(--radius-panel)", overflow: "hidden" }}>
              <VideoFacade
                provider={(dbProject.videoProvider as VideoProvider) || "none"}
                videoId={dbProject.videoId}
                posterSrc={posterSrc}
                posterAlt={dbProject.posterAlt || dbProject.title}
                title={dbProject.title}
                aspectRatio={ar}
              />
            </div>
          </div>

          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div className="project-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
                  {dbProject.category && (
                    <span className="text-label" style={{ color: "var(--text-muted)" }}>{dbProject.category}</span>
                  )}
                  {dbProject.location && (
                    <>
                      <span className="text-label" style={{ color: "var(--stone)" }}>·</span>
                      <span className="text-label" style={{ color: "var(--text-muted)" }}>{dbProject.location}</span>
                    </>
                  )}
                </div>
                <h1 className="text-headline" style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>
                  {dbProject.title}
                </h1>
                <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.125rem, 2vw, 1.375rem)", fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
                  {dbProject.shortDescription}
                </p>
                {dbProject.description && (
                  <div className="prose">
                    {dbProject.description.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}
              </div>

              <CTA />
            </div>
          </div>
        </article>

        <style>{`
          @media (min-width: 900px) {
            .project-layout { grid-template-columns: 1fr 360px !important; }
          }
        `}</style>
      </>
    );
  }

  // Fallback: static data projects
  const staticProject = getProjectBySlug(slug);
  if (!staticProject) notFound();

  const relatedProjects = staticProject.relatedSlugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { label: "Realizacje", href: "/realizacje" },
          { label: staticProject.title },
        ]}
      />
      <VideoObjectJsonLd project={staticProject} />

      <article style={{ paddingTop: "5.5rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", marginBottom: "2rem" }}>
          <Breadcrumb items={[{ label: "Realizacje", href: "/realizacje" }, { label: staticProject.title }]} />
        </div>

        <div style={{ maxWidth: "1280px", margin: "0 auto 2.5rem", padding: "0 1.5rem", borderRadius: "var(--radius-panel)", overflow: "hidden" }}>
          <div style={{ borderRadius: "var(--radius-panel)", overflow: "hidden" }}>
            <VideoFacade
              provider={staticProject.videoProvider}
              videoId={staticProject.vimeoId ?? staticProject.youtubeId}
              posterAlt={staticProject.posterAlt}
              title={staticProject.title}
              aspectRatio="16/9"
            />
          </div>
        </div>

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="project-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
                <span className="text-label" style={{ color: "var(--text-muted)" }}>{staticProject.categoryLabel}</span>
                <span className="text-label" style={{ color: "var(--stone)" }}>·</span>
                <span className="text-label" style={{ color: "var(--text-muted)" }}>{staticProject.location}</span>
              </div>
              <h1 className="text-headline" style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>
                {staticProject.title}
              </h1>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.125rem, 2vw, 1.375rem)", fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
                {staticProject.shortDescription}
              </p>
              <div className="prose">
                {staticProject.story.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>

            <CTA />
          </div>
        </div>

        {relatedProjects.length > 0 && (
          <div style={{ maxWidth: "1280px", margin: "4rem auto 0", padding: "0 1.5rem" }}>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "3rem" }}>
              <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Podobne realizacje</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "0.75rem" }}>
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
          .project-layout { grid-template-columns: 1fr 360px !important; }
        }
      `}</style>
    </>
  );
}
