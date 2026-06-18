// ───────────────────────────────────────────────────────────────────
// FIREMNÉ ÚDAJE PREVÁDZKOVATEĽA
// Vyplň hodnoty nižšie. Použijú sa v pätičke, VOP, GDPR aj na faktúrach.
// Polia označené [DOPLŇ: ...] treba nahradiť skutočnými údajmi z OR/ŽR.
// ───────────────────────────────────────────────────────────────────

type FirmaInfo = {
  obchodneMeno: string;
  sidlo: string;
  ico: string;
  dic: string;
  platcaDPH: boolean;
  icDph: string;
  zapis: string;
  konatel: string;
  email: string;
  telefon: string;
  web: string;
  dozor: string;
};

export const FIRMA: FirmaInfo = {
  // Obchodné meno presne ako v Obchodnom registri, vrátane "s. r. o."
  obchodneMeno: "[DOPLŇ: obchodné meno, napr. ECOPOWER s. r. o.]",

  // Sídlo: ulica a číslo, PSČ a mesto
  sidlo: "[DOPLŇ: Ulica 123, 010 01 Mesto]",

  // IČO (8-miestne)
  ico: "[DOPLŇ: IČO]",

  // DIČ (daňové identifikačné číslo)
  dic: "[DOPLŇ: DIČ]",

  // Neplatiteľ DPH → false. Keď sa staneš platcom, prepni na true a doplň IČ DPH.
  platcaDPH: false,
  icDph: "", // vyplň len ak platcaDPH = true (napr. "SK1234567890")

  // Zápis v registri (skopíruj z výpisu z OR)
  zapis: "[DOPLŇ: Obchodný register Mestského súdu …, oddiel Sro, vložka č. …]",

  // Konateľ / štatutár
  konatel: "[DOPLŇ: meno a priezvisko konateľa]",

  // Kontakt
  email: "info@erizika.sk",
  telefon: "", // nepovinné, napr. "+421 9xx xxx xxx"
  web: "www.erizika.sk",

  // Orgán dozoru (pre spotrebiteľov) — Slovenská obchodná inšpekcia, miestne príslušný inšpektorát
  dozor:
    "Slovenská obchodná inšpekcia (SOI), Inšpektorát SOI pre príslušný kraj podľa sídla prevádzkovateľa. www.soi.sk",
};

// Dátum poslednej aktualizácie právnych dokumentov (zobrazí sa na stránkach)
export const PRAVNE_AKTUALIZOVANE = "18. 6. 2026";
