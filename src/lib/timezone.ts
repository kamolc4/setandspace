const TZ = "Europe/Warsaw";

/**
 * Convert a Europe/Warsaw local date + time to a UTC Date.
 * Correctly handles CET (UTC+1) and CEST (UTC+2) without hardcoding offsets.
 *
 * Algorithm:
 * 1. Treat the input as UTC ("trial") to get a concrete instant.
 * 2. Ask Intl what Warsaw clock shows for that instant — that gives the Warsaw offset.
 * 3. Subtract the offset to get true UTC.
 */
export function warsawToUtc(dateStr: string, timeStr: string): Date {
  const trial = new Date(`${dateStr}T${timeStr}:00Z`);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(trial);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const h = map["hour"] === "24" ? "00" : map["hour"];
  const warsawAsUtc = new Date(
    `${map["year"]}-${map["month"]}-${map["day"]}T${h}:${map["minute"]}:00Z`
  );

  const offsetMs = warsawAsUtc.getTime() - trial.getTime();
  return new Date(trial.getTime() - offsetMs);
}

/** Extract YYYY-MM-DD string for a <input type="date"> prefilled in Warsaw time */
export function utcToWarsawDateInput(utcDate: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(utcDate);
  const m = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${m["year"]}-${m["month"]}-${m["day"]}`;
}

/** Extract HH:MM string for a <input type="time"> prefilled in Warsaw time */
export function utcToWarsawTimeInput(utcDate: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(utcDate);
  const m = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${m["hour"] === "24" ? "00" : m["hour"]}:${m["minute"]}`;
}

/** Human-readable date in Warsaw timezone, Polish locale — e.g. "31.08.2026" */
export function formatWarsawDate(utcDate: Date): string {
  return utcDate.toLocaleDateString("pl-PL", {
    timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric",
  });
}

/** Human-readable date+time in Warsaw timezone — e.g. "31.08.2026, 10:00" */
export function formatWarsawDateTime(utcDate: Date): string {
  const d = utcDate.toLocaleDateString("pl-PL", {
    timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric",
  });
  const t = utcDate.toLocaleTimeString("pl-PL", {
    timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false,
  });
  return `${d}, ${t}`;
}

/** ISO date string (YYYY-MM-DD) for URL params, based on Warsaw date */
export function utcToWarsawIsoDate(utcDate: Date): string {
  return utcToWarsawDateInput(utcDate);
}
