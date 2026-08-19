import Link from "next/link";
import { RealizacjeForm } from "@/components/admin/RealizacjeForm";
import { createPortfolioProjectAction } from "@/app/admin/_actions/portfolio";

export const metadata = { title: "Nowa realizacja — Admin" };

export default function NowaRealizacjaPage() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <Link
          href="/admin/realizacje"
          style={{ color: "#765C49", textDecoration: "none", fontSize: "0.875rem", whiteSpace: "nowrap" }}
        >
          ← Realizacje
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1F1916" }}>
          Nowa realizacja
        </h1>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #C4B5A5", borderRadius: "10px", padding: "1.75rem" }}>
        <RealizacjeForm action={createPortfolioProjectAction} submitLabel="Utwórz realizację" />
      </div>
    </div>
  );
}
