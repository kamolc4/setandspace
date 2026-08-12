import Link from "next/link";

export default function FinalCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      style={{
        padding: "6rem 1.5rem 7rem",
        textAlign: "center",
        backgroundColor: "var(--bg)",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <p
          className="text-label"
          style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}
        >
          Zacznijmy rozmawiać
        </p>

        <h2
          id="cta-heading"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            marginBottom: "1.75rem",
          }}
        >
          Masz przestrzeń,<br />
          <em>którą warto pokazać?</em>
        </h2>

        <p
          className="text-body"
          style={{
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
          }}
        >
          Opowiedz nam o swoim projekcie. Odezwiemy się w ciągu jednego dnia roboczego.
        </p>

        <Link
          href="/kontakt"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.625rem",
            backgroundColor: "var(--text-primary)",
            color: "var(--surface)",
            padding: "1rem 2.25rem",
            borderRadius: "99px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase" as const,
            textDecoration: "none",
            transition: "background-color 0.25s ease",
          }}
        >
          Napisz do nas
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
