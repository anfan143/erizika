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

// Zdieľaná hlavičková grafika — rovnaká na všetkých článkoch (jednotný brand).
export const BLOG_HERO = `<div class="clanok-hero">
<svg viewBox="0 0 760 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BOZP — hodnotenie rizík">
  <rect width="760" height="140" rx="12" fill="#16212D"/>
  <rect x="0" y="128" width="760" height="12" fill="#F5A524"/>
  <g stroke="#F5C24B" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"><path d="M150 38 L194 114 L106 114 Z"/><path d="M150 66 v22"/></g>
  <circle cx="150" cy="102" r="3" fill="#F5C24B"/>
  <g stroke="#E6ECF2" stroke-width="3" fill="none" stroke-linecap="round"><rect x="300" y="36" width="64" height="78" rx="7"/><path d="M315 60 h34 M315 78 h34 M315 96 h20"/></g>
  <rect x="319" y="29" width="26" height="14" rx="4" fill="#F5A524"/>
  <text x="600" y="34" font-family="monospace" font-size="12" fill="#9FB0C2">R = P × Z</text>
  <rect x="600" y="44" width="18" height="18" rx="3" fill="#E09B00"/><rect x="622" y="44" width="18" height="18" rx="3" fill="#D96B1F"/><rect x="644" y="44" width="18" height="18" rx="3" fill="#C2382A"/>
  <rect x="600" y="66" width="18" height="18" rx="3" fill="#1E8E5A"/><rect x="622" y="66" width="18" height="18" rx="3" fill="#E09B00"/><rect x="644" y="66" width="18" height="18" rx="3" fill="#D96B1F"/>
  <rect x="600" y="88" width="18" height="18" rx="3" fill="#1E8E5A"/><rect x="622" y="88" width="18" height="18" rx="3" fill="#1E8E5A"/><rect x="644" y="88" width="18" height="18" rx="3" fill="#E09B00"/>
</svg>
</div>`;

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
<div class="clanok-box is-tip"><p><strong>Tip:</strong> Pri každej činnosti sa pýtajte: <em>„Čo sa môže pokaziť a komu to môže ublížiť?"</em> Otázku si zopakujte pre každú fázu práce.</p></div>

<h2>Krok 2: Posúďte mieru rizika (matica P × Z)</h2>
<p>Riziko sa najčastejšie vyjadruje ako súčin <strong>pravdepodobnosti (P)</strong> a <strong>závažnosti (Z)</strong> možného následku: <strong>R = P × Z</strong>. Pri metodike 5 × 5 sa obe veličiny hodnotia na škále 1 až 5:</p>
<ul>
  <li><strong>Pravdepodobnosť P:</strong> 1 = vysoko nepravdepodobná, … 5 = očakávateľná (je súčasťou každodennej práce).</li>
  <li><strong>Závažnosť Z:</strong> 1 = drobné poranenie bez práceneschopnosti, … 5 = smrteľný úraz.</li>
</ul>
<p>Hodnoty P a Z určujete pre stav <strong>bez prijatých opatrení</strong> (východiskové riziko). Výsledné R potom zaradíte do pásma — napríklad: R 1–4 akceptovateľné, R 5–9 mierne, R 10–15 nežiaduce, R 16–25 neakceptovateľné.</p>
<figure class="clanok-matica">
  <span class="clanok-fig-cap">Príklad — matica rizík (R = P × Z, 5 × 5)</span>
  <div class="matica-grid">
    <span class="matica-cell" style="background:#E09B00">5</span><span class="matica-cell" style="background:#D96B1F">10</span><span class="matica-cell" style="background:#D96B1F">15</span><span class="matica-cell" style="background:#C2382A">20</span><span class="matica-cell" style="background:#C2382A">25</span>
    <span class="matica-cell" style="background:#1E8E5A">4</span><span class="matica-cell" style="background:#E09B00">8</span><span class="matica-cell" style="background:#D96B1F">12</span><span class="matica-cell" style="background:#C2382A">16</span><span class="matica-cell" style="background:#C2382A">20</span>
    <span class="matica-cell" style="background:#1E8E5A">3</span><span class="matica-cell" style="background:#E09B00">6</span><span class="matica-cell" style="background:#E09B00">9</span><span class="matica-cell" style="background:#D96B1F">12</span><span class="matica-cell" style="background:#D96B1F">15</span>
    <span class="matica-cell" style="background:#1E8E5A">2</span><span class="matica-cell" style="background:#1E8E5A">4</span><span class="matica-cell" style="background:#E09B00">6</span><span class="matica-cell" style="background:#E09B00">8</span><span class="matica-cell" style="background:#D96B1F">10</span>
    <span class="matica-cell" style="background:#1E8E5A">1</span><span class="matica-cell" style="background:#1E8E5A">2</span><span class="matica-cell" style="background:#1E8E5A">3</span><span class="matica-cell" style="background:#1E8E5A">4</span><span class="matica-cell" style="background:#E09B00">5</span>
  </div>
  <div class="matica-axes"><span>↑ Z = závažnosť</span><span>P = pravdepodobnosť →</span></div>
  <div class="matica-legend"><span style="background:#1E8E5A">1–4 akceptovateľné</span><span style="background:#E09B00">5–9 mierne</span><span style="background:#D96B1F">10–15 nežiaduce</span><span style="background:#C2382A">16–25 neakceptovateľné</span></div>
</figure>

<h2>Krok 3: Navrhnite opatrenia podľa hierarchie</h2>
<p>Ku každému nebezpečenstvu navrhnete opatrenia na zníženie rizika. Dôležité je dodržať <strong>hierarchiu opatrení</strong> — od najúčinnejších po najmenej:</p>
<div class="clanok-pyramida">
  <div class="pyr-row" style="background:#1E8E5A;width:100%">1 · Odstránenie nebezpečenstva</div>
  <div class="pyr-row" style="background:#2E9E68;width:90%">2 · Nahradenie menej nebezpečným</div>
  <div class="pyr-row" style="background:#E09B00;width:80%">3 · Technické opatrenia (kryty, odsávanie)</div>
  <div class="pyr-row" style="background:#D96B1F;width:70%">4 · Organizačné opatrenia (postupy, školenia)</div>
  <div class="pyr-row" style="background:#8A93A0;width:60%">5 · OOPP — posledná línia ochrany</div>
</div>
<p style="font-size:13.5px;color:var(--ink-soft);margin-top:-6px">Najúčinnejšie opatrenia sú hore. K OOPP siahnite až vtedy, keď riziko nevieš znížiť inak.</p>
<p>Opatrenia formulujte konkrétne a kontrolovateľne — nie „dbať na bezpečnosť", ale napríklad „inštalovať dvojtyčové zábradlie so zarážkou pri podlahe".</p>

<h2>Krok 4: Určte zostatkové riziko</h2>
<p>Po zavedení opatrení znova posúdite riziko — tentokrát hodnoty <strong>P2 a Z2</strong> pre stav <em>po</em> opatreniach. Zostatkové riziko (R2 = P2 × Z2) musí byť <strong>nižšie alebo rovné</strong> východiskovému a nikdy nie nulové (úplne bez rizika to nebýva). Podľa najvyššieho zostatkového rizika sa stanoví <strong>požadované konanie</strong>.</p>

<h2>Krok 5: Spracujte dokumentáciu a prehodnocujte</h2>
<p>Výsledok zapíšete do <strong>dokumentu o posúdení rizika</strong>, ktorý obsahuje identifikované nebezpečenstvá, ohrozenia, maticu rizika, opatrenia, požadované OOPP, zostatkové riziko a doložku o prehodnocovaní. Hodnotenie nie je jednorazové — <strong>prehodnocuje sa</strong> pri zmene podmienok (nový stroj, technológia, úraz) a v rámci periodickej aktualizácie.</p>

<h2>Najčastejšie chyby</h2>
<div class="clanok-box is-warn">
  <p><strong>⚠️ Čomu sa vyhnúť:</strong></p>
  <ul>
    <li>Príliš všeobecné nebezpečenstvá bez väzby na konkrétnu činnosť.</li>
    <li>Opatrenia formulované ako fráza, ktorá sa nedá skontrolovať.</li>
    <li>Vymyslené čísla predpisov — uvádzajte len tie, ktorými ste si istí.</li>
    <li>Dokument, ktorý vznikol „od stola" a nezodpovedá realite pracoviska.</li>
  </ul>
</div>

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
  {
    slug: "co-musi-obsahovat-hodnotenie-rizik",
    title: "Hodnotenie rizík: čo musí obsahovať (+ vzor)",
    description:
      "Čo musí obsahovať dokument o posúdení rizík — povinné náležitosti, vzorová tabuľka s maticou P × Z, opatreniami, OOPP a zostatkovým rizikom.",
    date: "2026-06-19",
    readMins: 6,
    keywords: ["čo musí obsahovať hodnotenie rizík", "hodnotenie rizík vzor", "posúdenie rizík", "BOZP dokumentácia"],
    body: `
<p class="lead">Aby hodnotenie rizík obstálo pri kontrole inšpektorátu práce, musí obsahovať niekoľko povinných náležitostí. Tu je prehľad — a vzor, ako vyzerá hotová tabuľka.</p>

<h2>Povinné náležitosti dokumentu</h2>
<p>Kvalitné posúdenie rizika by malo obsahovať:</p>
<ul class="clanok-check">
  <li>Identifikačné údaje — firma, pracovisko, dátum vyhotovenia a spracovateľ</li>
  <li>Zoznam posudzovaných pracovných činností a profesií</li>
  <li>Identifikované nebezpečenstvá a konkrétne ohrozenia</li>
  <li>Posúdenie rizika maticou P × Z (východiskové riziko bez opatrení)</li>
  <li>Navrhnuté opatrenia v poradí podľa hierarchie</li>
  <li>Požadované osobné ochranné pracovné prostriedky (OOPP)</li>
  <li>Zostatkové riziko po opatreniach a požadované konanie</li>
  <li>Doložku o prehodnocovaní a podpis zodpovednej osoby</li>
</ul>

<h2>Ako to vyzerá v praxi (vzor)</h2>
<p>Každá pracovná činnosť sa rozpíše do tabuľky. Jeden riadok = jedno nebezpečenstvo:</p>
<div class="clanok-vzor">
<table>
<thead><tr><th>Nebezpečenstvo</th><th>Ohrozenie</th><th>P</th><th>Z</th><th>R</th><th>Opatrenia</th><th>OOPP</th><th>Zostat.</th></tr></thead>
<tbody>
<tr>
  <td><strong>Pád z výšky</strong></td>
  <td>Pád z nezaisteného okraja podlahy lešenia</td>
  <td style="text-align:center">3</td><td style="text-align:center">4</td>
  <td class="r-cell" style="background:#D96B1F">12</td>
  <td>Zábradlie so zarážkou; odborné prehliadky; oboznámenie</td>
  <td>Prilba EN 397; postroj EN 361</td>
  <td class="r-cell" style="background:#E09B00">8</td>
</tr>
<tr>
  <td><strong>Zásah el. prúdom</strong></td>
  <td>Dotyk so živými časťami pri poškodenej izolácii</td>
  <td style="text-align:center">2</td><td style="text-align:center">4</td>
  <td class="r-cell" style="background:#E09B00">8</td>
  <td>Kontrola káblov; revízia zariadenia; vyradenie poškodených</td>
  <td>Rukavice EN 12477</td>
  <td class="r-cell" style="background:#1E8E5A">4</td>
</tr>
</tbody>
</table>
</div>

<div class="clanok-box is-tip"><p><strong>Tip:</strong> Najčastejšie sa zabúda na <strong>zostatkové riziko</strong> a <strong>doložku o prehodnocovaní</strong>. Bez nich dokument pri kontrole pôsobí nedokončene.</p></div>

<h2>Ako často sa prehodnocuje</h2>
<p>Hodnotenie nie je jednorazové. Aktualizuje sa pri <strong>zmene podmienok</strong> (nový stroj, technológia, priestor, pracovný úraz) a v rámci <strong>periodickej revízie</strong>. Práve preto sa oplatí mať dokument v editovateľnej podobe.</p>

<div class="clanok-cta">
  <p><strong>Nechajte si pripraviť kompletnú tabuľku automaticky.</strong></p>
  <a class="btn btn-primary" href="/login">Vytvoriť hodnotenie zadarmo</a>
  <a class="btn btn-ghost" href="/api/ukazka" target="_blank" rel="noopener">Pozrieť ukážkové PDF</a>
</div>

<p class="clanok-disc">Tento článok má informatívny charakter a nenahrádza odborné posúdenie. Konkrétnu dokumentáciu BOZP posudzuje a schvaľuje odborne spôsobilá osoba.</p>
`,
  },
  {
    slug: "bozp-dokumentacia-firmy",
    title: "BOZP dokumentácia: aké dokumenty musí mať firma",
    description:
      "Prehľad povinnej dokumentácie BOZP, ktorú musí mať každý zamestnávateľ — od posúdenia rizík cez školenia a OOPP po evidenciu úrazov.",
    date: "2026-06-19",
    readMins: 6,
    keywords: ["BOZP dokumentácia", "aké dokumenty BOZP", "povinnosti zamestnávateľa BOZP", "124/2006"],
    body: `
<p class="lead">Každý zamestnávateľ na Slovensku musí viesť dokumentáciu BOZP — bez ohľadu na to, či má jedného alebo sto zamestnancov. Tu je prehľad základných dokumentov.</p>

<h2>Základné dokumenty BOZP</h2>
<div class="clanok-docs">
  <div class="doc-chip"><span class="ic">📋</span><div><b>Posúdenie (hodnotenie) rizík</b><span class="t">Identifikácia a hodnotenie rizík — základný a najdôležitejší dokument (§ 6 zákona 124/2006).</span></div></div>
  <div class="doc-chip"><span class="ic">📝</span><div><b>Pracovné a technologické postupy</b><span class="t">Bezpečné postupy pre rizikové činnosti a obsluhu strojov.</span></div></div>
  <div class="doc-chip"><span class="ic">🎓</span><div><b>Oboznamovanie a školenia</b><span class="t">Záznamy o školeniach BOZP zamestnancov a vedúcich pracovníkov.</span></div></div>
  <div class="doc-chip"><span class="ic">🦺</span><div><b>Prideľovanie OOPP</b><span class="t">Zoznam a záznamy o prevzatí osobných ochranných pracovných prostriedkov.</span></div></div>
  <div class="doc-chip"><span class="ic">🩺</span><div><b>Zdravotná spôsobilosť</b><span class="t">Posudzovanie zdravotnej spôsobilosti na prácu (lekárske prehliadky).</span></div></div>
  <div class="doc-chip"><span class="ic">📑</span><div><b>Evidencia úrazov</b><span class="t">Registrácia a evidencia pracovných úrazov a nebezpečných udalostí.</span></div></div>
</div>

<div class="clanok-box is-tip"><p><strong>Tip pre malé firmy:</strong> Nemusíte mať desiatky šanónov. Začnite tým najdôležitejším — <strong>posúdením rizík</strong> — a postupne dopĺňajte zvyšok podľa svojich činností.</p></div>

<h2>Čo hrozí, ak dokumentáciu nemáte</h2>
<div class="clanok-box is-warn"><p><strong>⚠️ Pozor:</strong> Inšpektorát práce pri kontrole žiada dokumentáciu BOZP ako prvé. Za jej absenciu alebo nedostatky hrozia <strong>pokuty</strong> — a v prípade úrazu aj zodpovednosť zamestnávateľa.</p></div>

<h2>Od čoho začať</h2>
<p>Základom celej dokumentácie je <strong>posúdenie rizík</strong> — vychádza z neho potreba opatrení, OOPP aj školení. Ak ho ešte nemáte, je to prvý a najdôležitejší krok.</p>

<div class="clanok-cta">
  <p><strong>Začnite posúdením rizík — prvé máte zadarmo.</strong></p>
  <a class="btn btn-primary" href="/login">Vytvoriť hodnotenie zadarmo</a>
  <a class="btn btn-ghost" href="/blog/ako-vypracovat-hodnotenie-rizik">Ako na to — návod</a>
</div>

<p class="clanok-disc">Tento článok má informatívny charakter a nenahrádza odborné posúdenie. Rozsah dokumentácie závisí od konkrétnej činnosti firmy a posúdi ho odborne spôsobilá osoba.</p>
`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
