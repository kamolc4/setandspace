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

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  border: "#C4B5A5",
  borderLight: "#D8C8B8",
  text: "#1F1916",
  textSec: "#6B5040",
  textMut: "#8C7B6E",
  surface: "#F7F3EE",
  link: "#765C49",
  btnPrimary: "#1F1916",
  errorBg: "#fef2f2",
  errorColor: "#dc2626",
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: `1px solid ${C.border}`,
  borderRadius: "6px",
  fontSize: "0.9375rem",
  fontFamily: "inherit",
  backgroundColor: "#fff",
  color: C.text,
  boxSizing: "border-box",
  outline: "none",
};

const LABEL: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  fontSize: "0.8125rem",
  color: C.textSec,
  marginBottom: "0.375rem",
};

const FIELD: React.CSSProperties = { marginBottom: "1.25rem" };

const HINT: React.CSSProperties = {
  fontSize: "0.75rem",
  color: C.textMut,
  marginTop: "0.3rem",
  lineHeight: 1.5,
};

const ERR: React.CSSProperties = {
  color: C.errorColor,
  fontSize: "0.8125rem",
  marginTop: "0.25rem",
};

function SectionHeader({ label }: { label: string }) {
  return (
    <p style={{
      fontSize: "0.6875rem",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: C.textMut,
      marginBottom: "1rem",
      marginTop: "2rem",
      paddingBottom: "0.375rem",
      borderBottom: `1px solid ${C.borderLight}`,
    }}>
      {label}
    </p>
  );
}

function CharCounter({ current, max, warn }: { current: number; max: number; warn?: number }) {
  const isWarn = warn ? current > warn : false;
  const isOver = current > max;
  return (
    <span style={{
      fontSize: "0.75rem",
      color: isOver ? C.errorColor : isWarn ? "#c2410c" : C.textMut,
      fontWeight: isOver || isWarn ? 600 : 400,
    }}>
      {current}/{max}
    </span>
  );
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// ── Quick Paste template ──────────────────────────────────────────────────────
const PASTE_TEMPLATE = `# [Tytuł poradnika]

Tytuł SEO: [tytuł przeznaczony do wyników wyszukiwania – max 60 znaków]
Opis meta: [konkretny opis strony – max 155 znaków]
Slug: [adres-url-poradnika]
Krótki opis: [1–2 zdania opisujące poradnik, używane na liście i jako intro]
Kategoria: [np. Filmy dla nieruchomości]
Autor: [Imię Nazwisko]
Powiązana usługa: [slug usługi, np. filmy-dla-nieruchomosci – lub zostaw puste]
Canonical: [opcjonalnie – pełny URL]
Obraz Open Graph: [opcjonalnie – URL obrazu]

## Szybka odpowiedź

[W 40–80 słowach odpowiedz bezpośrednio na główne pytanie użytkownika. Najważniejsza odpowiedź pojawia się od razu, bez wstępu.]

## Wprowadzenie

[Krótko wyjaśnij problem lub sytuację użytkownika. Co go sprowadza na tę stronę? Czego dowie się z poradnika?]

## [Główna sekcja – odpowiedź na intencję wyszukiwania]

[Konkretna treść. Odpowiedz wprost na pytanie, które zadaje użytkownik.]

## [Druga ważna sekcja]

[Treść.]

### [Podsekcja, jeśli potrzebna]

[Treść podsekcji.]

## [Praktyczna sekcja – jak to zrobić / na co zwrócić uwagę]

[Treść.]

## Podsumowanie

[Krótko podsumuj najważniejsze informacje z poradnika.]

## FAQ

### Pytanie: [Naturalne pytanie użytkownika?]

Odpowiedź: [Krótka, samodzielna i konkretna odpowiedź.]

### Pytanie: [Drugie pytanie?]

Odpowiedź: [Odpowiedź.]

### Pytanie: [Trzecie pytanie?]

Odpowiedź: [Odpowiedź.]`;

const CATEGORIES = ["Filmy dla nieruchomości", "Filmy dla hoteli", "Produkcja", "Nieruchomości", "Craft", "Hotele", "Architektura"];
const SERVICES = [
  "filmy-dla-nieruchomosci",
  "filmy-dla-architektow-i-projektantow-wnetrz",
  "filmy-dla-salonow-meblowych-i-showroomow",
  "filmy-dla-butikowych-hoteli",
];

// ── Component ─────────────────────────────────────────────────────────────────
export function ArticleForm({ action, article, submitLabel = "Zapisz" }: ArticleFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  const [tab, setTab] = useState<"form" | "paste">("form");
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [showTemplate, setShowTemplate] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [quickAnswer, setQuickAnswer] = useState(article?.quickAnswer ?? "");
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
  const [faq, setFaq] = useState<FaqItem[]>((article?.faq as FaqItem[] | null) ?? []);

  const slugManualRef = useRef(!!article?.slug);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (!slugManualRef.current) setSlug(generateSlug(newTitle));
  }, []);

  const handleSlugChange = useCallback((v: string) => {
    slugManualRef.current = true;
    setSlug(v);
  }, []);

  const processPaste = useCallback(() => {
    if (!pasteText.trim()) { setPasteError("Wklej tekst artykułu."); return; }
    try {
      const p = parseArticle(pasteText);
      if (p.title) setTitle(p.title);
      if (p.slug) { setSlug(p.slug); slugManualRef.current = true; }
      else if (p.title) setSlug(generateSlug(p.title));
      if (p.excerpt) setExcerpt(p.excerpt);
      if (p.quickAnswer) setQuickAnswer(p.quickAnswer);
      if (p.content) setContent(p.content);
      if (p.category) setCategory(p.category);
      if (p.author) setAuthor(p.author);
      if (p.relatedService) setRelatedService(p.relatedService);
      if (p.canonical) setCanonical(p.canonical);
      if (p.ogImage) setOgImage(p.ogImage);
      if (p.seoTitle) setSeoTitle(p.seoTitle);
      if (p.seoDescription) setSeoDescription(p.seoDescription);
      if (p.faq.length) setFaq(p.faq);
      setPasteError("");
      setTab("form");
    } catch {
      setPasteError("Nie udało się przetworzyć tekstu. Sprawdź format.");
    }
  }, [pasteText]);

  const copyTemplate = useCallback(() => {
    navigator.clipboard.writeText(PASTE_TEMPLATE).then(() => {
      setCopyMsg("Skopiowano!");
      setTimeout(() => setCopyMsg(""), 2000);
    });
  }, []);

  const addFaq = () => setFaq((f) => [...f, { question: "", answer: "" }]);
  const removeFaq = (i: number) => setFaq((f) => f.filter((_, j) => j !== i));
  const updateFaq = (i: number, field: "question" | "answer", val: string) =>
    setFaq((f) => f.map((item, j) => (j === i ? { ...item, [field]: val } : item)));

  const fErr = state?.fieldErrors ?? {};

  // SEO preview data
  const previewTitle = seoTitle || title || "Tytuł poradnika";
  const previewSlug = slug || "adres-url";
  const previewDesc = seoDescription || excerpt || "Opis artykułu pojawi się tutaj.";

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        .af-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .af-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .af-faq-item { border: 1px solid ${C.border}; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; position: relative; background: #fff; }
        .af-serp { background: #fff; border: 1px solid ${C.border}; border-radius: 8px; padding: 1rem 1.25rem; margin-top: 0.75rem; }
        .af-template-box { background: ${C.surface}; border: 1px solid ${C.borderLight}; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
        @media (max-width: 599px) {
          .af-grid-2 { grid-template-columns: 1fr !important; }
          .af-tabs button { flex: 1; min-width: 0; }
        }
      `}</style>

      {/* ── TABS ─────────────────────────────────────────────────────────── */}
      <div className="af-tabs">
        {(["form", "paste"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "6px",
              border: `1px solid ${tab === t ? C.text : C.border}`,
              backgroundColor: tab === t ? C.text : "#fff",
              color: tab === t ? "#F1E9E0" : C.textSec,
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t === "form" ? "Formularz" : "Wklej cały artykuł"}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          QUICK PASTE TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {tab === "paste" && (
        <div>
          {/* Template section */}
          <div className="af-template-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: showTemplate ? "1rem" : 0 }}>
              <p style={{ fontWeight: 700, fontSize: "0.875rem", color: C.text, margin: 0 }}>
                Szablon artykułu
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setShowTemplate((v) => !v)}
                  style={{ padding: "0.3rem 0.875rem", border: `1px solid ${C.border}`, borderRadius: "5px", background: "#fff", color: C.textSec, fontSize: "0.8125rem", cursor: "pointer" }}
                >
                  {showTemplate ? "Ukryj szablon" : "Pokaż szablon"}
                </button>
                <button
                  type="button"
                  onClick={copyTemplate}
                  style={{ padding: "0.3rem 0.875rem", border: `1px solid ${C.border}`, borderRadius: "5px", background: copyMsg ? "#f0fdf4" : "#fff", color: copyMsg ? "#166534" : C.text, fontSize: "0.8125rem", cursor: "pointer", fontWeight: 600 }}
                >
                  {copyMsg || "Kopiuj szablon"}
                </button>
              </div>
            </div>
            {showTemplate && (
              <pre style={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: C.textSec,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.6,
                margin: 0,
                overflowX: "auto",
              }}>
                {PASTE_TEMPLATE}
              </pre>
            )}
          </div>

          <p style={{ fontSize: "0.875rem", color: C.textMut, marginBottom: "0.75rem" }}>
            Wklej artykuł wypełniony według szablonu. Po kliknięciu <strong>&bdquo;Przetwórz artykuł&rdquo;</strong> dane trafią do formularza &mdash; możesz je przejrzeć i dopiero wtedy zapisać lub opublikować.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={22}
            placeholder={`# Tytuł poradnika\n\nTytuł SEO: ...\nOpis meta: ...\nSlug: ...\nKrótki opis: ...\nKategoria: ...\nAutor: ...\n\n## Szybka odpowiedź\n\n...\n\n## Wprowadzenie\n\n...\n\n## FAQ\n\n### Pytanie: ...\n\nOdpowiedź: ...`}
            style={{ ...INPUT, fontFamily: "monospace", fontSize: "0.8125rem", minHeight: "340px", lineHeight: 1.55 }}
          />
          {pasteError && <p style={ERR}>{pasteError}</p>}
          <button
            type="button"
            onClick={processPaste}
            style={{
              marginTop: "0.75rem",
              padding: "0.625rem 1.5rem",
              backgroundColor: C.btnPrimary,
              color: "#F1E9E0",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            Przetwórz artykuł →
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          FORM TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {tab === "form" && (
        <form action={formAction}>
          {/* Hidden serialized fields */}
          <input type="hidden" name="content" value={content} />
          <input type="hidden" name="quickAnswer" value={quickAnswer} />
          <input type="hidden" name="faq" value={JSON.stringify(faq)} />
          <input type="hidden" name="featured" value={String(featured)} />

          {state?.error && (
            <div style={{ backgroundColor: C.errorBg, border: `1px solid #fecaca`, borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1rem", color: C.errorColor, fontSize: "0.875rem" }}>
              {state.error}
            </div>
          )}

          {/* ── A. PODSTAWOWE INFORMACJE ─────────────────────────────────── */}
          <SectionHeader label="A — Podstawowe informacje" />

          <div style={FIELD}>
            <label style={LABEL}>Tytuł poradnika *</label>
            <input
              name="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={INPUT}
              required
              placeholder="np. Jak przygotować nieruchomość do nagrania?"
            />
            {fErr.title && <p style={ERR}>{fErr.title[0]}</p>}
          </div>

          <div style={FIELD}>
            <label style={LABEL}>Adres URL / slug *</label>
            <input
              name="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              style={INPUT}
              required
              pattern="[a-z0-9-]+"
              placeholder="jak-przygotowac-nieruchomosc"
            />
            {fErr.slug && <p style={ERR}>{fErr.slug[0]}</p>}
            <p style={HINT}>
              URL: <code style={{ background: C.surface, padding: "0.1rem 0.3rem", borderRadius: "3px", fontSize: "0.8rem" }}>/poradniki/{slug || "…"}</code>
            </p>
          </div>

          <div className="af-grid-2">
            <div style={FIELD}>
              <label style={LABEL}>Kategoria</label>
              <input
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={INPUT}
                list="af-category-list"
                placeholder="np. Filmy dla nieruchomości"
              />
              <datalist id="af-category-list">
                {CATEGORIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div style={FIELD}>
              <label style={LABEL}>Autor</label>
              <input
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={INPUT}
                placeholder="Imię Nazwisko"
              />
            </div>
          </div>

          <div className="af-grid-2">
            <div style={FIELD}>
              <label style={LABEL}>Data publikacji</label>
              <input
                type="date"
                name="publishedAt"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                style={INPUT}
              />
            </div>
            <div style={FIELD}>
              <label style={LABEL}>Powiązana usługa</label>
              <input
                name="relatedService"
                value={relatedService}
                onChange={(e) => setRelatedService(e.target.value)}
                style={INPUT}
                list="af-service-list"
                placeholder="slug usługi lub puste"
              />
              <datalist id="af-service-list">
                {SERVICES.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
          </div>

          <div style={{ ...FIELD, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              id="af-featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              style={{ width: "1.125rem", height: "1.125rem", accentColor: C.text, flexShrink: 0 }}
            />
            <label htmlFor="af-featured" style={{ ...LABEL, marginBottom: 0, cursor: "pointer" }}>
              Wyróżniony poradnik
            </label>
          </div>

          {/* ── B. WYNIK W GOOGLE ─────────────────────────────────────────── */}
          <SectionHeader label="B — Wynik w Google" />

          <div style={FIELD}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem", flexWrap: "wrap", gap: "0.25rem" }}>
              <label style={LABEL}>Tytuł SEO</label>
              <CharCounter current={seoTitle.length} max={70} warn={60} />
            </div>
            <input
              name="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              style={INPUT}
              placeholder={title || "Tytuł w wynikach wyszukiwania"}
            />
            <p style={HINT}>Najważniejszy temat umieść możliwie wcześnie. Google może przepisać tytuł.</p>
          </div>

          <div style={FIELD}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem", flexWrap: "wrap", gap: "0.25rem" }}>
              <label style={LABEL}>Opis meta</label>
              <CharCounter current={seoDescription.length} max={160} warn={155} />
            </div>
            <textarea
              name="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={3}
              style={INPUT}
              placeholder="Napisz konkretnie, czego użytkownik dowie się na stronie."
            />
            <p style={HINT}>Napisz konkretnie, czego użytkownik dowie się na stronie. Google może wyświetlić inny fragment.</p>
          </div>

          {/* SERP Preview */}
          <div className="af-serp">
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.textMut, marginBottom: "0.75rem" }}>
              Podgląd wyniku wyszukiwania
            </p>
            <div style={{ fontFamily: "Arial, sans-serif" }}>
              <p style={{ fontSize: "1.125rem", color: "#1a0dab", fontWeight: 400, margin: "0 0 0.125rem", lineHeight: 1.3, wordBreak: "break-word" }}>
                {previewTitle.length > 70 ? previewTitle.slice(0, 70) + "…" : previewTitle}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#0d652d", margin: "0 0 0.25rem", wordBreak: "break-all" }}>
                setandspace.pl › poradniki › {previewSlug}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#4d5156", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
                {previewDesc.length > 160 ? previewDesc.slice(0, 160) + "…" : previewDesc}
              </p>
            </div>
          </div>

          <div style={{ ...FIELD, marginTop: "1.25rem" }}>
            <label style={LABEL}>Canonical URL</label>
            <input
              name="canonical"
              value={canonical}
              onChange={(e) => setCanonical(e.target.value)}
              style={INPUT}
              placeholder="https://www.setandspace.pl/poradniki/…"
            />
            <p style={HINT}>Zostaw puste — URL zostanie ustawiony automatycznie.</p>
          </div>

          <div style={FIELD}>
            <label style={LABEL}>Obraz Open Graph</label>
            <input
              name="ogImage"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              style={INPUT}
              placeholder="/images/poradniki/nazwa-obrazu.jpg"
            />
            <p style={HINT}>Obraz wyświetlany przy udostępnianiu artykułu w mediach społecznościowych.</p>
          </div>

          {/* ── C. WPROWADZENIE ───────────────────────────────────────────── */}
          <SectionHeader label="C — Wprowadzenie" />

          <div style={FIELD}>
            <label style={LABEL}>Krótki opis / zajawka</label>
            <textarea
              name="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              style={INPUT}
              placeholder="1–2 zdania opisujące poradnik. Używane na liście poradników i jako intro."
            />
            <p style={HINT}>1–2 zdania używane na liście poradników i jako wprowadzenie.</p>
          </div>

          <div style={FIELD}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem", flexWrap: "wrap", gap: "0.25rem" }}>
              <label style={LABEL}>Szybka odpowiedź</label>
              <span style={{ fontSize: "0.75rem", color: quickAnswer && wordCount(quickAnswer) < 40 ? "#c2410c" : C.textMut }}>
                {wordCount(quickAnswer)} słów
              </span>
            </div>
            <textarea
              value={quickAnswer}
              onChange={(e) => setQuickAnswer(e.target.value)}
              rows={4}
              style={INPUT}
              placeholder="W 40-80 slowach odpowiedz bezposrednio na glowne pytanie uzytkownika. Bez wstepu (np. w dzisiejszym artykule...)."
            />
            <p style={HINT}>Odpowiedz bezpośrednio na główne pytanie. Bez wstępu. Pojawi się wysoko na stronie, zaraz po tytule.</p>
          </div>

          {/* ── D. TREŚĆ PORADNIKA ────────────────────────────────────────── */}
          <SectionHeader label="D — Treść poradnika" />

          <div style={{ ...FIELD, backgroundColor: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "0.875rem 1rem", fontSize: "0.8125rem", color: C.textMut, lineHeight: 1.65, marginBottom: "1rem" }}>
            <strong style={{ color: C.textSec }}>Wskazówki dotyczące formatowania:</strong>
            <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.25rem" }}>
              <li>H1 jest generowany automatycznie z tytułu — nie dodawaj drugiego <code style={{ background: "#fff", padding: "0.05rem 0.25rem", borderRadius: "3px" }}># Nagłówka</code></li>
              <li>Główne sekcje używają <code style={{ background: "#fff", padding: "0.05rem 0.25rem", borderRadius: "3px" }}>## H2</code></li>
              <li>Podsekcje używają <code style={{ background: "#fff", padding: "0.05rem 0.25rem", borderRadius: "3px" }}>### H3</code></li>
              <li>Używaj list i krótkich akapitów, kiedy poprawiają czytelność</li>
              <li>Odpowiadaj konkretnie na intencję użytkownika</li>
            </ul>
          </div>

          <div style={FIELD}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={24}
              style={{ ...INPUT, fontFamily: "monospace", fontSize: "0.8125rem", lineHeight: 1.6, minHeight: "380px" }}
              placeholder={"## Wprowadzenie\n\nKrótki wstęp do tematu...\n\n## Jak to działa\n\nTreść sekcji...\n\n## Na co zwrócić uwagę\n\nTreść sekcji...\n\n## Podsumowanie\n\nNajważniejsze wnioski..."}
            />
          </div>

          {/* ── E. FAQ ────────────────────────────────────────────────────── */}
          <SectionHeader label="E — FAQ" />

          <p style={{ fontSize: "0.8125rem", color: C.textMut, marginBottom: "1rem" }}>
            Dodawaj tylko pytania, które rzeczywiście pomagają użytkownikowi i są związane z tematem.
          </p>

          {faq.map((item, i) => (
            <div key={i} className="af-faq-item">
              <button
                type="button"
                onClick={() => removeFaq(i)}
                style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "none", border: "none", color: C.textMut, cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}
                title="Usuń pytanie"
              >
                ✕
              </button>
              <div style={{ ...FIELD, paddingRight: "2rem" }}>
                <label style={LABEL}>Pytanie {i + 1}</label>
                <input
                  value={item.question}
                  onChange={(e) => updateFaq(i, "question", e.target.value)}
                  style={INPUT}
                  placeholder="Naturalne pytanie, które zadają użytkownicy?"
                />
              </div>
              <div style={{ marginBottom: 0 }}>
                <label style={LABEL}>Odpowiedź</label>
                <textarea
                  value={item.answer}
                  onChange={(e) => updateFaq(i, "answer", e.target.value)}
                  rows={3}
                  style={INPUT}
                  placeholder="Krótka, samodzielna i konkretna odpowiedź."
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFaq}
            style={{
              padding: "0.5rem 1rem",
              border: `1px dashed ${C.border}`,
              borderRadius: "6px",
              background: "none",
              color: C.textMut,
              cursor: "pointer",
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
              width: "100%",
            }}
          >
            + Dodaj pytanie
          </button>

          {/* ── F. PUBLIKACJA ─────────────────────────────────────────────── */}
          <SectionHeader label="F — Publikacja" />

          <div className="af-grid-2" style={{ marginBottom: "1.5rem" }}>
            <div style={FIELD}>
              <label style={LABEL}>Status</label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                style={INPUT}
              >
                <option value="DRAFT">Draft (roboczy)</option>
                <option value="PUBLISHED">Opublikowany</option>
              </select>
              <p style={HINT}>
                {status === "DRAFT"
                  ? "Artykuł nie jest widoczny publicznie."
                  : "Artykuł jest widoczny na stronie i indeksowany."}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.borderLight}`, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={pending}
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: C.btnPrimary,
                color: "#F1E9E0",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: pending ? "wait" : "pointer",
                opacity: pending ? 0.7 : 1,
                minWidth: "140px",
              }}
            >
              {pending ? "Zapisuję…" : submitLabel}
            </button>
            {status === "DRAFT" && (
              <p style={{ fontSize: "0.8125rem", color: C.textMut, alignSelf: "center", margin: 0 }}>
                Artykuł zostanie zapisany jako draft.
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
