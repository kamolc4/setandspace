import Link from "next/link";
import { getPrisma } from "@/lib/prisma";

async function getStats() {
  try {
    const db = getPrisma();
    const [
      articlesPublished, articlesDraft,
      projectsPublished, projectsDraft,
      latestArticles, latestProjects,
    ] = await Promise.all([
      db.article.count({ where: { status: "PUBLISHED" } }),
      db.article.count({ where: { status: "DRAFT" } }),
      db.portfolioProject.count({ where: { status: "PUBLISHED" } }),
      db.portfolioProject.count({ where: { status: "DRAFT" } }),
      db.article.findMany({ orderBy: { updatedAt: "desc" }, take: 4, select: { id: true, title: true, slug: true, status: true, updatedAt: true } }),
      db.portfolioProject.findMany({ orderBy: { updatedAt: "desc" }, take: 4, select: { id: true, title: true, slug: true, status: true, updatedAt: true } }),
    ]);
    return { articlesPublished, articlesDraft, projectsPublished, projectsDraft, latestArticles, latestProjects };
  } catch {
    return { articlesPublished: 0, articlesDraft: 0, projectsPublished: 0, projectsDraft: 0, latestArticles: [], latestProjects: [] };
  }
}

const STATUS_BADGE = {
  PUBLISHED: { bg: "#dcfce7", color: "#166534", label: "Opublikowany" },
  DRAFT: { bg: "#E8DED2", color: "#6B5040", label: "Draft" },
};

function formatDate(d: Date) {
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function AdminDashboard() {
  const { articlesPublished, articlesDraft, projectsPublished, projectsDraft, latestArticles, latestProjects } = await getStats();

  const stats = [
    { label: "Poradniki — opublikowane", value: articlesPublished, color: "#166534" },
    { label: "Poradniki — drafty", value: articlesDraft, color: "#6B5040" },
    { label: "Realizacje — opublikowane", value: projectsPublished, color: "#166534" },
    { label: "Realizacje — drafty", value: projectsDraft, color: "#6B5040" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1F1916", marginBottom: "2rem" }}>
        Dashboard
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.75rem", color: "#8C7B6E", marginBottom: "0.375rem", lineHeight: 1.3 }}>{stat.label}</p>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Ostatnie poradniki */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1F1916" }}>Ostatnie poradniki</h2>
          <Link href="/admin/poradniki" style={{ fontSize: "0.875rem", color: "#765C49", textDecoration: "none" }}>
            Wszystkie →
          </Link>
        </div>
        <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", overflow: "hidden" }}>
          {latestArticles.length === 0 ? (
            <p style={{ padding: "1.5rem", color: "#8C7B6E", textAlign: "center", fontSize: "0.875rem" }}>
              Brak poradników.{" "}
              <Link href="/admin/poradniki/nowy" style={{ color: "#765C49" }}>Dodaj pierwszy →</Link>
            </p>
          ) : (
            latestArticles.map((a, i) => {
              const badge = STATUS_BADGE[a.status as keyof typeof STATUS_BADGE];
              return (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderTop: i === 0 ? "none" : "1px solid #F1E9E0", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ minWidth: 0 }}>
                    <Link href={`/admin/poradniki/${a.id}`} style={{ color: "#1F1916", textDecoration: "none", fontWeight: 500, fontSize: "0.875rem", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.title}
                    </Link>
                    <p style={{ fontSize: "0.75rem", color: "#8C7B6E", marginTop: "0.1rem" }}>{formatDate(a.updatedAt)}</p>
                  </div>
                  <span style={{ backgroundColor: badge.bg, color: badge.color, padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {badge.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Ostatnie realizacje */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1F1916" }}>Ostatnie realizacje</h2>
          <Link href="/admin/realizacje" style={{ fontSize: "0.875rem", color: "#765C49", textDecoration: "none" }}>
            Wszystkie →
          </Link>
        </div>
        <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", overflow: "hidden" }}>
          {latestProjects.length === 0 ? (
            <p style={{ padding: "1.5rem", color: "#8C7B6E", textAlign: "center", fontSize: "0.875rem" }}>
              Brak realizacji.{" "}
              <Link href="/admin/realizacje/nowa" style={{ color: "#765C49" }}>Dodaj pierwszą →</Link>
            </p>
          ) : (
            latestProjects.map((p, i) => {
              const badge = STATUS_BADGE[p.status as keyof typeof STATUS_BADGE];
              return (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderTop: i === 0 ? "none" : "1px solid #F1E9E0", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ minWidth: 0 }}>
                    <Link href={`/admin/realizacje/${p.id}`} style={{ color: "#1F1916", textDecoration: "none", fontWeight: 500, fontSize: "0.875rem", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.title}
                    </Link>
                    <p style={{ fontSize: "0.75rem", color: "#8C7B6E", marginTop: "0.1rem" }}>{formatDate(p.updatedAt)}</p>
                  </div>
                  <span style={{ backgroundColor: badge.bg, color: badge.color, padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {badge.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/admin/poradniki/nowy" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#1F1916", color: "#F1E9E0", padding: "0.625rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>
          + Dodaj poradnik
        </Link>
        <Link href="/admin/realizacje/nowa" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#F1E9E0", color: "#1F1916", border: "1px solid #C4B5A5", padding: "0.625rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>
          + Dodaj realizację
        </Link>
      </div>
    </div>
  );
}
