"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import { generateSlug } from "@/lib/slug";
import { parseVideoUrl, getEmbedUrl } from "@/lib/video-parser";
import type { PortfolioProject } from "@/generated/prisma/client";

type FormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

interface RealizacjeFormProps {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  project?: PortfolioProject | null;
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
  btn: "#1F1916",
  errorBg: "#fef2f2",
  errorColor: "#dc2626",
};

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

const ERR: React.CSSProperties = { color: C.errorColor, fontSize: "0.8125rem", marginTop: "0.25rem" };

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
  const isOver = current > max;
  const isWarn = warn ? current > warn : false;
  return (
    <span style={{ fontSize: "0.75rem", color: isOver ? C.errorColor : isWarn ? "#c2410c" : C.textMut, fontWeight: isOver ? 600 : 400 }}>
      {current}/{max}
    </span>
  );
}

const CATEGORIES = [
  "Filmy dla nieruchomości",
  "Filmy dla architektów i projektantów wnętrz",
  "Filmy dla salonów meblowych i showroomów",
  "Filmy dla butikowych hoteli",
];

const AR_OPTIONS = [
  { value: "PORTRAIT",  label: "Pionowy 9:16 (Instagram Reels, TikTok)" },
  { value: "LANDSCAPE", label: "Poziomy 16:9 (YouTube, strona WWW)" },
  { value: "SQUARE",    label: "Kwadratowy 1:1 (Instagram Feed)" },
];

const AR_TO_PADDING: Record<string, string> = {
  PORTRAIT:  "177.78%",
  LANDSCAPE: "56.25%",
  SQUARE:    "100%",
};

export function RealizacjeForm({ action, project, submitLabel = "Zapisz" }: RealizacjeFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [shortDescription, setShortDescription] = useState(project?.shortDescription ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">((project?.status as "DRAFT" | "PUBLISHED") ?? "DRAFT");
  const [category, setCategory] = useState(project?.category ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [clientName, setClientName] = useState(project?.clientName ?? "");
  const [videoUrl, setVideoUrl] = useState(project?.videoUrl ?? "");
  const [videoAspectRatio, setVideoAspectRatio] = useState<"PORTRAIT" | "LANDSCAPE" | "SQUARE">(
    (project?.videoAspectRatio as "PORTRAIT" | "LANDSCAPE" | "SQUARE") ?? "PORTRAIT"
  );
  const [posterImage, setPosterImage] = useState(project?.posterImage ?? "");
  const [posterAlt, setPosterAlt] = useState(project?.posterAlt ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(project?.sortOrder ?? 0);
  const [publishedAt, setPublishedAt] = useState(
    project?.publishedAt ? project.publishedAt.toISOString().slice(0, 10) : ""
  );
  const [seoTitle, setSeoTitle] = useState(project?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(project?.seoDescription ?? "");
  const [canonical, setCanonical] = useState(project?.canonical ?? "");

  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const slugManualRef = useRef(!!project?.slug);

  const handleTitleChange = useCallback((v: string) => {
    setTitle(v);
    if (!slugManualRef.current) setSlug(generateSlug(v));
  }, []);

  const handleSlugChange = useCallback((v: string) => {
    slugManualRef.current = true;
    setSlug(v);
  }, []);

  const handleVideoUrlChange = useCallback((v: string) => {
    setVideoUrl(v);
    setShowVideoPreview(false);
  }, []);

  const parsedVideo = parseVideoUrl(videoUrl);
  const videoValid = !!parsedVideo;
  const videoInvalid = videoUrl.trim().length > 0 && !videoValid;

  const fErr = state?.fieldErrors ?? {};

  const previewSeoTitle = seoTitle || title || "Tytuł realizacji";
  const previewSlug = slug || "adres-url";
  const previewSeoDesc = seoDescription || shortDescription || "Opis realizacji.";

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        .rf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .rf-serp { background: #fff; border: 1px solid ${C.border}; border-radius: 8px; padding: 1rem 1.25rem; margin-top: 0.75rem; }
        @media (max-width: 599px) {
          .rf-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <form action={formAction}>
        {/* Hidden fields */}
        <input type="hidden" name="featured" value={String(featured)} />

        {state?.error && (
          <div style={{ backgroundColor: C.errorBg, border: "1px solid #fecaca", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1rem", color: C.errorColor, fontSize: "0.875rem" }}>
            {state.error}
          </div>
        )}

        {/* ── A. PODSTAWOWE INFORMACJE ───────────────────────────────────── */}
        <SectionHeader label="A — Podstawowe informacje" />

        <div style={FIELD}>
          <label style={LABEL}>Tytuł realizacji *</label>
          <input name="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} style={INPUT} required placeholder="np. Apartament na Mokotowie" />
          {fErr.title && <p style={ERR}>{fErr.title[0]}</p>}
        </div>

        <div style={FIELD}>
          <label style={LABEL}>Adres URL / slug *</label>
          <input name="slug" value={slug} onChange={(e) => handleSlugChange(e.target.value)} style={INPUT} required pattern="[a-z0-9-]+" placeholder="apartament-na-mokotowie" />
          {fErr.slug && <p style={ERR}>{fErr.slug[0]}</p>}
          <p style={HINT}>
            URL: <code style={{ background: C.surface, padding: "0.1rem 0.3rem", borderRadius: "3px", fontSize: "0.8rem" }}>/realizacje/{slug || "…"}</code>
          </p>
        </div>

        <div className="rf-grid-2">
          <div style={FIELD}>
            <label style={LABEL}>Kategoria *</label>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} style={INPUT}>
              <option value="">— wybierz —</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {fErr.category && <p style={ERR}>{fErr.category[0]}</p>}
          </div>
          <div style={FIELD}>
            <label style={LABEL}>Lokalizacja</label>
            <input name="location" value={location} onChange={(e) => setLocation(e.target.value)} style={INPUT} placeholder="np. Warszawa, Mokotów" />
          </div>
        </div>

        <div style={FIELD}>
          <label style={LABEL}>Klient / obiekt</label>
          <input name="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} style={INPUT} placeholder="np. Deweloper XYZ (opcjonalnie)" />
        </div>

        <div style={FIELD}>
          <label style={LABEL}>Krótki opis *</label>
          <textarea name="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={3} style={INPUT} placeholder="1–2 zdania opisujące realizację. Wyświetlane na listingu." required />
          <p style={HINT}>Wyświetlany na listingu i jako lead na stronie realizacji.</p>
          {fErr.shortDescription && <p style={ERR}>{fErr.shortDescription[0]}</p>}
        </div>

        <div style={FIELD}>
          <label style={LABEL}>Pełny opis</label>
          <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} style={INPUT} placeholder="Szczegółowy opis realizacji, kontekst projektu, wyzwania… (opcjonalnie)" />
        </div>

        {/* ── B. FILM ────────────────────────────────────────────────────── */}
        <SectionHeader label="B — Film" />

        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "0.875rem 1rem", marginBottom: "1rem", fontSize: "0.8125rem", color: C.textMut }}>
          Wklej link do filmu z <strong style={{ color: C.textSec }}>Vimeo</strong> lub <strong style={{ color: C.textSec }}>YouTube</strong>. Nie musisz wklejać kodu iframe — wystarczy normalny adres URL.
        </div>

        <div style={FIELD}>
          <label style={LABEL}>URL filmu</label>
          <input
            name="videoUrl"
            value={videoUrl}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            style={{
              ...INPUT,
              borderColor: videoInvalid ? C.errorColor : videoValid ? "#166534" : C.border,
            }}
            placeholder="https://vimeo.com/123456789  lub  https://www.youtube.com/watch?v=..."
            type="url"
          />
          {fErr.videoUrl && <p style={ERR}>{fErr.videoUrl[0]}</p>}
          {videoValid && parsedVideo && (
            <p style={{ fontSize: "0.8125rem", color: "#166534", marginTop: "0.3rem" }}>
              ✓ Wykryto: <strong>{parsedVideo.provider === "vimeo" ? "Vimeo" : "YouTube"}</strong> · ID: {parsedVideo.videoId}
            </p>
          )}
          {videoInvalid && (
            <p style={{ fontSize: "0.8125rem", color: C.errorColor, marginTop: "0.3rem" }}>
              Nieprawidłowy URL. Obsługiwane: vimeo.com, youtube.com, youtu.be
            </p>
          )}
        </div>

        {/* Video preview */}
        {videoValid && parsedVideo && (
          <div style={{ marginBottom: "1.25rem" }}>
            {!showVideoPreview ? (
              <button type="button" onClick={() => setShowVideoPreview(true)} style={{ padding: "0.4rem 1rem", border: `1px solid ${C.border}`, borderRadius: "6px", background: "#fff", color: C.textSec, fontSize: "0.8125rem", cursor: "pointer" }}>
                ▶ Pokaż podgląd filmu
              </button>
            ) : (
              <div>
                <p style={{ fontSize: "0.75rem", color: C.textMut, marginBottom: "0.5rem" }}>Podgląd · {AR_OPTIONS.find(a => a.value === videoAspectRatio)?.label}</p>
                <div style={{
                  position: "relative",
                  paddingBottom: AR_TO_PADDING[videoAspectRatio],
                  height: 0,
                  borderRadius: "8px",
                  overflow: "hidden",
                  maxWidth: videoAspectRatio === "PORTRAIT" ? "320px" : "100%",
                }}>
                  <iframe
                    src={getEmbedUrl(parsedVideo.provider, parsedVideo.videoId)}
                    title="Podgląd filmu"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
                <button type="button" onClick={() => setShowVideoPreview(false)} style={{ marginTop: "0.5rem", padding: "0.3rem 0.75rem", border: `1px solid ${C.border}`, borderRadius: "5px", background: "#fff", color: C.textMut, fontSize: "0.75rem", cursor: "pointer" }}>
                  Ukryj podgląd
                </button>
              </div>
            )}
          </div>
        )}

        <div style={FIELD}>
          <label style={LABEL}>Format filmu *</label>
          <select name="videoAspectRatio" value={videoAspectRatio} onChange={(e) => { setVideoAspectRatio(e.target.value as "PORTRAIT" | "LANDSCAPE" | "SQUARE"); setShowVideoPreview(false); }} style={INPUT}>
            {AR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <p style={HINT}>Pionowy dla Instagram Reels/Stories, poziomy dla YouTube i stron WWW.</p>
        </div>

        {/* ── C. OKŁADKA ─────────────────────────────────────────────────── */}
        <SectionHeader label="C — Okładka" />

        <div style={FIELD}>
          <label style={LABEL}>URL zdjęcia okładkowego</label>
          <input name="posterImage" value={posterImage} onChange={(e) => setPosterImage(e.target.value)} style={INPUT} placeholder="/images/realizacje/nazwa.jpg" />
          <p style={HINT}>
            {parsedVideo?.provider === "youtube"
              ? "YouTube: jeśli nie podasz zdjęcia, system użyje automatycznego miniatury z YouTube."
              : parsedVideo?.provider === "vimeo"
              ? "Vimeo: zalecamy podanie własnego zdjęcia okładkowego."
              : "URL obrazu (relatywny lub absolutny)."}
          </p>
        </div>

        <div style={FIELD}>
          <label style={LABEL}>Tekst alternatywny zdjęcia</label>
          <input name="posterAlt" value={posterAlt} onChange={(e) => setPosterAlt(e.target.value)} style={INPUT} placeholder="np. Apartament na Mokotowie — kadr z filmu" />
          <p style={HINT}>Opis obrazu dla czytników ekranu i SEO.</p>
        </div>

        {/* ── D. WYNIK W GOOGLE ─────────────────────────────────────────── */}
        <SectionHeader label="D — Wynik w Google" />

        <div style={FIELD}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem", flexWrap: "wrap", gap: "0.25rem" }}>
            <label style={LABEL}>Tytuł SEO</label>
            <CharCounter current={seoTitle.length} max={70} warn={60} />
          </div>
          <input name="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} style={INPUT} placeholder={title || "Tytuł w wynikach wyszukiwania"} />
          <p style={HINT}>Najważniejszy temat umieść możliwie wcześnie.</p>
        </div>

        <div style={FIELD}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem", flexWrap: "wrap", gap: "0.25rem" }}>
            <label style={LABEL}>Opis meta</label>
            <CharCounter current={seoDescription.length} max={160} warn={155} />
          </div>
          <textarea name="seoDescription" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} style={INPUT} placeholder="Napisz konkretnie, czego użytkownik dowie się na stronie." />
        </div>

        {/* SERP preview */}
        <div className="rf-serp">
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.textMut, marginBottom: "0.75rem" }}>
            Podgląd wyniku wyszukiwania
          </p>
          <div style={{ fontFamily: "Arial, sans-serif" }}>
            <p style={{ fontSize: "1.125rem", color: "#1a0dab", fontWeight: 400, margin: "0 0 0.125rem", lineHeight: 1.3, wordBreak: "break-word" }}>
              {previewSeoTitle.length > 70 ? previewSeoTitle.slice(0, 70) + "…" : previewSeoTitle}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#0d652d", margin: "0 0 0.25rem", wordBreak: "break-all" }}>
              setandspace.pl › realizacje › {previewSlug}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#4d5156", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
              {previewSeoDesc.length > 160 ? previewSeoDesc.slice(0, 160) + "…" : previewSeoDesc}
            </p>
          </div>
        </div>

        <div style={{ ...FIELD, marginTop: "1.25rem" }}>
          <label style={LABEL}>Canonical URL</label>
          <input name="canonical" value={canonical} onChange={(e) => setCanonical(e.target.value)} style={INPUT} placeholder="https://www.setandspace.pl/realizacje/…" />
          <p style={HINT}>Zostaw puste — URL zostanie ustawiony automatycznie.</p>
        </div>

        {/* ── E. PUBLIKACJA ─────────────────────────────────────────────── */}
        <SectionHeader label="E — Publikacja" />

        <div className="rf-grid-2">
          <div style={FIELD}>
            <label style={LABEL}>Status</label>
            <select name="status" value={status} onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")} style={INPUT}>
              <option value="DRAFT">Szkic (roboczy)</option>
              <option value="PUBLISHED">Opublikowana</option>
            </select>
            <p style={HINT}>{status === "DRAFT" ? "Realizacja nie jest widoczna publicznie." : "Realizacja jest widoczna na stronie."}</p>
          </div>
          <div style={FIELD}>
            <label style={LABEL}>Data publikacji</label>
            <input type="date" name="publishedAt" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} style={INPUT} />
          </div>
        </div>

        <div className="rf-grid-2">
          <div style={{ ...FIELD, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" id="rf-featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ width: "1.125rem", height: "1.125rem", accentColor: C.text, flexShrink: 0 }} />
            <label htmlFor="rf-featured" style={{ ...LABEL, marginBottom: 0, cursor: "pointer" }}>
              Wyróżniona realizacja
            </label>
          </div>
          <div style={FIELD}>
            <label style={LABEL}>Kolejność (mniejsza = wyżej)</label>
            <input type="number" name="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} style={INPUT} min="0" />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1.5rem", borderTop: `1px solid ${C.borderLight}`, flexWrap: "wrap" }}>
          <button type="submit" disabled={pending} style={{ padding: "0.75rem 2rem", backgroundColor: C.btn, color: "#F1E9E0", border: "none", borderRadius: "6px", fontSize: "0.9375rem", fontWeight: 600, cursor: pending ? "wait" : "pointer", opacity: pending ? 0.7 : 1, minWidth: "140px" }}>
            {pending ? "Zapisuję…" : submitLabel}
          </button>
          {status === "DRAFT" && (
            <p style={{ fontSize: "0.8125rem", color: C.textMut, alignSelf: "center", margin: 0 }}>
              Realizacja zostanie zapisana jako szkic.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
