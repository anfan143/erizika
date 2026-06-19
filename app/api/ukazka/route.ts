import { NextResponse } from "next/server";
import { renderRizikoPdf } from "@/lib/pdfDocument";

// Verejné ukážkové PDF pre úvodku — bez prihlásenia, plná kvalita (bez vodoznaku).
// Obsah je pevný vzor (nie reálny dokument), slúži na ukážku výstupu pred registráciou.
export const runtime = "nodejs";
export const maxDuration = 30;

const CTX = {
  firma: "VZOROVÁ STAVBA s. r. o.",
  odvetvie: "Stavebníctvo",
  pozicia: "Montér oceľových konštrukcií",
  prostredie: "Montáž na stavenisku, práca vo výške a zváranie nosných prvkov.",
  vypracoval: "Ing. Ján Novák, ABT",
};

const VYSLEDKY = [
  {
    cinnost: "Práca na lešení vo výške nad 1,5 m",
    refs: 4,
    nebezpecenstva: [
      {
        nebezpecenstvo: "Pád z výšky",
        ohrozenie: "Pád osoby z nezaisteného okraja podlahy lešenia na nižšiu úroveň",
        P: 3, Z: 4,
        opatrenia: [
          "Inštalovať dvojtyčové zábradlie so zarážkou pri podlahe",
          "Odovzdať lešenie do užívania zápisom a vykonávať odborné prehliadky",
          "Oboznámiť zamestnancov s návodom na používanie lešenia",
        ],
        oopp: ["Ochranná prilba s podbradným pásikom EN 397", "Zachytávací postroj EN 361"],
        P2: 2, Z2: 4,
        predpisy: ["NV SR č. 392/2006 Z. z.", "vyhláška MPSVR SR č. 147/2013 Z. z."],
      },
      {
        nebezpecenstvo: "Pád predmetov z výšky",
        ohrozenie: "Zasiahnutie osoby pod lešením padajúcim náradím alebo materiálom",
        P: 3, Z: 3,
        opatrenia: [
          "Inštalovať zarážky pri podlahe a ochranné siete na vonkajšej strane lešenia",
          "Vymedziť a označiť ohrozený priestor pod lešením",
          "Ukladať materiál a náradie tak, aby nemohli spadnúť cez okraj podlahy",
        ],
        oopp: ["Ochranná prilba EN 397"],
        P2: 2, Z2: 3,
        predpisy: ["NV SR č. 392/2006 Z. z."],
      },
      {
        nebezpecenstvo: "Strata stability lešenia",
        ohrozenie: "Zrútenie nesprávne zmontovanej alebo preťaženej konštrukcie lešenia aj s osobami",
        P: 2, Z: 5,
        opatrenia: [
          "Montovať a demontovať lešenie podľa návodu výrobcu osobou s odbornou spôsobilosťou",
          "Kotviť konštrukciu podľa dokumentácie a dodržiavať nosnosť podláh",
          "Vykonávať prehliadku lešenia po nepriaznivom počasí a pred každým použitím",
        ],
        oopp: ["Ochranná prilba EN 397"],
        P2: 1, Z2: 5,
        predpisy: ["vyhláška MPSVR SR č. 147/2013 Z. z."],
      },
      {
        nebezpecenstvo: "Pošmyknutie a zakopnutie",
        ohrozenie: "Pád osoby na podlahe lešenia znečistenej blatom, námrazou alebo materiálom",
        P: 3, Z: 2,
        opatrenia: [
          "Udržiavať podlahu lešenia čistú a priebežne odstraňovať materiál a námrazu",
          "Zabezpečiť rovné a úplné podlahy bez medzier a vyčnievajúcich dosiek",
        ],
        oopp: ["Pracovná obuv s protišmykovou podrážkou EN ISO 20345"],
        P2: 2, Z2: 2,
        predpisy: ["NV SR č. 392/2006 Z. z."],
      },
    ],
  },
  {
    cinnost: "Zváranie oceľovej konštrukcie elektrickým oblúkom",
    refs: 4,
    nebezpecenstva: [
      {
        nebezpecenstvo: "Zasiahnutie elektrickým prúdom",
        ohrozenie: "Dotyk so živými časťami zváracieho okruhu pri poškodenej izolácii káblov alebo držiaka",
        P: 2, Z: 4,
        opatrenia: [
          "Kontrolovať neporušenosť káblov, držiaka elektród a zemniacej svorky pred prácou",
          "Vyradiť poškodené zariadenie z prevádzky a označiť ho",
          "Zabezpečiť prevádzkovú revíziu zváracieho zdroja v stanovenom intervale",
        ],
        oopp: ["Zváračské rukavice EN 12477", "Pracovná obuv EN ISO 20345"],
        P2: 1, Z2: 4,
        predpisy: ["vyhláška MPSVR SR č. 508/2009 Z. z."],
      },
      {
        nebezpecenstvo: "Popálenie a žiarenie oblúka",
        ohrozenie: "Popálenie odletujúcim rozžeraveným kovom a poškodenie zraku UV a IR žiarením oblúka",
        P: 3, Z: 3,
        opatrenia: [
          "Používať zváračskú kuklu so samostmievacím filtrom a ochranný odev",
          "Ohraničiť pracovisko zváračskou zástenou pred okolitými osobami",
        ],
        oopp: ["Zváračská kukla so samostmievaním EN 379", "Zváračská zástera a rukavice EN 12477"],
        P2: 2, Z2: 2,
        predpisy: ["NV SR č. 395/2006 Z. z."],
      },
      {
        nebezpecenstvo: "Požiar a výbuch",
        ohrozenie: "Vznietenie horľavých látok v okolí od iskier a rozžeraveného materiálu pri zváraní",
        P: 2, Z: 4,
        opatrenia: [
          "Odstrániť horľavé látky z okolia pracoviska do bezpečnej vzdialenosti",
          "Zabezpečiť hasiaci prístroj na pracovisku a vykonávať dohľad po skončení prác",
          "Vydať príkaz na zváranie pri prácach so zvýšeným nebezpečenstvom požiaru",
        ],
        oopp: ["Nehorľavý pracovný odev"],
        P2: 1, Z2: 4,
        predpisy: ["vyhláška MV SR č. 121/2002 Z. z."],
      },
      {
        nebezpecenstvo: "Vdýchnutie zváracích dymov",
        ohrozenie: "Poškodenie dýchacích ciest splodinami a dymom pri zváraní v stiesnenom priestore",
        P: 3, Z: 3,
        opatrenia: [
          "Zabezpečiť miestne odsávanie dymov alebo vetranie pracoviska",
          "Skrátiť čas expozície a striedať pracovníkov pri dlhšom zváraní",
        ],
        oopp: ["Filtračná polmaska s ventilom EN 149 FFP2"],
        P2: 2, Z2: 2,
        predpisy: ["NV SR č. 355/2006 Z. z."],
      },
    ],
  },
];

export async function GET() {
  const buf = await renderRizikoPdf({ ctx: CTX, vysledky: VYSLEDKY, watermark: false });
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="ukazka-hodnotenie-rizik.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
