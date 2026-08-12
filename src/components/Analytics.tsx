"use client";

import Script from "next/script";
import { business } from "@/data/business";

export function Analytics() {
  if (!business.ga4Id || process.env.NODE_ENV !== "production") {
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
          gtag('config', '${business.ga4Id}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
