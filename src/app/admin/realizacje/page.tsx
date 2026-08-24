import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { toggleProjectStatusAction } from "@/app/admin/_actions/portfolio";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import type { PortfolioProject, Status } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    const db = getPrisma();
    return db.portfolioProject.findMany({ orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { updatedAt: "desc" }] });
  } catch {
    return [] as PortfolioProject[];
  }
}

const STATUS_BADGE = {
  PUBLISHED: { bg: "#dcfce7", color: "#166534", label: "Opublikowana" },
  DRAFT: { bg: "#E8DED2", color: "#6B5040", label: "Szkic" },
};

const AR_LABEL: Record<string, string> = {
  PORTRAIT: "9:16",
  LANDSCAPE: "16:9",
  SQUARE: "1:1",
};

function formatDate(d: Date) {
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function AdminRealizacjePage() {
  const projects = await getProjects();

  return (
    <div>
      <style>{`
        .rz-header { display: none; }
        .rz-row-desktop { display: none; }
        .rz-card-mobile { display: block; }
        @media (min-width: 640px) {
          .rz-header { display: grid !important; }
          .rz-row-desktop { display: grid !important; }
          .rz-card-mobile { display: none !important; }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1F1916" }}>Realizacje</h1>
        <Link href="/admin/realizacje/nowa" style={{ backgroundColor: "#1F1916", color: "#F1E9E0", padding: "0.625rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, whiteSpace: "nowrap" }}>
          + Dodaj realizację
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "#8C7B6E", marginBottom: "1rem" }}>Nie masz jeszcze żadnych realizacji.</p>
          <Link href="/admin/realizacje/nowa" style={{ backgroundColor: "#1F1916", color: "#F1E9E0", padding: "0.625rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>
            Dodaj pierwszą realizację
          </Link>
        </div>
      ) : (
        <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", overflow: "hidden" }}>
          {/* Desktop header */}
          <div className="rz-header" style={{ gridTemplateColumns: "1fr 130px 80px 90px 100px 170px", gap: "0.75rem", padding: "0.625rem 1rem", backgroundColor: "#F7F3EE", borderBottom: "1px solid #C4B5A5", fontSize: "0.75rem", fontWeight: 700, color: "#8C7B6E", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <span>Tytuł</span>
            <span>Kategoria</span>
            <span>Format</span>
            <span>Status</span>
            <span>Aktualizacja</span>
            <span style={{ textAlign: "right" }}>Akcje</span>
          </div>

          {projects.map((p) => {
            const badge = STATUS_BADGE[p.status as keyof typeof STATUS_BADGE];
            return (
              <div key={p.id} style={{ borderBottom: "1px solid #F1E9E0" }}>
                {/* Desktop row */}
                <div className="rz-row-desktop" style={{ gridTemplateColumns: "1fr 130px 80px 90px 100px 170px", gap: "0.75rem", padding: "0.75rem 1rem", alignItems: "center" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {p.featured && <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "#765C49", background: "#F1E9E0", padding: "0.15rem 0.4rem", borderRadius: "99px", whiteSpace: "nowrap" }}>Wyróżniona</span>}
                      <Link href={`/admin/realizacje/${p.id}`} style={{ color: "#1F1916", fontWeight: 500, fontSize: "0.875rem", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                        {p.title}
                      </Link>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#8C7B6E", marginTop: "0.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      /realizacje/{p.slug}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.8125rem", color: "#6B5040" }}>{p.category || "—"}</span>
                  <span style={{ fontSize: "0.8125rem", color: "#8C7B6E" }}>{AR_LABEL[p.videoAspectRatio] ?? "—"}</span>
                  <span style={{ backgroundColor: badge.bg, color: badge.color, padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, display: "inline-block", whiteSpace: "nowrap" }}>
                    {badge.label}
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "#8C7B6E" }}>{formatDate(p.updatedAt)}</span>
                  <div style={{ display: "flex", gap: "0.375rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <Link href={`/admin/realizacje/${p.id}`} style={{ padding: "0.25rem 0.6rem", backgroundColor: "#F1E9E0", color: "#1F1916", borderRadius: "5px", fontSize: "0.75rem", textDecoration: "none", whiteSpace: "nowrap" }}>
                      Edytuj
                    </Link>
                    <Link href={`/realizacje/${p.slug}`} target="_blank" style={{ padding: "0.25rem 0.6rem", backgroundColor: "#F1E9E0", color: "#1F1916", borderRadius: "5px", fontSize: "0.75rem", textDecoration: "none", whiteSpace: "nowrap" }}>
                      Podgląd ↗
                    </Link>
                    <form action={async () => {
                      "use server";
                      const next: Status = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
                      await toggleProjectStatusAction(p.id, next);
                    }}>
                      <button type="submit" style={{ padding: "0.25rem 0.6rem", backgroundColor: p.status === "PUBLISHED" ? "#fff7ed" : "#f0fdf4", color: p.status === "PUBLISHED" ? "#c2410c" : "#166534", border: "1px solid", borderColor: p.status === "PUBLISHED" ? "#fed7aa" : "#bbf7d0", borderRadius: "5px", fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap" }}>
                        {p.status === "PUBLISHED" ? "Cofnij" : "Opublikuj"}
                      </button>
                    </form>
                    <DeleteProjectButton id={p.id} title={p.title} small />
                  </div>
                </div>

                {/* Mobile card */}
                <div className="rz-card-mobile" style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "0.75rem" }}>
                    <div style={{ minWidth: 0 }}>
                      {p.featured && <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "#765C49", background: "#F1E9E0", padding: "0.15rem 0.4rem", borderRadius: "99px", display: "inline-block", marginBottom: "0.3rem" }}>Wyróżniona</span>}
                      <Link href={`/admin/realizacje/${p.id}`} style={{ color: "#1F1916", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none", display: "block" }}>
                        {p.title}
                      </Link>
                      <p style={{ fontSize: "0.75rem", color: "#8C7B6E", marginTop: "0.15rem", wordBreak: "break-all" }}>/realizacje/{p.slug}</p>
                    </div>
                    <span style={{ backgroundColor: badge.bg, color: badge.color, padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {badge.label}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#8C7B6E", marginBottom: "0.75rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {p.category && <span>{p.category}</span>}
                    <span>Format: {AR_LABEL[p.videoAspectRatio] ?? "—"}</span>
                    <span>Aktualizacja: {formatDate(p.updatedAt)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Link href={`/admin/realizacje/${p.id}`} style={{ padding: "0.4rem 0.875rem", backgroundColor: "#1F1916", color: "#F1E9E0", borderRadius: "5px", fontSize: "0.8125rem", textDecoration: "none", fontWeight: 500 }}>
                      Edytuj
                    </Link>
                    <Link href={`/realizacje/${p.slug}`} target="_blank" style={{ padding: "0.4rem 0.875rem", backgroundColor: "#F1E9E0", color: "#1F1916", borderRadius: "5px", fontSize: "0.8125rem", textDecoration: "none", border: "1px solid #C4B5A5" }}>
                      Podgląd ↗
                    </Link>
                    <form action={async () => {
                      "use server";
                      const next: Status = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
                      await toggleProjectStatusAction(p.id, next);
                    }}>
                      <button type="submit" style={{ padding: "0.4rem 0.875rem", backgroundColor: p.status === "PUBLISHED" ? "#fff7ed" : "#f0fdf4", color: p.status === "PUBLISHED" ? "#c2410c" : "#166534", border: "1px solid", borderColor: p.status === "PUBLISHED" ? "#fed7aa" : "#bbf7d0", borderRadius: "5px", fontSize: "0.8125rem", cursor: "pointer" }}>
                        {p.status === "PUBLISHED" ? "Cofnij do szkicu" : "Opublikuj"}
                      </button>
                    </form>
                    <DeleteProjectButton id={p.id} title={p.title} small />
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
