"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/data/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        role="banner"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          /*
           * Outer padding matches the hero section's horizontal gutter (1rem).
           * The inner max-width container matches hero's maxWidth: 1400px.
           * Together these guarantee logo left-edge === hero-bento left-edge
           * at every viewport width.
           *
           * The nav uses position:absolute on THIS element (the fixed header),
           * so left:50% = 50% of the fixed header = 50vw regardless of padding
           * or inner-container width — viewport-centering is preserved.
           */
          padding: "0 1rem",
          height: "3.75rem",
          transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
          backgroundColor: scrolled ? "rgba(232,222,210,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        {/* Desktop nav — absolutely centred at 50vw. Positioned on the outer
            fixed header so left:50% is always relative to the full viewport,
            not the constrained inner container. */}
        <nav
          aria-label="Główna nawigacja"
          className="header-desktop-nav"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ul
            style={{
              display: "flex",
              gap: "2rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {mainNav.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-label nav-link"
                    style={{
                      color: active ? "var(--text-primary)" : "var(--text-muted)",
                      borderBottom: active ? "1px solid var(--text-primary)" : "none",
                      paddingBottom: "2px",
                      transition: "color 0.2s ease",
                    }}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Inner container — maxWidth 1400px, same as hero bento grid.
            Aligns logo to the left edge and hamburger to the right edge
            of the page's main content column. */}
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="Set & Space, strona główna"
            className="text-label"
            style={{ color: "var(--text-primary)", letterSpacing: "0.15em", position: "relative", zIndex: 1 }}
            onClick={closeMenu}
          >
            SET & SPACE
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="header-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              color: "var(--text-primary)",
              flexDirection: "column",
              gap: "5px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                backgroundColor: "currentColor",
                transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
                transition: "transform 0.25s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                backgroundColor: "currentColor",
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 0.25s ease",
              }}
            />
            <span
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                backgroundColor: "currentColor",
                transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
                transition: "transform 0.25s ease",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu nawigacji"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          backgroundColor: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "6rem 2rem 4rem",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.76, 0, 0.24, 1)",
          visibility: menuOpen ? "visible" : "hidden",
        }}
      >
        <nav aria-label="Nawigacja mobilna">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {mainNav.map((link, i) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href} style={{ overflow: "hidden" }}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                    style={{
                      display: "block",
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(2.25rem, 8vw, 3.5rem)",
                      fontWeight: 300,
                      letterSpacing: "-0.01em",
                      color: active ? "var(--text-primary)" : "var(--text-muted)",
                      lineHeight: 1.15,
                      padding: "0.25rem 0",
                      transform: menuOpen ? "translateY(0)" : "translateY(110%)",
                      transition: `transform 0.4s cubic-bezier(0.76, 0, 0.24, 1) ${i * 0.06}s`,
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          style={{
            marginTop: "3rem",
            opacity: menuOpen ? 1 : 0,
            transition: "opacity 0.4s ease 0.3s",
          }}
        >
          <p className="text-label" style={{ color: "var(--text-muted)" }}>
            kontakt@setandspace.pl
          </p>
        </div>
      </div>

      <style>{`
        /* Desktop nav: hidden on mobile, shown (absolutely centred) on desktop */
        .header-desktop-nav { display: none; }
        @media (min-width: 768px) {
          .header-desktop-nav { display: flex; }
        }

        /* Hamburger: shown on mobile, hidden on desktop */
        .header-hamburger { display: flex; }
        @media (min-width: 768px) {
          .header-hamburger { display: none; }
        }
      `}</style>
    </>
  );
}
