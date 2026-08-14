import Link from "next/link";
import type { Service } from "@/data/services";
import type { Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import Breadcrumb from "./Breadcrumb";
import { BreadcrumbJsonLd, ServiceJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";

interface ServicePageProps {
  service: Service;
  relatedProjects: Project[];
}

export default function ServicePage({ service, relatedProjects }: ServicePageProps) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { label: "Usługi", href: "/uslugi" },
          { label: service.shortTitle },
        ]}
      />
      <ServiceJsonLd service={service} />
      {service.faq.length > 0 && <FaqJsonLd faq={service.faq} />}

      <div
        style={{
          paddingTop: "5.5rem",
          paddingBottom: "5rem",
        }}
      >
        {/* Hero */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem 3rem",
          }}
        >
          <Breadcrumb
            items={[
              { label: "Usługi", href: "/uslugi" },
              { label: service.shortTitle },
            ]}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
              marginBottom: "4rem",
            }}
            className="service-hero-grid"
          >
            <div>
              <p
                className="text-label"
                style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
              >
                {service.shortTitle}
              </p>
              <h1
                className="text-headline"
                style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}
              >
                {service.headline}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.1rem, 2vw, 1.375rem)",
                  fontStyle: "italic",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: "560px",
                }}
              >
                {service.intro}
              </p>
            </div>

            <div>
              <p className="text-body">{service.body}</p>
            </div>
          </div>
        </div>

        {/* Use cases & deliverables */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            padding: "4rem 1.5rem",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2.5rem",
            }}
            className="service-two-col"
          >
            {/* Use cases */}
            <div>
              <p
                className="text-label"
                style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}
              >
                Kiedy się sprawdza
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {service.useCases.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      padding: "0.75rem 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "0.9375rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "var(--clay)", flexShrink: 0 }}>◈</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div>
              <p
                className="text-label"
                style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}
              >
                Co dostarczam
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      padding: "0.75rem 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "0.9375rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "var(--clay)", flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Process */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 1.5rem" }}>
          <p
            className="text-label"
            style={{ color: "var(--text-muted)", marginBottom: "2rem" }}
          >
            Jak pracuję
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
              gap: "0.625rem",
            }}
          >
            {service.process.map((step, i) => (
              <div
                key={step.step}
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "var(--radius-card)",
                  padding: "1.5rem",
                }}
              >
                <span
                  className="text-label"
                  style={{ color: "var(--clay)", display: "block", marginBottom: "0.75rem" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.step}
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation */}
        <div
          style={{
            backgroundColor: "var(--text-primary)",
            padding: "4rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <p
              className="text-label"
              style={{ color: "var(--clay)", marginBottom: "1.5rem" }}
            >
              Jak się przygotować
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                gap: "1rem",
              }}
            >
              {service.preparation.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    fontSize: "0.9rem",
                    color: "rgba(241,233,224,0.75)",
                    lineHeight: 1.55,
                  }}
                >
                  <span style={{ color: "var(--clay)", flexShrink: 0 }}>◇</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        {service.faq.length > 0 && (
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.5rem" }}>
            <p
              className="text-label"
              style={{ color: "var(--text-muted)", marginBottom: "2rem" }}
            >
              Najczęstsze pytania
            </p>
            <dl>
              {service.faq.map((item) => (
                <div
                  key={item.question}
                  style={{
                    borderTop: "1px solid var(--border)",
                    padding: "1.5rem 0",
                  }}
                >
                  <dt
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {item.question}
                  </dt>
                  <dd
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "3rem" }}>
              <p
                className="text-label"
                style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}
              >
                Realizacje z tej kategorii
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                  gap: "0.75rem",
                }}
              >
                {relatedProjects.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-panel)",
              padding: "3rem",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 400,
                color: "var(--text-primary)",
                marginBottom: "1rem",
                letterSpacing: "-0.015em",
              }}
            >
              Zacznijmy od rozmowy.
            </h2>
            <p
              className="text-body"
              style={{ maxWidth: "440px", margin: "0 auto 2rem" }}
            >
              Opowiedz mi o swoim projekcie. Odpiszę w ciągu jednego dnia roboczego.
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
        @media (min-width: 900px) {
          .service-hero-grid {
            grid-template-columns: 1fr 1fr !important;
            align-items: start;
          }
          .service-two-col {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
