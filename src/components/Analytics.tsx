"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { business } from "@/data/business";
import { CONSENT_KEY } from "@/components/ui/CookieBanner";

export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const update = () => {
      setConsented(localStorage.getItem(CONSENT_KEY) === "granted");
    };
    update();
    window.addEventListener("ss-consent-change", update);
    return () => window.removeEventListener("ss-consent-change", update);
  }, []);

  if (!business.ga4Id || process.env.NODE_ENV !== "production" || !consented) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${business.ga4Id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${business.ga4Id}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
