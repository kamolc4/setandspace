import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { ContentRenderer } from "@/components/poradniki/ContentRenderer";
import { formatWarsawDateTime } from "@/lib/timezone";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  DRAFT: { label: "Szkic — nie jest publicznie dostępny", bg: "#FFF8E7", color: "#6B5040" },
  SCHEDULED: { label: "Zaplanowany — nie jest jeszcze publicznie dostępny", bg: "#1F1916", color: "#F7F3EE" },
  PUBLISHED: { label: "Opublikowany", bg: "#f0fdf4", color: "#166534" },
};

export default async function AdminPodgladPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  let article;
  try {
    const db = getPrisma();
    article = await db.article.findUnique({ where: { id } });
  } catch {
    notFound();
  }

  if (!article) notFound();

  const statusInfo = STATUS_LABELS[article.status] ?? STATUS_LABELS.DRAFT;
  type FaqItem = { question: string; answer: string };
  const faqItems = article.faq as FaqItem[] | null;

  return (
    <div>
      {/* Admin bar */}
      <div style={{ position: "sticky", top: "3.25rem", zIndex: 40, backgroundColor: statusInfo.bg, borderBottom: `2px solid ${statusInfo.color === "#F7F3EE" ? "#3a2e2a" : statusInfo.color}`, padding: "0.625rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", margin: "-2rem -1.25rem 2rem", boxSizing: "border-box" as const }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: statusInfo.color }}>
            Podgląd admina · {statusInfo.label}
          </span>
          {article.status === "SCHEDULED" && article.publishedAt && (
            <span style={{ fontSize: "0.8125rem", color: "rgba(247,243,238,0.75)" }}>
              Planowana publikacja: {formatWarsawDateTime(article.publishedAt)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link
            href={`/admin/poradniki/${article.id}`}
            style={{ padding: "0.3rem 0.875rem", border: `1px solid ${statusInfo.color === "#F7F3EE" ? "rgba(255,255,255,0.3)" : statusInfo.color}`, borderRadius: "5px", color: statusInfo.color, textDecoration: "none", fontSize: "0.8125rem", fontWeight: 600, backgroundColor: "transparent" }}
          >
            ← Edytuj artykuł
          </Link>
          {article.status === "PUBLISHED" && (
            <Link
              href={`/poradniki/${article.slug}`}
              target="_blank"
              style={{ padding: "0.3rem 0.875rem", backgroundColor: "#1F1916", color: "#F7F3EE", borderRadius: "5px", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 600 }}
            >
              Otwórz publiczny ↗
            </Link>
          )}
        </div>
      </div>

      {/* Article preview */}
      <div style={{ maxWidth: "740px", margin: "0 auto" }}>
        {article.category && (
          <p style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#A6856B", marginBottom: "0.75rem" }}>
            {article.category}
          </p>
        )}

        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#1F1916", marginBottom: "1.25rem" }}>
          {article.title}
        </h1>

        {article.excerpt && (
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1rem, 2vw, 1.25rem)", fontStyle: "italic", color: "#6B5040", lineHeight: 1.6, marginBottom: "2rem" }}>
            {article.excerpt}
          </p>
        )}

        {(article.author || article.publishedAt) && (
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.8125rem", color: "#8C7B6E", marginBottom: "2rem", flexWrap: "wrap" }}>
            {article.author && <span>{article.author}</span>}
            {article.publishedAt && (
              <span>
                {article.status === "SCHEDULED" ? "Planowana: " : ""}
                {formatWarsawDateTime(article.publishedAt)}
              </span>
            )}
          </div>
        )}

        {/* Quick answer */}
        {article.quickAnswer && (
          <div style={{ margin: "0 0 2rem", padding: "1.25rem 1.5rem", backgroundColor: "#F7F3EE", borderLeft: "3px solid #A6856B", borderRadius: "0 8px 8px 0" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#A6856B", marginBottom: "0.5rem" }}>
              Szybka odpowiedź
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#1F1916", margin: 0 }}>
              {article.quickAnswer}
            </p>
          </div>
        )}

        {/* Content */}
        <div style={{ fontSize: "1rem", lineHeight: 1.75, color: "#1F1916" }} className="prose">
          <ContentRenderer content={article.content} />
        </div>

        {/* FAQ */}
        {faqItems && faqItems.length > 0 && (
          <div style={{ marginTop: "3rem", borderTop: "1px solid #E8DED2", paddingTop: "2rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8C7B6E", marginBottom: "1.5rem" }}>
              Najczęstsze pytania
            </p>
            <dl>
              {faqItems.map((item, i) => (
                <div key={i} style={{ borderBottom: "1px solid #E8DED2", padding: "1.25rem 0" }}>
                  <dt style={{ fontWeight: 700, color: "#1F1916", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
                    {item.question}
                  </dt>
                  <dd style={{ color: "#6B5040", fontSize: "0.9375rem", lineHeight: 1.65, margin: 0 }}>
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* SEO info */}
        <div style={{ marginTop: "3rem", padding: "1rem 1.25rem", backgroundColor: "#F7F3EE", border: "1px solid #D8C8B8", borderRadius: "8px", fontSize: "0.8125rem", color: "#8C7B6E" }}>
          <p style={{ fontWeight: 700, color: "#6B5040", marginBottom: "0.5rem" }}>Dane SEO (tylko admin)</p>
          <p><strong>Tytuł SEO:</strong> {article.seoTitle || <em>brak</em>}</p>
          <p><strong>Opis meta:</strong> {article.seoDescription || <em>brak</em>}</p>
          <p><strong>Slug:</strong> /poradniki/{article.slug}</p>
        </div>
      </div>
    </div>
  );
}
