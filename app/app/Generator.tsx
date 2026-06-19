"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { track } from "@vercel/analytics";

type Neb = { nebezpecenstvo: string; ohrozenie: string; P: number; Z: number; opatrenia: string[]; oopp?: string[]; P2?: number; Z2?: number; predpisy?: string[] };
type Vysledok = { cinnost: string; nebezpecenstva: Neb[]; refs: number };
type Ctx = { firma: string; odvetvie: string; pozicia: string; prostredie: string; vypracoval: string };
type Tab = "prehlad" | "hodnotenie" | "historia" | "profil";

const ODVETVIA = ["Stavebníctvo","Strojárstvo a kovovýroba","Skladovanie a logistika","Drevospracujúci priemysel","Potravinárstvo","Doprava","Poľnohospodárstvo","Energetika","Administratíva a služby","Zdravotníctvo","Obchod a maloobchod","Iné"];

function riskInfo(r: number) {
  if (r <= 4) return { label: "AKCEPTOVATEĽNÉ", color: "var(--green)" };
  if (r <= 9) return { label: "MIERNE", color: "var(--amber)" };
  if (r <= 15) return { label: "NEŽIADUCE", color: "var(--orange)" };
  return { label: "NEAKCEPTOVATEĽNÉ", color: "var(--red)" };
}
// pevné hex farby pre výstupy (PDF/Word) — CSS premenné tam nefungujú
function riskHex(r: number) {
  if (r <= 4) return "#1E8E5A";
  if (r <= 9) return "#E09B00";
  if (r <= 15) return "#D96B1F";
  return "#C2382A";
}
function pozadovaneKonanie(r: number) {
  if (r <= 4) return "Riziko akceptovať. Prehodnotiť pri zmene podmienok a v rámci periodickej aktualizácie.";
  if (r <= 9) return "Prijať navrhnuté opatrenia. Činnosť popísať v pracovnom postupe a zamestnancov s ním oboznámiť.";
  if (r <= 15) return "Bezodkladne prijať dočasné opatrenia a vypracovať plán zníženia rizika. Činnosť vykonávať so zvýšeným dohľadom.";
  return "Činnosť zastaviť, resp. nezačínať, kým nie sú prijaté opatrenia znižujúce riziko.";
}
const clamp = (v: any, d: number) => Math.min(5, Math.max(1, parseInt(v) || d));
const esc = (s: any) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function Generator({ email, plan, mode, maxCinnosti, justPaid, hasCustomer }: { email: string; plan: string; mode: "sub" | "project" | "free" | "none"; maxCinnosti: number; justPaid?: boolean; hasCustomer?: boolean }) {
  const [tab, setTab] = useState<Tab>("prehlad");
  const [ctx, setCtx] = useState<Ctx>({ firma: "", odvetvie: ODVETVIA[0], pozicia: "", prostredie: "", vypracoval: "" });
  const [cinnostiText, setCinnostiText] = useState("");
  const [progress, setProgress] = useState<{ c: string; st: "wait" | "run" | "done" | "fail" }[]>([]);
  const [vysledky, setVysledky] = useState<Vysledok[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [hist, setHist] = useState<{ id: string; title: string; created_at: string }[]>([]);
  const [newPass, setNewPass] = useState("");
  const [profilMsg, setProfilMsg] = useState("");
  const [profilErr, setProfilErr] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [platbaSuhlas, setPlatbaSuhlas] = useState(false);
  const [suhlasChyba, setSuhlasChyba] = useState(false);
  const wordLocked = mode === "free";

  async function kupit(plan: string) {
    if (!platbaSuhlas) { setSuhlasChyba(true); return; }
    setSuhlasChyba(false);
    track("platba_klik", { plan });
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
      else setErr("Platobnú bránu sa nepodarilo otvoriť. Skúste to o chvíľu.");
    } catch { setErr("Platobnú bránu sa nepodarilo otvoriť. Skúste to o chvíľu."); }
  }

  async function spravujPredplatne() {
    setErr(""); setProfilErr("");
    try {
      const r = await fetch("/api/billing-portal", { method: "POST" });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
      else setProfilErr("Správu platieb sa nepodarilo otvoriť. Skúste to o chvíľu.");
    } catch { setProfilErr("Správu platieb sa nepodarilo otvoriť. Skúste to o chvíľu."); }
  }

  async function zmenHeslo() {
    setProfilErr(""); setProfilMsg("");
    if (newPass.length < 6) { setProfilErr("Heslo musí mať aspoň 6 znakov."); return; }
    try {
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) throw error;
      setNewPass(""); setProfilMsg("Heslo bolo zmenené.");
    } catch { setProfilErr("Zmena hesla zlyhala. Skúste to znova."); }
  }

  const KupaPanel = ({ lead }: { lead: string }) => (
    <div className="unlock-note">
      <strong>{lead}</strong> Jednorazový projekt pokryje obmedzený počet činností (do 15) počas 14 dní; predplatné je bez limitov.
      <div className="kupa-value">Odomknete export do <strong>Wordu bez vodoznaku</strong> a viac pracovných činností v jednom dokumente.</div>
      <label className={"suhlas" + (suhlasChyba ? " suhlas-chyba" : "")}>
        <input type="checkbox" checked={platbaSuhlas} onChange={(e) => { setPlatbaSuhlas(e.target.checked); if (e.target.checked) setSuhlasChyba(false); }} />
        <span>Súhlasím s <a href="/podmienky" target="_blank" rel="noopener">obchodnými podmienkami</a> a so začatím poskytovania služby pred uplynutím lehoty na odstúpenie. Beriem na vedomie, že začatím používania <a href="/odstupenie" target="_blank" rel="noopener">strácam právo na odstúpenie od zmluvy</a>.</span>
      </label>
      {suhlasChyba && (
        <div className="suhlas-hint">↑ Najprv zaškrtnite súhlas s podmienkami, potom môžete pokračovať k platbe.</div>
      )}
      <div className="kupa">
        <button className="btn btn-ghost" onClick={() => kupit("projekt")}>Projekt · 15 €</button>
        <button className="btn btn-ghost" onClick={() => kupit("mesacne")}>Mesačne · 19 €</button>
        <button className="btn btn-ghost" onClick={() => kupit("stvrtrok")}>3 mesiace · 49 €</button>
        <button className="btn btn-ghost" onClick={() => kupit("polrok")}>6 mesiacov · 79 €</button>
        <button className="btn btn-primary" onClick={() => kupit("rok")}>Rok · 99 €</button>
      </div>
      <div className="kupa-trust">🔒 Bezpečná platba cez Stripe · 🧾 Faktúra na e-mail · ✅ Zrušíte kedykoľvek</div>
    </div>
  );

  useEffect(() => { nacitajHistoriu(); }, []);

  // Po platbe sa prístup aktivuje cez webhook (asynchrónne). Kým mode ešte nie je
  // aktívny, párkrát stránku obnovíme, nech zákazník nevidí „žiadny balík".
  const aktivny = mode === "sub" || mode === "project";
  // Úspešnú platbu zaznamenáme len raz (stránka sa počas aktivácie párkrát obnoví).
  useEffect(() => {
    if (justPaid && !sessionStorage.getItem("platbaTracked")) {
      sessionStorage.setItem("platbaTracked", "1");
      track("platba_ok", { plan });
    }
  }, [justPaid, plan]);
  useEffect(() => {
    if (!justPaid) return;
    if (aktivny) { sessionStorage.removeItem("platbaRetries"); return; }
    const n = Number(sessionStorage.getItem("platbaRetries") || "0");
    if (n >= 5) return;
    sessionStorage.setItem("platbaRetries", String(n + 1));
    const t = setTimeout(() => location.reload(), 3500);
    return () => clearTimeout(t);
  }, [justPaid, aktivny]);

  async function nacitajHistoriu() {
    try { const r = await fetch("/api/dokumenty"); const d = await r.json(); setHist(d.documents ?? []); } catch {}
  }

  const set = (k: keyof Ctx) => (e: any) => setCtx({ ...ctx, [k]: e.target.value });

  function vyplnPriklad() {
    setCtx({
      ...ctx,
      firma: ctx.firma || "Ukážková firma s. r. o.",
      odvetvie: "Stavebníctvo",
      pozicia: "Murár",
      prostredie: "Práca na stavenisku, lešenie, pohyb mechanizmov a vozidiel.",
    });
    setCinnostiText("Murárske práce na lešení vo výške nad 1,5 m\nRučná manipulácia s bremenami\nPráca s ručným elektrickým náradím");
    setErr("");
    track("priklad_vyplneny");
  }

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
          track("paywall", { dovod: d402?.error || "limit" });
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
      track("generovanie", { pocet: out.length });
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
        setTab("hodnotenie");
        setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    } catch {}
  }

  async function odhlasit() {
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // Spoločný obsah dokumentu (meta, tabuľky, podpis, poznámky) — pre Word aj PDF.
  function docBody() {
    const dnes = new Date(); const dalsie = new Date(dnes); dalsie.setFullYear(dalsie.getFullYear() + 3);
    const vyprac = esc(ctx.vypracoval) || "______________________";
    let body = `<div class="title">HODNOTENIE RIZÍK</div>
    <table class="meta">
      <tr><td class="k">Spoločnosť</td><td>${esc(ctx.firma) || "—"}</td><td class="k">Dátum vyhotovenia</td><td>${dnes.toLocaleDateString("sk-SK")}</td></tr>
      <tr><td class="k">Odvetvie</td><td>${esc(ctx.odvetvie) || "—"}</td><td class="k">Pracovná pozícia</td><td>${esc(ctx.pozicia) || "—"}</td></tr>
      ${ctx.prostredie ? `<tr><td class="k">Špecifiká pracoviska</td><td colspan="3">${esc(ctx.prostredie)}</td></tr>` : ""}
    </table>
    <div class="legend">
      <span bgcolor="#1E8E5A" style="background:#1E8E5A">R 1–4 · AKCEPTOVATEĽNÉ</span>
      <span bgcolor="#E09B00" style="background:#E09B00">R 5–9 · MIERNE</span>
      <span bgcolor="#D96B1F" style="background:#D96B1F">R 10–15 · NEŽIADUCE</span>
      <span bgcolor="#C2382A" style="background:#C2382A">R 16–25 · NEAKCEPTOVATEĽNÉ</span>
    </div>`;
    vysledky.forEach((item, idx) => {
      let maxR2 = 0; let rows = "";
      item.nebezpecenstva.forEach((n) => {
        const P = clamp(n.P, 3), Z = clamp(n.Z, 3), R = P * Z;
        let P2 = clamp(n.P2, Math.max(1, P - 1)), Z2 = clamp(n.Z2, Z);
        if (P2 * Z2 > R) { P2 = P; Z2 = Z; }
        const R2 = P2 * Z2; if (R2 > maxR2) maxR2 = R2;
        const cR = riskHex(R), cR2 = riskHex(R2);
        rows += `<tr><td class="haz"><b>${esc(n.nebezpecenstvo)}</b></td><td>${esc(n.ohrozenie)}</td>
        <td class="c">${P}</td><td class="c">${Z}</td><td class="c rcell" bgcolor="${cR}" style="background:${cR}">${R}</td><td class="cat" style="color:${cR}">${riskInfo(R).label}</td>
        <td>${(n.opatrenia || []).map((o) => "• " + esc(o)).join("<br>")}</td>
        <td>${(n.oopp?.length ? n.oopp : ["—"]).map((o) => "• " + esc(o)).join("<br>")}</td>
        <td class="c">${P2}</td><td class="c">${Z2}</td><td class="c rcell" bgcolor="${cR2}" style="background:${cR2}">${R2}</td><td class="cat" style="color:${cR2}">${riskInfo(R2).label}</td>
        <td class="sm">${(n.predpisy || []).map(esc).join("<br>")}</td></tr>`;
      });
      const cMax = riskHex(maxR2);
      body += `<div class="act"><span class="actnum">${idx + 1}</span>${esc(item.cinnost)}</div>
      <table class="rt"><thead><tr>
        <th style="width:11%">Nebezpečenstvo</th><th style="width:14%">Ohrozenie</th><th class="c" style="width:3%">P</th><th class="c" style="width:3%">Z</th><th class="c" style="width:4%">R</th><th style="width:8%">Kategória</th><th style="width:20%">Opatrenia</th><th style="width:13%">Požadované OOPP</th><th class="c" style="width:3%">P₂</th><th class="c" style="width:3%">Z₂</th><th class="c" style="width:4%">R₂</th><th style="width:8%">Zostatkové riziko</th><th style="width:6%">Predpisy</th>
      </tr></thead><tbody>${rows}</tbody></table>
      <p class="konanie"><b style="color:${cMax}">Požadované konanie</b> (podľa najvyššieho zostatkového rizika R ${maxR2}): ${pozadovaneKonanie(maxR2)}</p>`;
    });
    body += `<table class="sign"><tr>
      <td>Vypracoval: <b>${vyprac}</b></td><td>Dátum: ${dnes.toLocaleDateString("sk-SK")}</td><td>Podpis: ______________________</td>
    </tr></table>
    <div class="fine">
      <p><b>Metodika:</b> R = P × Z (5×5). Východiskové riziko pred opatreniami a zostatkové riziko R₂ = P₂ × Z₂ po zavedení opatrení a OOPP. Kategórie: 1–4 akceptovateľné, 5–9 mierne, 10–15 nežiaduce, 16–25 neakceptovateľné.</p>
      <p><b>Pojmy:</b> Nebezpečenstvo — stav alebo vlastnosť faktora pracovného procesu a pracovného prostredia, ktoré môžu poškodiť zdravie. Ohrozenie — situácia, v ktorej nemožno vylúčiť poškodenie zdravia. Zostatkové riziko — hodnota rizika po vykonaní opatrení.</p>
      <p><b>Prehodnotenie:</b> Hodnotenie sa aktualizuje pri každej zmene pracovných podmienok, technológie alebo organizácie práce, po pracovnom úraze alebo závažnej skoronehode; periodicky najneskôr do troch rokov — najneskôr do ${dalsie.toLocaleDateString("sk-SK")}.</p>
      <p class="disc">Tento dokument je podkladom pre posúdenie rizika; pred zaradením do dokumentácie BOZP ho musí preveriť a schváliť odborne spôsobilá osoba (bezpečnostný technik) v zmysle zákona č. 124/2006 Z. z.</p>
    </div>`;
    return body;
  }

  function exportDoc() {
    if (!vysledky.length || wordLocked) return;
    const style = `@page Section1{size:841.95pt 595.35pt;mso-page-orientation:landscape;margin:1.3cm}div.Section1{page:Section1}
      body{font-family:Calibri,Arial,sans-serif;font-size:9pt;color:#1b1b1b}
      .title{font-size:18pt;font-weight:bold;color:#16212D;border-bottom:3pt solid #F5B700;padding-bottom:4pt;margin-bottom:10pt;letter-spacing:.5pt}
      table{border-collapse:collapse;width:100%}
      table.meta{margin-bottom:9pt}
      table.meta td{border:.5pt solid #cfcfcf;padding:4pt 8pt;font-size:9.5pt}
      table.meta td.k{background:#eef2f6;font-weight:bold;width:14%;color:#16212D}
      .legend{margin:0 0 11pt}
      .legend span{color:#fff;font-weight:bold;font-size:8.5pt;padding:3pt 9pt;margin-right:5pt}
      .act{background:#16212D;color:#fff;font-size:11.5pt;font-weight:bold;padding:5pt 9pt}
      .actnum{background:#F5B700;color:#16212D;font-weight:bold;padding:1pt 6pt;margin-right:7pt}
      table.rt th{background:#243345;color:#fff;font-size:8pt;padding:4pt 5pt;border:.5pt solid #243345;text-align:left}
      table.rt td{border:.5pt solid #c8c8c8;padding:4pt 6pt;vertical-align:top;font-size:8.5pt}
      td.c{text-align:center}td.rcell{color:#fff;font-weight:bold;text-align:center;font-size:10pt}td.cat{font-weight:bold;font-size:8pt}td.sm{font-size:7.5pt;color:#555}td.haz{border-left:2.5pt solid #F5B700}
      .konanie{font-size:9pt;background:#fbf7ea;border-left:3pt solid #F5B700;padding:5pt 9pt;margin:0 0 4pt}
      table.sign{margin-top:16pt}table.sign td{border:none;padding:5pt 8pt;font-size:9.5pt}
      .fine{margin-top:12pt;font-size:7.5pt;color:#666}.fine p{margin:0 0 3pt}.disc{font-style:italic}`;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>${style}</style></head><body><div class="Section1">${docBody()}</div></body></html>`;
    const blob = new Blob(["﻿" + html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "hodnotenie-rizik.doc"; a.rel = "noopener"; a.style.display = "none";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  async function stiahniPdf() {
    if (!vysledky.length || pdfBusy) return;
    setErr(""); setPdfBusy(true);
    try {
      const r = await fetch("/api/pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ctx, vysledky }) });
      if (!r.ok) { setErr("PDF sa nepodarilo vytvoriť. Skúste to o chvíľu."); return; }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "hodnotenie-rizik.pdf"; a.rel = "noopener"; a.style.display = "none";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch { setErr("PDF sa nepodarilo vytvoriť. Skúste to o chvíľu."); }
    finally { setPdfBusy(false); }
  }

  return (
    <>
      <div className="hazard" />
      <div className="tool-deco" aria-hidden="true">
        <svg className="d1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 L22 20 L2 20 Z" /><path d="M12 9 v5" /><circle cx="12" cy="17.4" r="0.7" fill="currentColor" stroke="none" /></svg>
        <svg className="d2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 17 a9 9 0 0 1 18 0" /><path d="M2 17 h20" /><path d="M10 8 v-2 h4 v2" /></svg>
        <svg className="d3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 3 h6" /><path d="M10 3 v6 L5 19 a1 1 0 0 0 1 1 h12 a1 1 0 0 0 1 -1 L14 9 V3" /><path d="M7.5 15 h9" /></svg>
        <svg className="d4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2 v3 M12 19 v3 M2 12 h3 M19 12 h3 M5 5 l2 2 M17 17 l2 2 M19 5 l-2 2 M7 17 l-2 2" /></svg>
        <svg className="d5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 L4 14 h6 l-1 8 L20 10 h-6 Z" /></svg>
        <svg className="d6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M6 8 h12 M6 16 h12" /></svg>
      </div>
      <header>
        <div className="head-inner">
          <button onClick={() => setTab("prehlad")} className="logo-mark" style={{ border: "none", cursor: "pointer" }} title="Domov">HR</button>
          <div><h1>e-rizika.sk</h1><div className="head-sub">Vaša pracovná plocha · § 6 zákona č. 124/2006 Z. z. · metodika 5×5</div></div>
          <div className="nav-links">
            <span className="plan-badge">{plan}</span>
            <span className="user-bar">{email}</span>
            <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }} onClick={odhlasit}>Odhlásiť</button>
          </div>
        </div>
        <nav className="app-tabs">
          <button className={"tab" + (tab === "prehlad" ? " on" : "")} onClick={() => setTab("prehlad")}>Domov</button>
          <button className={"tab" + (tab === "hodnotenie" ? " on" : "")} onClick={() => setTab("hodnotenie")}>Hodnotenie rizík</button>
          <button className={"tab" + (tab === "historia" ? " on" : "")} onClick={() => setTab("historia")}>História{hist.length > 0 ? ` · ${hist.length}` : ""}</button>
          <button className={"tab" + (tab === "profil" ? " on" : "")} onClick={() => setTab("profil")}>Profil</button>
        </nav>
      </header>

      <main>
        {justPaid && aktivny && (
          <div className="unlock-note" style={{ borderLeftColor: "var(--green)" }}>
            <strong>Platba prebehla — prístup je aktívny.</strong> Ďakujeme! Môžete generovať.
          </div>
        )}
        {justPaid && !aktivny && (
          <div className="unlock-note">
            <strong>Ďakujeme za platbu — aktivujeme váš prístup…</strong> Chvíľu strpenia, stránka sa o sekundu sama obnoví. Ak by sa prístup neaktivoval, obnovte ju ručne (F5).
          </div>
        )}

        {tab === "prehlad" && (
          <>
            <div className="dash-hero card">
              <div className="dash-hero-in">
                <div className="section-label">Vaša pracovná plocha</div>
                <h2 className="dash-title">{hist.length === 0 ? "Vitajte v e-rizika.sk 👋" : "Vitajte späť 👋"}</h2>
                <p className="dash-sub">{hist.length === 0
                  ? "Vytvorte svoje prvé hodnotenie rizík — stačí zadať pracovné činnosti, dokument pripravíme my."
                  : <>Aktuálny balík: <strong>{plan}</strong>{mode === "free" ? " — prvé hodnotenie máte zadarmo." : ""}</>}</p>
                <div className="dash-cta">
                  <button className="btn btn-primary" onClick={() => setTab("hodnotenie")}>+ Vytvoriť nové hodnotenie rizík</button>
                  {(mode === "free" || mode === "none") && (
                    <button className="btn btn-ghost" onClick={() => setTab("hodnotenie")}>Pozrieť balíky</button>
                  )}
                </div>
              </div>
              <div className="dash-mx" aria-hidden="true">
                {[5, 4, 3, 2, 1].flatMap((z) => [1, 2, 3, 4, 5].map((p) => (
                  <i key={`${z}-${p}`} style={{ background: riskHex(p * z) }} />
                )))}
                <div className="dash-mx-cap">Matica rizík · R = P × Z</div>
              </div>
            </div>

            <div className="dash-stats">
              <div className="stat-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6 M8 13h8 M8 17h8" /></svg>
                <div><b>{hist.length}</b><span>vytvorených dokumentov</span></div>
              </div>
              <div className="stat-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 0-5 5v3H5a8 8 0 0 1 14 0h-2V7a5 5 0 0 0-5-5z M3 13h18v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                <div><b>{plan}</b><span>aktuálny balík</span></div>
              </div>
              <div className="stat-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                <div><b>{maxCinnosti}</b><span>činností na dokument</span></div>
              </div>
            </div>

            <div className="card dash-recent">
              <div className="section-label">Posledné dokumenty</div>
              {hist.length === 0 ? (
                <p className="hint">Zatiaľ nemáte žiadne hodnotenia. Kliknite na <strong>„Vytvoriť nové hodnotenie rizík"</strong> a prvý dokument sa uloží sem.</p>
              ) : (
                <>
                  {hist.slice(0, 5).map((h) => (
                    <div className="hist-row" key={h.id}>
                      <span style={{ flex: 1 }}>{h.title}</span>
                      <span className="user-bar">{new Date(h.created_at).toLocaleDateString("sk-SK")}</span>
                      <button className="btn btn-ghost" onClick={() => nacitajDokument(h.id)}>Načítať</button>
                    </div>
                  ))}
                  {hist.length > 5 && (
                    <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => setTab("historia")}>Zobraziť celú históriu ({hist.length}) →</button>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {tab === "hodnotenie" && (
          <>
            {mode === "none" && <KupaPanel lead="Vyčerpali ste dostupné hodnotenia." />}
            {hist.length === 0 && mode !== "none" && (
              <div className="onboard-hint">
                <strong>Ako na to:</strong> zadajte aspoň jednu pracovnú činnosť (každú na nový riadok) a stlačte <em>Vygenerovať</em>. Stačí činnosti — ostatné polia sú nepovinné. Neviete kde začať? Kliknite na <strong>„Vyplniť ukážkový príklad"</strong>.
              </div>
            )}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div className="section-label" style={{ marginBottom: 0 }}>Vstupné údaje</div>
                <button className="btn btn-ghost" style={{ padding: "7px 13px", fontSize: 12.5 }} onClick={vyplnPriklad}>✨ Vyplniť ukážkový príklad</button>
              </div>
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
                    <button className="btn btn-primary" onClick={stiahniPdf} disabled={pdfBusy}>{pdfBusy ? "Pripravujem PDF…" : "Stiahnuť PDF"}</button>
                    <button className="btn btn-ghost" onClick={exportDoc} disabled={wordLocked} title={wordLocked ? "Editovateľný Word bez vodoznaku odomknete kúpou balíka" : undefined} style={wordLocked ? { opacity: .55, cursor: "not-allowed" } : undefined}>Stiahnuť Word (.doc){wordLocked ? " 🔒" : ""}</button>
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
                        <td className="predpisy">{(n.predpisy || []).map((p, i) => <span key={i}>{p}<br /></span>)}</td>
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
                      <div className="konanie"><strong>Požadované konanie</strong> (podľa najvyššieho zostatkového rizika R {maxR2}): {pozadovaneKonanie(maxR2)}</div>
                    </div>
                  );
                })}
                <div className="disclaimer"><strong>Upozornenie:</strong> Tento dokument je podkladom pre posúdenie rizika. Pred zaradením do dokumentácie BOZP ho musí preveriť a schváliť odborne spôsobilá osoba (bezpečnostný technik) v zmysle zákona č. 124/2006 Z. z.</div>
                {mode === "free" && <KupaPanel lead="Páči sa vám výsledok? Stiahnite si ho zadarmo ako PDF (s vodoznakom). Editovateľný Word bez vodoznaku získate kúpou balíka." />}
              </div>
            )}
          </>
        )}

        {tab === "historia" && (
          <div className="card">
            <div className="section-label">História dokumentov</div>
            {hist.length === 0 ? (
              <p className="hint">Zatiaľ nemáte uložené žiadne hodnotenia. Vytvorte prvé v záložke „Hodnotenie rizík" — uloží sa sem automaticky.</p>
            ) : (
              hist.map((h) => (
                <div className="hist-row" key={h.id}>
                  <span style={{ flex: 1 }}>{h.title}</span>
                  <span className="user-bar">{new Date(h.created_at).toLocaleDateString("sk-SK")}</span>
                  <button className="btn btn-ghost" onClick={() => nacitajDokument(h.id)}>Načítať</button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "profil" && (
          <>
            <div className="card">
              <div className="section-label">Účet</div>
              <div className="field"><label>E-mailová adresa</label><input value={email} disabled style={{ opacity: .7, cursor: "not-allowed" }} /></div>
              <p style={{ fontSize: 14, margin: "12px 0 0" }}><strong>Stav balíka:</strong> {plan}</p>
            </div>

            <div className="card" style={{ marginTop: 18 }}>
              <div className="section-label">Zmena hesla</div>
              <div className="field"><label htmlFor="np">Nové heslo</label>
                <input id="np" type="password" autoComplete="new-password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="aspoň 6 znakov" /></div>
              <div className="actions"><button className="btn btn-ghost" onClick={zmenHeslo}>Uložiť nové heslo</button></div>
              {profilMsg && <div style={{ display: "block", marginTop: 14, border: "1px solid var(--green)", borderRadius: 8, padding: "10px 14px", fontSize: 13.5, background: "#F0FAF4", color: "var(--green)" }}>{profilMsg}</div>}
              {profilErr && <div className="error-box" style={{ display: "block" }}>{profilErr}</div>}
            </div>

            <div className="card" style={{ marginTop: 18 }}>
              <div className="section-label">Platby a predplatné</div>
              {hasCustomer ? (
                <>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 14 }}>V správe platieb vidíte históriu platieb a faktúry, môžete zmeniť platobnú kartu alebo zrušiť predplatné.</p>
                  <button className="btn btn-primary" onClick={spravujPredplatne}>Spravovať platby a predplatné</button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 14 }}>Zatiaľ nemáte žiadnu platbu. Vyberte si balík a po prvej platbe tu uvidíte správu platieb, faktúry aj predplatné.</p>
                  <KupaPanel lead="Vyberte si balík:" />
                </>
              )}
            </div>
          </>
        )}
      </main>
      <footer>Metodika R = P × Z (5×5) · knižnica overených rizík z praxe a od profesionálov · nástroj na tvorbu hodnotenia rizík</footer>
    </>
  );
}
