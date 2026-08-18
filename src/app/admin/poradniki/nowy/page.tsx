import Link from "next/link";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { createArticleAction } from "@/app/admin/_actions/articles";

export default function NowyPoradnikPage() {
  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/poradniki" style={{ fontSize: "0.875rem", color: "#6b7280", textDecoration: "none" }}>
          ← Poradniki
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginTop: "0.5rem" }}>
          Nowy poradnik
        </h1>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "2rem" }}>
        <ArticleForm action={createArticleAction} submitLabel="Zapisz draft" />
      </div>
    </div>
  );
}
