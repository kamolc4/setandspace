"use client";

import { CONSENT_KEY } from "./CookieBanner";

export function PrivacySettingsButton() {
  const handleClick = () => {
    localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new Event("ss-consent-show"));
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        fontSize: "0.75rem",
        color: "rgba(241,233,224,0.5)",
        fontFamily: "inherit",
        lineHeight: "inherit",
      }}
    >
      Ustawienia prywatności
    </button>
  );
}
