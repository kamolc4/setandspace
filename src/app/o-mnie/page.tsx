import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/data/business";
import { services } from "@/data/services";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "O mnie — Set & Space",
  description:
    "Nagrywam filmy, które pokazują, jak naprawdę wygląda i czuje się dane miejsce. Architektura, wnętrza, nieruchomości i przestrzenie komercyjne w obrazie.",
  alternates: { canonical: `${business.url}/o-mnie` },
  openGraph: {
    title: "O mnie — Set & Space",
    description:
      "Nagrywam filmy, które pokazują, jak naprawdę wygląda i czuje się dane miejsce. Architektura, wnętrza, nieruchomości i przestrzenie komercyjne w obrazie.",
    url: `${business.url}/o-mnie`,
  },
};

export default function OMniePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ label: "O mnie", href: "/o-mnie" }]} />

      <div
        style={{
          paddingTop: "5.5rem",
          paddingBottom: "4rem",
        }}
      >
        {/* Hero */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem 3.5rem",
          }}
        >
          <Breadcrumb items={[{ label: "O mnie" }]} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              alignItems: "start",
            }}
            className="about-hero"
          >
            <div>
              <p
                className="text-label"
                style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
              >
                O Set & Space
              </p>
              <h1
                className="text-headline"
                style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}
              >
                Tworzę filmy,<br />
                <em>które pozwalają poczuć miejsce.</em>
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "2rem",
                  maxWidth: "520px",
                }}
              >
                Nagrywam filmy, które pokazują, jak naprawdę wygląda i czuje się dane miejsce.
                Nie chodzi tylko o metraż czy układ pomieszczeń, ale też o atmosferę,
                której nie da się oddać w standardowej ofercie sprzedażowej.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius-panel)",
                padding: "2.5rem",
                alignSelf: "start",
              }}
            >
              {/* PLACEHOLDER — replace with real bio */}
              <p className="text-label" style={{ color: "var(--clay)", marginBottom: "1rem" }}>
                Set & Space
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  lineHeight: 1.35,
                  fontStyle: "italic",
                }}
              >
                &ldquo;Łączę wyczucie kadru z wyczuciem przestrzeni.&rdquo;
              </p>
              <p
                className="text-label"
                style={{ color: "var(--text-muted)", marginTop: "1rem" }}
              >
                — Set & Space
              </p>
            </div>
          </div>
        </div>

        {/* Bio prose */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem 5rem",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <p className="text-body" style={{ marginBottom: "1.25rem" }}>
              Skupiam się na architekturze i wnętrzach. Pracuję z mieszkaniami, domami,
              nieruchomościami na sprzedaż oraz przestrzeniami komercyjnymi, takimi jak
              salony meblowe, showroomy czy butikowe hotele.
            </p>
            <p className="text-body" style={{ marginBottom: "1.25rem" }}>
              Zanim włączę kamerę, najpierw poznaję przestrzeń. Sprawdzam, skąd wpada
              światło, co naturalnie przyciąga wzrok i które elementy warto pokazać w ruchu.
            </p>
            <p className="text-body">
              Pracuję z szacunkiem do miejsca. Nie rozkładam niepotrzebnie dużej ilości
              sprzętu i nie podporządkowuję całego wnętrza kamerze. Przestrzeń ma pozostać
              sobą. Moją rolą jest pokazać ją w najlepszy możliwy sposób.
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <div
          style={{
            backgroundColor: "var(--text-primary)",
            padding: "5rem 1.5rem",
          }}
        >
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
            }}
          >
            <p className="text-label" style={{ color: "var(--clay)", marginBottom: "2rem" }}>
              Moja filozofia
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    fontWeight: 400,
                    color: "var(--surface)",
                    marginBottom: "1rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Przestrzeń jako historia.
                </h2>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "rgba(241,233,224,0.65)",
                    lineHeight: 1.7,
                    maxWidth: "600px",
                  }}
                >
                  Hotel, mieszkanie, budynek: każde miejsce ma coś do powiedzenia.
                  Zależy mi na tym, żeby film pokazał nie tylko jak to miejsce wygląda,
                  ale jak się w nim czuje.
                </p>
              </div>

              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    fontWeight: 400,
                    color: "var(--surface)",
                    marginBottom: "1rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Światło jako materiał.
                </h2>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "rgba(241,233,224,0.65)",
                    lineHeight: 1.7,
                    maxWidth: "600px",
                  }}
                >
                  Planuję realizacje wokół pory dnia, warunków atmosferycznych i ekspozycji okien.
                  Kamera rejestruje to, co widzimy, ale to światło decyduje, co czujemy.
                </p>
              </div>

              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    fontWeight: 400,
                    color: "var(--surface)",
                    marginBottom: "1rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Ruch jako narracja.
                </h2>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "rgba(241,233,224,0.65)",
                    lineHeight: 1.7,
                    maxWidth: "600px",
                  }}
                >
                  Ruch kamery nie jest efektem specjalnym, lecz językiem narracji.
                  Tempo, rytm, kierunek: każda decyzja służy historii, którą opowiadam.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What I do */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "5rem 1.5rem",
          }}
        >
          <p
            className="text-label"
            style={{ color: "var(--text-muted)", marginBottom: "2rem" }}
          >
            Z czym pracuję
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: "0.625rem",
            }}
          >
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/uslugi/${service.slug}`}
                style={{
                  display: "block",
                  backgroundColor: "var(--surface)",
                  borderRadius: "var(--radius-card)",
                  padding: "1.5rem",
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {service.shortTitle}
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {service.headline}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-panel)",
              padding: "3rem",
              textAlign: "center",
              borderTop: "4px solid var(--clay)",
            }}
          >
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
              Porozmawiajmy o Twoim projekcie.
            </h2>
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
              Kontakt →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .about-hero {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
