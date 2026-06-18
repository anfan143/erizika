import type { ReactNode } from "react";
import { FIRMA, PRAVNE_AKTUALIZOVANE } from "@/lib/firma";

export function PravnaStranka({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className="hazard" />
      <header>
        <div className="head-inner">
          <a href="/" className="logo-mark" style={{ textDecoration: "none" }} title="Domov">HR</a>
          <div>
            <h1>e-rizika.sk</h1>
            <div className="head-sub">{title}</div>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 820 }}>
        <div className="card pravne">
          <h2 style={{ marginTop: 0 }}>{title}</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: -6 }}>
            Naposledy aktualizované: {PRAVNE_AKTUALIZOVANE}
          </p>
          {children}
          <hr style={{ border: "none", borderTop: "1px solid var(--line, #e5e7eb)", margin: "28px 0 16px" }} />
          <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            <a href="/podmienky" style={{ marginRight: 14 }}>Obchodné podmienky</a>
            <a href="/sukromie" style={{ marginRight: 14 }}>Ochrana osobných údajov</a>
            <a href="/odstupenie">Odstúpenie od zmluvy</a>
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            <a href="/">← Späť na úvod</a>
          </p>
        </div>
      </main>
    </>
  );
}

export function Prevadzkovatel() {
  return (
    <address style={{ fontStyle: "normal", lineHeight: 1.7 }}>
      <strong>{FIRMA.obchodneMeno}</strong>
      <br />
      Sídlo: {FIRMA.sidlo}
      <br />
      IČO: {FIRMA.ico} &nbsp;·&nbsp; DIČ: {FIRMA.dic}
      {FIRMA.platcaDPH && FIRMA.icDph ? (
        <>
          {" "}·&nbsp; IČ DPH: {FIRMA.icDph}
        </>
      ) : null}
      <br />
      {FIRMA.zapis}
      <br />
      Konateľ: {FIRMA.konatel}
      <br />
      E-mail: <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>
      {FIRMA.telefon ? (
        <>
          {" "}·&nbsp; Tel.: {FIRMA.telefon}
        </>
      ) : null}
      {!FIRMA.platcaDPH && (
        <>
          <br />
          <em>Prevádzkovateľ nie je platiteľom DPH. Uvedené ceny sú konečné.</em>
        </>
      )}
    </address>
  );
}
