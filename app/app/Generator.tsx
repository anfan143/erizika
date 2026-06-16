"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Neb = { nebezpecenstvo: string; ohrozenie: string; P: number; Z: number; opatrenia: string[]; oopp?: string[]; P2?: number; Z2?: number; predpisy?: string[] };
type Vysledok = { cinnost: string; nebezpecenstva: Neb[]; refs: number };
type Ctx = { firma: string; odvetvie: string; pozicia: string; prostredie: string; vypracoval: string };

const ODVETVIA = ["Stavebníctvo","Strojárstvo a kovovýroba","Skladovanie a logistika","Drevospracujúci priemysel","Potravinárstvo","Doprava","Poľnohospodárstvo","Energetika","Administratíva a služby","Zdravotníctvo","Obchod a maloobchod","Iné"];

function riskInfo(r: number) {
  if (r <= 4) return { label: "AKCEPTOVATEĽNÉ", color: "var(--green)" };
  if (r <= 9) return { label: "MIERNE", color: "var(--amber)" };
  if (r <= 15) return { label: "NEŽIADUCE", color: "var(--orange)" };
  return { label: "NEAKCEPTOVATEĽNÉ", color: "var(--red)" };
}
function pozadovaneKonanie(r: number) {
  if (r <= 4) return "Riziko akceptovať. Prehodnotiť pri zmene podmienok a v rámci periodickej aktualizácie.";
  if (r <= 9) return "Prijať navrhnuté opatrenia. Činnosť popísať v pracovnom postupe a zamestnancov s ním oboznámiť.";
  if (r <= 15) return "Bezodkladne prijať dočasné opatrenia a vypracovať plán zníženia rizika. Činnosť vykonávať so zvýšeným dohľadom.";
  return "Činnosť zastaviť, resp. nezačínať, kým nie sú prijaté opatrenia znižujúce riziko.";
}
const clamp = (v: any, d: number) => Math.min(5, Math.max(1, parseInt(v) || d));
const esc = (s: any) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function Generator({ email, plan, mode, maxCinnosti }: { email: string; plan: string; mode: "sub" | "project" | "free" | "none"; maxCinnosti: number }) {
  const [ctx, setCtx] = useState<Ctx>({ firma: "", odvetvie: ODVETVIA[0], pozicia: "", prostredie: "", vypracoval: "" });
  const [cinnostiText, setCinnostiText] = useState("");
  const [progress, setProgress] = useState<{ c: string; st: "wait" | "run" | "done" | "fail" }[]>([]);
  const [vysledky, setVysledky] = useState<Vysledok[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [hist, setHist] = useState<{ id: string; title: string; created_at: string }[]>([]);
  const locked = mode === "free";

  async function kupit(plan: string) {
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
      else setErr("Platobnú bránu sa nepodarilo otvoriť. Skúste to o chvíľu.");
    } catch { setErr("Platobnú bránu sa nepodarilo otvoriť. Skúste to o chvíľu."); }
  }

  const KupaPanel = ({ lead }: { lead: string }) => (
    <div className="unlock-note">
      <strong>{lead}</strong> Jednorazový projekt pokryje obmedzený počet činností (do 15) počas 14 dní; predplatné je bez limitov.
      <div className="kupa">
        <button className="btn btn-ghost" onClick={() => kupit("projekt")}>Projekt · 15 €</button>
        <button className="btn btn-ghost" onClick={() => kupit("mesacne")}>Mesačne · 19 €</button>
        <button className="btn btn-ghost" onClick={() => kupit("stvrtrok")}>3 mesiace · 51 €</button>
        <button className="btn btn-ghost" onClick={() => kupit("polrok")}>6 mesiacov · 90 €</button>
        <button className="btn btn-primary" onClick={() => kupit("rok")}>Rok · 99 €</button>
      </div>
    </div>
  );

  useEffect(() => { nacitajHistoriu(); }, []);
  async function nacitajHistoriu() {
    try { const r = await fetch("/api/dokumenty"); const d = await r.json(); setHist(d.documents ?? []); } catch {}
  }

  const set = (k: keyof Ctx) => (e: any) => setCtx({ ...ctx, [k]: e.target.value });

  async function generuj() {
    setErr("");
    const cinnosti = cinnostiText.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, Math.max(1, maxCinnosti));
    if (!cinnosti.length) { setErr("Zadajte aspoň jednu pracovnú činnosť — každú na samostatný riadok."); return; }
    setBusy(true);
    setVysledky([]);
    setProgress(cinnosti.map((c) => ({ c, st: "wait" })));
    const out: Vysledok[] = [];
    for (let i = 0; i < cinnosti.length; i++) {
      setProgress((p) => p.map((x, j) => (j === i ? { ...x, st: "run" } : x)));
      let ok = false;
      try {
        const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cinnost: cinnosti[i], ctx }) });
        if (r.status === 402) {
          const d402 = await r.json().catch(() => ({} as any));
          setErr(d402?.error === "project_limit"
            ? "V projekte už nie sú voľné činnosti. Kúpte si ďalší projekt alebo prejdite na predplatné."
            : "Vyčerpali ste dostupné hodnotenia. Vyberte si balík nižšie.");
          break;
        }
        const d = await r.json();
        if (r.ok && d.nebezpecenstva) { out.push({ cinnost: cinnosti[i], nebezpecenstva: d.nebezpecenstva, refs: d.refs ?? 0 }); ok = true; }
      } catch {}
      setProgress((p) => p.map((x, j) => (j === i ? { ...x, st: ok ? "done" : "fail" } : x)));
      setVysledky([...out]);
    }
    setBusy(false);
    if (out.length) {
      try {
        await fetch("/api/dokumenty", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: `${ctx.firma || "Hodnotenie rizík"} — ${ctx.pozicia || out[0].cinnost}`, payload: { ctx, vysledky: out } }) });
        nacitajHistoriu();
      } catch {}
    }
  }

  async function nacitajDokument(id: string) {
    try {
      const r = await fetch(`/api/dokumenty/${id}`);
      const d = await r.json();
      if (d.payload) {
        setCtx(d.payload.ctx); setVysledky(d.payload.vysledky); setProgress([]); setErr("");
        setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    } catch {}
  }

  async function odhlasit() {
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function exportDoc() {
    if (!vysledky.length) return;
    const dnes = new Date(); const dalsie = new Date(dnes); dalsie.setFullYear(dalsie.getFullYear() + 3);
    const meta = [ctx.firma, ctx.odvetvie, ctx.pozicia && "pozícia: " + ctx.pozicia, "dátum: " + dnes.toLocaleDateString("sk-SK"), ctx.vypracoval && "vypracoval: " + ctx.vypracoval].filter(Boolean).join("  ·  ");
    let body = `<h1 style="font-family:Arial">HODNOTENIE RIZÍK</h1>
    <p style="font-family:Arial;font-size:11pt">${esc(meta)}</p>
    <p style="font-family:Arial;font-size:10pt">Metodika: R = P × Z (5×5), východiskové riziko pred opatreniami a zostatkové riziko R₂ = P₂ × Z₂ po zavedení opatrení a OOPP. Kategórie: 1–4 akceptovateľné, 5–9 mierne, 10–15 nežiaduce, 16–25 neakceptovateľné.</p>
    <p style="font-family:Arial;font-size:9pt;color:#444"><b>Pojmy:</b> Nebezpečenstvo — stav alebo vlastnosť faktora pracovného procesu a pracovného prostredia, ktoré môžu poškodiť zdravie. Ohrozenie — situácia, v ktorej nemožno vylúčiť poškodenie zdravia. Zostatkové riziko — hodnota rizika po vykonaní opatrení.</p>
    <p style="font-family:Arial;font-size:9pt;color:#444"><b>Prehodnotenie:</b> Hodnotenie sa aktualizuje operatívne pri každej zmene pracovných podmienok, technológie alebo organizácie práce, po pracovnom úraze alebo závažnej skoronehode; periodicky najneskôr do troch rokov. Dátum ďalšieho periodického prehodnotenia: najneskôr ${dalsie.toLocaleDateString("sk-SK")}.</p>`;
    vysledky.forEach((item, idx) => {
      let maxR2 = 0;
      body += `<h2 style="font-family:Arial;font-size:13pt">${idx + 1}. ${esc(item.cinnost)}</h2>
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:Arial;font-size:9pt;width:100%">
      <tr style="background:#16212D;color:#fff"><th>Nebezpečenstvo</th><th>Ohrozenie</th><th>P</th><th>Z</th><th>R</th><th>Kategória</th><th>Opatrenia</th><th>Požadované OOPP</th><th>P₂</th><th>Z₂</th><th>R₂</th><th>Zostatkové riziko</th><th>Predpisy</th></tr>`;
      item.nebezpecenstva.forEach((n) => {
        const P = clamp(n.P, 3), Z = clamp(n.Z, 3), R = P * Z;
        let P2 = clamp(n.P2, Math.max(1, P - 1)), Z2 = clamp(n.Z2, Z);
        if (P2 * Z2 > R) { P2 = P; Z2 = Z; }
        const R2 = P2 * Z2; if (R2 > maxR2) maxR2 = R2;
        body += `<tr><td>${esc(n.nebezpecenstvo)}</td><td>${esc(n.ohrozenie)}</td>
        <td align="center">${P}</td><td align="center">${Z}</td><td align="center"><b>${R}</b></td><td>${riskInfo(R).label}</td>
        <td>${(n.opatrenia || []).map((o) => "• " + esc(o)).join("<br>")}</td>
        <td>${(n.oopp?.length ? n.oopp : ["—"]).map((o) => "• " + esc(o)).join("<br>")}</td>
        <td align="center">${P2}</td><td align="center">${Z2}</td><td align="center"><b>${R2}</b></td><td>${riskInfo(R2).label}</td>
        <td>${(n.predpisy || []).map(esc).join("<br>")}</td></tr>`;
      });
      body += `</table><p style="font-family:Arial;font-size:9.5pt"><b>Požadované konanie</b> (podľa najvyššieho zostatkového rizika R ${maxR2}): ${pozadovaneKonanie(maxR2)}</p>`;
    });
    body += `<p style="font-family:Arial;font-size:9pt;color:#555"><i>Tento dokument je podkladom pre posúdenie rizika a pred zaradením do dokumentácie BOZP ho musí preveriť a schváliť odborne spôsobilá osoba v zmysle zákona č. 124/2006 Z. z.</i></p>`;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"></head><body>${body}</body></html>`;
    const blob = new Blob(["\ufeff" + html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "hodnotenie-rizik.doc"; a.rel = "noopener"; a.style.display = "none";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  return (
    <>
      <div className="hazard" />
      <header>
        <div className="head-inner">
          <a href="/" className="logo-mark" style={{ textDecoration: "none" }} title="Domov">HR</a>
          <div><h1>Rizika</h1><div className="head-sub">Generátor hodnotenia rizík · § 6 zákona č. 124/2006 Z. z. · metodika 5×5</div></div>
          <div className="nav-links">
            <span className="plan-badge">{plan}</span>
            <span className="user-bar">{email}</span>
            <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }} onClick={odhlasit}>Odhlásiť</button>
          </div>
        </div>
      </header>
      <main>
        {mode === "none" && <KupaPanel lead="Vyčerpali ste dostupné hodnotenia." />}
        <div className="card">
          <div className="section-label">Vstupné údaje</div>
          <div className="grid">
            <div className="field"><label>Názov spoločnosti</label><input value={ctx.firma} onChange={set("firma")} placeholder="napr. STAVMONT s.r.o." /></div>
            <div className="field"><label>Odvetvie</label><select value={ctx.odvetvie} onChange={set("odvetvie")}>{ODVETVIA.map((o) => <option key={o}>{o}</option>)}</select></div>
            <div className="field"><label>Pracovná pozícia / profesia</label><input value={ctx.pozicia} onChange={set("pozicia")} placeholder="napr. murár, skladník, zvárač" /></div>
            <div className="field"><label>Vypracoval <span className="opt">(meno, funkcia)</span></label><input value={ctx.vypracoval} onChange={set("vypracoval")} placeholder="napr. Ing. Ján Novák, ABT" /></div>
            <div className="field full"><label>Pracovné činnosti <span className="opt">— každá na nový riadok (max. {maxCinnosti})</span></label>
              <textarea value={cinnostiText} onChange={(e) => setCinnostiText(e.target.value)} placeholder={"práca na lešení vo výške nad 1,5 m\nručná manipulácia s bremenami"} /></div>
            <div className="field full"><label>Špecifiká pracoviska <span className="opt">(nepovinné)</span></label>
              <textarea style={{ minHeight: 64 }} value={ctx.prostredie} onChange={set("prostredie")} placeholder="napr. práca v exteriéri, pohyb VZV na pracovisku, nočné zmeny..." /></div>
          </div>
          <div className="actions">
            <button className="btn btn-primary" onClick={generuj} disabled={busy || mode === "none"}>{busy ? "Generujem…" : "Vygenerovať hodnotenie rizík"}</button>
            {!busy && <span className="hint">Generovanie trvá približne 15 – 60 sekúnd podľa počtu činností. Dokument sa automaticky uloží do histórie.</span>}
          </div>
          {progress.length > 0 && (
            <div id="progress" style={{ display: "block" }}>
              {progress.map((p, i) => (
                <div className="prog-row" key={i}><span className={"dot " + (p.st === "run" ? "run" : p.st === "done" ? "done" : p.st === "fail" ? "fail" : "")} /><span>{p.c}</span></div>
              ))}
            </div>
          )}
          {err && <div className="error-box" style={{ display: "block" }}>{err}</div>}
        </div>

        {vysledky.length > 0 && (
          <div id="results" style={{ display: "block" }}>
            <div className="doc-head">
              <div>
                <div className="doc-title">Hodnotenie rizík</div>
                <div className="doc-meta">{[ctx.firma, ctx.odvetvie, ctx.pozicia && "pozícia: " + ctx.pozicia, "dátum: " + new Date().toLocaleDateString("sk-SK"), ctx.vypracoval && "vypracoval: " + ctx.vypracoval].filter(Boolean).join("  ·  ")}</div>
              </div>
              <div className="actions" style={{ margin: 0 }}>
                <button className="btn btn-ghost" onClick={exportDoc} disabled={locked} title={locked ? "Export odomknete predplatným alebo jednorazovým projektom" : undefined} style={locked ? { opacity: .55, cursor: "not-allowed" } : undefined}>Stiahnuť ako Word (.doc)</button>
                <button className="btn btn-ghost" onClick={() => window.print()}>Tlačiť / PDF</button>
              </div>
            </div>
            <div className="legend">
              <span style={{ background: "var(--green)" }}>R 1–4 · AKCEPTOVATEĽNÉ</span>
              <span style={{ background: "var(--amber)" }}>R 5–9 · MIERNE</span>
              <span style={{ background: "var(--orange)" }}>R 10–15 · NEŽIADUCE</span>
              <span style={{ background: "var(--red)" }}>R 16–25 · NEAKCEPTOVATEĽNÉ</span>
            </div>
            {vysledky.map((item, idx) => {
              let maxR2 = 0;
              const rows = item.nebezpecenstva.map((n, ri) => {
                const P = clamp(n.P, 3), Z = clamp(n.Z, 3), R = P * Z, info = riskInfo(R);
                let P2 = clamp(n.P2, Math.max(1, P - 1)), Z2 = clamp(n.Z2, Z);
                if (P2 * Z2 > R) { P2 = P; Z2 = Z; }
                const R2 = P2 * Z2, info2 = riskInfo(R2); if (R2 > maxR2) maxR2 = R2;
                return (
                  <tr key={ri}>
                    <td><strong>{n.nebezpecenstvo}</strong></td>
                    <td>{n.ohrozenie}</td>
                    <td style={{ textAlign: "center" }}><div className="pz">{P} × {Z}</div><span className="risk-chip" style={{ background: info.color }}>R {R}</span><div className="chip-sub">{info.label}</div></td>
                    <td><ul>{(n.opatrenia || []).map((o, i) => <li key={i}>{o}</li>)}</ul></td>
                    <td><ul>{(n.oopp?.length ? n.oopp : ["—"]).map((o, i) => <li key={i}>{o}</li>)}</ul></td>
                    <td style={{ textAlign: "center" }}><div className="pz">{P2} × {Z2}</div><span className="risk-chip" style={{ background: info2.color }}>R {R2}</span><div className="chip-sub">{info2.label}</div></td>
                    <td className={"predpisy" + (locked ? " locked" : "")}>{(n.predpisy || []).map((p, i) => <span key={i}>{p}<br /></span>)}</td>
                  </tr>
                );
              });
              return (
                <div className="activity-card" key={idx}>
                  <div className="activity-head"><span className="num">{String(idx + 1).padStart(2, "0")}</span>{item.cinnost}{item.refs > 0 && <span className="lib-badge" title={`Generované s oporou ${item.refs} overených záznamov z praxe`}>KNIŽNICA · {item.refs}</span>}</div>
                  <div style={{ overflowX: "auto" }}>
                    <table>
                      <thead><tr>
                        <th style={{ width: "14%" }}>Nebezpečenstvo</th><th style={{ width: "17%" }}>Ohrozenie</th>
                        <th style={{ width: "10%" }}>Riziko pred opatreniami</th><th style={{ width: "23%" }}>Opatrenia</th>
                        <th style={{ width: "15%" }}>Požadované OOPP</th><th style={{ width: "10%" }}>Zostatkové riziko</th>
                        <th style={{ width: "11%" }}>Predpisy</th>
                      </tr></thead>
                      <tbody>{rows}</tbody>
                    </table>
                  </div>
                  <div className={"konanie" + (locked ? " locked" : "")}><strong>Požadované konanie</strong> (podľa najvyššieho zostatkového rizika R {maxR2}): {pozadovaneKonanie(maxR2)}</div>
                </div>
              );
            })}
            <div className="disclaimer"><strong>Upozornenie:</strong> Tento dokument je podkladom pre posúdenie rizika. Pred zaradením do dokumentácie BOZP ho musí preveriť a schváliť odborne spôsobilá osoba (bezpečnostný technik) v zmysle zákona č. 124/2006 Z. z.</div>
            {locked && <KupaPanel lead="Páči sa vám výsledok? Predpisy, požadované konanie a export do Wordu odomknete jedným z balíkov." />}
          </div>
        )}

        {hist.length > 0 && (
          <div className="card hist">
            <div className="section-label">História dokumentov</div>
            {hist.map((h) => (
              <div className="hist-row" key={h.id}>
                <span style={{ flex: 1 }}>{h.title}</span>
                <span className="user-bar">{new Date(h.created_at).toLocaleDateString("sk-SK")}</span>
                <button className="btn btn-ghost" onClick={() => nacitajDokument(h.id)}>Načítať</button>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer>Metodika R = P × Z (5×5) · knižnica overených rizík z praxe · obsah generovaný AI s nastavenými pravidlami</footer>
    </>
  );
}
