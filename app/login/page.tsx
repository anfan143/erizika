"use client";
import { useState, type CSSProperties } from "react";
import { createBrowserClient } from "@supabase/ssr";

function sb() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [suhlas, setSuhlas] = useState(false);

  async function google() {
    setErr(""); setMsg("");
    try {
      const { error } = await sb().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch {
      setErr("Prihlásenie cez Google zlyhalo. Skúste e-mail a heslo.");
    }
  }

  function prepni() {
    setMode(mode === "login" ? "register" : "login");
    setErr(""); setMsg("");
  }

  async function submit() {
    setErr(""); setMsg("");
    if (!email.includes("@")) { setErr("Zadajte platný e-mail."); return; }
    if (password.length < 6) { setErr("Heslo musí mať aspoň 6 znakov."); return; }
    if (mode === "register" && !suhlas) { setErr("Na registráciu je potrebný súhlas s obchodnými podmienkami a spracúvaním osobných údajov."); return; }
    setBusy(true);
    try {
      if (mode === "register") {
        const { data, error } = await sb().auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
        });
        if (error) throw error;
        if (data.session) { window.location.href = "/app"; return; }
        setMsg("Účet sme vytvorili. Ak vám prišiel potvrdzovací e-mail, kliknite naň a potom sa prihláste.");
        setMode("login");
      } else {
        const { error } = await sb().auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/app";
      }
    } catch (e: any) {
      const m = String(e?.message || "");
      if (/already|registered|exists/i.test(m)) setErr("Tento e-mail je už zaregistrovaný — prihláste sa.");
      else if (/Invalid login credentials/i.test(m)) setErr("Nesprávny e-mail alebo heslo.");
      else if (/not confirmed/i.test(m)) setErr("E-mail ešte nie je potvrdený. Skontrolujte schránku a kliknite na potvrdzovací odkaz.");
      else if (/at least 6|weak|password/i.test(m)) setErr("Heslo je príliš slabé — použite aspoň 6 znakov.");
      else setErr(mode === "register" ? "Registrácia zlyhala. Skúste to znova." : "Prihlásenie zlyhalo. Skúste to znova.");
    } finally { setBusy(false); }
  }

  const linkStyle: CSSProperties = { color: "var(--ink)", fontWeight: 600, cursor: "pointer", textDecoration: "underline" };

  return (
    <>
      <div className="hazard" />
      <header><div className="head-inner"><a href="/" className="logo-mark" style={{ textDecoration: "none" }} title="Domov">HR</a><div><h1>e-rizika.sk</h1><div className="head-sub">Prihlásenie a registrácia</div></div></div></header>
      <main style={{ maxWidth: 460 }}>
        <div className="card">
          <div className="section-label">{mode === "register" ? "Registrácia" : "Prihlásenie"}</div>
          <button className="btn btn-google" onClick={google}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Pokračovať cez Google
          </button>
          <div className="delic"><span>alebo e-mailom</span></div>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vas@email.sk" />
          </div>
          <div className="field">
            <label htmlFor="password">Heslo</label>
            <input id="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="aspoň 6 znakov" onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
          </div>
          {mode === "register" && (
            <label className="suhlas">
              <input type="checkbox" checked={suhlas} onChange={(e) => setSuhlas(e.target.checked)} />
              <span>Súhlasím s <a href="/podmienky" target="_blank" rel="noopener">obchodnými podmienkami</a> a so <a href="/sukromie" target="_blank" rel="noopener">spracúvaním osobných údajov</a>.</span>
            </label>
          )}
          <div className="actions">
            <button className="btn btn-primary" onClick={submit} disabled={busy}>{busy ? "Pracujem…" : mode === "register" ? "Vytvoriť účet" : "Prihlásiť sa"}</button>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 16 }}>
            {mode === "login" ? "Nemáte ešte účet? " : "Už máte účet? "}
            <a onClick={prepni} style={linkStyle}>{mode === "login" ? "Zaregistrujte sa" : "Prihláste sa"}</a>
          </p>
          <p style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 10, lineHeight: 1.5 }}>
            Pokračovaním cez Google súhlasíte s <a href="/podmienky" target="_blank" rel="noopener" style={{ textDecoration: "underline" }}>obchodnými podmienkami</a> a so <a href="/sukromie" target="_blank" rel="noopener" style={{ textDecoration: "underline" }}>spracúvaním osobných údajov</a>.
          </p>
          {msg && <div style={{ display: "block", marginTop: 16, border: "1px solid var(--green)", borderRadius: 8, padding: "12px 16px", fontSize: 13.5, background: "#F0FAF4", color: "var(--green)" }}>{msg}</div>}
          {err && <div className="error-box" style={{ display: "block" }}>{err}</div>}
        </div>
      </main>
    </>
  );
}
