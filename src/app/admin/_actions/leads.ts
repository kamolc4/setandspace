"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { sendLeadNotification } from "@/lib/email";
import type { LeadStatus } from "@/generated/prisma/client";

// ── Auth guard ────────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
}

// ── Simple in-memory rate limiter (best-effort on serverless) ─────────────────
// Provides basic protection within a single Node.js process lifetime.
// Not shared across Vercel function instances — honeypot is the primary defence.

const ipWindows = new Map<string, number[]>();

async function isRateLimited(): Promise<boolean> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const now = Date.now();
  const windowMs = 60_000;
  const maxPerWindow = 3;

  const times = (ipWindows.get(ip) ?? []).filter((t) => now - t < windowMs);

  if (times.length >= maxPerWindow) return true;

  times.push(now);
  ipWindows.set(ip, times);

  // Periodic cleanup to prevent memory growth
  if (ipWindows.size > 500) {
    for (const [key, vals] of ipWindows) {
      if (vals.every((t) => now - t >= windowMs)) ipWindows.delete(key);
    }
  }

  return false;
}

// ── Validation schema ─────────────────────────────────────────────────────────

const LeadPayloadSchema = z.object({
  name: z
    .string()
    .min(2, "Imię musi mieć co najmniej 2 znaki")
    .max(100, "Imię jest za długie"),
  email: z
    .string()
    .email("Podaj poprawny adres e-mail")
    .max(254, "Adres e-mail jest za długi"),
  phone: z.string().max(30, "Numer telefonu jest za długi").optional(),
  company: z.string().max(200).optional(),
  projectType: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  message: z
    .string()
    .min(10, "Wiadomość musi mieć co najmniej 10 znaków")
    .max(5000, "Wiadomość jest za długa"),
  // Tracking (auto-filled by client)
  pageUrl: z.string().max(500).optional(),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  // Honeypot — must be empty
  website: z.string().optional(),
});

// ── Public action: submit contact form ───────────────────────────────────────

export type SubmitLeadResult = { ok: true } | { ok: false; error: string };

export async function submitLeadAction(
  payload: unknown
): Promise<SubmitLeadResult> {
  // Honeypot check before Zod (bots may send malformed data too)
  const raw =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};

  const honeypot = String(raw.website ?? "");
  if (honeypot.length > 0) {
    // Silent success — don't inform bots they were detected
    return { ok: true };
  }

  // Rate limit check
  if (await isRateLimited()) {
    return {
      ok: false,
      error: "Zbyt wiele prób. Poczekaj chwilę i spróbuj ponownie.",
    };
  }

  // Zod validation
  const parsed = LeadPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const userFields = ["name", "email", "phone", "message"] as const;
    for (const field of userFields) {
      const msg = fieldErrors[field]?.[0];
      if (msg) return { ok: false, error: msg };
    }
    return {
      ok: false,
      error: "Niepoprawne dane formularza. Sprawdź pola i spróbuj ponownie.",
    };
  }

  const data = parsed.data;

  // Save lead to DB (primary — must succeed)
  const db = getPrisma();
  let lead;
  try {
    lead = await db.lead.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        company: data.company?.trim() || null,
        projectType: data.projectType?.trim() || null,
        location: data.location?.trim() || null,
        message: data.message.trim(),
        source: "contact-form",
        pageUrl: data.pageUrl?.trim() || null,
        utmSource: data.utmSource?.trim() || null,
        utmMedium: data.utmMedium?.trim() || null,
        utmCampaign: data.utmCampaign?.trim() || null,
        utmContent: data.utmContent?.trim() || null,
        utmTerm: data.utmTerm?.trim() || null,
      },
    });
  } catch (err) {
    console.error("[leads] Failed to save lead:", err);
    return {
      ok: false,
      error: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
    };
  }

  // Email notification (secondary — non-blocking, never rolls back the lead)
  try {
    await sendLeadNotification(lead);
  } catch (err) {
    console.error("[leads] Email notification failed (lead saved):", err);
  }

  return { ok: true };
}

// ── Admin action: update lead status ─────────────────────────────────────────

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus
): Promise<void> {
  await requireAuth();

  const db = getPrisma();
  await db.lead.update({ where: { id }, data: { status } });

  revalidatePath("/admin/leady");
  revalidatePath(`/admin/leady/${id}`);
  revalidatePath("/admin");
}
