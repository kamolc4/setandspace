import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { formatWarsawDateTime } from "@/lib/timezone";
import { updateLeadStatusAction } from "@/app/admin/_actions/leads";
import type { LeadStatus } from "@/generated/prisma/client";

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

const STATUS_ACTIONS: { status: LeadStatus; label: string }[] = [
  { status: "NEW", label: "Oznacz jako nowy" },
  { status: "CONTACTED", label: "Skontaktowano" },
  { status: "IN_PROGRESS", label: "W trakcie" },
  { status: "WON", label: "Pozyskany" },
  { status: "LOST", label: "Utracony" },
];

function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      style={{
        backgroundColor: meta.bg,
        color: meta.color,
        padding: "0.3rem 0.875rem",
        borderRadius: "99px",
        fontSize: "0.875rem",
        fontWeight: 700,
      }}
    >
      {meta.label}
    </span>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value?: string | null;
  href?: string;
}) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "#8C7B6E",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </p>
      {href ? (
        <a
          href={href}
          style={{ color: "#765C49", fontWeight: 500, fontSize: "0.9375rem" }}
        >
          {value}
        </a>
      ) : (
        <p style={{ color: "#1F1916", fontSize: "0.9375rem", lineHeight: 1.6 }}>
          {value}
        </p>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const db = getPrisma();
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  const currentMeta = STATUS_META[lead.status];

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/leady"
        style={{
          color: "#8C7B6E",
          textDecoration: "none",
          fontSize: "0.875rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          marginBottom: "1.5rem",
        }}
      >
        ← Wszystkie leady
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
        className="lead-detail-grid"
      >
        {/* Left: lead data */}
        <div>
          {/* Header card */}
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #C4B5A5",
              borderRadius: "10px",
              padding: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <h1
                style={{
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  color: "#1F1916",
                  lineHeight: 1.2,
                }}
              >
                {lead.name}
              </h1>
              <StatusBadge status={lead.status} />
            </div>

            <Field
              label="E-mail"
              value={lead.email}
              href={`mailto:${lead.email}`}
            />
            {lead.phone && (
              <Field
                label="Telefon"
                value={lead.phone}
                href={`tel:${lead.phone}`}
              />
            )}
            {lead.company && <Field label="Firma / obiekt" value={lead.company} />}
            {lead.projectType && (
              <Field label="Rodzaj projektu" value={lead.projectType} />
            )}
            {lead.location && <Field label="Lokalizacja" value={lead.location} />}

            <div style={{ marginBottom: "1.25rem" }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#8C7B6E",
                  marginBottom: "0.375rem",
                }}
              >
                Wiadomość
              </p>
              <p
                style={{
                  color: "#1F1916",
                  fontSize: "0.9375rem",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {lead.message}
              </p>
            </div>

            <p
              style={{
                fontSize: "0.8125rem",
                color: "#8C7B6E",
                borderTop: "1px solid #F1E9E0",
                paddingTop: "1rem",
                marginTop: "0.5rem",
              }}
            >
              Przesłano: {formatWarsawDateTime(lead.createdAt)}
            </p>
          </div>

          {/* Tracking card */}
          {(lead.source ||
            lead.pageUrl ||
            lead.utmSource ||
            lead.utmMedium ||
            lead.utmCampaign ||
            lead.utmContent ||
            lead.utmTerm) && (
            <div
              style={{
                backgroundColor: "#F7F3EE",
                border: "1px solid #C4B5A5",
                borderRadius: "10px",
                padding: "1.25rem 1.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#8C7B6E",
                  marginBottom: "0.875rem",
                }}
              >
                Śledzenie
              </p>
              {[
                { label: "Źródło", value: lead.source },
                { label: "Strona wysłania", value: lead.pageUrl },
                { label: "UTM source", value: lead.utmSource },
                { label: "UTM medium", value: lead.utmMedium },
                { label: "UTM campaign", value: lead.utmCampaign },
                { label: "UTM content", value: lead.utmContent },
                { label: "UTM term", value: lead.utmTerm },
              ]
                .filter((f) => f.value)
                .map((f) => (
                  <div
                    key={f.label}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      fontSize: "0.8125rem",
                      marginBottom: "0.375rem",
                    }}
                  >
                    <span style={{ color: "#8C7B6E", minWidth: "120px" }}>
                      {f.label}
                    </span>
                    <span style={{ color: "#1F1916", wordBreak: "break-all" }}>
                      {f.value}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right: status panel */}
        <div>
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #C4B5A5",
              borderRadius: "10px",
              padding: "1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "#8C7B6E",
                marginBottom: "1rem",
              }}
            >
              Zmień status
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              {STATUS_ACTIONS.map(({ status, label }) => {
                const isActive = lead.status === status;
                const action = updateLeadStatusAction.bind(null, lead.id, status);
                return (
                  <form key={status} action={action}>
                    <button
                      type="submit"
                      disabled={isActive}
                      style={{
                        width: "100%",
                        padding: "0.625rem 1rem",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 700 : 500,
                        cursor: isActive ? "default" : "pointer",
                        border: isActive
                          ? `2px solid ${currentMeta.color}`
                          : "1px solid #C4B5A5",
                        backgroundColor: isActive ? currentMeta.bg : "#F7F3EE",
                        color: isActive ? currentMeta.color : "#4A3A35",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isActive ? `✓ ${label}` : label}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .lead-detail-grid {
            grid-template-columns: 1fr 280px !important;
          }
        }
      `}</style>
    </div>
  );
}
