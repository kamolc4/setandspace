import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <Link
      href={`/realizacje/${project.slug}`}
      className="group"
      style={{
        display: "block",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        backgroundColor: "var(--surface-alt)",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
        {project.posterImage && project.posterImage !== "/images/placeholder-hotel.jpg" &&
         project.posterImage !== "/images/placeholder-apartment.jpg" &&
         project.posterImage !== "/images/placeholder-architecture.jpg" &&
         project.posterImage !== "/images/placeholder-brand.jpg" ? (
          <Image
            src={project.posterImage}
            alt={project.posterAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            style={{ objectFit: "cover" }}
            className="transition-image"
          />
        ) : (
          <div
            className="transition-image"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, var(--dune) 0%, var(--stone) 60%, var(--surface-alt) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                fontStyle: "italic",
                letterSpacing: "0.05em",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              {project.title}
            </span>
          </div>
        )}
        {/* Category label */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            backgroundColor: "rgba(241,233,224,0.9)",
            padding: "0.25rem 0.6rem",
            borderRadius: "99px",
          }}
        >
          <span className="text-label" style={{ color: "var(--text-primary)", fontSize: "0.625rem" }}>
            {project.categoryLabel}
          </span>
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: "1rem 1.125rem 1.25rem" }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.25rem",
            lineHeight: 1.3,
          }}
        >
          {project.title}
        </p>
        <p className="text-label" style={{ color: "var(--text-muted)" }}>
          {project.location}
          {project.year ? ` · ${project.year}` : ""}
        </p>
      </div>
    </Link>
  );
}
