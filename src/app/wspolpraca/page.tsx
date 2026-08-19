import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/data/business";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Współpraca — jak wygląda droga od pierwszego kontaktu do gotowego filmu",
  description:
    "Osiem etapów współpracy z Set & Space: od formularza zgłoszeniowego i rozmowy, przez dzień nagrania i montaż, aż do przekazania gotowego materiału.",
  alternates: { canonical: `${business.url}/wspolpraca` },
  openGraph: { url: `${business.url}/wspolpraca` },
};

const steps = [
  {
    number: "01",
    title: "Formularz zgłoszeniowy",
    body: "Na początku wysyłam krótki formularz do wypełnienia. Jego zadaniem jest zebranie podstawowych informacji o projekcie: rodzaj obiektu, lokalizacja, przybliżony termin i cel filmu. Formularz ma sprawić, że późniejsza rozmowa jest konkretna i nie zaczyna się od podstaw.",
    note: "Film może powstawać z myślą o social mediach, stronie internetowej, portfolio, sprzedaży lub prezentacji inwestorskiej.",
  },
  {
    number: "02",
    title: "Rozmowa telefoniczna lub online",
    body: "Na podstawie formularza odbywa się krótka rozmowa, około 30 minut. Ustalamy styl filmu, długość, formaty finalne, logistykę i budżet. To również moment, w którym możesz zadać wszystkie pytania, a ja lepiej poznaję Twoje oczekiwania.",
    note: null,
  },
  {
    number: "03",
    title: "Wycena i potwierdzenie terminu",
    body: "Po rozmowie przygotowuję indywidualną wycenę. Po jej akceptacji termin nagrania zostaje zarezerwowany.",
    note: null,
  },
  {
    number: "04",
    title: "Przygotowanie przestrzeni",
    body: "Przed nagraniem przesyłam wskazówki dotyczące przygotowania wnętrza. Obejmują między innymi na co zwrócić uwagę, czego unikać i kwestie dostępu do obiektu.",
    note: null,
  },
  {
    number: "05",
    title: "Dzień nagrania",
    body: "Nagrywam na miejscu, dopasowując się do naturalnego światła i rytmu przestrzeni. Pracuję spokojnie, bez zbędnego sprzętu i niepotrzebnego przestawiania wnętrza. Ma ono pozostać sobą.",
    note: null,
  },
  {
    number: "06",
    title: "Montaż i postprodukcja",
    body: "Materiał przechodzi przez montaż, korekcję kolorystyczną, pracę nad tempem i dobór muzyki. Przygotowuję wersję roboczą do akceptacji.",
    note: null,
  },
  {
    number: "07",
    title: "Poprawki i finalizacja",
    body: "Możesz zgłosić uwagi w ramach jednej rundy poprawek ujętej w cenie. Po poprawkach przygotowuję finalną wersję materiału.",
    note: null,
  },
  {
    number: "08",
    title: "Przekazanie materiałów",
    body: "Gotowy film jest przekazywany w formatach dopasowanych do zastosowania: Instagram, social media, strona internetowa, portfolio lub prezentacja inwestorska.",
    note: null,
  },
];

export default function WspolpracaPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ label: "Współpraca", href: "/wspolpraca" }]} />

      <div style={{ paddingTop: "5.5rem", paddingBottom: "5rem" }}>
        {/* Header */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem 4rem",
          }}
        >
          <Breadcrumb items={[{ label: "Współpraca" }]} />

          <div style={{ maxWidth: "700px" }}>
            <p
              className="text-label"
              style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
            >
              Jak to działa
            </p>
            <h1
              className="text-headline"
              style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}
            >
              Współpraca.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Jak wygląda droga od pierwszego kontaktu do gotowego filmu.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          {steps.map((step, i) => {
            const isDark = i === 4 || i === 5;
            return (
              <div
                key={step.number}
                style={{
                  borderTop: "1px solid var(--border)",
                  padding: "3rem 0",
                  ...(isDark ? {} : {}),
                }}
                className="wspolpraca-step"
              >
                <div className="wspolpraca-step-inner">
                  <div className="wspolpraca-number-col">
                    <span
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(3rem, 6vw, 5rem)",
                        fontWeight: 300,
                        color: "var(--clay)",
                        lineHeight: 1,
                        display: "block",
                      }}
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>
                  </div>

                  <div className="wspolpraca-content-col">
                    <h2
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                        marginBottom: "1.25rem",
                      }}
                    >
                      {step.title}
                    </h2>
                    <p
                      style={{
                        fontSize: "0.9375rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                        maxWidth: "560px",
                        marginBottom: step.note ? "1rem" : 0,
                      }}
                    >
                      {step.body}
                    </p>
                    {step.note && (
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.6,
                          maxWidth: "520px",
                          fontStyle: "italic",
                        }}
                      >
                        {step.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Last border */}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* Dark emphasis block */}
        <div
          style={{
            backgroundColor: "var(--text-primary)",
            padding: "5rem 1.5rem",
            marginTop: "5rem",
          }}
        >
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <p className="text-label" style={{ color: "var(--clay)", marginBottom: "1.5rem" }}>
              Od kontaktu do gotowego materiału
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "var(--surface)",
                lineHeight: 1.4,
                maxWidth: "700px",
              }}
            >
              Zależy mi na tym, żebyś przez cały czas wiedział, co się dzieje i co będzie dalej.
              Każdy etap zaczyna się wtedy, kiedy poprzedni jest domknięty.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "5rem 1.5rem 0",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-panel)",
              padding: "clamp(2rem, 5vw, 4rem)",
              textAlign: "center",
              borderTop: "4px solid var(--clay)",
            }}
          >
            <p
              className="text-label"
              style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}
            >
              Gotowy, żeby zacząć?
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 400,
                color: "var(--text-primary)",
                marginBottom: "1rem",
                letterSpacing: "-0.015em",
              }}
            >
              Opowiedz mi o swoim projekcie.
            </h2>
            <p
              className="text-body"
              style={{ maxWidth: "440px", margin: "0 auto 2rem" }}
            >
              Zacznijmy od krótkiej rozmowy. Odpiszę w ciągu jednego dnia roboczego.
            </p>
            <Link
              href="/kontakt"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "var(--text-primary)",
                color: "var(--surface)",
                padding: "0.875rem 2rem",
                borderRadius: "99px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
              }}
            >
              Napisz do mnie →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .wspolpraca-step-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        .wspolpraca-number-col {
          display: flex;
          align-items: flex-start;
        }

        @media (min-width: 768px) {
          .wspolpraca-step-inner {
            grid-template-columns: 120px 1fr;
            gap: 3rem;
            align-items: start;
          }
        }

        @media (min-width: 1100px) {
          .wspolpraca-step-inner {
            grid-template-columns: 160px 1fr;
          }
        }
      `}</style>
    </>
  );
}
