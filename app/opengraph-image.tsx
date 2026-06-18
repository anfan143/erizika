import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "e-rizika.sk — hodnotenie rizík BOZP za pár minút";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Font s plnou slovenskou diakritikou (rovnaký ako v PDF). Ak sa nepodarí načítať,
// obrázok sa aj tak vykreslí systémovým fontom — nikdy to nezhodí build.
async function nacitajFonty() {
  try {
    // timeout, aby pomalé CDN nikdy nezablokovalo vykreslenie obrázka
    const opts = { signal: AbortSignal.timeout(3000), cache: "force-cache" as const };
    const [reg, bold] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf", opts).then((r) => r.arrayBuffer()),
      fetch("https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf", opts).then((r) => r.arrayBuffer()),
    ]);
    return [
      { name: "DejaVu", data: reg, weight: 400 as const, style: "normal" as const },
      { name: "DejaVu", data: bold, weight: 700 as const, style: "normal" as const },
    ];
  } catch {
    return undefined;
  }
}

export default async function OgImage() {
  const fonts = await nacitajFonty();
  const matrix = ["#2BB673", "#2BB673", "#F5A524", "#F5A524", "#EF8C2B", "#EF8C2B", "#E5484D"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111418",
          padding: "64px 72px",
          fontFamily: fonts ? "DejaVu" : "sans-serif",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "#1b1f24",
              border: "2px solid #F5A524",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            HR
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: 1 }}>e-rizika.sk</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 60, fontWeight: 700, lineHeight: 1.12, marginBottom: 18 }}>
            Hodnotenie rizík BOZP za pár minút
          </div>
          <div style={{ display: "flex", fontSize: 29, color: "#B8C0CC", lineHeight: 1.3 }}>
            Nebezpečenstvá · opatrenia · OOPP · zostatkové riziko — export do Wordu a PDF
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {matrix.map((c, i) => (
              <div key={i} style={{ display: "flex", width: 40, height: 40, borderRadius: 8, background: c }} />
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#8A92A0" }}>v súlade s 124/2006 Z. z.</div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
