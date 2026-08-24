import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { cancelScheduleAction, publishNowAction } from "@/app/admin/_actions/articles";
import { QuickScheduleButton } from "@/components/admin/QuickScheduleButton";
import { formatWarsawDateTime, utcToWarsawDateInput, utcToWarsawTimeInput } from "@/lib/timezone";
import type { Article } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ w?: string }>;
}

// ── Date helpers ─────────────────────────────────────────────────────────────

/** Monday (ISO week start) for a given date */
function getMondayOf(d: Date): Date {
  const day = new Date(d);
  const dow = day.getDay(); // 0 = Sunday
  const diff = dow === 0 ? -6 : 1 - dow;
  day.setDate(day.getDate() + diff);
  day.setHours(0, 0, 0, 0);
  return day;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const PL_DAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

const PL_MONTHS = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];

function formatDayHeader(d: Date): string {
  return `${d.getDate()} ${PL_MONTHS[d.getMonth()]}`;
}

function formatWeekRange(monday: Date, sunday: Date): string {
  const m = `${monday.getDate()} ${PL_MONTHS[monday.getMonth()]}`;
  const s = `${sunday.getDate()} ${PL_MONTHS[sunday.getMonth()]} ${sunday.getFullYear()}`;
  return `${m} – ${s}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  espresso: "#1F1916",
  pearl: "#F7F3EE",
  sand: "#E8DED2",
  stone: "#C4B5A5",
  umber: "#765C49",
  clay: "#A6856B",
  dune: "#D8C8B8",
  textMut: "#8C7B6E",
  textSec: "#6B5040",
  green: "#166534",
  greenBg: "#dcfce7",
};

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getWeekArticles(weekStart: Date, weekEnd: Date) {
  try {
    const db = getPrisma();
    return db.article.findMany({
      where: {
        status: { in: ["SCHEDULED", "PUBLISHED"] },
        publishedAt: { gte: weekStart, lt: weekEnd },
      },
      orderBy: { publishedAt: "asc" },
    });
  } catch {
    return [] as Article[];
  }
}

async function getUnscheduledDrafts() {
  try {
    const db = getPrisma();
    return db.article.findMany({
      where: { status: "DRAFT", publishedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
  } catch {
    return [] as Article[];
  }
}

async function getNextScheduled() {
  try {
    const db = getPrisma();
    return db.article.findFirst({
      where: {
        status: "SCHEDULED",
        publishedAt: { gt: new Date() },
      },
      orderBy: { publishedAt: "asc" },
    });
  } catch {
    return null;
  }
}

// ── Article card ──────────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: Article }) {
  const isScheduled = article.status === "SCHEDULED";
  const isPublished = article.status === "PUBLISHED";

  const timeStr = article.publishedAt
    ? article.publishedAt.toLocaleTimeString("pl-PL", { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit", hour12: false })
    : null;

  const initDate = isScheduled && article.publishedAt ? utcToWarsawDateInput(article.publishedAt) : "";
  const initTime = isScheduled && article.publishedAt ? utcToWarsawTimeInput(article.publishedAt) : "10:00";

  const cardBg = isScheduled ? C.espresso : isPublished ? "#f8fffe" : C.sand;
  const cardBorder = isScheduled ? C.espresso : isPublished ? "#bbf7d0" : C.dune;
  const cardColor = isScheduled ? "#F7F3EE" : C.espresso;
  const mutColor = isScheduled ? "rgba(247,243,238,0.6)" : C.textMut;

  return (
    <div style={{
      backgroundColor: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: "8px",
      padding: "0.875rem",
      marginBottom: "0.5rem",
    }}>
      {timeStr && (
        <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: mutColor, marginBottom: "0.375rem", fontVariantNumeric: "tabular-nums" }}>
          {timeStr}
        </p>
      )}
      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: cardColor, lineHeight: 1.35, marginBottom: "0.5rem" }}>
        {article.title}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.625rem" }}>
        <span style={{
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: isScheduled ? "rgba(247,243,238,0.7)" : isPublished ? C.green : C.textMut,
          padding: "0.15rem 0.5rem",
          backgroundColor: isScheduled ? "rgba(255,255,255,0.12)" : isPublished ? C.greenBg : C.sand,
          borderRadius: "99px",
          border: isPublished ? `1px solid #bbf7d0` : "none",
        }}>
          {isScheduled ? "Zaplanowany" : isPublished ? "Opublikowany" : "Szkic"}
        </span>
        {article.category && (
          <span style={{ fontSize: "0.75rem", color: mutColor }}>{article.category}</span>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
        <Link
          href={`/admin/poradniki/${article.id}`}
          style={{
            padding: "0.2rem 0.625rem",
            fontSize: "0.75rem",
            borderRadius: "4px",
            textDecoration: "none",
            backgroundColor: isScheduled ? "rgba(255,255,255,0.15)" : C.sand,
            color: cardColor,
            border: isScheduled ? "1px solid rgba(255,255,255,0.2)" : `1px solid ${C.dune}`,
            whiteSpace: "nowrap",
          }}
        >
          Edytuj
        </Link>
        <Link
          href={`/admin/podglad/${article.id}`}
          target="_blank"
          style={{
            padding: "0.2rem 0.625rem",
            fontSize: "0.75rem",
            borderRadius: "4px",
            textDecoration: "none",
            backgroundColor: isScheduled ? "rgba(255,255,255,0.1)" : "#fff",
            color: isScheduled ? "rgba(247,243,238,0.85)" : C.textSec,
            border: isScheduled ? "1px solid rgba(255,255,255,0.15)" : `1px solid ${C.stone}`,
            whiteSpace: "nowrap",
          }}
        >
          Podgląd ↗
        </Link>

        {isScheduled && (
          <>
            <div style={{ position: "relative", display: "inline-block" }}>
              <QuickScheduleButton
                articleId={article.id}
                mode="change"
                initialDate={initDate}
                initialTime={initTime}
                label="Zmień termin"
              />
            </div>
            <form action={async () => {
              "use server";
              await cancelScheduleAction(article.id);
            }}>
              <button type="submit" style={{ padding: "0.2rem 0.625rem", fontSize: "0.75rem", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(247,243,238,0.85)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Anuluj planowanie
              </button>
            </form>
            <form action={async () => {
              "use server";
              await publishNowAction(article.id);
            }}>
              <button type="submit" style={{ padding: "0.2rem 0.625rem", fontSize: "0.75rem", borderRadius: "4px", backgroundColor: C.greenBg, color: C.green, border: "1px solid #bbf7d0", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Opublikuj teraz
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function PlanerPage({ searchParams }: Props) {
  const { w } = await searchParams;

  // Parse week start from URL or use current week's Monday
  let monday: Date;
  if (w && /^\d{4}-\d{2}-\d{2}$/.test(w)) {
    const parsed = new Date(w + "T00:00:00Z");
    monday = getMondayOf(parsed);
  } else {
    monday = getMondayOf(new Date());
  }

  const sunday = addDays(monday, 7); // exclusive end
  const sundayDisplay = addDays(monday, 6);
  const prevMonday = addDays(monday, -7);
  const nextMonday = addDays(monday, 7);
  const todayMonday = getMondayOf(new Date());

  const [weekArticles, unscheduledDrafts, nextScheduled] = await Promise.all([
    getWeekArticles(monday, sunday),
    getUnscheduledDrafts(),
    getNextScheduled(),
  ]);

  // Group articles by day index (0=Mon … 6=Sun)
  const byDay: Article[][] = Array.from({ length: 7 }, () => []);
  for (const a of weekArticles) {
    if (!a.publishedAt) continue;
    const pubDate = new Date(a.publishedAt);
    for (let i = 0; i < 7; i++) {
      if (isSameDay(pubDate, addDays(monday, i))) {
        byDay[i].push(a);
        break;
      }
    }
  }

  const isCurrentWeek = toIsoDate(monday) === toIsoDate(todayMonday);
  const today = new Date();

  // Relative time for next scheduled
  function relativeLabel(d: Date): string {
    const diffMs = d.getTime() - today.getTime();
    const days = Math.ceil(diffMs / 86400000);
    if (days === 0) return "Dzisiaj";
    if (days === 1) return "Jutro";
    if (days <= 6) return `Za ${days} dni`;
    const weeks = Math.ceil(days / 7);
    return `Za ${weeks} ${weeks === 1 ? "tydzień" : weeks < 5 ? "tygodnie" : "tygodni"}`;
  }

  return (
    <div>
      <style>{`
        .planer-week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.75rem; }
        .planer-day { min-width: 0; }
        .planer-day-header { font-size: 0.75rem; font-weight: 700; color: #8C7B6E; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.625rem; padding-bottom: 0.375rem; border-bottom: 2px solid #E8DED2; }
        .planer-day-header.today { color: #1F1916; border-color: #1F1916; }
        .planer-drafts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.625rem; }
        @media (max-width: 900px) {
          .planer-week { grid-template-columns: 1fr; }
        }
        .qs-wrap { position: relative; display: inline-block; }
      `}</style>

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: C.espresso }}>Planer publikacji</h1>
        <Link href="/admin/poradniki/nowy" style={{ backgroundColor: C.espresso, color: "#F1E9E0", padding: "0.625rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, whiteSpace: "nowrap" }}>
          + Nowy poradnik
        </Link>
      </div>

      {/* Next scheduled banner */}
      {nextScheduled && nextScheduled.publishedAt && (
        <div style={{ backgroundColor: C.espresso, color: "#F7F3EE", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(247,243,238,0.6)", marginBottom: "0.25rem" }}>
              Najbliższa publikacja
            </p>
            <p style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "0.125rem" }}>
              {nextScheduled.title}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "rgba(247,243,238,0.7)" }}>
              {formatWarsawDateTime(nextScheduled.publishedAt)}
            </p>
          </div>
          <span style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#F7F3EE", padding: "0.375rem 0.875rem", borderRadius: "99px", fontSize: "0.8125rem", fontWeight: 600, whiteSpace: "nowrap" }}>
            {relativeLabel(nextScheduled.publishedAt)}
          </span>
        </div>
      )}

      {/* Week navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link
            href={`/admin/planer?w=${toIsoDate(prevMonday)}`}
            style={{ padding: "0.4rem 0.875rem", border: `1px solid ${C.stone}`, borderRadius: "6px", color: C.textSec, textDecoration: "none", fontSize: "0.875rem", backgroundColor: "#fff", whiteSpace: "nowrap" }}
          >
            ← Poprzedni tydzień
          </Link>
          {!isCurrentWeek && (
            <Link
              href="/admin/planer"
              style={{ padding: "0.4rem 0.875rem", border: `1px solid ${C.stone}`, borderRadius: "6px", color: C.espresso, textDecoration: "none", fontSize: "0.875rem", backgroundColor: C.sand, fontWeight: 600, whiteSpace: "nowrap" }}
            >
              Dzisiaj
            </Link>
          )}
        </div>

        <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: C.espresso, textAlign: "center", flex: 1, padding: "0 0.5rem" }}>
          {formatWeekRange(monday, sundayDisplay)}
        </p>

        <Link
          href={`/admin/planer?w=${toIsoDate(nextMonday)}`}
          style={{ padding: "0.4rem 0.875rem", border: `1px solid ${C.stone}`, borderRadius: "6px", color: C.textSec, textDecoration: "none", fontSize: "0.875rem", backgroundColor: "#fff", whiteSpace: "nowrap" }}
        >
          Następny tydzień →
        </Link>
      </div>

      {/* Week grid */}
      <div className="planer-week" style={{ marginBottom: "2.5rem" }}>
        {Array.from({ length: 7 }, (_, i) => {
          const day = addDays(monday, i);
          const dayArticles = byDay[i];
          const isToday = isSameDay(day, today);

          return (
            <div key={i} className="planer-day">
              <div className={`planer-day-header${isToday ? " today" : ""}`}>
                {PL_DAYS[i]}
                <span style={{ display: "block", fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: "0.8125rem", color: isToday ? C.espresso : C.textMut, marginTop: "0.125rem" }}>
                  {formatDayHeader(day)}
                </span>
              </div>

              {dayArticles.length === 0 ? (
                <div style={{ color: C.textMut, fontSize: "0.75rem", padding: "0.5rem 0", fontStyle: "italic" }}>
                  —
                </div>
              ) : (
                dayArticles.map((a) => <ArticleCard key={a.id} article={a} />)
              )}
            </div>
          );
        })}
      </div>

      {/* Unscheduled drafts */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: C.espresso }}>
            Niezaplanowane szkice
          </h2>
          <Link href="/admin/poradniki" style={{ fontSize: "0.875rem", color: C.umber, textDecoration: "none" }}>
            Wszystkie poradniki →
          </Link>
        </div>

        {unscheduledDrafts.length === 0 ? (
          <div style={{ backgroundColor: "#fff", border: `1px solid ${C.stone}`, borderRadius: "10px", padding: "2rem", textAlign: "center", color: C.textMut, fontSize: "0.875rem" }}>
            Brak niezaplanowanych szkiców.
          </div>
        ) : (
          <div className="planer-drafts-grid">
            {unscheduledDrafts.map((a) => (
              <div key={a.id} style={{ backgroundColor: "#fff", border: `1px solid ${C.stone}`, borderRadius: "8px", padding: "0.875rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: C.espresso, lineHeight: 1.35, margin: 0 }}>
                  {a.title}
                </p>
                {a.category && (
                  <p style={{ fontSize: "0.75rem", color: C.textMut, margin: 0 }}>{a.category}</p>
                )}
                <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                  <Link href={`/admin/poradniki/${a.id}`} style={{ padding: "0.2rem 0.625rem", fontSize: "0.75rem", borderRadius: "4px", textDecoration: "none", backgroundColor: C.sand, color: C.espresso, border: `1px solid ${C.dune}`, whiteSpace: "nowrap" }}>
                    Edytuj
                  </Link>
                  <div className="qs-wrap">
                    <QuickScheduleButton articleId={a.id} mode="schedule" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
