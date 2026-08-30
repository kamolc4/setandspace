import nodemailer from "nodemailer";
import { getPrisma } from "@/lib/prisma";
import { decryptPassword } from "@/lib/encryption";

export interface LeadData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  projectType?: string | null;
  location?: string | null;
  message: string;
  pageUrl?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  createdAt: Date;
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value?: string | null): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 16px;color:#8C7B6E;font-size:12px;width:130px;vertical-align:top;white-space:nowrap">${esc(label)}</td>
    <td style="padding:6px 16px;color:#1F1916;font-size:14px;vertical-align:top;word-break:break-word">${esc(value)}</td>
  </tr>`;
}

function buildHtml(lead: LeadData, adminUrl: string): string {
  const date = lead.createdAt.toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Nowy lead — Set &amp; Space</title>
</head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#fff;border-radius:12px;border:1px solid #E8DED2;overflow:hidden">
        <tr>
          <td style="background:#1F1916;padding:24px 28px">
            <p style="margin:0;color:#C4B5A5;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:700">Set &amp; Space</p>
            <h1 style="margin:6px 0 0;color:#F7F3EE;font-size:20px;font-weight:600">Nowy lead z formularza</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 0 4px">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Imię", lead.name)}
              ${row("E-mail", lead.email)}
              ${row("Telefon", lead.phone)}
              ${row("Firma", lead.company)}
              ${row("Projekt", lead.projectType)}
              ${row("Lokalizacja", lead.location)}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 28px 20px">
            <p style="margin:0 0 8px;color:#8C7B6E;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Wiadomość</p>
            <p style="margin:0;color:#1F1916;font-size:14px;line-height:1.7;white-space:pre-wrap">${esc(lead.message)}</p>
          </td>
        </tr>
        ${
          lead.pageUrl || lead.utmSource || lead.utmMedium || lead.utmCampaign
            ? `<tr>
          <td style="padding:0 0 4px;border-top:1px solid #F1E9E0">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Data", date)}
              ${row("Strona", lead.pageUrl)}
              ${row("UTM source", lead.utmSource)}
              ${row("UTM medium", lead.utmMedium)}
              ${row("UTM campaign", lead.utmCampaign)}
            </table>
          </td>
        </tr>`
            : `<tr><td style="padding:0 28px 4px;border-top:1px solid #F1E9E0">${row("Data", date)}</td></tr>`
        }
        <tr>
          <td style="padding:20px 28px 28px">
            <a href="${adminUrl}" style="display:inline-block;background:#1F1916;color:#F7F3EE;text-decoration:none;padding:12px 24px;border-radius:99px;font-size:13px;font-weight:700;letter-spacing:0.04em">
              Zobacz lead w panelu &rarr;
            </a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildText(lead: LeadData, adminUrl: string): string {
  const date = lead.createdAt.toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw",
  });
  const lines = [
    "Nowy lead z formularza Set & Space",
    "",
    `Imię: ${lead.name}`,
    `E-mail: ${lead.email}`,
  ];
  if (lead.phone) lines.push(`Telefon: ${lead.phone}`);
  if (lead.company) lines.push(`Firma: ${lead.company}`);
  if (lead.projectType) lines.push(`Projekt: ${lead.projectType}`);
  if (lead.location) lines.push(`Lokalizacja: ${lead.location}`);
  lines.push("", "Wiadomość:", lead.message, "");
  lines.push(`Data: ${date}`);
  if (lead.pageUrl) lines.push(`Strona: ${lead.pageUrl}`);
  if (lead.utmSource) lines.push(`UTM source: ${lead.utmSource}`);
  if (lead.utmMedium) lines.push(`UTM medium: ${lead.utmMedium}`);
  if (lead.utmCampaign) lines.push(`UTM campaign: ${lead.utmCampaign}`);
  lines.push("", "Otwórz w panelu admina:", adminUrl);
  return lines.join("\n");
}

/**
 * Sends a lead notification email via Gmail SMTP.
 * Reads credentials from DB (GmailIntegration). Silent no-op if not configured.
 * DB save in submitLeadAction MUST happen before calling this function.
 */
export async function sendLeadNotification(lead: LeadData): Promise<void> {
  const db = getPrisma();
  const integration = await db.gmailIntegration.findFirst();

  if (!integration || !integration.enabled || integration.status !== "CONNECTED")
    return;

  const password = decryptPassword(integration.encryptedPassword);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: integration.email, pass: password },
  });

  const adminUrl = `https://www.setandspace.pl/admin/leady/${lead.id}`;

  try {
    await transporter.sendMail({
      from: `Set & Space <${integration.email}>`,
      to: integration.notifyEmail,
      replyTo: lead.email,
      subject: `Nowy lead — Set & Space — ${lead.name}`,
      text: buildText(lead, adminUrl),
      html: buildHtml(lead, adminUrl),
    });
  } catch (err) {
    // Mark integration as ERROR — best effort, non-blocking
    void db.gmailIntegration
      .update({
        where: { id: integration.id },
        data: { status: "ERROR", lastErrorAt: new Date() },
      })
      .catch(() => {});
    throw err;
  }
}
