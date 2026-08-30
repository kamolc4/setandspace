import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

async function getNewLeadsCount(): Promise<number> {
  try {
    return await getPrisma().lead.count({ where: { status: "NEW" } });
  } catch {
    return 0;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newLeadsCount = await getNewLeadsCount();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F3EE",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <AdminNav newLeadsCount={newLeadsCount} />
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.25rem",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {children}
      </main>
    </div>
  );
}
