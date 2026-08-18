import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { toggleStatusAction } from "@/app/admin/_actions/articles";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { Article, Status } from "@/generated/prisma/client";

async function getArticles() {
  try {
    const db = getPrisma();
    return db.article.findMany({ orderBy: { updatedAt: "desc" } });
  } catch {
    return [] as Article[];
  }
}

const STATUS_BADGE = {
  PUBLISHED: { bg: "#dcfce7", color: "#166534", label: "Opublikowany" },
  DRAFT: { bg: "#f3f4f6", color: "#6b7280", label: "Draft" },
};

function formatDate(d: Date) {
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function AdminPoradnikiPage() {
  const articles = await getArticles();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>Poradniki</h1>
        <Link
          href="/admin/poradniki/nowy"
          style={{ backgroundColor: "#1d4ed8", color: "#fff", padding: "0.625rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}
        >
          + Dodaj nowy
        </Link>
      </div>

      {articles.length === 0 ? (
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
          Brak poradników. <Link href="/admin/poradniki/nowy" style={{ color: "#1d4ed8" }}>Dodaj pierwszy →</Link>
        </div>
      ) : (
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 110px 110px 180px", gap: "0.75rem", padding: "0.625rem 1rem", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <span>Tytuł</span>
            <span>Kategoria</span>
            <span>Status</span>
            <span>Aktualizacja</span>
            <span style={{ textAlign: "right" }}>Akcje</span>
          </div>

          {articles.map((a) => {
            const badge = STATUS_BADGE[a.status as keyof typeof STATUS_BADGE];
            return (
              <div key={a.id} style={{ display: "grid", gridTemplateColumns: "1fr 130px 110px 110px 180px", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: "1px solid #f3f4f6", alignItems: "center" }}>
                <div>
                  <Link href={`/admin/poradniki/${a.id}`} style={{ color: "#111827", fontWeight: 500, fontSize: "0.875rem", textDecoration: "none" }}>
                    {a.title}
                  </Link>
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.1rem" }}>/poradniki/{a.slug}</p>
                </div>
                <span style={{ fontSize: "0.8125rem", color: "#6b7280" }}>{a.category || "—"}</span>
                <span style={{ backgroundColor: badge.bg, color: badge.color, padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, display: "inline-block" }}>
                  {badge.label}
                </span>
                <span style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>{formatDate(a.updatedAt)}</span>
                <div style={{ display: "flex", gap: "0.375rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <Link href={`/admin/poradniki/${a.id}`} style={{ padding: "0.25rem 0.6rem", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "5px", fontSize: "0.75rem", textDecoration: "none" }}>
                    Edytuj
                  </Link>
                  <Link href={`/poradniki/${a.slug}`} target="_blank" style={{ padding: "0.25rem 0.6rem", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "5px", fontSize: "0.75rem", textDecoration: "none" }}>
                    Podgląd ↗
                  </Link>
                  <form action={async () => {
                    "use server";
                    const next: Status = a.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
                    await toggleStatusAction(a.id, next);
                  }}>
                    <button type="submit" style={{ padding: "0.25rem 0.6rem", backgroundColor: a.status === "PUBLISHED" ? "#fff7ed" : "#f0fdf4", color: a.status === "PUBLISHED" ? "#c2410c" : "#166534", border: "1px solid", borderColor: a.status === "PUBLISHED" ? "#fed7aa" : "#bbf7d0", borderRadius: "5px", fontSize: "0.75rem", cursor: "pointer" }}>
                      {a.status === "PUBLISHED" ? "Cofnij" : "Opublikuj"}
                    </button>
                  </form>
                  <DeleteButton id={a.id} title={a.title} small />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
