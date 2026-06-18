import type { Metadata } from "next";
import { PravnaStranka, Prevadzkovatel } from "@/lib/PravnaStranka";
import { FIRMA } from "@/lib/firma";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov — e-rizika.sk",
  robots: { index: true, follow: true },
};

export default function Sukromie() {
  return (
    <PravnaStranka title="Ochrana osobných údajov">
      <p>Tieto zásady vysvetľujú, aké osobné údaje spracúvame, na aký účel a aké máte práva podľa
        Nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. o ochrane osobných údajov.</p>

      <h3>1. Prevádzkovateľ</h3>
      <Prevadzkovatel />

      <h3>2. Aké údaje spracúvame</h3>
      <ul>
        <li><strong>Registračné a prihlasovacie údaje</strong> — e-mailová adresa, heslo (uložené
          v zašifrovanej podobe), prípadne údaje z účtu Google pri prihlásení cez Google.</li>
        <li><strong>Údaje zadané do platformy</strong> — názov firmy, odvetvie, pozícia, pracovné
          činnosti a špecifiká pracoviska, ktoré zadáte na vytvorenie hodnotenia.</li>
        <li><strong>Platobné údaje</strong> — spracúva ich výhradne poskytovateľ platieb (Stripe);
          my dostávame len identifikátor zákazníka a stav platby, <strong>nie</strong> číslo
          platobnej karty.</li>
        <li><strong>Technické údaje</strong> — nevyhnutné cookies pre prihlásenie a chod služby.</li>
      </ul>

      <h3>3. Účely a právne základy spracúvania</h3>
      <ul>
        <li><strong>Poskytovanie služby a správa účtu</strong> — právny základ: plnenie zmluvy
          (čl. 6 ods. 1 písm. b GDPR).</li>
        <li><strong>Spracovanie platieb a fakturácia</strong> — plnenie zmluvy a zákonná povinnosť
          (účtovné a daňové predpisy, čl. 6 ods. 1 písm. b a c GDPR).</li>
        <li><strong>Komunikácia a podpora</strong> — oprávnený záujem, resp. plnenie zmluvy
          (čl. 6 ods. 1 písm. b, f GDPR).</li>
        <li><strong>Zabezpečenie a prevencia zneužitia</strong> — oprávnený záujem
          (čl. 6 ods. 1 písm. f GDPR).</li>
      </ul>

      <h3>4. Sprostredkovatelia a príjemcovia</h3>
      <p>Na prevádzku služby využívame dôveryhodných poskytovateľov, ktorí spracúvajú údaje v našom
        mene na základe zmluvy o spracúvaní:</p>
      <ul>
        <li><strong>Supabase</strong> — databáza a autentifikácia účtov.</li>
        <li><strong>Vercel</strong> — hosting a prevádzka aplikácie.</li>
        <li><strong>Stripe Payments Europe, Ltd.</strong> — spracovanie platieb.</li>
        <li><strong>Resend</strong> — odosielanie transakčných e-mailov (potvrdenia, oznámenia).</li>
        <li><strong>Anthropic</strong> — spracovanie textu zadania pri generovaní výstupu.</li>
      </ul>
      <p>Niektorí poskytovatelia môžu spracúvať údaje aj mimo EÚ; v takom prípade je prenos krytý
        primeranými zárukami (štandardné zmluvné doložky EÚ).</p>

      <h3>5. Doba uchovávania</h3>
      <p>Údaje účtu uchovávame po dobu trvania účtu. Po jeho zrušení ich vymažeme alebo
        anonymizujeme, okrem údajov, ktoré musíme uchovať zo zákona (napr. účtovné doklady po dobu
        stanovenú daňovými a účtovnými predpismi).</p>

      <h3>6. Vaše práva</h3>
      <p>Máte právo na prístup k údajom, ich opravu, vymazanie, obmedzenie spracúvania, prenosnosť,
        právo namietať a právo kedykoľvek odvolať udelený súhlas. Tieto práva si môžete uplatniť na{" "}
        <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>. Máte tiež právo podať sťažnosť dozornému
        orgánu — <strong>Úrad na ochranu osobných údajov SR</strong>, Hraničná 12, 820 07 Bratislava,
        www.dataprotection.gov.sk.</p>

      <h3>7. Cookies</h3>
      <p>Používame iba <strong>nevyhnutné</strong> cookies potrebné na prihlásenie a fungovanie
        služby. Bez nich by sa nedalo bezpečne používať konto. Nepoužívame reklamné cookies.</p>

      <h3>8. Zmeny</h3>
      <p>Tieto zásady môžeme aktualizovať. Aktuálne znenie je vždy dostupné na tejto stránke.</p>
    </PravnaStranka>
  );
}
