import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { LeadyGoogleTabs } from "@/components/admin/LeadyGoogleTabs";
import {
  GmailConfigPanel,
  type GmailIntegrationPublic,
} from "@/components/admin/GmailConfigPanel";

export const dynamic = "force-dynamic";

export default async function GooglePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const raw = await getPrisma().gmailIntegration.findFirst();

  const integration: GmailIntegrationPublic | null = raw
    ? {
        id: raw.id,
        email: raw.email,
        notifyEmail: raw.notifyEmail,
        enabled: raw.enabled,
        status: raw.status,
        lastTestAt: raw.lastTestAt?.toISOString() ?? null,
        lastSuccessAt: raw.lastSuccessAt?.toISOString() ?? null,
      }
    : null;

  return (
    <div>
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
          Zarządzaj leadami i połączeniem z Gmail
        </p>
      </div>

      <LeadyGoogleTabs />

      <div style={{ marginBottom: "0.75rem" }}>
        <p
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "#1F1916",
            marginBottom: "0.25rem",
          }}
        >
          Gmail / Google
        </p>
        <p style={{ fontSize: "0.875rem", color: "#8C7B6E" }}>
          Powiadomienia e-mail o nowych leadach
        </p>
      </div>

      <GmailConfigPanel key={integration?.id ?? "none"} integration={integration} />
    </div>
  );
}
