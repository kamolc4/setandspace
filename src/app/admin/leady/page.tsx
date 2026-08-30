import Link from "next/link";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { formatWarsawDateTime } from "@/lib/timezone";
import { LeadyGoogleTabs } from "@/components/admin/LeadyGoogleTabs";
import type { LeadStatus, Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

// ── Status helpers ─────────────────────────────────────────────────────────────

const STATUS_META: Record<
  LeadStatus,
  { label: string; bg: string; color: string }
> = {
  NEW: { label: "Nowy", bg: "#FFF8E1", color: "#7D5A00" },
  CONTACTED: { label: "Skontaktowano", bg: "#F1E9E0", color: "#6B5040" },
  IN_PROGRESS: { label: "W trakcie", bg: "#E8DED2", color: "#5C4030" },
  WON: { label: "Pozyskany", bg: "#DCEFD8", color: "#2D5A1B" },
  LOST: { label: "Utracony", bg: "#F5E4E4", color: "#8B2222" },
};

const STATUS_FILTERS = [
  { label: "Wszystkie", value: "" },
  { label: "Nowe", value: "NEW" },
  { label: "Skontaktowano", value: "CONTACTED" },
  { label: "W trakcie", value: "IN_PROGRESS" },
  { label: "Pozyskane", value: "WON" },
  { label: "Utracone", value: "LOST" },
] as const;

function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      style={{
        backgroundColor: meta.bg,
        color: meta.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "99px",
        fontSize: "0.75rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {meta.label}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function LeadyPage({ searchParams }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const sp = await searchParams;
  const statusFilter = (sp.status ?? "") as LeadStatus | "";
  const searchQuery = (sp.q ?? "").trim();

  const db = getPrisma();

  // Build where clause
  const where: Prisma.LeadWhereInput = {};
  if (statusFilter) where.status = statusFilter as LeadStatus;
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { email: { contains: searchQuery, mode: "insensitive" } },
      { phone: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const [leads, totalNew] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        source: true,
        pageUrl: true,
        message: true,
        createdAt: true,
      },
    }),
    db.lead.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1F1916",
            marginBottom: "0.25rem",
          }}
        >
          Leady i Google
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#8C7B6E" }}>
          {totalNew > 0 ? (
            <>
              <strong style={{ color: "#7D5A00" }}>{totalNew} nowych</strong>{" "}
              · {leads.length} wyników
            </>
          ) : (
            <>{leads.length} wyników</>
          )}
        </p>
      </div>

      <LeadyGoogleTabs />

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.375rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {STATUS_FILTERS.map(({ label, value }) => {
          const url = new URLSearchParams();
          if (value) url.set("status", value);
          if (searchQuery) url.set("q", searchQuery);
          const href = url.size ? `/admin/leady?${url}` : "/admin/leady";
          const active = statusFilter === value;
          return (
            <Link
              key={value}
              href={href}
              style={{
                padding: "0.35rem 0.875rem",
                borderRadius: "99px",
                fontSize: "0.8125rem",
                fontWeight: active ? 700 : 400,
                textDecoration: "none",
                backgroundColor: active ? "#1F1916" : "#E8DED2",
                color: active ? "#F7F3EE" : "#6B5040",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form
        method="GET"
        action="/admin/leady"
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {statusFilter && (
          <input type="hidden" name="status" value={statusFilter} />
        )}
        <input
          name="q"
          type="search"
          defaultValue={searchQuery}
          placeholder="Szukaj po imieniu, e-mailu, telefonie..."
          style={{
            flex: "1 1 220px",
            padding: "0.5rem 0.875rem",
            border: "1px solid #C4B5A5",
            borderRadius: "6px",
            fontSize: "0.875rem",
            backgroundColor: "#fff",
            color: "#1F1916",
            outline: "none",
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1.25rem",
            backgroundColor: "#1F1916",
            color: "#F7F3EE",
            border: "none",
            borderRadius: "6px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Szukaj
        </button>
        {(searchQuery || statusFilter) && (
          <Link
            href="/admin/leady"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#F1E9E0",
              color: "#6B5040",
              border: "1px solid #C4B5A5",
              borderRadius: "6px",
              fontSize: "0.875rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Wyczyść
          </Link>
        )}
      </form>

      {/* List */}
      {leads.length === 0 ? (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #C4B5A5",
            borderRadius: "10px",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#8C7B6E", fontSize: "0.9375rem" }}>
            {searchQuery || statusFilter
              ? "Brak leadów pasujących do filtrów."
              : "Brak leadów. Pojawią się tutaj po wypełnieniu formularza kontaktowego."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="leads-table-wrap">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#fff",
                border: "1px solid #C4B5A5",
                borderRadius: "10px",
                overflow: "hidden",
                fontSize: "0.875rem",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#F7F3EE", borderBottom: "1px solid #C4B5A5" }}>
                  {["Imię", "E-mail", "Telefon", "Status", "Źródło", "Data", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.625rem 1rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#8C7B6E",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={lead.id}
                    style={{
                      borderTop: i === 0 ? "none" : "1px solid #F1E9E0",
                    }}
                  >
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#1F1916", whiteSpace: "nowrap" }}>
                      {lead.name}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#4A3A35" }}>
                      <a href={`mailto:${lead.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {lead.email}
                      </a>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#4A3A35", whiteSpace: "nowrap" }}>
                      {lead.phone ? (
                        <a href={`tel:${lead.phone}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {lead.phone}
                        </a>
                      ) : (
                        <span style={{ color: "#C4B5A5" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#8C7B6E", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {lead.pageUrl ?? lead.source ?? "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#8C7B6E", whiteSpace: "nowrap" }}>
                      {formatWarsawDateTime(lead.createdAt)}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <Link
                        href={`/admin/leady/${lead.id}`}
                        style={{
                          color: "#765C49",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: "0.8125rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Otwórz →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="leads-cards">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leady/${lead.id}`}
                style={{
                  display: "block",
                  backgroundColor: "#fff",
                  border: "1px solid #C4B5A5",
                  borderRadius: "10px",
                  padding: "1rem 1.125rem",
                  marginBottom: "0.625rem",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.5rem",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#1F1916", fontSize: "0.9375rem" }}>
                    {lead.name}
                  </span>
                  <StatusBadge status={lead.status} />
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#765C49", marginBottom: "0.25rem" }}>
                  {lead.email}
                </p>
                {lead.phone && (
                  <p style={{ fontSize: "0.8125rem", color: "#8C7B6E", marginBottom: "0.25rem" }}>
                    {lead.phone}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#8C7B6E",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    marginBottom: "0.5rem",
                  }}
                >
                  {lead.message}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#C4B5A5" }}>
                  {formatWarsawDateTime(lead.createdAt)}
                  {lead.pageUrl && ` · ${lead.pageUrl}`}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}

      <style>{`
        .leads-table-wrap { display: block; }
        .leads-cards { display: none; }
        @media (max-width: 767px) {
          .leads-table-wrap { display: none; }
          .leads-cards { display: block; }
        }
      `}</style>
    </div>
  );
}
