import Link from "next/link";
import { mainNav } from "@/data/navigation";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        textAlign: "center",
      }}
    >
      <p
        className="text-label"
        style={{
          color: "var(--clay)",
          marginBottom: "1.25rem",
          fontSize: "0.75rem",
        }}
      >
        404
      </p>

      <h1
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(2.5rem, 8vw, 5rem)",
          fontWeight: 400,
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          marginBottom: "1.25rem",
        }}
      >
        Strona nie istnieje.
      </h1>

      <p className="text-body" style={{ maxWidth: "400px", marginBottom: "2.5rem" }}>
        Szukana strona nie została znaleziona. Wróć do strony głównej lub
        skorzystaj z nawigacji poniżej.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            backgroundColor: "var(--text-primary)",
            color: "var(--surface)",
            padding: "0.75rem 1.75rem",
            borderRadius: "99px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.8125rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase" as const,
            textDecoration: "none",
          }}
        >
          Strona główna
        </Link>
        {mainNav.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-label"
            style={{
              color: "var(--text-muted)",
              padding: "0.75rem 1.25rem",
              border: "1px solid var(--border)",
              borderRadius: "99px",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
