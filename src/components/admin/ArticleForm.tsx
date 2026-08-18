"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import { generateSlug } from "@/lib/slug";
import { parseArticle } from "@/lib/article-parser";
import type { Article } from "@/generated/prisma/client";

type FaqItem = { question: string; answer: string };
type FormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

interface ArticleFormProps {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  article?: Article | null;
  submitLabel?: string;
}

const INPUT = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "0.9375rem",
  fontFamily: "inherit",
  backgroundColor: "#fff",
  color: "#111",
  boxSizing: "border-box" as const,
};

const LABEL = {
  display: "block",
  fontWeight: 600,
  fontSize: "0.8125rem",
  color: "#374151",
  marginBottom: "0.375rem",
};

const FIELD = { marginBottom: "1.25rem" };

const SECTION_TITLE = {
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#9ca3af",
  marginBottom: "1rem",
  marginTop: "1.5rem",
  paddingBottom: "0.375rem",
  borderBottom: "1px solid #e5e7eb",
};

const ERR = { color: "#dc2626", fontSize: "0.8125rem", marginTop: "0.25rem" };

export function ArticleForm({ action, article, submitLabel = "Zapisz" }: ArticleFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  // Tab state
  const [tab, setTab] = useState<"form" | "paste">("form");
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState("");

  // Form fields
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [category, setCategory] = useState(article?.category ?? "");
  const [author, setAuthor] = useState(article?.author ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    (article?.status as "DRAFT" | "PUBLISHED") ?? "DRAFT"
  );
  const [publishedAt, setPublishedAt] = useState(
    article?.publishedAt ? article.publishedAt.toISOString().slice(0, 10) : ""
  );
  const [featured, setFeatured] = useState(article?.featured ?? false);
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(article?.seoDescription ?? "");
  const [canonical, setCanonical] = useState(article?.canonical ?? "");
  const [ogImage, setOgImage] = useState(article?.ogImage ?? "");
  const [relatedService, setRelatedService] = useState(article?.relatedService ?? "");
  const [faq, setFaq] = useState<FaqItem[]>(
    (article?.faq as FaqItem[] | null) ?? []
  );

  const slugManualRef = useRef(!!article?.slug);

  const handleTitleChange = useCallback(
    async (newTitle: string) => {
      setTitle(newTitle);
      if (!slugManualRef.current) {
        setSlug(generateSlug(newTitle));
      }
    },
    []
  );

  const handleSlugChange = useCallback((v: string) => {
    slugManualRef.current = true;
    setSlug(v);
  }, []);

  const processPaste = useCallback(() => {
    if (!pasteText.trim()) {
      setPasteError("Wklej tekst artykułu.");
      return;
    }
    try {
      const parsed = parseArticle(pasteText);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.slug) { setSlug(parsed.slug); slugManualRef.current = true; }
      else if (parsed.title) setSlug(generateSlug(parsed.title));
      if (parsed.excerpt) setExcerpt(parsed.excerpt);
      if (parsed.content) setContent(parsed.content);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.relatedService) setRelatedService(parsed.relatedService);
      if (parsed.seoTitle) setSeoTitle(parsed.seoTitle);
      if (parsed.seoDescription) setSeoDescription(parsed.seoDescription);
      if (parsed.faq.length) setFaq(parsed.faq);
      setPasteError("");
      setTab("form");
    } catch {
      setPasteError("Nie udało się przetworzyć tekstu. Sprawdź format.");
    }
  }, [pasteText]);

  const addFaq = () => setFaq((f) => [...f, { question: "", answer: "" }]);
  const removeFaq = (i: number) => setFaq((f) => f.filter((_, j) => j !== i));
  const updateFaq = (i: number, field: "question" | "answer", val: string) =>
    setFaq((f) => f.map((item, j) => (j === i ? { ...item, [field]: val } : item)));

  const fErr = state?.fieldErrors ?? {};

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {(["form", "paste"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: tab === t ? "#1d4ed8" : "#d1d5db",
              backgroundColor: tab === t ? "#1d4ed8" : "#fff",
              color: tab === t ? "#fff" : "#374151",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t === "form" ? "Formularz" : "Wklej cały artykuł"}
          </button>
        ))}
      </div>

      {/* Quick Paste Tab */}
      {tab === "paste" && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.75rem" }}>
            Wklej artykuł w formacie szablonowym. Po kliknięciu &bdquo;Przetwórz&rdquo; dane trafią do formularza — możesz je sprawdzić i dopiero wtedy zapisać lub opublikować.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={20}
            placeholder={"# Tytuł artykułu\n\nSEO Title: ...\nSEO Description: ...\nSlug: ...\nExcerpt: ...\nCategory: ...\nRelated Service: ...\n\n## Nagłówek sekcji\n\nTreść...\n\n## FAQ\n\n### Pytanie: ...\n\nOdpowiedź: ..."}
            style={{ ...INPUT, fontFamily: "monospace", fontSize: "0.8125rem" }}
          />
          {pasteError && <p style={ERR}>{pasteError}</p>}
          <button
            type="button"
            onClick={processPaste}
            style={{
              marginTop: "0.75rem",
              padding: "0.625rem 1.5rem",
              backgroundColor: "#1d4ed8",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Przetwórz artykuł →
          </button>
        </div>
      )}

      {/* Form Tab */}
      {tab === "form" && (
        <form action={formAction}>
          {/* hidden serialized fields */}
          <input type="hidden" name="content" value={content} />
          <input type="hidden" name="faq" value={JSON.stringify(faq)} />
          <input type="hidden" name="featured" value={String(featured)} />

          {state?.error && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#dc2626", fontSize: "0.875rem" }}>
              {state.error}
            </div>
          )}

          <p style={SECTION_TITLE}>Podstawowe</p>

          <div style={FIELD}>
            <label style={LABEL}>Tytuł *</label>
            <input name="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} style={INPUT} required />
            {fErr.title && <p style={ERR}>{fErr.title[0]}</p>}
          </div>

          <div style={FIELD}>
            <label style={LABEL}>Slug *</label>
            <input name="slug" value={slug} onChange={(e) => handleSlugChange(e.target.value)} style={INPUT} required pattern="[a-z0-9-]+" />
            {fErr.slug && <p style={ERR}>{fErr.slug[0]}</p>}
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>
              URL: /poradniki/{slug || "…"}
            </p>
          </div>

          <div style={FIELD}>
            <label style={LABEL}>Lead / excerpt</label>
            <textarea name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} style={INPUT} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={FIELD}>
              <label style={LABEL}>Kategoria</label>
              <input name="category" value={category} onChange={(e) => setCategory(e.target.value)} style={INPUT} list="category-list" />
              <datalist id="category-list">
                {["Produkcja", "Nieruchomości", "Craft", "Hotele", "Architektura"].map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div style={FIELD}>
              <label style={LABEL}>Autor</label>
              <input name="author" value={author} onChange={(e) => setAuthor(e.target.value)} style={INPUT} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={FIELD}>
              <label style={LABEL}>Status</label>
              <select name="status" value={status} onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")} style={INPUT}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Opublikowany</option>
              </select>
            </div>
            <div style={FIELD}>
              <label style={LABEL}>Data publikacji</label>
              <input type="date" name="publishedAt" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} style={INPUT} />
            </div>
          </div>

          <div style={{ ...FIELD, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ width: "1rem", height: "1rem" }} />
            <label htmlFor="featured" style={{ ...LABEL, marginBottom: 0 }}>Wyróżniony artykuł</label>
          </div>

          <p style={SECTION_TITLE}>Treść</p>

          <div style={FIELD}>
            <label style={LABEL}>Treść artykułu (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              style={{ ...INPUT, fontFamily: "monospace", fontSize: "0.8125rem" }}
              placeholder={"## Nagłówek H2\n\nAkapit tekstu...\n\n### Podnagłówek H3\n\n- Element listy\n- Element listy\n\n> Cytat"}
            />
          </div>

          <p style={SECTION_TITLE}>SEO</p>

          <div style={FIELD}>
            <label style={LABEL}>SEO title</label>
            <input name="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} style={INPUT} />
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>{seoTitle.length}/70 znaków</p>
          </div>

          <div style={FIELD}>
            <label style={LABEL}>Meta description</label>
            <textarea name="seoDescription" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} style={INPUT} />
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>{seoDescription.length}/160 znaków</p>
          </div>

          <div style={FIELD}>
            <label style={LABEL}>Canonical URL</label>
            <input name="canonical" value={canonical} onChange={(e) => setCanonical(e.target.value)} style={INPUT} placeholder="https://www.setandspace.pl/poradniki/..." />
          </div>

          <div style={FIELD}>
            <label style={LABEL}>OG Image URL</label>
            <input name="ogImage" value={ogImage} onChange={(e) => setOgImage(e.target.value)} style={INPUT} />
          </div>

          <p style={SECTION_TITLE}>Powiązania</p>

          <div style={FIELD}>
            <label style={LABEL}>Powiązana usługa (slug)</label>
            <input name="relatedService" value={relatedService} onChange={(e) => setRelatedService(e.target.value)} style={INPUT} list="service-list" />
            <datalist id="service-list">
              {[
                "filmy-dla-nieruchomosci",
                "filmy-dla-architektow-i-projektantow-wnetrz",
                "filmy-dla-salonow-meblowych-i-showroomow",
                "filmy-dla-butikowych-hoteli",
              ].map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>

          <p style={SECTION_TITLE}>FAQ</p>

          {faq.map((item, i) => (
            <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem", position: "relative" }}>
              <button
                type="button"
                onClick={() => removeFaq(i)}
                style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "1rem" }}
              >
                ✕
              </button>
              <div style={FIELD}>
                <label style={LABEL}>Pytanie {i + 1}</label>
                <input value={item.question} onChange={(e) => updateFaq(i, "question", e.target.value)} style={INPUT} />
              </div>
              <div style={{ marginBottom: 0 }}>
                <label style={LABEL}>Odpowiedź</label>
                <textarea value={item.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={3} style={INPUT} />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFaq}
            style={{ padding: "0.5rem 1rem", border: "1px dashed #d1d5db", borderRadius: "6px", background: "none", color: "#6b7280", cursor: "pointer", fontSize: "0.875rem", marginBottom: "2rem" }}
          >
            + Dodaj pytanie
          </button>

          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
            <button
              type="submit"
              disabled={pending}
              style={{ padding: "0.75rem 2rem", backgroundColor: "#1d4ed8", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.9375rem", fontWeight: 600, cursor: pending ? "wait" : "pointer", opacity: pending ? 0.7 : 1 }}
            >
              {pending ? "Zapisuję…" : submitLabel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
