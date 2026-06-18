import type { Metadata } from "next";
import { PravnaStranka, Prevadzkovatel } from "@/lib/PravnaStranka";
import { FIRMA } from "@/lib/firma";

export const metadata: Metadata = {
  title: "Odstúpenie od zmluvy — e-rizika.sk",
  robots: { index: true, follow: true },
};

export default function Odstupenie() {
  return (
    <PravnaStranka title="Poučenie o odstúpení od zmluvy">
      <h3>Právo na odstúpenie</h3>
      <p>Ak ste spotrebiteľ (fyzická osoba, ktorá nekoná v rámci podnikateľskej činnosti), máte
        právo odstúpiť od zmluvy do <strong>14 dní</strong> bez uvedenia dôvodu.</p>

      <h3>Dôležité — strata práva na odstúpenie pri digitálnom obsahu</h3>
      <p>Naša služba je digitálny obsah/služba poskytovaná elektronicky. Pri objednávke udeľujete{" "}
        <strong>výslovný súhlas so začatím poskytovania pred uplynutím 14-dňovej lehoty</strong> a
        beriete na vedomie, že <strong>udelením tohto súhlasu a začatím používania služby (napr.
        vygenerovaním hodnotenia alebo stiahnutím výstupu) strácate právo na odstúpenie od
        zmluvy</strong>. Ak ste službu ešte nezačali používať, právo na odstúpenie vám zostáva
        zachované.</p>

      <h3>Ako odstúpiť</h3>
      <p>O odstúpení nás informujte jednoznačným vyhlásením — e-mailom na{" "}
        <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a> alebo poštou na adresu sídla. Môžete
        použiť vzorový formulár nižšie, nie je to však povinné. Lehota je zachovaná, ak vyhlásenie
        odošlete pred jej uplynutím.</p>

      <h3>Dôsledky odstúpenia</h3>
      <p>Ak platne odstúpite, vrátime vám prijaté platby bez zbytočného odkladu, najneskôr do 14 dní,
        rovnakým platobným prostriedkom, aký ste použili pri platbe (ak sa nedohodneme inak). Ak ste
        požiadali o začatie poskytovania počas lehoty na odstúpenie, môžeme požadovať úhradu za
        plnenie poskytnuté do okamihu odstúpenia.</p>

      <h3>Prevádzkovateľ</h3>
      <Prevadzkovatel />

      <h3>Vzorový formulár na odstúpenie od zmluvy</h3>
      <div
        style={{
          border: "1px solid var(--line, #e5e7eb)",
          borderRadius: 8,
          padding: "16px 18px",
          background: "var(--paper, #fafafa)",
          fontSize: 14,
          lineHeight: 1.8,
        }}
      >
        <p style={{ marginTop: 0 }}>
          (vyplňte a zašlite tento formulár len v prípade, že si želáte odstúpiť od zmluvy)
        </p>
        <p>
          Adresát: {FIRMA.obchodneMeno}, {FIRMA.sidlo}, e-mail: {FIRMA.email}
        </p>
        <p>
          Týmto oznamujem, že odstupujem od zmluvy o poskytnutí tejto služby: ____________________
          <br />
          Dátum objednania / zakúpenia: ____________________
          <br />
          Meno a priezvisko spotrebiteľa: ____________________
          <br />
          Adresa spotrebiteľa: ____________________
          <br />
          E-mail použitý pri objednávke: ____________________
          <br />
          Dátum: ____________________
          <br />
          Podpis (ak sa zasiela v listinnej podobe): ____________________
        </p>
      </div>
    </PravnaStranka>
  );
}
