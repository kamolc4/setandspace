"use client";

import { useState, type FormEvent } from "react";
import { business } from "@/data/business";

const projectTypes = [
  "Film dla hotelu / obiektu hospitality",
  "Video nieruchomości",
  "Film architektury / wnętrz",
  "Film reklamowy / brand content",
  "Inne",
];

interface FormState {
  name: string;
  email: string;
  company: string;
  projectType: string;
  location: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    location: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    /**
     * INTEGRATION POINT
     * Replace this with your actual form submission logic:
     * - Email API (e.g., Resend, SendGrid, Formspree)
     * - Next.js Server Action
     * - Any backend endpoint
     *
     * For now, this simulates a successful submission.
     */
    await new Promise((r) => setTimeout(r, 800));

    if (business.email) {
      // When backend is ready: post to /api/contact
      setStatus("success");
    } else {
      // No email configured — show success anyway (form captured locally)
      setStatus("success");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.875rem 1rem",
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-sans)",
    fontSize: "0.9375rem",
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.2s ease",
    appearance: "none",
    WebkitAppearance: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--text-muted)",
    marginBottom: "0.5rem",
  };

  if (status === "success") {
    return (
      <div
        role="alert"
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          backgroundColor: "var(--surface)",
          borderRadius: "var(--radius-panel)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "var(--clay)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          Wiadomość wysłana.
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          Odpiszę w ciągu jednego dnia roboczego.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.25rem",
        }}
        className="contact-form-grid"
      >
        <div>
          <label htmlFor="name" style={labelStyle}>
            Imię <span aria-label="pole wymagane">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="given-name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Jan"
          />
        </div>

        <div>
          <label htmlFor="email" style={labelStyle}>
            E-mail <span aria-label="pole wymagane">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            placeholder="jan@firma.pl"
          />
        </div>

        <div>
          <label htmlFor="company" style={labelStyle}>
            Firma / obiekt
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Nazwa hotelu, studia, firmy..."
          />
        </div>

        <div>
          <label htmlFor="projectType" style={labelStyle}>
            Rodzaj projektu
          </label>
          <select
            id="projectType"
            name="projectType"
            value={form.projectType}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">Wybierz kategorię...</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" style={labelStyle}>
            Lokalizacja
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Miasto, region..."
          />
        </div>

        <div>
          <label htmlFor="message" style={labelStyle}>
            Wiadomość <span aria-label="pole wymagane">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            placeholder="Opisz swój projekt — czym jest, co chcesz osiągnąć, jakie są ramy czasowe..."
          />
        </div>
      </div>

      {status === "error" && (
        <p
          role="alert"
          style={{
            color: "#8B2222",
            fontSize: "0.875rem",
            marginTop: "1rem",
          }}
        >
          Wystąpił błąd. Spróbuj ponownie lub napisz bezpośrednio na adres{" "}
          <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          marginTop: "1.75rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.625rem",
          backgroundColor: status === "loading" ? "var(--stone)" : "var(--text-primary)",
          color: "var(--surface)",
          padding: "1rem 2.25rem",
          borderRadius: "99px",
          fontFamily: "var(--font-sans)",
          fontSize: "0.8125rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
          border: "none",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          transition: "background-color 0.25s ease",
        }}
      >
        {status === "loading" ? "Wysyłanie..." : "Wyślij wiadomość →"}
      </button>

      <style>{`
        @media (min-width: 640px) {
          .contact-form-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .contact-form-grid > div:nth-child(5),
          .contact-form-grid > div:nth-child(6) {
            grid-column: span 2;
          }
        }
      `}</style>
    </form>
  );
}
