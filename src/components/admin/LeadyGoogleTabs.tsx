"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LeadyGoogleTabs() {
  const pathname = usePathname();
  const isGoogle = pathname === "/admin/leady/google";

  const tab = (
    label: string,
    href: string,
    active: boolean
  ) => (
    <Link
      href={href}
      style={{
        padding: "0.5rem 1.375rem",
        borderRadius: "6px",
        fontSize: "0.875rem",
        fontWeight: active ? 700 : 400,
        backgroundColor: active ? "#1F1916" : "transparent",
        color: active ? "#F7F3EE" : "#8C7B6E",
        textDecoration: "none",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Link>
  );

  return (
    <div
      style={{
        display: "flex",
        gap: "0.25rem",
        marginBottom: "1.75rem",
        backgroundColor: "#F1E9E0",
        borderRadius: "8px",
        padding: "0.25rem",
        alignSelf: "flex-start",
      }}
    >
      {tab("Leady", "/admin/leady", !isGoogle)}
      {tab("Google", "/admin/leady/google", isGoogle)}
    </div>
  );
}
