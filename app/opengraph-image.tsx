import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "e-rizika.sk — hodnotenie rizík BOZP za pár minút";
export const size = { width: 2400, height: 1260 };
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
          padding: "116px 140px",
          fontFamily: ff,
          color: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Pozadie: žeriav (vpravo hore) + lešenie (pravý bok) — SVG sa škáluje cez viewBox */}
        <svg width="2400" height="1260" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          <g stroke={amber} strokeWidth="2.2" fill="none" strokeLinecap="round">
            <line x1="951" y1="58" x2="951" y2="338" />
            <line x1="972" y1="64" x2="972" y2="338" />
            <path d="M951 96 L972 126 M972 96 L951 126 M951 156 L972 186 M972 156 L951 186 M951 216 L972 246 M972 216 L951 246 M951 276 L972 306 M972 276 L951 306" />
            <line x1="961" y1="26" x2="961" y2="62" />
            <path d="M961 26 L795 92 M961 26 L1078 104" />
            <line x1="961" y1="92" x2="770" y2="92" />
            <line x1="955" y1="110" x2="792" y2="110" />
            <path d="M792 110 L822 92 M850 110 L880 92 M908 110 L938 92" />
            <line x1="961" y1="102" x2="1070" y2="102" />
            <rect x="1062" y="92" width="26" height="22" />
            <line x1="835" y1="92" x2="835" y2="206" />
            <path d="M829 206 a6 6 0 0 0 12 0" />
          </g>
          <g stroke={steel} strokeWidth="2" fill="none">
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
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 140,
              height: 140,
              borderRadius: 32,
              background: "#1b1f24",
              border: "4px solid #F5A524",
              fontSize: 58,
              fontWeight: 700,
            }}
          >
            HR
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: 1 }}>e-rizika.sk</div>
        </div>

        {/* nadpis */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
            HODNOTENIE RIZÍK BOZP
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 100,
              fontStyle: "italic",
              fontWeight: 400,
              color: "#F5A524",
              letterSpacing: -1,
              marginTop: 8,
            }}
          >
            za pár minút
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 400, color: "#AEB7C2", letterSpacing: -0.4, marginTop: 40 }}>
            nebezpečenstvá · opatrenia · ochranné prostriedky · zostatkové riziko
          </div>
        </div>

        {/* spodok: matica vľavo + CTA vpravo */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 20 }}>
            {matrix.map((c, i) => (
              <div key={i} style={{ display: "flex", width: 72, height: 72, borderRadius: 16, background: c }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#F5A524",
                color: "#111418",
                fontSize: 52,
                fontWeight: 700,
                padding: "28px 60px",
                borderRadius: 999,
                letterSpacing: -0.6,
              }}
            >
              Vyskúšajte zadarmo
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 28 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 38,
                  color: "#C8D0DA",
                  border: "2px solid #353C47",
                  borderRadius: 999,
                  padding: "14px 32px",
                }}
              >
                jednorazový projekt 15 €
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 38,
                  color: "#C8D0DA",
                  border: "2px solid #353C47",
                  borderRadius: 999,
                  padding: "14px 32px",
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
