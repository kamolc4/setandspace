"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  connectGmailAction,
  updateGmailConfigAction,
  sendTestEmailAction,
  toggleGmailNotificationsAction,
  disconnectGmailAction,
} from "@/app/admin/_actions/gmail";
import type { GmailActionResult } from "@/app/admin/_actions/gmail";

// ── Types ─────────────────────────────────────────────────────────────────────

type GmailStatus = "PENDING" | "CONNECTED" | "ERROR";

export interface GmailIntegrationPublic {
  id: string;
  email: string;
  notifyEmail: string;
  enabled: boolean;
  status: GmailStatus;
  lastTestAt: string | null;
  lastSuccessAt: string | null;
}

interface Props {
  integration: GmailIntegrationPublic | null;
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.8rem 1rem",
  border: "1px solid #C4B5A5",
  borderRadius: "6px",
  fontSize: "0.9375rem",
  backgroundColor: "#fff",
  color: "#1F1916",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "#8C7B6E",
  marginBottom: "0.4rem",
};

function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
        {required && <span aria-label="wymagane"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        style={inputStyle}
      />
    </div>
  );
}

function PrimaryButton({
  busy,
  busyLabel,
  label,
  type = "submit",
  onClick,
  disabled,
}: {
  busy?: boolean;
  busyLabel?: string;
  label: string;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={busy || disabled}
      style={{
        padding: "0.875rem 2rem",
        backgroundColor: busy || disabled ? "#C4B5A5" : "#1F1916",
        color: "#F7F3EE",
        border: "none",
        borderRadius: "99px",
        fontSize: "0.875rem",
        fontWeight: 700,
        cursor: busy || disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
        transition: "background-color 0.2s ease",
      }}
    >
      {busy ? (busyLabel ?? "Ładowanie...") : label}
    </button>
  );
}

function GhostButton({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "0.75rem 1.5rem",
        backgroundColor: "transparent",
        color: danger ? "#8B2222" : "#8C7B6E",
        border: `1px solid ${danger ? "#D8B0B0" : "#C4B5A5"}`,
        borderRadius: "99px",
        fontSize: "0.875rem",
        fontWeight: 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function StatusDot({ connected }: { connected: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: connected ? "#2D5A1B" : "#8B2222",
        marginRight: "0.5rem",
        flexShrink: 0,
      }}
    />
  );
}

// ── Instructions accordion ────────────────────────────────────────────────────

function Instructions({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div
      style={{
        border: "1px solid #E8DED2",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#F7F3EE",
          border: "none",
          cursor: "pointer",
          fontSize: "0.875rem",
          color: "#765C49",
          fontWeight: 600,
          textAlign: "left",
        }}
      >
        <span>Jak utworzyć hasło aplikacji?</span>
        <span style={{ fontSize: "0.75rem", color: "#8C7B6E" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "1rem 1.125rem 1.125rem",
            backgroundColor: "#fff",
            fontSize: "0.875rem",
            color: "#4A3A35",
            lineHeight: 1.7,
          }}
        >
          <ol style={{ margin: 0, paddingLeft: "1.375rem" }}>
            <li>Zaloguj się na swoje konto Google.</li>
            <li style={{ marginTop: "0.375rem" }}>
              Otwórz{" "}
              <strong>Ustawienia konta Google</strong> &rarr;{" "}
              <strong>Bezpieczeństwo</strong>.
            </li>
            <li style={{ marginTop: "0.375rem" }}>
              Upewnij się, że{" "}
              <strong>weryfikacja dwuetapowa</strong> jest włączona
              (wymagana przez Google).
            </li>
            <li style={{ marginTop: "0.375rem" }}>
              W wyszukiwarce na stronie konta Google wpisz{" "}
              <strong>{'„Hasła aplikacji"'}</strong> i otwórz tę sekcję.
            </li>
            <li style={{ marginTop: "0.375rem" }}>
              Utwórz nowe hasło — jako nazwę aplikacji wpisz np.{" "}
              <strong>Set & Space</strong>.
            </li>
            <li style={{ marginTop: "0.375rem" }}>
              Skopiuj wygenerowane hasło (16 znaków).
            </li>
            <li style={{ marginTop: "0.375rem" }}>
              Wklej je w pole <strong>{'„Hasło aplikacji Google"'}</strong>{" "}
              powyżej i kliknij <strong>{'„Połącz Gmail"'}</strong>.
            </li>
          </ol>
          <p
            style={{
              margin: "0.875rem 0 0",
              fontSize: "0.8125rem",
              color: "#8C7B6E",
              padding: "0.625rem 0.875rem",
              backgroundColor: "#F7F3EE",
              borderRadius: "6px",
              border: "1px solid #E8DED2",
            }}
          >
            Do połączenia potrzebne jest hasło aplikacji Google, a nie zwykłe
            hasło do Gmaila.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function GmailConfigPanel({ integration: initial }: Props) {
  const router = useRouter();

  const [mode, setMode] = useState<"status" | "edit" | "connect">(
    initial ? "status" : "connect"
  );
  const [showInstructions, setShowInstructions] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [disconnectConfirm, setDisconnectConfirm] = useState(false);

  // Form fields (used in both connect and edit modes)
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(initial?.notifyEmail ?? "");
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);

  // Async UI states
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [testBusy, setTestBusy] = useState(false);
  const [testMsg, setTestMsg] = useState("");
  const [disconnectBusy, setDisconnectBusy] = useState(false);

  function handleResult(result: GmailActionResult, onOk: () => void) {
    if (result.ok) {
      setErrorMsg("");
      onOk();
      router.refresh();
    } else {
      setErrorMsg(result.error);
    }
  }

  // ── Connect form ────────────────────────────────────────────────────────────

  async function handleConnect(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrorMsg("");
    const result = await connectGmailAction({ email, password, notifyEmail });
    setBusy(false);
    handleResult(result, () => {
      setMode("status");
      setSuccessMsg("Gmail został połączony.");
      setPassword("");
    });
  }

  // ── Edit form ───────────────────────────────────────────────────────────────

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrorMsg("");
    const payload: Record<string, unknown> = { email, notifyEmail, enabled };
    if (showNewPassword && password.trim()) payload.password = password;
    const result = await updateGmailConfigAction(payload);
    setBusy(false);
    handleResult(result, () => {
      setMode("status");
      setSuccessMsg("Ustawienia zostały zapisane.");
      setPassword("");
      setShowNewPassword(false);
    });
  }

  // ── Test email ──────────────────────────────────────────────────────────────

  async function handleTest() {
    setTestBusy(true);
    setTestMsg("");
    const result = await sendTestEmailAction();
    setTestBusy(false);
    if (result.ok) {
      setTestMsg("Wiadomość testowa została wysłana.");
    } else {
      setTestMsg(`Błąd: ${result.error}`);
    }
    router.refresh();
  }

  // ── Toggle ──────────────────────────────────────────────────────────────────

  async function handleToggle(val: boolean) {
    setEnabled(val);
    await toggleGmailNotificationsAction(val);
    router.refresh();
  }

  // ── Disconnect ──────────────────────────────────────────────────────────────

  async function handleDisconnect() {
    setDisconnectBusy(true);
    await disconnectGmailAction();
    setDisconnectBusy(false);
    setDisconnectConfirm(false);
    setEmail("");
    setPassword("");
    setNotifyEmail("");
    setEnabled(true);
    setSuccessMsg("");
    setTestMsg("");
    setMode("connect");
    router.refresh();
  }

  // ── Card wrapper ────────────────────────────────────────────────────────────

  const card = (children: React.ReactNode) => (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #C4B5A5",
        borderRadius: "12px",
        padding: "1.75rem",
        maxWidth: "540px",
      }}
    >
      {children}
    </div>
  );

  const sectionLabel: React.CSSProperties = {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8C7B6E",
    marginBottom: "0.5rem",
  };

  // ── Status panel (connected / error) ─────────────────────────────────────────

  if (mode === "status" && initial) {
    const isConnected = initial.status === "CONNECTED";
    const isError = initial.status === "ERROR";

    const formatDate = (iso: string | null) => {
      if (!iso) return null;
      return new Date(iso).toLocaleString("pl-PL", {
        timeZone: "Europe/Warsaw",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {successMsg && (
          <div
            style={{
              padding: "0.875rem 1rem",
              backgroundColor: "#DCEFD8",
              color: "#2D5A1B",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {successMsg}
          </div>
        )}

        {card(
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem",
                gap: "0.5rem",
              }}
            >
              <StatusDot connected={isConnected} />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: isConnected ? "#2D5A1B" : "#8B2222",
                }}
              >
                {isConnected
                  ? "Połączono"
                  : isError
                  ? "Problem z połączeniem"
                  : "Niepołączono"}
              </span>
            </div>

            {isError && (
              <p
                style={{
                  margin: "0 0 1.25rem",
                  color: "#8B2222",
                  fontSize: "0.875rem",
                  backgroundColor: "#F5E4E4",
                  padding: "0.75rem 1rem",
                  borderRadius: "6px",
                }}
              >
                Gmail wymaga ponownego połączenia. Kliknij{" "}
                {'„Zmień ustawienia"'}, aby zaktualizować hasło aplikacji.
              </p>
            )}

            <div
              style={{
                display: "grid",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <p style={sectionLabel}>Konto Gmail</p>
                <p style={{ margin: 0, color: "#1F1916", fontSize: "0.9375rem" }}>
                  {initial.email}
                </p>
              </div>

              {isConnected && (
                <>
                  <div>
                    <p style={sectionLabel}>
                      Powiadomienia o nowych leadach
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.375rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggle(true)}
                        style={{
                          padding: "0.4rem 1rem",
                          borderRadius: "99px",
                          fontSize: "0.8125rem",
                          fontWeight: enabled ? 700 : 400,
                          backgroundColor: enabled ? "#1F1916" : "#F1E9E0",
                          color: enabled ? "#F7F3EE" : "#8C7B6E",
                          border: "1px solid transparent",
                          cursor: "pointer",
                        }}
                      >
                        ● Włączone
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(false)}
                        style={{
                          padding: "0.4rem 1rem",
                          borderRadius: "99px",
                          fontSize: "0.8125rem",
                          fontWeight: !enabled ? 700 : 400,
                          backgroundColor: !enabled ? "#1F1916" : "#F1E9E0",
                          color: !enabled ? "#F7F3EE" : "#8C7B6E",
                          border: "1px solid transparent",
                          cursor: "pointer",
                        }}
                      >
                        ○ Wyłączone
                      </button>
                    </div>
                  </div>

                  <div>
                    <p style={sectionLabel}>Powiadomienia wysyłane na</p>
                    <p
                      style={{
                        margin: 0,
                        color: "#1F1916",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {initial.notifyEmail}
                    </p>
                  </div>

                  {initial.lastTestAt && (
                    <div>
                      <p style={sectionLabel}>Ostatni test</p>
                      <p
                        style={{
                          margin: 0,
                          color: "#8C7B6E",
                          fontSize: "0.875rem",
                        }}
                      >
                        {formatDate(initial.lastTestAt)}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {isConnected && (
              <div style={{ marginBottom: "1.25rem" }}>
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testBusy}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: testBusy ? "#C4B5A5" : "#E8DED2",
                    color: "#4A3A35",
                    border: "1px solid #C4B5A5",
                    borderRadius: "99px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: testBusy ? "not-allowed" : "pointer",
                    width: "100%",
                  }}
                >
                  {testBusy
                    ? "Wysyłanie..."
                    : "Wyślij wiadomość testową"}
                </button>
                {testMsg && (
                  <p
                    style={{
                      marginTop: "0.625rem",
                      fontSize: "0.8125rem",
                      color: testMsg.startsWith("Błąd")
                        ? "#8B2222"
                        : "#2D5A1B",
                      fontWeight: 600,
                    }}
                  >
                    {testMsg}
                  </p>
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                borderTop: "1px solid #F1E9E0",
                paddingTop: "1.25rem",
              }}
            >
              <GhostButton
                label="Zmień ustawienia"
                onClick={() => {
                  setEmail(initial.email);
                  setNotifyEmail(initial.notifyEmail);
                  setEnabled(initial.enabled);
                  setPassword("");
                  setShowNewPassword(false);
                  setErrorMsg("");
                  setMode("edit");
                }}
              />
              {!disconnectConfirm ? (
                <GhostButton
                  label="Odłącz Gmail"
                  danger
                  onClick={() => setDisconnectConfirm(true)}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8125rem", color: "#8B2222", fontWeight: 600 }}
                  >
                    Na pewno odłączyć?
                  </span>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    disabled={disconnectBusy}
                    style={{
                      padding: "0.4rem 1rem",
                      backgroundColor: "#8B2222",
                      color: "#fff",
                      border: "none",
                      borderRadius: "99px",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      cursor: disconnectBusy ? "not-allowed" : "pointer",
                    }}
                  >
                    {disconnectBusy ? "Odłączanie..." : "Tak, odłącz"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisconnectConfirm(false)}
                    style={{
                      padding: "0.4rem 1rem",
                      backgroundColor: "transparent",
                      color: "#8C7B6E",
                      border: "1px solid #C4B5A5",
                      borderRadius: "99px",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    Anuluj
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Connect form ────────────────────────────────────────────────────────────

  if (mode === "connect") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {card(
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <StatusDot connected={false} />
              <span
                style={{ fontWeight: 700, fontSize: "1rem", color: "#8B2222" }}
              >
                Niepołączono
              </span>
            </div>

            <p
              style={{
                margin: "0 0 1.5rem",
                color: "#4A3A35",
                fontSize: "0.9375rem",
                lineHeight: 1.6,
              }}
            >
              Połącz konto Gmail, aby otrzymywać powiadomienia o nowych
              leadach.
            </p>

            <form
              onSubmit={handleConnect}
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <FormField
                id="g-email"
                label="Adres Gmail"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="twoje@gmail.com"
                required
                autoComplete="email"
              />

              <FormField
                id="g-password"
                label="Hasło aplikacji Google"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="xxxx xxxx xxxx xxxx"
                required
                autoComplete="new-password"
              />

              <FormField
                id="g-notify"
                label="E-mail odbiorcy powiadomień"
                type="email"
                value={notifyEmail}
                onChange={setNotifyEmail}
                placeholder="twoje@gmail.com"
                required
                autoComplete="email"
              />

              <Instructions
                open={showInstructions}
                onToggle={() => setShowInstructions((v) => !v)}
              />

              {errorMsg && (
                <p
                  role="alert"
                  style={{
                    color: "#8B2222",
                    fontSize: "0.875rem",
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  {errorMsg}
                </p>
              )}

              <PrimaryButton
                busy={busy}
                busyLabel="Łączenie..."
                label="Połącz Gmail"
              />
            </form>
          </>
        )}
      </div>
    );
  }

  // ── Edit form ───────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {card(
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: "#1F1916",
              }}
            >
              Zmień ustawienia
            </span>
            <button
              type="button"
              onClick={() => {
                setMode("status");
                setErrorMsg("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#8C7B6E",
                cursor: "pointer",
                fontSize: "0.875rem",
                padding: 0,
              }}
            >
              ← Wróć
            </button>
          </div>

          <form
            onSubmit={handleUpdate}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <FormField
              id="ge-email"
              label="Adres Gmail"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="twoje@gmail.com"
              required
              autoComplete="email"
            />

            <div>
              <label style={labelStyle}>Hasło aplikacji Google</label>
              {!showNewPassword ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      ...inputStyle,
                      color: "#8C7B6E",
                      letterSpacing: "0.15em",
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    ••••••••••••••••
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(true)}
                    style={{
                      padding: "0.8rem 1.25rem",
                      backgroundColor: "#F1E9E0",
                      color: "#765C49",
                      border: "1px solid #C4B5A5",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Ustaw nowe hasło
                  </button>
                </div>
              ) : (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wklej nowe hasło aplikacji"
                  autoComplete="new-password"
                  style={inputStyle}
                />
              )}
            </div>

            <FormField
              id="ge-notify"
              label="E-mail odbiorcy powiadomień"
              type="email"
              value={notifyEmail}
              onChange={setNotifyEmail}
              placeholder="twoje@gmail.com"
              required
              autoComplete="email"
            />

            <div>
              <p style={sectionLabel}>Powiadomienia o nowych leadach</p>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <button
                  type="button"
                  onClick={() => setEnabled(true)}
                  style={{
                    padding: "0.5rem 1.125rem",
                    borderRadius: "99px",
                    fontSize: "0.8125rem",
                    fontWeight: enabled ? 700 : 400,
                    backgroundColor: enabled ? "#1F1916" : "#F1E9E0",
                    color: enabled ? "#F7F3EE" : "#8C7B6E",
                    border: "1px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  Włączone
                </button>
                <button
                  type="button"
                  onClick={() => setEnabled(false)}
                  style={{
                    padding: "0.5rem 1.125rem",
                    borderRadius: "99px",
                    fontSize: "0.8125rem",
                    fontWeight: !enabled ? 700 : 400,
                    backgroundColor: !enabled ? "#1F1916" : "#F1E9E0",
                    color: !enabled ? "#F7F3EE" : "#8C7B6E",
                    border: "1px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  Wyłączone
                </button>
              </div>
            </div>

            {errorMsg && (
              <p
                role="alert"
                style={{
                  color: "#8B2222",
                  fontSize: "0.875rem",
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {errorMsg}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <PrimaryButton
                busy={busy}
                busyLabel="Zapisywanie..."
                label="Zapisz"
              />
              <GhostButton
                label="Anuluj"
                onClick={() => {
                  setMode("status");
                  setErrorMsg("");
                  setShowNewPassword(false);
                  setPassword("");
                }}
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
}
