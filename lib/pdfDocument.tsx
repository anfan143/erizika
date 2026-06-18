import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";

// Font so slovenskou diakritikou (DejaVu Sans pokrýva celú latinku vrátane č,š,ž,ť,ô,ľ…)
Font.register({
  family: "DejaVu",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf" },
    { src: "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf", fontWeight: "bold" },
  ],
});
Font.registerHyphenationCallback((w) => [w]);

const GREEN = "#1E8E5A", AMBER = "#E09B00", ORANGE = "#D96B1F", RED = "#C2382A", INK = "#16212D", INK2 = "#243345", SAFETY = "#F5B700", LINE = "#d0d0d0";
const hex = (r: number) => (r <= 4 ? GREEN : r <= 9 ? AMBER : r <= 15 ? ORANGE : RED);
const label = (r: number) => (r <= 4 ? "AKCEPTOVATEĽNÉ" : r <= 9 ? "MIERNE" : r <= 15 ? "NEŽIADUCE" : "NEAKCEPTOVATEĽNÉ");
const konanie = (r: number) =>
  r <= 4 ? "Riziko akceptovať. Prehodnotiť pri zmene podmienok a v rámci periodickej aktualizácie."
    : r <= 9 ? "Prijať navrhnuté opatrenia. Činnosť popísať v pracovnom postupe a zamestnancov s ním oboznámiť."
      : r <= 15 ? "Bezodkladne prijať dočasné opatrenia a vypracovať plán zníženia rizika. Činnosť vykonávať so zvýšeným dohľadom."
        : "Činnosť zastaviť, resp. nezačínať, kým nie sú prijaté opatrenia znižujúce riziko.";
const clamp = (v: any, d: number) => Math.min(5, Math.max(1, parseInt(v) || d));

// šírky 13 stĺpcov v % (súčet 100)
const W = [11, 14, 3.5, 3.5, 4.5, 8.5, 19, 12.5, 3.5, 3.5, 4.5, 8.5, 5.5];

const st = StyleSheet.create({
  page: { fontFamily: "DejaVu", fontSize: 7.5, color: "#1b1b1b", paddingTop: 24, paddingBottom: 30, paddingHorizontal: 22 },
  title: { fontSize: 16, fontWeight: "bold", color: INK, borderBottomWidth: 2.5, borderBottomColor: SAFETY, paddingBottom: 5, marginBottom: 10 },
  metaRow: { flexDirection: "row" },
  metaK: { width: "14%", backgroundColor: "#eef2f6", color: INK, fontWeight: "bold", borderWidth: 0.5, borderColor: "#cfcfcf", padding: 4, fontSize: 8 },
  metaV: { width: "36%", borderWidth: 0.5, borderColor: "#cfcfcf", padding: 4, fontSize: 8 },
  metaVfull: { width: "86%", borderWidth: 0.5, borderColor: "#cfcfcf", padding: 4, fontSize: 8 },
  legend: { flexDirection: "row", marginTop: 10, marginBottom: 12 },
  legBox: { color: "#fff", fontWeight: "bold", fontSize: 7.5, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 3, marginRight: 6 },
  act: { flexDirection: "row", alignItems: "center", backgroundColor: INK, paddingVertical: 5, paddingHorizontal: 9, marginTop: 10 },
  actNum: { backgroundColor: SAFETY, color: INK, fontWeight: "bold", fontSize: 9, paddingVertical: 1, paddingHorizontal: 6, marginRight: 8 },
  actName: { color: "#fff", fontWeight: "bold", fontSize: 11 },
  thRow: { flexDirection: "row", backgroundColor: INK2, borderBottomWidth: 0.5, borderBottomColor: INK2 },
  th: { color: "#fff", fontWeight: "bold", fontSize: 6.6, paddingVertical: 4, paddingHorizontal: 3, borderRightWidth: 0.5, borderRightColor: "#3a4c60" },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: LINE, borderLeftWidth: 0.5, borderLeftColor: LINE },
  td: { paddingVertical: 3, paddingHorizontal: 3, fontSize: 7, borderRightWidth: 0.5, borderRightColor: LINE },
  konanie: { backgroundColor: "#fbf7ea", borderLeftWidth: 3, borderLeftColor: SAFETY, paddingVertical: 6, paddingHorizontal: 9, fontSize: 8, marginBottom: 4 },
  sign: { flexDirection: "row", marginTop: 16 },
  signCell: { width: "33.3%", fontSize: 8.5, paddingRight: 10 },
  fine: { marginTop: 12, fontSize: 6.5, color: "#666" },
  fineP: { marginBottom: 3 },
  wm: { position: "absolute", top: "45%", left: 0, right: 0, textAlign: "center", color: INK, opacity: 0.08, fontSize: 52, fontWeight: "bold", transform: "rotate(-22deg)" },
});

function Bullets({ items }: { items: string[] }) {
  return <>{items.map((o, i) => <Text key={i} style={{ marginBottom: 1 }}>• {o}</Text>)}</>;
}

function RizikoDoc({ ctx, vysledky, watermark }: { ctx: any; vysledky: any[]; watermark: boolean }) {
  const dnes = new Date();
  const dalsie = new Date(dnes); dalsie.setFullYear(dalsie.getFullYear() + 3);
  const d = (x: Date) => x.toLocaleDateString("sk-SK");
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={st.page}>
        {watermark ? <Text style={st.wm} fixed>www.erizika.sk</Text> : null}
        <Text style={st.title}>HODNOTENIE RIZÍK</Text>

        <View>
          <View style={st.metaRow}>
            <Text style={st.metaK}>Spoločnosť</Text><Text style={st.metaV}>{ctx?.firma || "—"}</Text>
            <Text style={st.metaK}>Dátum vyhotovenia</Text><Text style={st.metaV}>{d(dnes)}</Text>
          </View>
          <View style={st.metaRow}>
            <Text style={st.metaK}>Odvetvie</Text><Text style={st.metaV}>{ctx?.odvetvie || "—"}</Text>
            <Text style={st.metaK}>Pracovná pozícia</Text><Text style={st.metaV}>{ctx?.pozicia || "—"}</Text>
          </View>
          {ctx?.prostredie ? (
            <View style={st.metaRow}>
              <Text style={st.metaK}>Špecifiká pracoviska</Text><Text style={st.metaVfull}>{ctx.prostredie}</Text>
            </View>
          ) : null}
        </View>

        <View style={st.legend}>
          <Text style={[st.legBox, { backgroundColor: GREEN }]}>R 1–4 · AKCEPTOVATEĽNÉ</Text>
          <Text style={[st.legBox, { backgroundColor: AMBER }]}>R 5–9 · MIERNE</Text>
          <Text style={[st.legBox, { backgroundColor: ORANGE }]}>R 10–15 · NEŽIADUCE</Text>
          <Text style={[st.legBox, { backgroundColor: RED }]}>R 16–25 · NEAKCEPTOVATEĽNÉ</Text>
        </View>

        {vysledky.map((item: any, idx: number) => {
          let maxR2 = 0;
          const rows = item.nebezpecenstva.map((n: any, ri: number) => {
            const P = clamp(n.P, 3), Z = clamp(n.Z, 3), R = P * Z;
            let P2 = clamp(n.P2, Math.max(1, P - 1)), Z2 = clamp(n.Z2, Z);
            if (P2 * Z2 > R) { P2 = P; Z2 = Z; }
            const R2 = P2 * Z2; if (R2 > maxR2) maxR2 = R2;
            const cR = hex(R), cR2 = hex(R2);
            return (
              <View style={st.row} key={ri} wrap={false}>
                <View style={[st.td, { width: `${W[0]}%` }]}><Text style={{ fontWeight: "bold" }}>{n.nebezpecenstvo}</Text></View>
                <View style={[st.td, { width: `${W[1]}%` }]}><Text>{n.ohrozenie}</Text></View>
                <View style={[st.td, { width: `${W[2]}%` }]}><Text style={{ textAlign: "center" }}>{P}</Text></View>
                <View style={[st.td, { width: `${W[3]}%` }]}><Text style={{ textAlign: "center" }}>{Z}</Text></View>
                <View style={[st.td, { width: `${W[4]}%`, backgroundColor: cR }]}><Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 8 }}>{R}</Text></View>
                <View style={[st.td, { width: `${W[5]}%` }]}><Text style={{ color: cR, fontWeight: "bold", fontSize: 6.6 }}>{label(R)}</Text></View>
                <View style={[st.td, { width: `${W[6]}%` }]}><Bullets items={n.opatrenia || []} /></View>
                <View style={[st.td, { width: `${W[7]}%` }]}><Bullets items={n.oopp?.length ? n.oopp : ["—"]} /></View>
                <View style={[st.td, { width: `${W[8]}%` }]}><Text style={{ textAlign: "center" }}>{P2}</Text></View>
                <View style={[st.td, { width: `${W[9]}%` }]}><Text style={{ textAlign: "center" }}>{Z2}</Text></View>
                <View style={[st.td, { width: `${W[10]}%`, backgroundColor: cR2 }]}><Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 8 }}>{R2}</Text></View>
                <View style={[st.td, { width: `${W[11]}%` }]}><Text style={{ color: cR2, fontWeight: "bold", fontSize: 6.6 }}>{label(R2)}</Text></View>
                <View style={[st.td, { width: `${W[12]}%` }]}><Text style={{ fontSize: 6.5, color: "#555" }}>{(n.predpisy || []).join("\n")}</Text></View>
              </View>
            );
          });
          return (
            <View key={idx}>
              <View style={st.act} wrap={false}>
                <Text style={st.actNum}>{idx + 1}</Text>
                <Text style={st.actName}>{item.cinnost}</Text>
              </View>
              <View style={st.thRow}>
                <Text style={[st.th, { width: `${W[0]}%` }]}>Nebezpečenstvo</Text>
                <Text style={[st.th, { width: `${W[1]}%` }]}>Ohrozenie</Text>
                <Text style={[st.th, { width: `${W[2]}%`, textAlign: "center" }]}>P</Text>
                <Text style={[st.th, { width: `${W[3]}%`, textAlign: "center" }]}>Z</Text>
                <Text style={[st.th, { width: `${W[4]}%`, textAlign: "center" }]}>R</Text>
                <Text style={[st.th, { width: `${W[5]}%` }]}>Kategória</Text>
                <Text style={[st.th, { width: `${W[6]}%` }]}>Opatrenia</Text>
                <Text style={[st.th, { width: `${W[7]}%` }]}>Požadované OOPP</Text>
                <Text style={[st.th, { width: `${W[8]}%`, textAlign: "center" }]}>P2</Text>
                <Text style={[st.th, { width: `${W[9]}%`, textAlign: "center" }]}>Z2</Text>
                <Text style={[st.th, { width: `${W[10]}%`, textAlign: "center" }]}>R2</Text>
                <Text style={[st.th, { width: `${W[11]}%` }]}>Zostatkové riziko</Text>
                <Text style={[st.th, { width: `${W[12]}%` }]}>Predpisy</Text>
              </View>
              {rows}
              <Text style={st.konanie}><Text style={{ color: hex(maxR2), fontWeight: "bold" }}>Požadované konanie</Text> (podľa najvyššieho zostatkového rizika R {maxR2}): {konanie(maxR2)}</Text>
            </View>
          );
        })}

        <View style={st.sign}>
          <Text style={st.signCell}>Vypracoval: {ctx?.vypracoval || "______________________"}</Text>
          <Text style={st.signCell}>Dátum: {d(dnes)}</Text>
          <Text style={st.signCell}>Podpis: ______________________</Text>
        </View>

        <View style={st.fine}>
          <Text style={st.fineP}>Metodika: R = P × Z (5×5). Východiskové riziko pred opatreniami a zostatkové riziko R2 = P2 × Z2 po zavedení opatrení a OOPP. Kategórie: 1–4 akceptovateľné, 5–9 mierne, 10–15 nežiaduce, 16–25 neakceptovateľné.</Text>
          <Text style={st.fineP}>Pojmy: Nebezpečenstvo — stav alebo vlastnosť faktora pracovného procesu a pracovného prostredia, ktoré môžu poškodiť zdravie. Ohrozenie — situácia, v ktorej nemožno vylúčiť poškodenie zdravia. Zostatkové riziko — hodnota rizika po vykonaní opatrení.</Text>
          <Text style={st.fineP}>Prehodnotenie: Hodnotenie sa aktualizuje pri každej zmene pracovných podmienok, technológie alebo organizácie práce, po pracovnom úraze alebo závažnej skoronehode; periodicky najneskôr do troch rokov — najneskôr do {d(dalsie)}.</Text>
          <Text>Tento dokument je podkladom pre posúdenie rizika; pred zaradením do dokumentácie BOZP ho musí preveriť a schváliť odborne spôsobilá osoba (bezpečnostný technik) v zmysle zákona č. 124/2006 Z. z.</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderRizikoPdf(opts: { ctx: any; vysledky: any[]; watermark: boolean }): Promise<Buffer> {
  return await renderToBuffer(<RizikoDoc ctx={opts.ctx} vysledky={opts.vysledky} watermark={opts.watermark} />);
}
