import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { updateArticleAction, toggleStatusAction } from "@/app/admin/_actions/articles";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { Status } from "@/generated/prisma/client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPoradnikPage({ params }: Props) {
  const { id } = await params;

  let article;
  try {
    const db = getPrisma();
    article = await db.article.findUnique({ where: { id } });
  } catch {
    notFound();
  }

  if (!article) notFound();

  const boundUpdate = updateArticleAction.bind(null, id);
  const isPublished = article.status === "PUBLISHED";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ minWidth: 0 }}>
          <Link href="/admin/poradniki" style={{ fontSize: "0.875rem", color: "#765C49", textDecoration: "none" }}>
            ← Poradniki
          </Link>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#1F1916", marginTop: "0.5rem", wordBreak: "break-word" }}>
            Edycja: {article.title}
          </h1>
          {article.slug && (
            <p style={{ fontSize: "0.8125rem", color: "#8C7B6E", marginTop: "0.25rem", wordBreak: "break-all" }}>
              /poradniki/{article.slug}
              {isPublished && (
                <Link href={`/poradniki/${article.slug}`} target="_blank" style={{ color: "#765C49", marginLeft: "0.75rem" }}>
                  Otwórz ↗
                </Link>
              )}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", flexShrink: 0 }}>
          <Link
            href={`/poradniki/${article.slug}`}
            target="_blank"
            style={{ padding: "0.5rem 1rem", border: "1px solid #C4B5A5", borderRadius: "6px", color: "#1F1916", fontSize: "0.875rem", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Podgląd ↗
          </Link>

          <form action={async () => {
            "use server";
            const next: Status = isPublished ? "DRAFT" : "PUBLISHED";
            await toggleStatusAction(id, next);
          }}>
            <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: isPublished ? "#fff7ed" : "#f0fdf4", color: isPublished ? "#c2410c" : "#166534", border: "1px solid", borderColor: isPublished ? "#fed7aa" : "#bbf7d0", borderRadius: "6px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              {isPublished ? "Cofnij do draftu" : "Opublikuj"}
            </button>
          </form>

          <DeleteButton id={id} title={article.title} />
        </div>
      </div>

      {isPublished && (
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.875rem", color: "#166534" }}>
          ✓ Ten artykuł jest opublikowany.
        </div>
      )}

      <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", padding: "1.5rem" }}>
        <ArticleForm action={boundUpdate} article={article} submitLabel="Zapisz zmiany" />
      </div>
    </div>
  );
}
