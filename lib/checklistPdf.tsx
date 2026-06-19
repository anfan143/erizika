import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";

Font.register({
  family: "DejaVu",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf" },
    { src: "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf", fontWeight: "bold" },
  ],
});

const INK = "#16212D", SAFETY = "#F5B700", GREEN = "#1E8E5A";

const SECTIONS: { t: string; items: string[] }[] = [
  { t: "1. Riadenie a organizácia BOZP", items: [
    "Vnútorný predpis (smernica) o riadení BOZP",
    "Koncepcia politiky BOZP vrátane cieľov (najmä pri vyššom počte zamestnancov)",
    "Vymedzenie zodpovedností a právomocí vedúcich zamestnancov v BOZP",
    "Zabezpečenie bezpečnostnotechnickej služby (BT/ABT) — poverenie alebo zmluva",
    "Zmluva o pracovnej zdravotnej službe (PZS)",
  ] },
  { t: "2. Posúdenie rizík", items: [
    "Posúdenie rizík pre všetky pracoviská a pracovné činnosti",
    "Plán opatrení na odstránenie a zníženie rizík (s termínmi a zodpovednosťou)",
    "Posúdenie rizík pre tehotné, dojčiace a mladistvých (ak sa vzťahuje)",
    "Zoznam prác a pracovísk zakázaných pre vybrané skupiny zamestnancov",
  ] },
  { t: "3. Pracovné postupy a prevádzkové predpisy", items: [
    "Bezpečné pracovné postupy pre rizikové činnosti",
    "Prevádzkové poriadky podľa rizík (chemické faktory, hluk a pod.)",
    "Pokyny na bezpečnú obsluhu strojov a zariadení",
  ] },
  { t: "4. Školenia a oboznamovanie", items: [
    "Oboznámenie pri nástupe, preradení a pri zmene pracovných podmienok",
    "Periodické školenia BOZP vrátane vedúcich zamestnancov",
    "Osnovy školení a overenie vedomostí zamestnancov",
    "Záznamy o školeniach s dátumom a podpismi",
  ] },
  { t: "5. Osobné ochranné pracovné prostriedky (OOPP)", items: [
    "Posúdenie a zoznam OOPP podľa rizík (smernica o OOPP)",
    "Evidencia prideľovania a prevzatia OOPP (podpisy)",
    "Kontrola používania a technického stavu OOPP",
  ] },
  { t: "6. Zdravie pri práci", items: [
    "Dohľad pracovnej zdravotnej služby nad podmienkami práce",
    "Lekárske preventívne prehliadky (vstupné, periodické, výstupné)",
    "Posudky o zdravotnej spôsobilosti na prácu",
    "Kategorizácia prác a meranie faktorov prostredia (ak sa vzťahuje)",
  ] },
  { t: "7. Stroje, zariadenia a revízie (VTZ)", items: [
    "Revízie vyhradených technických zariadení (elektro, tlak, plyn, zdvíhacie)",
    "Termíny odborných prehliadok a odborných skúšok",
    "Sprievodná dokumentácia, návody a vyhlásenia o zhode",
    "Evidencia a kontrola rebríkov, regálov a viazacích prostriedkov",
  ] },
  { t: "8. Pracovné úrazy a mimoriadne udalosti", items: [
    "Evidencia (kniha) úrazov a nebezpečných udalostí",
    "Záznam o registrovanom pracovnom úraze a jeho nahlásenie",
    "Analýza príčin úrazov a prijaté opatrenia",
  ] },
  { t: "9. Prvá pomoc a havarijná pripravenosť", items: [
    "Lekárničky — umiestnenie, obsah a pravidelná kontrola",
    "Určení zamestnanci a školenie poskytovania prvej pomoci",
    "Postupy pre mimoriadne udalosti a evakuáciu",
  ] },
  { t: "10. Ochrana pred požiarmi (súvisiaca dokumentácia)", items: [
    "Požiarne poplachové smernice a požiarny evakuačný plán",
    "Určenie technika PO / preventivára a vedenie požiarnej knihy",
    "Školenia a protipožiarne cvičenia",
  ] },
];

const st = StyleSheet.create({
  page: { fontFamily: "DejaVu", fontSize: 10, color: "#1b1b1b", paddingTop: 34, paddingBottom: 36, paddingHorizontal: 40 },
  brand: { fontSize: 9, color: GREEN, fontWeight: "bold", marginBottom: 2 },
  title: { fontSize: 20, fontWeight: "bold", color: INK, borderBottomWidth: 2.5, borderBottomColor: SAFETY, paddingBottom: 6, marginBottom: 8 },
  intro: { fontSize: 9.5, color: "#444", marginBottom: 14, lineHeight: 1.4 },
  secT: { fontSize: 11.5, fontWeight: "bold", color: "#fff", backgroundColor: INK, paddingVertical: 4, paddingHorizontal: 8, marginTop: 12, marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 3, paddingHorizontal: 4, borderBottomWidth: 0.5, borderBottomColor: "#e6e6e6" },
  box: { width: 11, height: 11, borderWidth: 1.3, borderColor: INK, borderRadius: 2, marginRight: 8, marginTop: 1 },
  item: { fontSize: 10, flex: 1, lineHeight: 1.35 },
  wm: { position: "absolute", top: "45%", left: 0, right: 0, textAlign: "center", color: INK, opacity: 0.07, fontSize: 50, fontWeight: "bold", transform: "rotate(-22deg)" },
  fine: { marginTop: 16, fontSize: 8, color: "#666", lineHeight: 1.4 },
  foot: { position: "absolute", bottom: 18, left: 40, right: 40, fontSize: 8, color: "#888", textAlign: "center" },
});

function ChecklistDoc({ watermark }: { watermark: boolean }) {
  return (
    <Document>
      <Page size="A4" style={st.page}>
        {watermark ? <Text style={st.wm} fixed>www.erizika.sk</Text> : null}
        <Text style={st.brand}>e-rizika.sk</Text>
        <Text style={st.title}>Checklist BOZP dokumentácie</Text>
        <Text style={st.intro}>
          Prehľad dokumentov, ktoré by mal mať zamestnávateľ v rámci bezpečnosti a ochrany zdravia pri práci.
          Rozsah sa líši podľa činnosti firmy — zoznam berte ako orientačnú pomôcku a konzultujte ho s odborne
          spôsobilou osobou. Odškrtnite si, čo už máte spracované.
        </Text>

        {SECTIONS.map((s, i) => (
          <View key={i} wrap={false}>
            <Text style={st.secT}>{s.t}</Text>
            {s.items.map((it, j) => (
              <View key={j} style={st.row}>
                <View style={st.box} />
                <Text style={st.item}>{it}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={st.fine}>
          Tento checklist má informatívny charakter a nenahrádza odborné posúdenie. Konkrétny rozsah dokumentácie
          a jej náležitosti posudzuje odborne spôsobilá osoba (bezpečnostný technik / autorizovaný bezpečnostný
          technik) v zmysle zákona č. 124/2006 Z. z.
        </Text>
        <Text style={st.foot} fixed>© e-rizika.sk · www.erizika.sk · Hodnotenie rizík BOZP za pár minút</Text>
      </Page>
    </Document>
  );
}

export async function renderChecklistPdf(watermark = true): Promise<Buffer> {
  return await renderToBuffer(<ChecklistDoc watermark={watermark} />);
}
