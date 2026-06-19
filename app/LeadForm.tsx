"use client";
import { useState, type FormEvent } from "react";

export default function LeadForm({ source = "blog" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [stav, setStav] = useState<"" | "ok" | "err">("");
  const [busy, setBusy] = useState(false);

  async function odosli(e: FormEvent) {
    e.preventDefault();
    setStav(""); setMsg("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setStav("err"); setMsg("Zadajte platný e-mail."); return; }
    // okno otvoríme synchrónne (v rámci kliknutia), aby ho neblokoval popup blocker
    const w = window.open("", "_blank");
    setBusy(true); setMsg("Posielam…");
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), source }) });
      const d = await r.json();
      if (r.ok && d.pdf) {
        if (w) w.location.href = d.pdf;
        setStav("ok"); setMsg("Hotovo! Checklist sme otvorili v novom okne."); setEmail("");
      } else { if (w) w.close(); setStav("err"); setMsg(d.error || "Nepodarilo sa odoslať. Skúste znova."); }
    } catch { if (w) w.close(); setStav("err"); setMsg("Nepodarilo sa odoslať. Skúste znova."); }
    finally { setBusy(false); }
  }

  return (
    <div className="lead-magnet">
      <div className="lm-text">
        <h3>Checklist BOZP dokumentácie — zadarmo</h3>
        <p>Prehľad dokumentov, ktoré by mala mať každá firma. Nechajte e-mail a hneď vám ho zobrazíme ako PDF.</p>
      </div>
      <form className="lm-form" onSubmit={odosli} noValidate>
        <input type="email" placeholder="vas@email.sk" autoComplete="email" aria-label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Posielam…" : "Získať checklist"}</button>
        <div className={"lm-msg" + (stav ? " " + stav : "")} role="status">
          {msg}
          {stav === "ok" && <> Ak nie, <a href="/api/checklist" target="_blank" rel="noopener" style={{ color: "#8fe3b4", textDecoration: "underline" }}>otvorte ho tu</a>.</>}
        </div>
        <div className="lm-note">Pošleme vám len užitočné tipy k BOZP. Odhlásiť sa môžete kedykoľvek.</div>
      </form>
    </div>
  );
}
