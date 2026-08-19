import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { RealizacjeForm } from "@/components/admin/RealizacjeForm";
import { updatePortfolioProjectAction, toggleProjectStatusAction } from "@/app/admin/_actions/portfolio";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import type { Status } from "@/generated/prisma/client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRealizacjaPage({ params }: Props) {
  const { id } = await params;

  let project;
  try {
    const db = getPrisma();
    project = await db.portfolioProject.findUnique({ where: { id } });
  } catch {
    notFound();
  }

  if (!project) notFound();

  const boundUpdate = updatePortfolioProjectAction.bind(null, id);
  const isPublished = project.status === "PUBLISHED";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ minWidth: 0 }}>
          <Link href="/admin/realizacje" style={{ fontSize: "0.875rem", color: "#765C49", textDecoration: "none" }}>
            ← Realizacje
          </Link>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#1F1916", marginTop: "0.5rem", wordBreak: "break-word" }}>
            Edycja: {project.title}
          </h1>
          {project.slug && (
            <p style={{ fontSize: "0.8125rem", color: "#8C7B6E", marginTop: "0.25rem", wordBreak: "break-all" }}>
              /realizacje/{project.slug}
              {isPublished && (
                <Link href={`/realizacje/${project.slug}`} target="_blank" style={{ color: "#765C49", marginLeft: "0.75rem" }}>
                  Otwórz ↗
                </Link>
              )}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", flexShrink: 0 }}>
          <Link
            href={`/realizacje/${project.slug}`}
            target="_blank"
            style={{ padding: "0.5rem 1rem", border: "1px solid #C4B5A5", borderRadius: "6px", color: "#1F1916", fontSize: "0.875rem", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Podgląd ↗
          </Link>

          <form action={async () => {
            "use server";
            const next: Status = isPublished ? "DRAFT" : "PUBLISHED";
            await toggleProjectStatusAction(id, next);
          }}>
            <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: isPublished ? "#fff7ed" : "#f0fdf4", color: isPublished ? "#c2410c" : "#166534", border: "1px solid", borderColor: isPublished ? "#fed7aa" : "#bbf7d0", borderRadius: "6px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              {isPublished ? "Cofnij do draftu" : "Opublikuj"}
            </button>
          </form>

          <DeleteProjectButton id={id} title={project.title} />
        </div>
      </div>

      {isPublished && (
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.875rem", color: "#166534" }}>
          ✓ Ta realizacja jest opublikowana.
        </div>
      )}

      <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", padding: "1.5rem" }}>
        <RealizacjeForm action={boundUpdate} project={project} submitLabel="Zapisz zmiany" />
      </div>
    </div>
  );
}
