import type { Metadata } from "next";
import { PravnaStranka, Prevadzkovatel } from "@/lib/PravnaStranka";
import { FIRMA } from "@/lib/firma";

export const metadata: Metadata = {
  title: "Obchodné podmienky — e-rizika.sk",
  robots: { index: true, follow: true },
};

export default function Podmienky() {
  return (
    <PravnaStranka title="Všeobecné obchodné podmienky">
      <h3>1. Prevádzkovateľ</h3>
      <p>Tieto všeobecné obchodné podmienky (ďalej len „VOP“) upravujú práva a povinnosti
        medzi prevádzkovateľom a používateľom pri poskytovaní služby dostupnej na adrese{" "}
        {FIRMA.web} (ďalej len „služba“ alebo „platforma“).</p>
      <Prevadzkovatel />

      <h3>2. Vymedzenie pojmov</h3>
      <ul>
        <li><strong>Služba</strong> — webová platforma na automatizované vytváranie dokumentu
          o posúdení rizík (hodnotenia rizík) na základe zadaných pracovných činností.</li>
        <li><strong>Používateľ</strong> — fyzická alebo právnická osoba, ktorá si vytvorí
          účet a využíva službu.</li>
        <li><strong>Spotrebiteľ</strong> — fyzická osoba, ktorá pri uzatváraní zmluvy nekoná
          v rámci predmetu svojej podnikateľskej činnosti.</li>
        <li><strong>Digitálny obsah / digitálna služba</strong> — výstupy a funkcie platformy
          poskytované v elektronickej podobe.</li>
      </ul>

      <h3>3. Charakter služby a dôležité upozornenie</h3>
      <p>Platforma je <strong>nástroj na podporu spracovania</strong> dokumentácie BOZP. Vytvorené
        výstupy sú <strong>podkladom</strong> pre posúdenie rizík. Pred zaradením do dokumentácie
        bezpečnosti a ochrany zdravia pri práci ich <strong>preveruje a schvaľuje odborne spôsobilá
        osoba</strong> (bezpečnostný technik / autorizovaný bezpečnostný technik) v zmysle platnej
        legislatívy, najmä zákona č. 124/2006 Z. z.</p>
      <p>Prevádzkovateľ <strong>nezodpovedá</strong> za úplnosť, správnosť a vhodnosť výstupov pre
        konkrétne pracovisko ani za ich použitie bez odborného posúdenia. Služba nenahrádza
        odborne spôsobilú osobu.</p>

      <h3>4. Registrácia a používateľský účet</h3>
      <p>Používanie platených funkcií vyžaduje vytvorenie účtu (e-mailom a heslom alebo cez
        Google). Používateľ zodpovedá za správnosť zadaných údajov a za ochranu prihlasovacích
        údajov. Účet je neprenosný.</p>

      <h3>5. Rozsah služby a cenník</h3>
      <ul>
        <li><strong>Bezplatné vyskúšanie</strong> — po registrácii jedno posúdenie jednej pracovnej
          činnosti. Výstup je dostupný ako PDF s vodoznakom; editovateľný výstup a viac činností sa
          odomykajú zakúpením jednorazového projektu alebo predplatného.</li>
        <li><strong>Jednorazový projekt — 15 €</strong> — jeden dokument s obmedzeným počtom
          pracovných činností (do 15), s možnosťou úprav a opätovného exportu počas 14 dní od
          zakúpenia.</li>
        <li><strong>Predplatné</strong> — 19 € / mesiac, 49 € / 3 mesiace, 79 € / 6 mesiacov,
          99 € / 12 mesiacov. Neobmedzené hodnotenia a dokumenty počas platnosti predplatného.</li>
      </ul>
      <p>Všetky ceny sú uvedené v eurách a sú konečné.
        {!FIRMA.platcaDPH && " Prevádzkovateľ nie je platiteľom DPH."}</p>

      <h3>6. Objednávka a uzatvorenie zmluvy</h3>
      <p>Objednávku používateľ vytvorí výberom plánu a jeho potvrdením. Platba prebieha cez
        poskytovateľa platobných služieb (Stripe Payments Europe, Ltd.). Zmluva je uzatvorená
        pripísaním platby a sprístupnením príslušných funkcií. Potvrdenie a doklad o platbe
        používateľ dostáva e-mailom.</p>

      <h3>7. Platobné podmienky a obnova predplatného</h3>
      <p>Predplatné sa môže automaticky obnovovať na ďalšie rovnaké obdobie, ak ho používateľ
        nezruší pred koncom prebiehajúceho obdobia. Predplatné je možné kedykoľvek spravovať
        a zrušiť v sekcii <em>Profil → Spravovať predplatné</em>. Po zrušení zostávajú funkcie
        dostupné do konca už zaplateného obdobia. Jednorazový projekt sa neobnovuje.</p>

      <h3>8. Odstúpenie od zmluvy (spotrebiteľ)</h3>
      <p>Spotrebiteľ má právo odstúpiť od zmluvy do 14 dní bez uvedenia dôvodu. Keďže ide
        o digitálny obsah/službu poskytovanú elektronicky, spotrebiteľ pri objednávke udeľuje{" "}
        <strong>výslovný súhlas so začatím poskytovania pred uplynutím lehoty na odstúpenie</strong>{" "}
        a berie na vedomie, že <strong>udelením súhlasu a začatím používania stráca právo na
        odstúpenie</strong>. Podrobnosti a formulár: <a href="/odstupenie">Odstúpenie od zmluvy</a>.</p>

      <h3>9. Práva z vadného plnenia a reklamácie</h3>
      <p>Ak služba nefunguje, ako má, používateľ to môže reklamovať na{" "}
        <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>. Prevádzkovateľ vybaví reklamáciu bez
        zbytočného odkladu, najneskôr do 30 dní. Ak ide o oprávnenú reklamáciu nefunkčnej platenej
        služby, prevádzkovateľ zabezpečí nápravu, primeranú zľavu alebo vrátenie platby.</p>

      <h3>10. Dostupnosť služby</h3>
      <p>Prevádzkovateľ vyvíja primerané úsilie o dostupnosť platformy, negarantuje však
        neprerušovanú prevádzku. Služba môže byť dočasne nedostupná z dôvodu údržby alebo
        príčin mimo kontroly prevádzkovateľa.</p>

      <h3>11. Duševné vlastníctvo</h3>
      <p>Platforma, jej databáza a softvér sú chránené a zostávajú vlastníctvom prevádzkovateľa.
        Vytvorené výstupy (dokumenty) môže používateľ používať pre vlastnú potrebu a pre potrebu
        svojich klientov v rámci predmetu služby.</p>

      <h3>12. Riešenie sporov a alternatívne riešenie sporov (ARS)</h3>
      <p>Spotrebiteľ má právo obrátiť sa na prevádzkovateľa so žiadosťou o nápravu. Ak nie je
        spokojný so spôsobom vybavenia, má právo na <strong>alternatívne riešenie sporu</strong>{" "}
        prostredníctvom subjektu ARS (napr. Slovenská obchodná inšpekcia) alebo cez platformu RSO
        (ec.europa.eu/consumers/odr). Orgánom dozoru je {FIRMA.dozor}.</p>

      <h3>13. Záverečné ustanovenia</h3>
      <p>Vzťahy neupravené týmito VOP sa riadia právnym poriadkom Slovenskej republiky, najmä
        Občianskym zákonníkom, zákonom č. 108/2024 Z. z. o ochrane spotrebiteľa a zákonom
        č. 22/2004 Z. z. o elektronickom obchode. Prevádzkovateľ môže VOP meniť; na používateľa
        sa vzťahuje znenie platné v čase objednávky. Tieto VOP nadobúdajú účinnosť dňom zverejnenia.</p>
    </PravnaStranka>
  );
}
