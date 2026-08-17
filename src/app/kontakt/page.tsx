import type { Metadata } from "next";
import { business } from "@/data/business";
import ContactForm from "@/components/ui/ContactForm";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Kontakt — napisz do Set & Space",
  description:
    "Masz projekt filmowy? Napisz do Set & Space. Odpiszę w ciągu jednego dnia roboczego.",
  alternates: { canonical: `${business.url}/kontakt` },
};

export default function KontaktPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ label: "Kontakt", href: "/kontakt" }]} />

      <div
        style={{
          paddingTop: "5.5rem",
          paddingBottom: "5rem",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "5.5rem 1.5rem 5rem",
        }}
      >
        <Breadcrumb items={[{ label: "Kontakt" }]} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "4rem",
            alignItems: "start",
          }}
          className="contact-layout"
        >
          {/* Left: intro */}
          <div>
            <p
              className="text-label"
              style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
            >
              Kontakt
            </p>
            <h1
              className="text-headline"
              style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}
            >
              Porozmawiajmy<br />
              <em>o Twoim projekcie.</em>
            </h1>
            <p className="text-body" style={{ marginBottom: "2.5rem", maxWidth: "420px" }}>
              Napisz kilka słów o miejscu, które chcesz pokazać: rodzaj wnętrza, przybliżony termin i to do czego ma służyć film?
            </p>

            {/* Contact details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                  E-mail
                </p>
                <a
                  href={`mailto:${business.email}`}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {business.email}
                </a>
              </div>

              {business.phone && (
                <div>
                  <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                    Telefon
                  </p>
                  <a
                    href={`tel:${business.phone}`}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {business.phone}
                  </a>
                </div>
              )}

              {/* Social */}
              <div style={{ marginTop: "0.5rem" }}>
                <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  Social
                </p>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {business.social.instagram ? (
                    <a
                      href={business.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-label"
                      style={{
                        color: "var(--text-primary)",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: "2px",
                      }}
                    >
                      Instagram
                    </a>
                  ) : (
                    <span className="text-label" style={{ color: "var(--stone)" }}>
                      Instagram (wkrótce)
                    </span>
                  )}
                  {business.social.vimeo ? (
                    <a
                      href={business.social.vimeo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-label"
                      style={{
                        color: "var(--text-primary)",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: "2px",
                      }}
                    >
                      Vimeo
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <div
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-panel)",
                padding: "clamp(1.5rem, 4vw, 2.5rem)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.375rem",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  marginBottom: "1.75rem",
                }}
              >
                Napisz do mnie
              </p>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ strip */}
        <div
          style={{
            marginTop: "5rem",
            paddingTop: "3rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <p className="text-label" style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            Pytania i odpowiedzi
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                q: "Jak szybko odpiszesz?",
                a: "Odpisuję w ciągu jednego dnia roboczego.",
              },
              {
                q: "Gdzie realizujesz projekty?",
                a: "Przede wszystkim w Polsce, ale jestem otwarta na realizacje zagraniczne. Napisz do mnie. Omówimy szczegóły.",
              },
              {
                q: "Od czego zależy cena?",
                a: "Od skali projektu, liczby dni nagrania, zakresu postprodukcji i oczekiwanych formatów. Wycena jest indywidualna.",
              },
            ].map((item) => (
              <div key={item.q}>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                    fontSize: "0.9375rem",
                  }}
                >
                  {item.q}
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
      `}</style>
    </>
  );
}
