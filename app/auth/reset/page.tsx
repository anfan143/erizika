"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

function sb() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function ResetHesla() {
  const [stav, setStav] = useState<"kontrola" | "formular" | "neplatny">("kontrola");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Po kliknutí na odkaz z e-mailu už máme platnú session (vymenenú v /auth/callback
    // alebo /auth/confirm). Ak ju nemáme, odkaz je neplatný alebo vypršal.
    (async () => {
      const { data } = await sb().auth.getUser();
      setStav(data.user ? "formular" : "neplatny");
    })();
  }, []);

  async function uloz() {
    setErr(""); setMsg("");
    if (password.length < 6) { setErr("Heslo musí mať aspoň 6 znakov."); return; }
    if (password !== password2) { setErr("Heslá sa nezhodujú."); return; }
    setBusy(true);
    try {
      const { error } = await sb().auth.updateUser({ password });
      if (error) throw error;
      setMsg("Heslo bolo zmenené. Presmerúvame vás do aplikácie…");
      setTimeout(() => { window.location.href = "/app"; }, 1500);
    } catch {
      setErr("Heslo sa nepodarilo zmeniť. Skúste odkaz z e-mailu otvoriť znova.");
    } finally { setBusy(false); }
  }

  return (
    <>
      <div className="hazard" />
      <header><div className="head-inner"><a href="/" className="logo-mark" style={{ textDecoration: "none" }} title="Domov">HR</a><div><h1>e-rizika.sk</h1><div className="head-sub">Nastavenie nového hesla</div></div></div></header>
      <main style={{ maxWidth: 460 }}>
        <div className="card">
          <div className="section-label">Nové heslo</div>

          {stav === "kontrola" && (
            <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>Overujem odkaz…</p>
          )}

          {stav === "neplatny" && (
            <>
              <div className="error-box" style={{ display: "block" }}>
                Odkaz na obnovu hesla je neplatný alebo vypršal. Vyžiadajte si nový na prihlasovacej stránke.
              </div>
              <div className="actions" style={{ marginTop: 16 }}>
                <a className="btn btn-primary" href="/login">Späť na prihlásenie</a>
              </div>
            </>
          )}

          {stav === "formular" && (
            <>
              <div className="field">
                <label htmlFor="p1">Nové heslo</label>
                <input id="p1" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="aspoň 6 znakov" />
              </div>
              <div className="field">
                <label htmlFor="p2">Zopakujte heslo</label>
                <input id="p2" type="password" autoComplete="new-password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="rovnaké heslo" onKeyDown={(e) => { if (e.key === "Enter") uloz(); }} />
              </div>
              <div className="actions">
                <button className="btn btn-primary" onClick={uloz} disabled={busy}>{busy ? "Ukladám…" : "Uložiť nové heslo"}</button>
              </div>
            </>
          )}

          {msg && <div style={{ display: "block", marginTop: 16, border: "1px solid var(--green)", borderRadius: 8, padding: "12px 16px", fontSize: 13.5, background: "#F0FAF4", color: "var(--green)" }}>{msg}</div>}
          {err && <div className="error-box" style={{ display: "block" }}>{err}</div>}
        </div>
      </main>
    </>
  );
}
