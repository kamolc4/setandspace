import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import { business } from "@/data/business";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Usługi — filmy dla hoteli, nieruchomości i architektury",
  description:
    "Set & Space tworzy kinematograficzne filmy dla hoteli, nieruchomości, architektury i wnętrz oraz wybranych marek. Sprawdź zakres usług.",
  alternates: { canonical: `${business.url}/uslugi` },
};

export default function UslugiPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ label: "Usługi", href: "/uslugi" }]} />

      <div
        style={{
          paddingTop: "5.5rem",
          paddingBottom: "5rem",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "5.5rem 1.5rem 5rem",
        }}
      >
        <Breadcrumb items={[{ label: "Usługi" }]} />

        <header style={{ marginBottom: "4rem", maxWidth: "700px" }}>
          <p
            className="text-label"
            style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}
          >
            Co robimy
          </p>
          <h1
            className="text-headline"
            style={{ color: "var(--text-primary)", marginBottom: "1.25rem" }}
          >
            Filmy, które sprzedają doświadczenie. Nie tylko miejsce.
          </h1>
          <p className="text-body" style={{ maxWidth: "520px" }}>
            Specjalizujemy się w kinematograficznym opowiadaniu przestrzeni. Każda usługa
            jest dopasowana do specyfiki branży — hoteli, nieruchomości, architektury i marek.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "0.625rem",
          }}
        >
          {services.map((service, i) => (
            <Link
              key={service.slug}
              href={`/uslugi/${service.slug}`}
              style={{
                display: "block",
                borderRadius: "var(--radius-panel)",
                backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--bg)",
                border: "1px solid var(--border)",
                padding: "clamp(1.5rem, 3vw, 2.5rem)",
                textDecoration: "none",
                color: "inherit",
              }}
              className="service-link"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      className="text-label"
                      style={{
                        color: "var(--clay)",
                        backgroundColor: "var(--surface-alt)",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "99px",
                      }}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                      fontWeight: 400,
                      color: "var(--text-primary)",
                      marginBottom: "0.75rem",
                      letterSpacing: "-0.015em",
                      lineHeight: 1.2,
                    }}
                  >
                    {service.title}
                  </h2>

                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                      maxWidth: "640px",
                    }}
                  >
                    {service.intro}
                  </p>

                  <div
                    style={{
                      marginTop: "1.5rem",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    {service.useCases.slice(0, 3).map((useCase) => (
                      <span
                        key={useCase}
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          border: "1px solid var(--border)",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "99px",
                        }}
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ flexShrink: 0, paddingTop: "0.25rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.5rem",
                      color: "var(--clay)",
                    }}
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: "4rem",
            textAlign: "center",
            padding: "3rem 1.5rem",
            backgroundColor: "var(--surface)",
            borderRadius: "var(--radius-panel)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "var(--text-primary)",
              marginBottom: "1.25rem",
            }}
          >
            Nie jesteś pewny, która usługa pasuje do Twojego projektu?
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
            Porozmawiajmy →
          </Link>
        </div>
      </div>
    </>
  );
}
