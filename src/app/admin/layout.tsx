import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F7F3EE",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <AdminNav />
      <main style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1.25rem",
        boxSizing: "border-box",
        width: "100%",
      }}>
        {children}
      </main>
    </div>
  );
}
