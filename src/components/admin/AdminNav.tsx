"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/_actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/poradniki", label: "Poradniki", exact: false },
  { href: "/admin/poradniki/nowy", label: "+ Dodaj", exact: false },
];

export function AdminNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const close = () => setOpen(false);

  return (
    <>
      <nav style={{
        backgroundColor: "#1F1916",
        padding: "0 1.25rem",
        height: "3.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxSizing: "border-box",
      }}>
        <Link href="/admin" style={{
          color: "#F1E9E0",
          fontWeight: 700,
          fontSize: "0.9375rem",
          textDecoration: "none",
          letterSpacing: "0.01em",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>
          Set &amp; Space
        </Link>

        {/* Desktop navigation */}
        <div className="admin-desktop" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} style={{
              color: isActive(item.href, item.exact) ? "#F7F3EE" : "#8C7B6E",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: isActive(item.href, item.exact) ? 600 : 400,
              whiteSpace: "nowrap",
            }}>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="admin-desktop" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link href="/" target="_blank" style={{
              color: "#8C7B6E",
              textDecoration: "none",
              fontSize: "0.8125rem",
              whiteSpace: "nowrap",
            }}>
              ↗ Strona
            </Link>
            <form action={logoutAction}>
              <button type="submit" style={{
                background: "none",
                border: "1px solid #4a3a35",
                color: "#8C7B6E",
                padding: "0.3rem 0.75rem",
                borderRadius: "5px",
                fontSize: "0.8125rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}>
                Wyloguj
              </button>
            </form>
          </div>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="admin-hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={open}
            style={{
              background: "none",
              border: "none",
              color: "#F1E9E0",
              cursor: "pointer",
              padding: "0.5rem",
              fontSize: "1.25rem",
              lineHeight: 1,
              display: "none",
              flexShrink: 0,
            }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={close}
            style={{
              position: "fixed",
              inset: 0,
              top: "3.25rem",
              zIndex: 48,
              background: "rgba(0,0,0,0.35)",
            }}
          />
          {/* Panel */}
          <div style={{
            position: "fixed",
            top: "3.25rem",
            left: 0,
            right: 0,
            backgroundColor: "#2D241F",
            zIndex: 49,
            padding: "0.5rem 1.25rem 1.25rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={close} style={{
                color: isActive(item.href, item.exact) ? "#F7F3EE" : "#C4B5A5",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: isActive(item.href, item.exact) ? 600 : 400,
                padding: "0.875rem 0",
                borderBottom: "1px solid #3d302a",
                display: "block",
              }}>
                {item.label}
              </Link>
            ))}
            <Link href="/" target="_blank" onClick={close} style={{
              color: "#8C7B6E",
              textDecoration: "none",
              fontSize: "0.9375rem",
              padding: "0.875rem 0",
              borderBottom: "1px solid #3d302a",
              display: "block",
            }}>
              ↗ Strona publiczna
            </Link>
            <form action={logoutAction} style={{ paddingTop: "1rem" }}>
              <button type="submit" style={{
                background: "none",
                border: "1px solid #4a3a35",
                color: "#8C7B6E",
                padding: "0.625rem 1.25rem",
                borderRadius: "6px",
                fontSize: "0.9375rem",
                cursor: "pointer",
                width: "100%",
              }}>
                Wyloguj
              </button>
            </form>
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 640px) {
          .admin-desktop { display: flex !important; }
          .admin-hamburger { display: none !important; }
        }
        @media (max-width: 639px) {
          .admin-desktop { display: none !important; }
          .admin-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
