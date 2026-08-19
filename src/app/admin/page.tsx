import Link from "next/link";
import { getPrisma } from "@/lib/prisma";

async function getStats() {
  try {
    const db = getPrisma();
    const [published, drafts, latest] = await Promise.all([
      db.article.count({ where: { status: "PUBLISHED" } }),
      db.article.count({ where: { status: "DRAFT" } }),
      db.article.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, status: true, updatedAt: true },
      }),
    ]);
    return { published, drafts, latest };
  } catch {
    return { published: 0, drafts: 0, latest: [] };
  }
}

const STATUS_BADGE = {
  PUBLISHED: { bg: "#dcfce7", color: "#166534", label: "Opublikowany" },
  DRAFT: { bg: "#E8DED2", color: "#6B5040", label: "Draft" },
};

export default async function AdminDashboard() {
  const { published, drafts, latest } = await getStats();

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1F1916", marginBottom: "2rem" }}>
        Dashboard
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          { label: "Opublikowane", value: published, color: "#166534" },
          { label: "Drafty", value: drafts, color: "#6B5040" },
        ].map((stat) => (
          <div key={stat.label} style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", padding: "1.5rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "#8C7B6E", marginBottom: "0.5rem" }}>{stat.label}</p>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1F1916" }}>Ostatnie artykuły</h2>
        <Link href="/admin/poradniki" style={{ fontSize: "0.875rem", color: "#765C49", textDecoration: "none" }}>
          Wszystkie →
        </Link>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", overflow: "hidden" }}>
        {latest.length === 0 ? (
          <p style={{ padding: "2rem", color: "#8C7B6E", textAlign: "center" }}>
            Brak artykułów.{" "}
            <Link href="/admin/poradniki/nowy" style={{ color: "#765C49" }}>
              Dodaj pierwszy →
            </Link>
          </p>
        ) : (
          latest.map((a, i) => {
            const badge = STATUS_BADGE[a.status as keyof typeof STATUS_BADGE];
            return (
              <div key={a.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.875rem 1rem",
                borderTop: i === 0 ? "none" : "1px solid #F1E9E0",
                gap: "1rem",
                flexWrap: "wrap",
              }}>
                <div style={{ minWidth: 0 }}>
                  <Link href={`/admin/poradniki/${a.id}`} style={{
                    color: "#1F1916",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "0.9375rem",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {a.title}
                  </Link>
                  <p style={{ fontSize: "0.75rem", color: "#8C7B6E", marginTop: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    /poradniki/{a.slug}
                  </p>
                </div>
                <span style={{
                  backgroundColor: badge.bg,
                  color: badge.color,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "99px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {badge.label}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link
          href="/admin/poradniki/nowy"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#1F1916",
            color: "#F1E9E0",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          + Dodaj nowy poradnik
        </Link>
      </div>
    </div>
  );
}
