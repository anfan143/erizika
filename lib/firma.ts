// ───────────────────────────────────────────────────────────────────
// FIREMNÉ ÚDAJE PREVÁDZKOVATEĽA
// Použijú sa v pätičke, VOP, GDPR aj na faktúrach.
// Polia označené [DOPLŇ: ...] treba ešte nahradiť skutočnými údajmi z OR.
// ───────────────────────────────────────────────────────────────────

type FirmaInfo = {
  obchodneMeno: string;
  sidlo: string;
  ico: string;
  dic: string;
  platcaDPH: boolean; // riadny platiteľ §4 = true; neplatiteľ (aj §7a) = false
  icDph: string;
  zapis: string;
  konatel: string;
  email: string;
  telefon: string;
  web: string;
  dozor: string;
  iban: string;
  swift: string;
  banka: string;
};

export const FIRMA: FirmaInfo = {
  // Obchodné meno presne ako v Obchodnom registri, vrátane "s. r. o."
  obchodneMeno: "HAVCO s. r. o.",

  // Sídlo: ulica a číslo, PSČ a mesto
  sidlo: "[DOPLŇ: Ulica 123, 010 01 Mesto]",

  // IČO (8-miestne)
  ico: "57 317 917",

  // DIČ (daňové identifikačné číslo)
  dic: "2122666898",

  // Riadny platiteľ DPH §4 → true (ceny s DPH). Neplatiteľ vrátane §7a → false (ceny konečné).
  platcaDPH: false,
  icDph: "SK2122666898", // registrácia §7a (len pre zahraničné služby), domáce ceny bez DPH

  // Zápis v registri (skopíruj z výpisu z OR)
  zapis: "[DOPLŇ: Obchodný register Mestského súdu …, oddiel Sro, vložka č. …]",

  // Konateľ / štatutár
  konatel: "[DOPLŇ: meno a priezvisko konateľa]",

  // Kontakt
  email: "info@erizika.sk",
  telefon: "", // nepovinné, napr. "+421 9xx xxx xxx"
  web: "www.erizika.sk",

  // Orgán dozoru (pre spotrebiteľov) — Slovenská obchodná inšpekcia
  dozor:
    "Slovenská obchodná inšpekcia (SOI), Inšpektorát SOI pre príslušný kraj podľa sídla prevádzkovateľa. www.soi.sk",

  // Bankové spojenie (pre faktúry)
  iban: "SK28 8330 0000 0022 0339 8433",
  swift: "FIOZSKBAXXX",
  banka: "Fio banka",
};

// Dátum poslednej aktualizácie právnych dokumentov (zobrazí sa na stránkach)
export const PRAVNE_AKTUALIZOVANE = "18. 6. 2026";
