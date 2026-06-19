import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "e-rizika.sk — hodnotenie rizík BOZP za pár minút";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Plné TTF (všetky slovenské znaky) + kurzíva. Timeout + kontrola odpovede, aby
// pomalé/zlé CDN nikdy nezhodilo vykreslenie — vtedy padne na systémový font.
async function font(url: string) {
  const r = await fetch(url, { signal: AbortSignal.timeout(3000), cache: "force-cache" });
  if (!r.ok) throw new Error("font");
  return r.arrayBuffer();
}
async function nacitajFonty() {
  try {
    const base = "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/";
    const [reg, bold, obl] = await Promise.all([
      font(base + "DejaVuSans.ttf"),
      font(base + "DejaVuSans-Bold.ttf"),
      font(base + "DejaVuSans-Oblique.ttf"),
    ]);
    return [
      { name: "Brand", data: reg, weight: 400 as const, style: "normal" as const },
      { name: "Brand", data: bold, weight: 700 as const, style: "normal" as const },
      { name: "Brand", data: obl, weight: 400 as const, style: "italic" as const },
    ];
  } catch {
    return undefined;
  }
}

export default async function OgImage() {
  const fonts = await nacitajFonty();
  const ff = fonts ? "Brand" : "sans-serif";
  const matrix = ["#2BB673", "#2BB673", "#F5A524", "#F5A524", "#EF8C2B", "#EF8C2B", "#E5484D"];
  const amber = "rgba(245,165,36,0.30)";
  const steel = "rgba(255,255,255,0.10)";

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111418",
          padding: "58px 70px",
          fontFamily: ff,
          color: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Pozadie: žeriav (vpravo hore) + lešenie (pravý bok) — jemná čiarová grafika */}
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          <g stroke={amber} strokeWidth="2.2" fill="none" strokeLinecap="round">
            {/* vežový žeriav */}
            <line x1="951" y1="58" x2="951" y2="338" />
            <line x1="972" y1="64" x2="972" y2="338" />
            <path d="M951 96 L972 126 M972 96 L951 126 M951 156 L972 186 M972 156 L951 186 M951 216 L972 246 M972 216 L951 246 M951 276 L972 306 M972 276 L951 306" />
            {/* hlava + ťahadlá */}
            <line x1="961" y1="26" x2="961" y2="62" />
            <path d="M961 26 L795 92 M961 26 L1078 104" />
            {/* výložník vľavo */}
            <line x1="961" y1="92" x2="770" y2="92" />
            <line x1="955" y1="110" x2="792" y2="110" />
            <path d="M792 110 L822 92 M850 110 L880 92 M908 110 L938 92" />
            {/* protizávažie vpravo */}
            <line x1="961" y1="102" x2="1070" y2="102" />
            <rect x="1062" y="92" width="26" height="22" />
            {/* lano + hák */}
            <line x1="835" y1="92" x2="835" y2="206" />
            <path d="M829 206 a6 6 0 0 0 12 0" />
          </g>
          <g stroke={steel} strokeWidth="2" fill="none">
            {/* lešenie — úzka veža v pravom okraji */}
            <line x1="1112" y1="196" x2="1112" y2="470" />
            <line x1="1168" y1="196" x2="1168" y2="470" />
            <line x1="1112" y1="196" x2="1168" y2="196" />
            <line x1="1112" y1="242" x2="1168" y2="242" />
            <line x1="1112" y1="288" x2="1168" y2="288" />
            <line x1="1112" y1="334" x2="1168" y2="334" />
            <line x1="1112" y1="380" x2="1168" y2="380" />
            <line x1="1112" y1="426" x2="1168" y2="426" />
            <line x1="1112" y1="470" x2="1168" y2="470" />
            <path d="M1112 242 L1168 288 M1168 334 L1112 380 M1112 426 L1168 470" />
          </g>
        </svg>

        {/* značka */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 70,
              height: 70,
              borderRadius: 16,
              background: "#1b1f24",
              border: "2px solid #F5A524",
              fontSize: 29,
              fontWeight: 700,
            }}
          >
            HR
          </div>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 700, letterSpacing: 0.5 }}>e-rizika.sk</div>
        </div>

        {/* nadpis */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5 }}>
            HODNOTENIE RIZÍK BOZP
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 50,
              fontStyle: "italic",
              fontWeight: 400,
              color: "#F5A524",
              letterSpacing: -0.5,
              marginTop: 4,
            }}
          >
            za pár minút
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 400, color: "#AEB7C2", letterSpacing: -0.2, marginTop: 20 }}>
            nebezpečenstvá · opatrenia · ochranné prostriedky · zostatkové riziko
          </div>
        </div>

        {/* spodok: matica vľavo + CTA vpravo */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {matrix.map((c, i) => (
              <div key={i} style={{ display: "flex", width: 36, height: 36, borderRadius: 8, background: c }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#F5A524",
                color: "#111418",
                fontSize: 26,
                fontWeight: 700,
                padding: "14px 30px",
                borderRadius: 999,
                letterSpacing: -0.3,
              }}
            >
              Vyskúšajte zadarmo
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 19,
                  color: "#C8D0DA",
                  border: "1px solid #353C47",
                  borderRadius: 999,
                  padding: "7px 16px",
                }}
              >
                jednorazový projekt 15 €
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 19,
                  color: "#C8D0DA",
                  border: "1px solid #353C47",
                  borderRadius: 999,
                  padding: "7px 16px",
                }}
              >
                predplatné od 19 €/mes
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
