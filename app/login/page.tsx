"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

function sb() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function google() {
    setErr("");
    try {
      const { error } = await sb().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch {
      setErr("Prihlásenie cez Google zlyhalo. Skúste e-mailový odkaz nižšie.");
    }
  }

  async function send() {
    setErr(""); setBusy(true);
    try {
      const { error } = await sb().auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setErr("Odoslanie zlyhalo. Skontrolujte e-mail a skúste znova.");
    } finally { setBusy(false); }
  }

  return (
    <>
      <div className="hazard" />
      <header><div className="head-inner"><a href="/" className="logo-mark" style={{ textDecoration: "none" }} title="Domov">HR</a><div><h1>Rizika</h1><div className="head-sub">Prihlásenie</div></div></div></header>
      <main style={{ maxWidth: 460 }}>
        <div className="card">
          {sent ? (
            <p>Hotovo — poslali sme vám prihlasovací odkaz na <strong>{email}</strong>. Otvorte e-mail a kliknite naň (platí pár minút).</p>
          ) : (
            <>
              <div className="section-label">Prihlásenie / registrácia</div>
              <button className="btn btn-google" onClick={google}>
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Prihlásiť sa cez Google
              </button>
              <div className="delic"><span>alebo e-mailom</span></div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vas@email.sk" />
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={send} disabled={busy || !email.includes("@")}>{busy ? "Odosielam…" : "Poslať prihlasovací odkaz"}</button>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 14 }}>Prihlásením vzniká účet automaticky — žiadne heslá si pamätať nemusíte.</p>
              {err && <div className="error-box" style={{ display: "block" }}>{err}</div>}
            </>
          )}
        </div>
      </main>
    </>
  );
}
