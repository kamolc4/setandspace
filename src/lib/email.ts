interface LeadData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  projectType?: string | null;
  location?: string | null;
  message: string;
  pageUrl?: string | null;
  createdAt: Date;
}

/**
 * Sends an email notification when a new lead is submitted.
 * Requires RESEND_API_KEY env var. Silently skips if not configured.
 * Required Vercel env vars:
 *   RESEND_API_KEY          — API key from resend.com (free tier: 3k emails/month)
 *   RESEND_FROM_EMAIL       — verified sender address (default: onboarding@resend.dev for testing)
 *   CONTACT_NOTIFY_EMAIL    — recipient address (default: paulinaolczykk@gmail.com)
 */
export async function sendLeadNotification(lead: LeadData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.CONTACT_NOTIFY_EMAIL ?? "paulinaolczykk@gmail.com";
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const adminUrl = `https://www.setandspace.pl/admin/leady/${lead.id}`;

  const lines: string[] = [
    "Nowe zapytanie kontaktowe — Set & Space",
    "",
    `Imię: ${lead.name}`,
    `E-mail: ${lead.email}`,
  ];
  if (lead.phone) lines.push(`Telefon: ${lead.phone}`);
  if (lead.company) lines.push(`Firma / obiekt: ${lead.company}`);
  if (lead.projectType) lines.push(`Rodzaj projektu: ${lead.projectType}`);
  if (lead.location) lines.push(`Lokalizacja: ${lead.location}`);
  lines.push("", "Wiadomość:", lead.message, "");
  if (lead.pageUrl) lines.push(`Strona wysłania: ${lead.pageUrl}`);
  lines.push(
    `Data: ${lead.createdAt.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })}`,
    "",
    "Otwórz w panelu admina:",
    adminUrl,
  );

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Nowe zapytanie: ${lead.name} — Set & Space`,
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}
