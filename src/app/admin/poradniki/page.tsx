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
  DRAFT: { bg: "#E8DED2", color: "#6B5040", label: "Draft" },
};

function formatDate(d: Date) {
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function AdminPoradnikiPage() {
  const articles = await getArticles();

  return (
    <div>
      <style>{`
        .articles-grid-header { display: grid; }
        .articles-grid-row { display: grid; }
        @media (min-width: 640px) {
          .articles-grid-header {
            grid-template-columns: 1fr 110px 120px 100px 160px;
          }
          .articles-grid-row {
            grid-template-columns: 1fr 110px 120px 100px 160px;
          }
          .article-card-mobile { display: none !important; }
          .article-row-desktop { display: grid !important; }
        }
        @media (max-width: 639px) {
          .articles-grid-header { display: none; }
          .article-row-desktop { display: none !important; }
          .article-card-mobile { display: block !important; }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1F1916" }}>Poradniki</h1>
        <Link
          href="/admin/poradniki/nowy"
          style={{ backgroundColor: "#1F1916", color: "#F1E9E0", padding: "0.625rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          + Dodaj nowy
        </Link>
      </div>

      {articles.length === 0 ? (
        <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "#8C7B6E" }}>
          Brak poradników.{" "}
          <Link href="/admin/poradniki/nowy" style={{ color: "#765C49" }}>
            Dodaj pierwszy →
          </Link>
        </div>
      ) : (
        <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", overflow: "hidden" }}>
          {/* Desktop header */}
          <div className="articles-grid-header" style={{
            gap: "0.75rem",
            padding: "0.625rem 1rem",
            backgroundColor: "#F7F3EE",
            borderBottom: "1px solid #C4B5A5",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#8C7B6E",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>
            <span>Tytuł</span>
            <span>Kategoria</span>
            <span>Status</span>
            <span>Aktualizacja</span>
            <span style={{ textAlign: "right" }}>Akcje</span>
          </div>

          {articles.map((a) => {
            const badge = STATUS_BADGE[a.status as keyof typeof STATUS_BADGE];
            return (
              <div key={a.id} style={{ borderBottom: "1px solid #F1E9E0" }}>
                {/* Desktop row */}
                <div className="article-row-desktop" style={{
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  alignItems: "center",
                }}>
                  <div style={{ minWidth: 0 }}>
                    <Link href={`/admin/poradniki/${a.id}`} style={{ color: "#1F1916", fontWeight: 500, fontSize: "0.875rem", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.title}
                    </Link>
                    <p style={{ fontSize: "0.75rem", color: "#8C7B6E", marginTop: "0.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      /poradniki/{a.slug}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.8125rem", color: "#6B5040" }}>{a.category || "—"}</span>
                  <span style={{ backgroundColor: badge.bg, color: badge.color, padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, display: "inline-block", whiteSpace: "nowrap" }}>
                    {badge.label}
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "#8C7B6E" }}>{formatDate(a.updatedAt)}</span>
                  <div style={{ display: "flex", gap: "0.375rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <Link href={`/admin/poradniki/${a.id}`} style={{ padding: "0.25rem 0.6rem", backgroundColor: "#F1E9E0", color: "#1F1916", borderRadius: "5px", fontSize: "0.75rem", textDecoration: "none", whiteSpace: "nowrap" }}>
                      Edytuj
                    </Link>
                    <Link href={`/poradniki/${a.slug}`} target="_blank" style={{ padding: "0.25rem 0.6rem", backgroundColor: "#F1E9E0", color: "#1F1916", borderRadius: "5px", fontSize: "0.75rem", textDecoration: "none", whiteSpace: "nowrap" }}>
                      Podgląd ↗
                    </Link>
                    <form action={async () => {
                      "use server";
                      const next: Status = a.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
                      await toggleStatusAction(a.id, next);
                    }}>
                      <button type="submit" style={{ padding: "0.25rem 0.6rem", backgroundColor: a.status === "PUBLISHED" ? "#fff7ed" : "#f0fdf4", color: a.status === "PUBLISHED" ? "#c2410c" : "#166534", border: "1px solid", borderColor: a.status === "PUBLISHED" ? "#fed7aa" : "#bbf7d0", borderRadius: "5px", fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap" }}>
                        {a.status === "PUBLISHED" ? "Cofnij" : "Opublikuj"}
                      </button>
                    </form>
                    <DeleteButton id={a.id} title={a.title} small />
                  </div>
                </div>

                {/* Mobile card */}
                <div className="article-card-mobile" style={{ padding: "1rem", display: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.625rem", gap: "0.75rem" }}>
                    <div style={{ minWidth: 0 }}>
                      <Link href={`/admin/poradniki/${a.id}`} style={{ color: "#1F1916", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none", display: "block" }}>
                        {a.title}
                      </Link>
                      <p style={{ fontSize: "0.75rem", color: "#8C7B6E", marginTop: "0.2rem", wordBreak: "break-all" }}>
                        /poradniki/{a.slug}
                      </p>
                    </div>
                    <span style={{ backgroundColor: badge.bg, color: badge.color, padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {badge.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", fontSize: "0.75rem", color: "#8C7B6E", marginBottom: "0.75rem", gap: "1rem" }}>
                    {a.category && <span>{a.category}</span>}
                    <span>Aktualizacja: {formatDate(a.updatedAt)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Link href={`/admin/poradniki/${a.id}`} style={{ padding: "0.4rem 0.875rem", backgroundColor: "#1F1916", color: "#F1E9E0", borderRadius: "5px", fontSize: "0.8125rem", textDecoration: "none", fontWeight: 500 }}>
                      Edytuj
                    </Link>
                    <Link href={`/poradniki/${a.slug}`} target="_blank" style={{ padding: "0.4rem 0.875rem", backgroundColor: "#F1E9E0", color: "#1F1916", borderRadius: "5px", fontSize: "0.8125rem", textDecoration: "none", border: "1px solid #C4B5A5" }}>
                      Podgląd ↗
                    </Link>
                    <form action={async () => {
                      "use server";
                      const next: Status = a.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
                      await toggleStatusAction(a.id, next);
                    }}>
                      <button type="submit" style={{ padding: "0.4rem 0.875rem", backgroundColor: a.status === "PUBLISHED" ? "#fff7ed" : "#f0fdf4", color: a.status === "PUBLISHED" ? "#c2410c" : "#166534", border: "1px solid", borderColor: a.status === "PUBLISHED" ? "#fed7aa" : "#bbf7d0", borderRadius: "5px", fontSize: "0.8125rem", cursor: "pointer" }}>
                        {a.status === "PUBLISHED" ? "Cofnij do draftu" : "Opublikuj"}
                      </button>
                    </form>
                    <DeleteButton id={a.id} title={a.title} small />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
