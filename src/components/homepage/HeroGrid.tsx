import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import VideoFacade from "@/components/ui/VideoFacade";

interface HeroGridProps {
  featuredProjects: Project[];
  allProjects: Project[];
}

export default function HeroGrid({ featuredProjects, allProjects }: HeroGridProps) {
  const mainProject = featuredProjects[0];
  const listProjects = allProjects.slice(0, 4);

  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-section"
      style={{
        padding: "5rem 1rem 1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gap: "0.625rem",
          /* Mobile: single column, desktop: bento layout */
          gridTemplateColumns: "1fr",
          gridTemplateRows: "auto",
        }}
        className="hero-bento"
      >
        {/* ── Cell A: Main typographic statement ── */}
        <div
          className="panel"
          style={{
            gridArea: "statement",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "clamp(220px, 30vw, 340px)",
          }}
        >
          {/* Decorative year */}
          <span
            className="text-label"
            aria-hidden="true"
            style={{
              color: "var(--stone)",
              alignSelf: "flex-end",
            }}
          >
            {new Date().getFullYear()}
          </span>

          <div>
            <h1
              id="hero-heading"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 3.2vw, 3.5rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                margin: 0,
                maxWidth: "100%",
              }}
            >
              Opowiadam<br />
              <em>przestrzeń</em><br />
              obrazem.
            </h1>
          </div>
        </div>

        {/* ── Cell B: Main featured video ── */}
        <div
          className="panel-dune hero-video-cell"
          style={{
            gridArea: "video",
            borderRadius: "var(--radius-panel)",
            overflow: "hidden",
          }}
        >
          {mainProject ? (
            <div className="hero-video-inner">
              {/* Mobile only: camera photo replacing the gradient placeholder */}
              <div className="hero-mobile-poster">
                <Image
                  src="/images/camera-mobile.png"
                  alt="Aparat do profesjonalnej produkcji filmowej Set & Space"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  sizes="(max-width: 767px) calc(100vw - 2rem)"
                />
              </div>
              {/* Desktop only: VideoFacade with gradient placeholder */}
              <div className="hero-desktop-video">
                <VideoFacade
                  provider={mainProject.videoProvider}
                  videoId={mainProject.vimeoId ?? mainProject.youtubeId}
                  posterSrc={undefined}
                  posterAlt={mainProject.posterAlt}
                  title={mainProject.title}
                  aspectRatio="16/9"
                  className="h-full"
                />
              </div>
              <div
                style={{
                  padding: "1rem 1.25rem 1.25rem",
                  backgroundColor: "var(--surface-alt)",
                }}
              >
                <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                  {mainProject.categoryLabel} · {mainProject.location}
                </p>
                <Link
                  href={`/realizacje/${mainProject.slug}`}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {mainProject.title}
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="hero-video-inner"
              style={{
                background: "linear-gradient(135deg, var(--dune) 0%, var(--surface-alt) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.25rem",
                  fontStyle: "italic",
                  color: "var(--text-muted)",
                  textAlign: "center",
                }}
              >
                Realizacje wkrótce
              </p>
            </div>
          )}
        </div>

        {/* ── Cell C: Project list ── */}
        <div
          className="panel"
          style={{
            gridArea: "projects",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
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
            <p className="text-label" style={{ color: "var(--text-muted)" }}>
              Realizacje
            </p>
            <Link
              href="/realizacje"
              className="text-label"
              style={{
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              Wszystkie ↗
            </Link>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
            {listProjects.map((project, i) => (
              <li
                key={project.slug}
                style={{
                  borderTop: i === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <Link
                  href={`/realizacje/${project.slug}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.875rem 0",
                    color: "var(--text-primary)",
                    gap: "1rem",
                  }}
                  className="group"
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        lineHeight: 1.25,
                        marginBottom: "0.15rem",
                      }}
                    >
                      {project.title}
                    </p>
                    <p className="text-label" style={{ color: "var(--text-muted)" }}>
                      {project.categoryLabel}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    style={{
                      color: "var(--stone)",
                      fontSize: "1rem",
                      flexShrink: 0,
                      transition: "transform 0.2s ease",
                    }}
                  >
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Cell D: Brief intro ── */}
        <div
          className="panel-dune"
          style={{
            gridArea: "intro",
            padding: "clamp(1.25rem, 3vw, 2rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
            Set & Space
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
            }}
          >
            Tworzę krótkie filmy dla nieruchomości, hoteli, architektów i salonów meblowych.
            Każdy projekt traktuję indywidualnie. Żadnych szablonów.
          </p>
        </div>

        {/* ── Cell E: CTA ── */}
        <Link
          href="/kontakt"
          className="panel-dark"
          style={{
            gridArea: "cta",
            padding: "clamp(1.5rem, 3vw, 2.5rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "clamp(140px, 18vw, 200px)",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            textDecoration: "none",
          }}
        >
          <p className="text-label" style={{ color: "var(--clay)" }}>
            Kontakt
          </p>
          <div>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "var(--surface)",
                marginBottom: "0.75rem",
              }}
            >
              Masz przestrzeń,<br />
              <em>którą warto pokazać?</em>
            </p>
            <span
              className="text-label"
              style={{
                color: "var(--clay)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Porozmawiajmy ↗
            </span>
          </div>
        </Link>

        {/* ── Cell F: Disciplines tag line ── */}
        <div
          style={{
            gridArea: "tags",
            padding: "1rem 1.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {["Nieruchomości", "Architektura", "Wnętrza", "Hotele", "Salony meblowe"].map(
            (tag) => (
              <span
                key={tag}
                className="text-label"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--text-muted)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "99px",
                  border: "1px solid var(--border)",
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>

      {/* Inline CSS for responsive bento grid */}
      <style>{`
        /* ── Defaults (all screen sizes) ── */
        .hero-video-cell  { min-height: clamp(220px, 40vw, 480px); }
        .hero-video-inner { height: 100%; }
        .hero-mobile-poster { display: none; position: relative; aspect-ratio: 16 / 9; }
        .hero-desktop-video { display: block; }

        /* ── Desktop bento: 3-column layout ── */
        @media (min-width: 768px) {
          .hero-section { min-height: 100svh; }
          .hero-bento {
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: auto auto auto;
            grid-template-areas:
              "statement video projects"
              "intro     video projects"
              "cta       cta   tags";
          }
          .hero-bento > *:nth-child(1) { grid-area: statement; }
          .hero-bento > *:nth-child(2) { grid-area: video; }
          .hero-bento > *:nth-child(3) { grid-area: projects; }
          .hero-bento > *:nth-child(4) { grid-area: intro; }
          .hero-bento > *:nth-child(5) { grid-area: cta; }
          .hero-bento > *:nth-child(6) { grid-area: tags; }
        }

        @media (min-width: 1100px) {
          .hero-bento { grid-template-columns: 1.1fr 1.6fr 1fr; }
        }

        /* ── Mobile layout: single column, explicit order ── */
        @media (max-width: 767px) {
          /* Override desktop-only height constraints */
          .hero-video-cell  { min-height: 0; }
          .hero-video-inner { height: auto; }

          /* Camera poster visible, VideoFacade hidden */
          .hero-mobile-poster { display: block; }
          .hero-desktop-video { display: none; }

          /* Reading order: statement → video → intro → projects → tags → cta */
          .hero-bento > *:nth-child(1) { order: 1; }
          .hero-bento > *:nth-child(2) { order: 2; }
          .hero-bento > *:nth-child(3) { order: 4; }
          .hero-bento > *:nth-child(4) { order: 3; }
          .hero-bento > *:nth-child(5) { order: 6; }
          .hero-bento > *:nth-child(6) { order: 5; }
        }
      `}</style>
    </section>
  );
}
