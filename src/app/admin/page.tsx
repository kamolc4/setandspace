import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { formatWarsawDateTime } from "@/lib/timezone";
import type { LeadStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

const ARTICLE_STATUS_BADGE: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  PUBLISHED: { bg: "#dcfce7", color: "#166534", label: "Opublikowany" },
  SCHEDULED: { bg: "#1F1916", color: "#F7F3EE", label: "Zaplanowany" },
  DRAFT: { bg: "#E8DED2", color: "#6B5040", label: "Szkic" },
};

const LEAD_STATUS_BADGE: Record<
  LeadStatus,
  { bg: string; color: string; label: string }
> = {
  NEW: { bg: "#FFF8E1", color: "#7D5A00", label: "Nowy" },
  CONTACTED: { bg: "#F1E9E0", color: "#6B5040", label: "Skontaktowano" },
  IN_PROGRESS: { bg: "#E8DED2", color: "#5C4030", label: "W trakcie" },
  WON: { bg: "#DCEFD8", color: "#2D5A1B", label: "Pozyskany" },
  LOST: { bg: "#F5E4E4", color: "#8B2222", label: "Utracony" },
};

function formatDate(d: Date) {
  return d.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function getStats() {
  try {
    const db = getPrisma();
    const [
      articlesPublished,
      articlesScheduled,
      articlesDraft,
      projectsPublished,
      projectsDraft,
      leadsNew,
      leadsInProgress,
      leadsWon,
      latestArticles,
      latestProjects,
      latestLeads,
      upcomingScheduled,
    ] = await Promise.all([
      db.article.count({ where: { status: "PUBLISHED" } }),
      db.article.count({ where: { status: "SCHEDULED" } }),
      db.article.count({ where: { status: "DRAFT" } }),
      db.portfolioProject.count({ where: { status: "PUBLISHED" } }),
      db.portfolioProject.count({ where: { status: "DRAFT" } }),
      db.lead.count({ where: { status: "NEW" } }),
      db.lead.count({ where: { status: "IN_PROGRESS" } }),
      db.lead.count({ where: { status: "WON" } }),
      db.article.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          updatedAt: true,
          publishedAt: true,
        },
      }),
      db.portfolioProject.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          updatedAt: true,
        },
      }),
      db.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
        },
      }),
      db.article.findMany({
        where: { status: "SCHEDULED", publishedAt: { gt: new Date() } },
        orderBy: { publishedAt: "asc" },
        take: 5,
        select: { id: true, title: true, publishedAt: true },
      }),
    ]);

    return {
      articlesPublished,
      articlesScheduled,
      articlesDraft,
      projectsPublished,
      projectsDraft,
      leadsNew,
      leadsInProgress,
      leadsWon,
      latestArticles,
      latestProjects,
      latestLeads,
      upcomingScheduled,
    };
  } catch {
    return {
      articlesPublished: 0,
      articlesScheduled: 0,
      articlesDraft: 0,
      projectsPublished: 0,
      projectsDraft: 0,
      leadsNew: 0,
      leadsInProgress: 0,
      leadsWon: 0,
      latestArticles: [],
      latestProjects: [],
      latestLeads: [],
      upcomingScheduled: [],
    };
  }
}

export default async function AdminDashboard() {
  const {
    articlesPublished,
    articlesScheduled,
    articlesDraft,
    projectsPublished,
    projectsDraft,
    leadsNew,
    leadsInProgress,
    leadsWon,
    latestArticles,
    latestProjects,
    latestLeads,
    upcomingScheduled,
  } = await getStats();

  const articleStats = [
    { label: "Poradniki — opublikowane", value: articlesPublished, color: "#166534" },
    { label: "Poradniki — zaplanowane", value: articlesScheduled, color: "#1F1916" },
    { label: "Poradniki — szkice", value: articlesDraft, color: "#6B5040" },
    { label: "Realizacje — opublikowane", value: projectsPublished, color: "#166534" },
    { label: "Realizacje — szkice", value: projectsDraft, color: "#6B5040" },
  ];

  const leadStats = [
    { label: "Nowe leady", value: leadsNew, color: "#7D5A00", href: "/admin/leady?status=NEW" },
    { label: "W trakcie", value: leadsInProgress, color: "#5C4030", href: "/admin/leady?status=IN_PROGRESS" },
    { label: "Pozyskane", value: leadsWon, color: "#2D5A1B", href: "/admin/leady?status=WON" },
  ];

  return (
    <div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#1F1916",
          marginBottom: "2rem",
        }}
      >
        Dashboard
      </h1>

      {/* Content stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {articleStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #C4B5A5",
              borderRadius: "10px",
              padding: "1.25rem 1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "#8C7B6E",
                marginBottom: "0.375rem",
                lineHeight: 1.3,
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: stat.color,
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Lead stats */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1F1916" }}>
            Leady
          </h2>
          <Link
            href="/admin/leady"
            style={{ fontSize: "0.875rem", color: "#765C49", textDecoration: "none" }}
          >
            Wszystkie leady →
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          {leadStats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #C4B5A5",
                borderRadius: "10px",
                padding: "1.25rem 1.5rem",
                textDecoration: "none",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#8C7B6E",
                  marginBottom: "0.375rem",
                  lineHeight: 1.3,
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: stat.color,
                }}
              >
                {stat.value}
              </p>
            </Link>
          ))}
        </div>

        {/* Latest leads */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #C4B5A5",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {latestLeads.length === 0 ? (
            <p
              style={{
                padding: "1.5rem",
                color: "#8C7B6E",
                textAlign: "center",
                fontSize: "0.875rem",
              }}
            >
              Brak leadów. Pojawią się tu po wypełnieniu formularza kontaktowego.
            </p>
          ) : (
            latestLeads.map((lead, i) => {
              const badge = LEAD_STATUS_BADGE[lead.status];
              return (
                <div
                  key={lead.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderTop: i === 0 ? "none" : "1px solid #F1E9E0",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/admin/leady/${lead.id}`}
                      style={{
                        color: "#1F1916",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lead.name}
                    </Link>
                    <p style={{ fontSize: "0.75rem", color: "#8C7B6E", marginTop: "0.1rem" }}>
                      {formatWarsawDateTime(lead.createdAt)}
                    </p>
                  </div>
                  <span
                    style={{
                      backgroundColor: badge.bg,
                      color: badge.color,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "99px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upcoming scheduled */}
      {upcomingScheduled.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1F1916" }}>
              Najbliższe publikacje
            </h2>
            <Link
              href="/admin/planer"
              style={{ fontSize: "0.875rem", color: "#765C49", textDecoration: "none" }}
            >
              Zobacz planer →
            </Link>
          </div>
          <div
            style={{
              backgroundColor: "#1F1916",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {upcomingScheduled.map((a, i) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <Link
                    href={`/admin/poradniki/${a.id}`}
                    style={{
                      color: "#F7F3EE",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.title}
                  </Link>
                  {a.publishedAt && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(247,243,238,0.55)",
                        marginTop: "0.1rem",
                      }}
                    >
                      {formatWarsawDateTime(a.publishedAt)}
                    </p>
                  )}
                </div>
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#F7F3EE",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "99px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Zaplanowany
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest articles */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1F1916" }}>
            Ostatnie poradniki
          </h2>
          <Link
            href="/admin/poradniki"
            style={{ fontSize: "0.875rem", color: "#765C49", textDecoration: "none" }}
          >
            Wszystkie →
          </Link>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #C4B5A5",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {latestArticles.length === 0 ? (
            <p
              style={{
                padding: "1.5rem",
                color: "#8C7B6E",
                textAlign: "center",
                fontSize: "0.875rem",
              }}
            >
              Brak poradników.{" "}
              <Link href="/admin/poradniki/nowy" style={{ color: "#765C49" }}>
                Dodaj pierwszy →
              </Link>
            </p>
          ) : (
            latestArticles.map((a, i) => {
              const badge =
                ARTICLE_STATUS_BADGE[a.status] ?? ARTICLE_STATUS_BADGE.DRAFT;
              return (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderTop: i === 0 ? "none" : "1px solid #F1E9E0",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/admin/poradniki/${a.id}`}
                      style={{
                        color: "#1F1916",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.title}
                    </Link>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#8C7B6E",
                        marginTop: "0.1rem",
                      }}
                    >
                      {a.status === "SCHEDULED" && a.publishedAt
                        ? `⏱ ${formatWarsawDateTime(a.publishedAt)}`
                        : formatDate(a.updatedAt)}
                    </p>
                  </div>
                  <span
                    style={{
                      backgroundColor: badge.bg,
                      color: badge.color,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "99px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      border:
                        a.status === "SCHEDULED" ? "1px solid #3a2e2a" : "none",
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Latest projects */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1F1916" }}>
            Ostatnie realizacje
          </h2>
          <Link
            href="/admin/realizacje"
            style={{ fontSize: "0.875rem", color: "#765C49", textDecoration: "none" }}
          >
            Wszystkie →
          </Link>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #C4B5A5",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {latestProjects.length === 0 ? (
            <p
              style={{
                padding: "1.5rem",
                color: "#8C7B6E",
                textAlign: "center",
                fontSize: "0.875rem",
              }}
            >
              Brak realizacji.{" "}
              <Link href="/admin/realizacje/nowa" style={{ color: "#765C49" }}>
                Dodaj pierwszą →
              </Link>
            </p>
          ) : (
            latestProjects.map((p, i) => {
              const badge =
                ARTICLE_STATUS_BADGE[p.status] ?? ARTICLE_STATUS_BADGE.DRAFT;
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderTop: i === 0 ? "none" : "1px solid #F1E9E0",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/admin/realizacje/${p.id}`}
                      style={{
                        color: "#1F1916",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.title}
                    </Link>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#8C7B6E",
                        marginTop: "0.1rem",
                      }}
                    >
                      {formatDate(p.updatedAt)}
                    </p>
                  </div>
                  <span
                    style={{
                      backgroundColor: badge.bg,
                      color: badge.color,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "99px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link
          href="/admin/poradniki/nowy"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#1F1916",
            color: "#F1E9E0",
            padding: "0.625rem 1.25rem",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          + Dodaj poradnik
        </Link>
        <Link
          href="/admin/planer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#F1E9E0",
            color: "#1F1916",
            border: "1px solid #C4B5A5",
            padding: "0.625rem 1.25rem",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          Planer publikacji →
        </Link>
        <Link
          href="/admin/realizacje/nowa"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#F1E9E0",
            color: "#1F1916",
            border: "1px solid #C4B5A5",
            padding: "0.625rem 1.25rem",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          + Dodaj realizację
        </Link>
        <Link
          href="/admin/leady"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#F1E9E0",
            color: "#1F1916",
            border: "1px solid #C4B5A5",
            padding: "0.625rem 1.25rem",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          Leady →
        </Link>
      </div>
    </div>
  );
}
