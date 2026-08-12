import Link from "next/link";
import type { Service } from "@/data/services";

const serviceIcons: Record<string, string> = {
  "filmy-dla-hoteli": "◈",
  "video-nieruchomosci": "◇",
  "filmy-architektury-i-wnetrz": "△",
  "filmy-reklamowe": "○",
};

interface ServicesPreviewProps {
  services: Service[];
}

export default function ServicesPreview({ services }: ServicesPreviewProps) {
  return (
    <section
      aria-labelledby="services-heading"
      style={{
        backgroundColor: "var(--surface)",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              className="text-label"
              style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}
            >
              Usługi
            </p>
            <h2
              id="services-heading"
              className="text-headline"
              style={{ color: "var(--text-primary)", margin: 0 }}
            >
              Co robimy.
            </h2>
          </div>
          <Link
            href="/uslugi"
            className="text-label"
            style={{
              color: "var(--text-primary)",
              borderBottom: "1px solid var(--text-primary)",
              paddingBottom: "2px",
            }}
          >
            Wszystkie usługi →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "0.625rem",
          }}
        >
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/uslugi/${service.slug}`}
              className="group"
              style={{
                display: "block",
                backgroundColor: "var(--bg)",
                borderRadius: "var(--radius-card)",
                padding: "1.75rem 1.5rem",
                textDecoration: "none",
                color: "inherit",
                transition: "background-color 0.25s ease",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.75rem",
                    color: "var(--clay)",
                    lineHeight: 1,
                  }}
                >
                  {serviceIcons[service.slug] ?? "◈"}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    color: "var(--stone)",
                    fontSize: "0.875rem",
                    transition: "transform 0.2s ease",
                  }}
                >
                  ↗
                </span>
              </div>

              <h3
                className="text-title"
                style={{
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  lineHeight: 1.2,
                }}
              >
                {service.shortTitle}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {service.intro.length > 120
                  ? service.intro.substring(0, 120) + "…"
                  : service.intro}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
