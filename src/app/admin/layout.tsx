import Link from "next/link";
import { logoutAction } from "@/app/admin/_actions/auth";

const NAV_LINK = {
  color: "#d1d5db",
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Top nav */}
      <nav style={{ backgroundColor: "#111827", padding: "0 1.5rem", height: "3.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/admin" style={{ color: "#fff", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none" }}>
            Set &amp; Space Admin
          </Link>
          <Link href="/admin" style={NAV_LINK}>Dashboard</Link>
          <Link href="/admin/poradniki" style={NAV_LINK}>Poradniki</Link>
          <Link href="/admin/poradniki/nowy" style={NAV_LINK}>+ Dodaj</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" target="_blank" style={{ ...NAV_LINK, fontSize: "0.8125rem" }}>
            ↗ Strona
          </Link>
          <form action={logoutAction}>
            <button type="submit" style={{ background: "none", border: "1px solid #374151", color: "#9ca3af", padding: "0.3rem 0.75rem", borderRadius: "5px", fontSize: "0.8125rem", cursor: "pointer" }}>
              Wyloguj
            </button>
          </form>
        </div>
      </nav>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {children}
      </main>
    </div>
  );
}
