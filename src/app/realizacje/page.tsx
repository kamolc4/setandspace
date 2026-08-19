import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { business } from "@/data/business";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPrisma } from "@/lib/prisma";
import { getYoutubeThumbnail } from "@/lib/video-parser";
import type { PortfolioProject } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Realizacje — Set & Space",
  description:
    "Portfolio filmów kinematograficznych Set & Space dla nieruchomości, hoteli, architektury i wnętrz.",
  alternates: { canonical: `${business.url}/realizacje` },
  openGraph: { url: `${business.url}/realizacje` },
};

export const dynamic = "force-dynamic";

async function getPublishedProjects(): Promise<PortfolioProject[]> {
  try {
    const db = getPrisma();
    return db.portfolioProject.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { publishedAt: "desc" }],
    });
  } catch {
    return [];
  }
}

function ProjectThumbnail({ project }: { project: PortfolioProject }) {
  const ytSrc = project.videoProvider === "youtube" && project.videoId
    ? getYoutubeThumbnail(project.videoId)
    : null;

  const posterSrc = project.posterImage || ytSrc;

  if (posterSrc) {
    return (
      <Image
        src={posterSrc}
        alt={project.posterAlt || project.title}
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
        loading="lazy"
      />
    );
  }

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(160deg, var(--dune) 0%, var(--surface-alt) 55%, var(--stone) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <span aria-hidden="true" style={{
        fontFamily: "var(--font-cormorant)",
        fontSize: "clamp(3rem, 10vw, 6rem)",
        fontWeight: 300,
        color: "rgba(31,25,22,0.08)",
        lineHeight: 1,
        userSelect: "none",
      }}>
        S
      </span>
    </div>
  );
}

export default async function RealizacjePage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <BreadcrumbJsonLd items={[{ label: "Realizacje", href: "/realizacje" }]} />

      <div style={{ padding: "5.5rem 1.5rem 5rem", maxWidth: "1280px", margin: "0 auto" }}>
        <Breadcrumb items={[{ label: "Realizacje" }]} />

        <h1 className="text-headline" style={{ color: "var(--text-primary)", marginBottom: "3rem" }}>
          Realizacje.
        </h1>

        {projects.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-cormorant)", fontSize: "1.375rem", fontStyle: "italic" }}>
            Wkrótce pojawią się nasze realizacje.
          </p>
        ) : (
          <>
            <div className="rz-grid">
              {projects.map((p) => {
                const aspectRatio = p.videoAspectRatio === "PORTRAIT" ? "9/16" : p.videoAspectRatio === "SQUARE" ? "1/1" : "16/9";
                const paddingPct = aspectRatio === "9/16" ? "177.78%" : aspectRatio === "1/1" ? "100%" : "56.25%";

                return (
                  <Link key={p.id} href={`/realizacje/${p.slug}`} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                    <article>
                      <div style={{ position: "relative", paddingBottom: paddingPct, height: 0, overflow: "hidden", borderRadius: "var(--radius-card)", backgroundColor: "var(--surface-alt)" }}>
                        <ProjectThumbnail project={p} />
                        {/* Play overlay */}
                        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(31,25,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.3s ease" }} className="rz-play-overlay">
                          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(241,233,224,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-primary)" style={{ marginLeft: "2px" }}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        {p.featured && (
                          <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", backgroundColor: "rgba(31,25,22,0.75)", color: "#F1E9E0", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.2rem 0.5rem", borderRadius: "99px" }}>
                            Wyróżniona
                          </span>
                        )}
                      </div>

                      <div style={{ padding: "0.875rem 0 1.5rem" }}>
                        {p.category && (
                          <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                            {p.category}
                          </p>
                        )}
                        <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.125rem, 2vw, 1.375rem)", fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: "0.5rem" }}>
                          {p.title}
                        </h2>
                        {p.shortDescription && (
                          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.shortDescription}
                          </p>
                        )}
                        {p.location && (
                          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                            {p.location}
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            <style>{`
              .rz-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 2rem 1.5rem;
              }
              .rz-play-overlay:hover {
                background-color: rgba(31,25,22,0.05) !important;
              }
              @media (min-width: 600px) {
                .rz-grid { grid-template-columns: 1fr 1fr; }
              }
              @media (min-width: 1024px) {
                .rz-grid { grid-template-columns: 1fr 1fr 1fr; gap: 2.5rem 2rem; }
              }
            `}</style>
          </>
        )}
      </div>
    </>
  );
}
