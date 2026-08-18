"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/_actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "380px", padding: "2.5rem", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>
          Panel administracyjny
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "2rem" }}>
          Set &amp; Space
        </p>

        {state?.error && (
          <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "0.75rem", marginBottom: "1rem", color: "#dc2626", fontSize: "0.875rem" }}>
            {state.error}
          </div>
        )}

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>
              E-mail
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              style={{ width: "100%", padding: "0.625rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.9375rem", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>
              Hasło
            </label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              style={{ width: "100%", padding: "0.625rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.9375rem", boxSizing: "border-box" }}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            style={{ padding: "0.75rem", backgroundColor: "#1d4ed8", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.9375rem", fontWeight: 600, cursor: pending ? "wait" : "pointer", opacity: pending ? 0.7 : 1 }}
          >
            {pending ? "Loguję…" : "Zaloguj się"}
          </button>
        </form>
      </div>
    </div>
  );
}
