"use client";

import { useState, useTransition } from "react";
import { scheduleArticleAction, changeScheduledDateAction } from "@/app/admin/_actions/articles";

const C = {
  border: "#C4B5A5",
  borderLight: "#D8C8B8",
  text: "#1F1916",
  textSec: "#6B5040",
  textMut: "#8C7B6E",
  surface: "#F7F3EE",
  error: "#dc2626",
};

const INPUT: React.CSSProperties = {
  padding: "0.3rem 0.5rem",
  border: `1px solid ${C.border}`,
  borderRadius: "5px",
  fontSize: "0.8125rem",
  fontFamily: "inherit",
  backgroundColor: "#fff",
  color: C.text,
  boxSizing: "border-box" as const,
  outline: "none",
  width: "100%",
};

interface Props {
  articleId: string;
  mode: "schedule" | "change";
  label?: string;
  initialDate?: string;
  initialTime?: string;
}

export function QuickScheduleButton({ articleId, mode, label, initialDate = "", initialTime = "10:00" }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  const handleSubmit = () => {
    if (!date || !time) { setError("Wybierz datę i godzinę."); return; }
    setError("");

    startTransition(async () => {
      const action = mode === "schedule" ? scheduleArticleAction : changeScheduledDateAction;
      const result = await action(articleId, date, time);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
      }
    });
  };

  const btnStyle: React.CSSProperties = {
    padding: "0.25rem 0.6rem",
    backgroundColor: "#F1E9E0",
    color: C.text,
    borderRadius: "5px",
    fontSize: "0.75rem",
    textDecoration: "none",
    border: "1px solid #C4B5A5",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    fontFamily: "inherit",
    fontWeight: 500,
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} style={btnStyle}>
        {label ?? (mode === "schedule" ? "Zaplanuj" : "Zmień termin")}
      </button>
    );
  }

  return (
    <div style={{
      position: "relative",
      display: "inline-block",
    }}>
      <div style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        right: 0,
        zIndex: 100,
        backgroundColor: "#fff",
        border: `1px solid ${C.border}`,
        borderRadius: "8px",
        padding: "0.875rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        minWidth: "240px",
        maxWidth: "280px",
      }}>
        <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: C.text, margin: "0 0 0.75rem" }}>
          {mode === "schedule" ? "Zaplanuj publikację" : "Zmień termin"}
        </p>

        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", color: C.textSec, marginBottom: "0.25rem", fontWeight: 600 }}>
            Data
          </label>
          <input type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} style={INPUT} />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", color: C.textSec, marginBottom: "0.25rem", fontWeight: 600 }}>
            Godzina (Warszawa)
          </label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={INPUT} />
        </div>

        {error && <p style={{ color: C.error, fontSize: "0.75rem", margin: "0 0 0.5rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "0.375rem" }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            style={{
              flex: 1,
              padding: "0.375rem 0.5rem",
              backgroundColor: C.text,
              color: "#F1E9E0",
              border: "none",
              borderRadius: "5px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: isPending ? "wait" : "pointer",
              fontFamily: "inherit",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? "Zapisuję…" : "Zapisz"}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setError(""); }}
            style={{
              padding: "0.375rem 0.75rem",
              backgroundColor: C.surface,
              color: C.textSec,
              border: `1px solid ${C.border}`,
              borderRadius: "5px",
              fontSize: "0.8125rem",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Anuluj
          </button>
        </div>
      </div>

      {/* Trigger button (shown while dropdown is open) */}
      <button type="button" onClick={() => setOpen(false)} style={{ ...btnStyle, backgroundColor: C.surface }}>
        {label ?? (mode === "schedule" ? "Zaplanuj" : "Zmień termin")}
      </button>
    </div>
  );
}
