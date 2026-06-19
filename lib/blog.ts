// Články blogu. Obsah je uložený ako HTML reťazec (rovnaký prístup ako úvodka).
// Každý článok je staticky vygenerovaný (rýchle, ideálne pre SEO).

export type Article = {
  slug: string;
  title: string;        // H1 aj SEO titulok
  description: string;  // meta popis (~150 znakov)
  date: string;         // ISO dátum publikovania
  updated?: string;     // ISO dátum poslednej úpravy
  readMins: number;
  keywords: string[];
  body: string;         // HTML obsah článku
};

export const ARTICLES: Article[] = [
  {
    slug: "ako-vypracovat-hodnotenie-rizik",
    title: "Ako vypracovať hodnotenie rizík — postup krok za krokom",
    description:
      "Praktický návod, ako vypracovať hodnotenie rizík podľa zákona č. 124/2006 Z. z. — identifikácia nebezpečenstiev, matica P × Z, opatrenia, OOPP aj zostatkové riziko.",
    date: "2026-06-19",
    readMins: 8,
    keywords: ["ako vypracovať hodnotenie rizík", "hodnotenie rizík", "posúdenie rizík", "BOZP", "124/2006"],
    body: `
<p class="lead">Hodnotenie rizík je zákonná povinnosť každého zamestnávateľa na Slovensku. V tomto návode si krok po kroku ukážeme, ako ho vypracovať správne — od identifikácie nebezpečenstiev cez maticu rizika až po opatrenia a zostatkové riziko.</p>

<h2>Čo je hodnotenie rizík a prečo je povinné</h2>
<p>Posúdenie (hodnotenie) rizík je systematický postup, ktorým zamestnávateľ identifikuje nebezpečenstvá na pracovisku, posúdi mieru rizika a navrhne opatrenia na jeho zníženie. Povinnosť vyplýva z <strong>§ 6 ods. 1 písm. c) zákona č. 124/2006 Z. z.</strong> o bezpečnosti a ochrane zdravia pri práci. Týka sa <strong>každého zamestnávateľa</strong> bez ohľadu na veľkosť — od živnostníka s jedným zamestnancom po veľký priemyselný podnik.</p>
<p>Dokument o posúdení rizika je zároveň jedným z prvých podkladov, ktoré pri kontrole žiada <strong>inšpektorát práce</strong>.</p>

<h2>Krok 1: Identifikujte pracovné činnosti a nebezpečenstvá</h2>
<p>Začnite tým, že si rozpíšete jednotlivé <strong>pracovné činnosti</strong> a profesie na pracovisku (napr. murár, skladník, zvárač, vodič). Ku každej činnosti potom hľadáte <strong>nebezpečenstvá</strong> — zdroje možného poškodenia zdravia.</p>
<p>Pomôže vám kontrolný zoznam kategórií:</p>
<ul>
  <li>mechanické (pohyblivé časti strojov, ostré hrany, zovretie),</li>
  <li>pád z výšky a do hĺbky, pád predmetov,</li>
  <li>zasiahnutie elektrickým prúdom, popálenie, požiar a výbuch,</li>
  <li>chemická expozícia, prach, hluk a vibrácie,</li>
  <li>ručná manipulácia s bremenami a ergonómia,</li>
  <li>pošmyknutie a zakopnutie, doprava a manipulačné vozíky,</li>
  <li>uzavretý priestor, poveternostné podmienky, psychosociálne faktory.</li>
</ul>
<p>Pri každej činnosti sa pýtajte: <em>„Čo sa môže pokaziť a komu to môže ublížiť?"</em></p>

<h2>Krok 2: Posúďte mieru rizika (matica P × Z)</h2>
<p>Riziko sa najčastejšie vyjadruje ako súčin <strong>pravdepodobnosti (P)</strong> a <strong>závažnosti (Z)</strong> možného následku: <strong>R = P × Z</strong>. Pri metodike 5 × 5 sa obe veličiny hodnotia na škále 1 až 5:</p>
<ul>
  <li><strong>Pravdepodobnosť P:</strong> 1 = vysoko nepravdepodobná, … 5 = očakávateľná (je súčasťou každodennej práce).</li>
  <li><strong>Závažnosť Z:</strong> 1 = drobné poranenie bez práceneschopnosti, … 5 = smrteľný úraz.</li>
</ul>
<p>Hodnoty P a Z určujete pre stav <strong>bez prijatých opatrení</strong> (východiskové riziko). Výsledné R potom zaradíte do pásma — napríklad: R 1–4 akceptovateľné, R 5–9 mierne, R 10–15 nežiaduce, R 16–25 neakceptovateľné.</p>

<h2>Krok 3: Navrhnite opatrenia podľa hierarchie</h2>
<p>Ku každému nebezpečenstvu navrhnete opatrenia na zníženie rizika. Dôležité je dodržať <strong>hierarchiu opatrení</strong> — od najúčinnejších po najmenej:</p>
<ol>
  <li><strong>Odstránenie</strong> nebezpečenstva (úplne ho vylúčiť),</li>
  <li><strong>Nahradenie</strong> menej nebezpečným riešením,</li>
  <li><strong>Technické</strong> opatrenia (kryty, zábradlia, odsávanie),</li>
  <li><strong>Organizačné</strong> opatrenia (postupy, školenia, striedanie),</li>
  <li><strong>Osobné ochranné pracovné prostriedky (OOPP)</strong> ako posledná línia.</li>
</ol>
<p>Opatrenia formulujte konkrétne a kontrolovateľne — nie „dbať na bezpečnosť", ale napríklad „inštalovať dvojtyčové zábradlie so zarážkou pri podlahe".</p>

<h2>Krok 4: Určte zostatkové riziko</h2>
<p>Po zavedení opatrení znova posúdite riziko — tentokrát hodnoty <strong>P2 a Z2</strong> pre stav <em>po</em> opatreniach. Zostatkové riziko (R2 = P2 × Z2) musí byť <strong>nižšie alebo rovné</strong> východiskovému a nikdy nie nulové (úplne bez rizika to nebýva). Podľa najvyššieho zostatkového rizika sa stanoví <strong>požadované konanie</strong>.</p>

<h2>Krok 5: Spracujte dokumentáciu a prehodnocujte</h2>
<p>Výsledok zapíšete do <strong>dokumentu o posúdení rizika</strong>, ktorý obsahuje identifikované nebezpečenstvá, ohrozenia, maticu rizika, opatrenia, požadované OOPP, zostatkové riziko a doložku o prehodnocovaní. Hodnotenie nie je jednorazové — <strong>prehodnocuje sa</strong> pri zmene podmienok (nový stroj, technológia, úraz) a v rámci periodickej aktualizácie.</p>

<h2>Najčastejšie chyby</h2>
<ul>
  <li>Príliš všeobecné nebezpečenstvá bez väzby na konkrétnu činnosť.</li>
  <li>Opatrenia formulované ako fráza, ktorá sa nedá skontrolovať.</li>
  <li>Vymyslené čísla predpisov — uvádzajte len tie, ktorými ste si istí.</li>
  <li>Dokument, ktorý vznikol „od stola" a nezodpovedá realite pracoviska.</li>
</ul>

<h2>Ako to zvládnuť rýchlejšie</h2>
<p>Vypracovať kvalitné hodnotenie ručne zaberie hodiny. Náš nástroj <strong>e-rizika.sk</strong> vám ku každej zadanej činnosti pripraví kompletný návrh — nebezpečenstvá, maticu P × Z, opatrenia podľa hierarchie, OOPP aj zostatkové riziko — postavený na databáze overených rizík z praxe. Výstup si stiahnete ako Word a PDF a pred zaradením do dokumentácie ho preverí odborne spôsobilá osoba.</p>
<div class="clanok-cta">
  <p><strong>Vyskúšajte si to — prvé hodnotenie máte zadarmo.</strong></p>
  <a class="btn btn-primary" href="/login">Vytvoriť hodnotenie zadarmo</a>
  <a class="btn btn-ghost" href="/api/ukazka" target="_blank" rel="noopener">Pozrieť ukážkové PDF</a>
</div>

<p class="clanok-disc">Tento článok má informatívny charakter a nenahrádza odborné posúdenie. Konkrétnu dokumentáciu BOZP posudzuje a schvaľuje odborne spôsobilá osoba (bezpečnostný technik / autorizovaný bezpečnostný technik).</p>
`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
