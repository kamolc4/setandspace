"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export const CONSENT_KEY = "ss-analytics-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Defer initial check to avoid synchronous setState in effect body
    const timerId = setTimeout(() => {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    }, 0);

    const handleShow = () => setVisible(true);
    window.addEventListener("ss-consent-show", handleShow);
    return () => {
      clearTimeout(timerId);
      window.removeEventListener("ss-consent-show", handleShow);
    };
  }, []);

  const save = (value: "granted" | "denied") => {
    localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event("ss-consent-change"));
    setVisible(false);
  };

  if (!visible) return null;

  const btnBase: React.CSSProperties = {
    border: "none",
    borderRadius: "99px",
    padding: "0.6rem 1.25rem",
    fontFamily: "var(--font-sans)",
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  };

  return (
    <div
      role="dialog"
      aria-label="Ustawienia prywatności i cookies"
      aria-modal="false"
      style={{
        position: "fixed",
        bottom: "clamp(0.75rem, 2vw, 1.25rem)",
        left: "1rem",
        right: "1rem",
        zIndex: 9999,
        backgroundColor: "var(--text-primary)",
        borderRadius: "var(--radius-panel)",
        padding: "clamp(1.25rem, 3vw, 1.75rem)",
        maxWidth: "580px",
        margin: "0 auto",
        boxShadow: "0 8px 40px rgba(31,25,22,0.35)",
      }}
    >
      <p
        style={{
          fontSize: "0.875rem",
          lineHeight: 1.65,
          color: "rgba(241,233,224,0.8)",
          marginBottom: "1.25rem",
        }}
      >
        Ta strona korzysta z niezbędnych technicznych plików cookie. Za Twoją
        zgodą może też korzystać z narzędzi analitycznych.{" "}
        <Link
          href="/polityka-prywatnosci"
          style={{
            color: "var(--clay)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Polityka prywatności
        </Link>
        .
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => save("granted")}
          aria-label="Zaakceptuj cookies analityczne"
          style={{
            ...btnBase,
            backgroundColor: "var(--clay)",
            color: "var(--surface)",
          }}
        >
          Akceptuję
        </button>
        <button
          onClick={() => save("denied")}
          aria-label="Odrzuć cookies analityczne"
          style={{
            ...btnBase,
            backgroundColor: "transparent",
            color: "rgba(241,233,224,0.6)",
            border: "1px solid rgba(241,233,224,0.18)",
          }}
        >
          Odrzucam
        </button>
      </div>
    </div>
  );
}
