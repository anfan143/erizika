import { LANDING_HTML } from "@/lib/landingHtml";
import LandingFX from "./LandingFX";
import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

// Prihláseného používateľa nenechávame na verejnej úvodke (pôsobilo to ako odhlásenie) —
// presmerujeme ho do jeho pracovnej plochy (Domov / dashboard).
export const dynamic = "force-dynamic";

// Pred vykreslením zapne „fx-ready" (skryje prvky na reveal). Failsafe: ak by sa
// klientský JS nikdy nespustil, po 2,6 s sa fx-ready odstráni a stránka je celá viditeľná.
const FX_INIT =
  "(function(){try{if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('fx-ready');setTimeout(function(){if(!window.__fxInit){document.documentElement.classList.remove('fx-ready');}},2600);}catch(e){}})();";

// Štruktúrované dáta pre vyhľadávače (rich results v Google) — Organization, aplikácia, FAQ.
const FAQ: [string, string][] = [
  ["Ako funguje vyskúšanie zadarmo?", "Po registrácii si necháte posúdiť jednu pracovnú činnosť — výsledok vidíte celý a v plnej kvalite. Stiahnete si ho ako PDF s diskrétnym vodoznakom. Editovateľný Word bez vodoznaku a viac pracovných činností získate jednorazovým projektom alebo predplatným."],
  ["Čo presne obsahuje jednorazový projekt?", "Jeden kompletný dokument o posúdení rizika s obmedzeným počtom pracovných činností (do 15). Počas 14 dní ho môžete upravovať, dopĺňať a exportovať bez obmedzenia."],
  ["V akom formáte dostanem hodnotenie?", "Hotové hodnotenie si stiahnete ako PDF aj ako editovateľný Word (.doc) — oba na šírku a profesionálne naformátované, pripravené na okamžité použitie aj podpis."],
  ["Obstojí dokument pri kontrole inšpektorátu práce?", "Áno. Obsahuje identifikované nebezpečenstvá a ohrozenia, maticu rizika, opatrenia podľa hierarchie, požadované OOPP, zostatkové riziko aj doložku o prehodnocovaní. Pred zaradením do dokumentácie BOZP ho preverí a schváli odborne spôsobilá osoba."],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.erizika.sk/#organization",
      name: "e-rizika.sk",
      legalName: "HAVCO s. r. o.",
      url: "https://www.erizika.sk",
      logo: "https://www.erizika.sk/icon.svg",
      email: "info@erizika.sk",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Papiernická 1789/15",
        postalCode: "034 01",
        addressLocality: "Ružomberok",
        addressCountry: "SK",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.erizika.sk/#website",
      url: "https://www.erizika.sk",
      name: "e-rizika.sk",
      inLanguage: "sk-SK",
      publisher: { "@id": "https://www.erizika.sk/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      name: "e-rizika.sk — generátor hodnotenia rizík BOZP",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://www.erizika.sk",
      inLanguage: "sk-SK",
      description: "Online nástroj na vypracovanie hodnotenia (posúdenia) rizík BOZP podľa zákona č. 124/2006 Z. z. Z databázy overených rizík pripraví kompletný dokument — nebezpečenstvá, opatrenia, OOPP aj zostatkové riziko, s exportom do Wordu a PDF.",
      offers: [
        { "@type": "Offer", name: "Jednorazový projekt", price: "15", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Mesačné predplatné", price: "19", priceCurrency: "EUR" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default async function Landing() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/app");

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: FX_INIT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <div className="land" dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />
      <LandingFX />
    </>
  );
}
