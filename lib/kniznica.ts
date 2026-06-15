import KNIZNICA from "@/data/kniznica.json";

type Zaznam = { a: string; n: string; o: string; z: number; p: number; m: { t: string; k: string }[] };

function norm(s: string) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const STOP = new Set(["prace","praca","pracovna","pracovne","pracovnej","cinnost","cinnosti","pomocou","pocas","alebo","podla","oblasti","vykon","vykonavanie"]);
function qTokens(s: string) {
  return norm(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !STOP.has(w));
}

export function findRefs(cinnost: string, pozicia: string): Zaznam[] {
  const q = qTokens(cinnost + " " + (pozicia || ""));
  if (!q.length) return [];
  const scored: [number, Zaznam][] = [];
  for (const e of KNIZNICA as Zaznam[]) {
    const hay = norm(e.a + " " + e.n + " " + e.o);
    let s = 0;
    for (const w of q) { if (hay.includes(w.slice(0, 5))) s++; }
    if (s >= Math.min(2, q.length)) scored.push([s, e]);
  }
  scored.sort((x, y) => y[0] - x[0]);
  return scored.slice(0, 4).map((x) => x[1]);
}

export function refsBlock(refs: Zaznam[]) {
  if (!refs.length) return "";
  const lines = refs.map((e, i) =>
    `${i + 1}. Nebezpečenstvo: ${e.n} | Ohrozenie: ${e.o} | Z=${e.z}, P=${e.p} | Opatrenia: ${e.m.map((m) => m.t).join(" • ")}`.slice(0, 650)
  );
  return "\n\nOVERENÉ ZÁZNAMY Z PRAXE (interná knižnica):\n" + lines.join("\n");
}
