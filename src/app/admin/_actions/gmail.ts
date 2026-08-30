"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import nodemailer from "nodemailer";
import { getPrisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { encryptPassword, decryptPassword } from "@/lib/encryption";

async function requireAuth() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
}

function revalidateGoogle() {
  revalidatePath("/admin/leady/google");
}

// ── Schemas ──────────────────────────────────────────────────────────────────

const ConnectSchema = z.object({
  email: z
    .string()
    .email("Podaj poprawny adres Gmail")
    .max(254),
  password: z
    .string()
    .min(1, "Hasło aplikacji jest wymagane")
    .max(100, "Hasło jest za długie"),
  notifyEmail: z
    .string()
    .email("Podaj poprawny adres e-mail odbiorcy")
    .max(254),
});

const UpdateSchema = z.object({
  email: z
    .string()
    .email("Podaj poprawny adres Gmail")
    .max(254),
  password: z.string().max(100).optional(),
  notifyEmail: z
    .string()
    .email("Podaj poprawny adres e-mail odbiorcy")
    .max(254),
  enabled: z.boolean().optional(),
});

// ── Result type ───────────────────────────────────────────────────────────────

export type GmailActionResult = { ok: true } | { ok: false; error: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

async function verifySmtp(email: string, password: string): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: email, pass: password },
  });
  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function connectGmailAction(
  payload: unknown
): Promise<GmailActionResult> {
  await requireAuth();

  const raw =
    typeof payload === "object" && payload !== null ? payload : {};
  const parsed = ConnectSchema.safeParse(raw);
  if (!parsed.success) {
    const firstMsg =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Nieprawidłowe dane";
    return { ok: false, error: firstMsg };
  }

  const { email, password, notifyEmail } = parsed.data;

  const ok = await verifySmtp(email, password);
  if (!ok) {
    return {
      ok: false,
      error:
        "Nie udało się połączyć z Gmail. Sprawdź adres Gmail i hasło aplikacji Google.",
    };
  }

  const db = getPrisma();
  const encrypted = encryptPassword(password);
  const now = new Date();
  const existing = await db.gmailIntegration.findFirst();

  if (existing) {
    await db.gmailIntegration.update({
      where: { id: existing.id },
      data: {
        email,
        encryptedPassword: encrypted,
        notifyEmail,
        status: "CONNECTED",
        enabled: true,
        lastSuccessAt: now,
      },
    });
  } else {
    await db.gmailIntegration.create({
      data: {
        email,
        encryptedPassword: encrypted,
        notifyEmail,
        status: "CONNECTED",
        enabled: true,
        lastSuccessAt: now,
      },
    });
  }

  revalidateGoogle();
  return { ok: true };
}

export async function updateGmailConfigAction(
  payload: unknown
): Promise<GmailActionResult> {
  await requireAuth();

  const raw =
    typeof payload === "object" && payload !== null ? payload : {};
  const parsed = UpdateSchema.safeParse(raw);
  if (!parsed.success) {
    const firstMsg =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Nieprawidłowe dane";
    return { ok: false, error: firstMsg };
  }

  const { email, password, notifyEmail, enabled } = parsed.data;

  const db = getPrisma();
  const existing = await db.gmailIntegration.findFirst();
  if (!existing)
    return { ok: false, error: "Brak konfiguracji Gmail. Połącz Gmail ponownie." };

  let encryptedPass = existing.encryptedPassword;
  let newStatus = existing.status;

  if (password && password.trim().length > 0) {
    const ok = await verifySmtp(email, password);
    if (!ok) {
      return {
        ok: false,
        error:
          "Nie udało się połączyć z Gmail. Sprawdź adres Gmail i hasło aplikacji Google.",
      };
    }
    encryptedPass = encryptPassword(password);
    newStatus = "CONNECTED";
  }

  await db.gmailIntegration.update({
    where: { id: existing.id },
    data: {
      email,
      encryptedPassword: encryptedPass,
      notifyEmail,
      status: newStatus,
      ...(enabled !== undefined && { enabled }),
    },
  });

  revalidateGoogle();
  return { ok: true };
}

export async function sendTestEmailAction(): Promise<GmailActionResult> {
  await requireAuth();

  const db = getPrisma();
  const integration = await db.gmailIntegration.findFirst();
  if (!integration)
    return { ok: false, error: "Brak konfiguracji Gmail." };
  if (integration.status !== "CONNECTED")
    return { ok: false, error: "Gmail nie jest połączony." };

  let password: string;
  try {
    password = decryptPassword(integration.encryptedPassword);
  } catch {
    return { ok: false, error: "Błąd odszyfrowania danych. Połącz Gmail ponownie." };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: integration.email, pass: password },
  });

  try {
    await transporter.sendMail({
      from: `Set & Space <${integration.email}>`,
      to: integration.notifyEmail,
      subject: "Test powiadomień — Set & Space",
      text: [
        "Połączenie Gmail z Set & Space działa poprawnie.",
        "",
        "Od teraz na ten adres będą przychodziły powiadomienia o nowych leadach.",
        "",
        "---",
        "Set & Space — setandspace.pl",
      ].join("\n"),
      html: `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#fff;border-radius:12px;border:1px solid #E8DED2;overflow:hidden">
        <tr><td style="background:#1F1916;padding:24px 28px">
          <p style="margin:0;color:#C4B5A5;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:700">Set &amp; Space</p>
          <h1 style="margin:6px 0 0;color:#F7F3EE;font-size:18px;font-weight:600">Test powiadomień</h1>
        </td></tr>
        <tr><td style="padding:28px">
          <p style="margin:0 0 12px;color:#1F1916;font-size:15px;line-height:1.6">Połączenie Gmail z Set &amp; Space działa poprawnie.</p>
          <p style="margin:0;color:#8C7B6E;font-size:14px;line-height:1.6">Od teraz na ten adres będą przychodziły powiadomienia o nowych leadach.</p>
        </td></tr>
        <tr><td style="padding:0 28px 28px">
          <a href="https://www.setandspace.pl/admin/leady" style="display:inline-block;background:#1F1916;color:#F7F3EE;text-decoration:none;padding:12px 24px;border-radius:99px;font-size:13px;font-weight:700;letter-spacing:0.04em">Przejdź do panelu &rarr;</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    });

    const now = new Date();
    await db.gmailIntegration.update({
      where: { id: integration.id },
      data: { lastTestAt: now, lastSuccessAt: now },
    });

    revalidateGoogle();
    return { ok: true };
  } catch {
    void db.gmailIntegration
      .update({
        where: { id: integration.id },
        data: { status: "ERROR", lastErrorAt: new Date() },
      })
      .catch(() => {});
    return {
      ok: false,
      error:
        "Nie udało się wysłać wiadomości testowej. Sprawdź połączenie Gmail.",
    };
  }
}

export async function toggleGmailNotificationsAction(
  enabled: boolean
): Promise<void> {
  await requireAuth();
  const db = getPrisma();
  const existing = await db.gmailIntegration.findFirst();
  if (!existing) return;
  await db.gmailIntegration.update({
    where: { id: existing.id },
    data: { enabled },
  });
  revalidateGoogle();
}

export async function disconnectGmailAction(): Promise<void> {
  await requireAuth();
  const db = getPrisma();
  const existing = await db.gmailIntegration.findFirst();
  if (existing) {
    await db.gmailIntegration.delete({ where: { id: existing.id } });
  }
  revalidateGoogle();
}
