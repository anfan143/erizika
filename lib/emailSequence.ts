// Automatická uvítacia e-mailová séria (nurture). afterDays = počet dní od zápisu.
const BASE = "https://www.erizika.sk";

function btn(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#1E8E5A;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:8px">${label}</a>`;
}

function matica() {
  const farby = ["#2BB673", "#2BB673", "#E09B00", "#E09B00", "#D96B1F", "#D96B1F", "#C2382A"];
  const bunky = farby
    .map((c, i) => `<td width="24" height="14" style="background:${c};border-radius:3px;font-size:0;line-height:14px">&nbsp;</td>${i < farby.length - 1 ? '<td width="5" style="font-size:0">&nbsp;</td>' : ""}`)
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${bunky}</tr></table>`;
}

function layout(inner: string, unsubUrl: string) {
  return `<!DOCTYPE html><html lang="sk"><body style="margin:0;padding:0;background:#f3f5f7;font-family:Arial,Helvetica,sans-serif;color:#1b2430">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f5f7"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%">
    <tr><td style="background:#16212D;border-radius:14px 14px 0 0;padding:22px 26px 16px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="padding-right:14px;vertical-align:middle"><img src="${BASE}/api/logo" width="46" height="46" alt="" style="display:block;border-radius:10px"></td>
        <td style="vertical-align:middle">
          <a href="${BASE}" style="color:#ffffff;text-decoration:none;font-weight:700;font-size:20px;letter-spacing:.3px">e-rizika.sk</a>
          <div style="color:#9FB0C2;font-size:12px;margin-top:2px">Hodnotenie rizík BOZP</div>
        </td>
      </tr></table>
      <div style="height:14px;line-height:14px;font-size:0">&nbsp;</div>
      ${matica()}
    </td></tr>
    <tr><td style="background:#F5B700;height:5px;line-height:5px;font-size:0">&nbsp;</td></tr>
    <tr><td style="background:#ffffff;border-radius:0 0 14px 14px;padding:28px 26px;font-size:15px;line-height:1.6;color:#243345">
      ${inner}
    </td></tr>
    <tr><td style="text-align:center;color:#8a93a0;font-size:11.5px;line-height:1.6;padding:18px 10px">
      HAVCO s. r. o. · Papiernická 1789/15, 034 01 Ružomberok<br>
      <a href="${BASE}" style="color:#8a93a0">www.erizika.sk</a> &nbsp;·&nbsp; <a href="${unsubUrl}" style="color:#8a93a0;text-decoration:underline">Odhlásiť sa</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

export type Step = { afterDays: number; subject: string; render: (unsubUrl: string) => string };

export const SEQUENCE: Step[] = [
  {
    afterDays: 0,
    subject: "Váš Checklist BOZP dokumentácie",
    render: (u) => layout(`
      <p style="margin:0 0 14px"><strong>Ďakujeme!</strong> Tu je váš Checklist BOZP dokumentácie — prehľad dokumentov, ktoré by mala mať každá firma.</p>
      <p style="margin:0 0 20px">Prejdite si ho a odškrtnite, čo už máte spracované. Začnite tým najdôležitejším — posúdením rizík.</p>
      <p style="margin:0 0 22px">${btn(BASE + "/api/checklist", "Otvoriť checklist (PDF)")}</p>
      <p style="margin:0;color:#5b6675;font-size:13.5px">V najbližších dňoch vám pošleme pár užitočných tipov k BOZP. Ak vás nezaujímajú, kedykoľvek sa môžete odhlásiť.</p>
    `, u),
  },
  {
    afterDays: 2,
    subject: "3 časté chyby v BOZP dokumentácii",
    render: (u) => layout(`
      <p style="margin:0 0 14px">Pri kontrole inšpektorátu práce sa najčastejšie opakujú tri chyby:</p>
      <ol style="margin:0 0 18px;padding-left:20px">
        <li style="margin:6px 0">Príliš všeobecné riziká bez väzby na konkrétnu činnosť.</li>
        <li style="margin:6px 0">Opatrenia formulované ako fráza, ktorá sa nedá skontrolovať.</li>
        <li style="margin:6px 0">Chýbajúce zostatkové riziko a doložka o prehodnocovaní.</li>
      </ol>
      <p style="margin:0 0 22px">Ako má hodnotenie rizík vyzerať správne (aj so vzorom) sme rozpísali na blogu:</p>
      <p style="margin:0 0 4px">${btn(BASE + "/blog/co-musi-obsahovat-hodnotenie-rizik", "Čítať návod")}</p>
    `, u),
  },
  {
    afterDays: 4,
    subject: "Hodnotenie rizík za pár minút",
    render: (u) => layout(`
      <p style="margin:0 0 14px">Vypracovať hodnotenie rizík ručne zaberie hodiny — vypisovanie nebezpečenstiev, matica, opatrenia, OOPP.</p>
      <p style="margin:0 0 18px">Náš nástroj to spraví za vás: ku každej zadanej činnosti pripraví kompletný návrh z databázy overených rizík. Výstup stiahnete ako Word a PDF.</p>
      <p style="margin:0 0 22px">${btn(BASE + "/login", "Vyskúšať zadarmo")}</p>
      <p style="margin:0;color:#5b6675;font-size:13.5px">Prvé hodnotenie je zadarmo — bez záväzku.</p>
    `, u),
  },
  {
    afterDays: 7,
    subject: "Prvé hodnotenie máte zadarmo",
    render: (u) => layout(`
      <p style="margin:0 0 14px">Posúdenie rizík je zákonná povinnosť každého zamestnávateľa — a základ celej dokumentácie BOZP.</p>
      <p style="margin:0 0 18px">Skúste si vytvoriť prvé hodnotenie zadarmo. Uvidíte celý výsledok v plnej kvalite a sami posúdite, či vám to ušetrí čas.</p>
      <p style="margin:0 0 4px">${btn(BASE + "/login", "Vytvoriť hodnotenie zadarmo")}</p>
    `, u),
  },
];
