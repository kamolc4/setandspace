import Link from "next/link";
import { footerLinks } from "@/data/navigation";
import { business } from "@/data/business";
import { services } from "@/data/services";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer
        role="contentinfo"
        style={{
          backgroundColor: "var(--text-primary)",
          color: "var(--surface)",
          padding: "4rem 1.5rem 2rem",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Top row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "3rem",
              paddingBottom: "3rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Brand */}
            <div>
              <p
                className="text-label footer-wordmark"
                style={{ letterSpacing: "0.15em", marginBottom: "1rem" }}
              >
                SET & SPACE
              </p>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.6, maxWidth: "220px" }} className="footer-muted">
                Filmy dla nieruchomości, architektury i wnętrz.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-label footer-section-label" style={{ marginBottom: "1rem" }}>
                Menu
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {footerLinks.navigation.map((link) => (
                  <li key={link.href} style={{ marginBottom: "0.5rem" }}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <p className="text-label footer-section-label" style={{ marginBottom: "1rem" }}>
                Usługi
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {services.map((s) => (
                  <li key={s.slug} style={{ marginBottom: "0.5rem" }}>
                    <Link href={`/uslugi/${s.slug}`} className="footer-link">
                      {s.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-label footer-section-label" style={{ marginBottom: "1rem" }}>
                Kontakt
              </p>
              <div>
                <a href={`mailto:${business.email}`} className="footer-link" style={{ display: "block", marginBottom: "0.5rem" }}>
                  {business.email}
                </a>
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="footer-link" style={{ display: "block", marginBottom: "0.5rem" }}>
                    {business.phone}
                  </a>
                )}
                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                  {business.social.instagram && (
                    <a
                      href={business.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram Set & Space"
                      className="text-label footer-social"
                    >
                      IG
                    </a>
                  )}
                  {business.social.vimeo && (
                    <a
                      href={business.social.vimeo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Vimeo Set & Space"
                      className="text-label footer-social"
                    >
                      VM
                    </a>
                  )}
                  {business.social.youtube && (
                    <a
                      href={business.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube Set & Space"
                      className="text-label footer-social"
                    >
                      YT
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              paddingTop: "1.75rem",
            }}
          >
            <p className="footer-copyright">
              © {currentYear} Set & Space. Wszelkie prawa zastrzeżone.
            </p>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {footerLinks.legal.map((link) => (
                <Link key={link.href} href={link.href} className="footer-copyright">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .footer-wordmark { color: var(--surface); }
        .footer-muted { color: var(--clay); }
        .footer-section-label { color: var(--clay); }
        .footer-link {
          font-size: 0.875rem;
          color: rgba(241,233,224,0.65);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: var(--surface); }
        .footer-social { color: var(--clay); }
        .footer-copyright { font-size: 0.75rem; color: rgba(241,233,224,0.5); }
      `}</style>
    </>
  );
}
