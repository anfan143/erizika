import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "e-rizika.sk — hodnotenie rizík BOZP za pár minút";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Jeden plný TTF (všetky slovenské znaky) s plnou diakritikou. Timeout + kontrola
// odpovede, aby pomalé/zlé CDN nikdy nezhodilo vykreslenie — vtedy padne na systémový font.
async function font(url: string) {
  const r = await fetch(url, { signal: AbortSignal.timeout(3000), cache: "force-cache" });
  if (!r.ok) throw new Error("font");
  return r.arrayBuffer();
}
async function nacitajFonty() {
  try {
    const [reg, bold] = await Promise.all([
      font("https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf"),
      font("https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf"),
    ]);
    return [
      { name: "Brand", data: reg, weight: 400 as const, style: "normal" as const },
      { name: "Brand", data: bold, weight: 700 as const, style: "normal" as const },
    ];
  } catch {
    return undefined;
  }
}

export default async function OgImage() {
  const fonts = await nacitajFonty();
  const ff = fonts ? "Brand" : "sans-serif";
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
          padding: "60px 72px",
          fontFamily: ff,
          color: "#FFFFFF",
        }}
      >
        {/* značka */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#1b1f24",
              border: "2px solid #F5A524",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            HR
          </div>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 700, letterSpacing: 0.5 }}>e-rizika.sk</div>
        </div>

        {/* nadpis + podnadpis */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              marginBottom: 20,
            }}
          >
            HODNOTENIE RIZÍK BOZP ZA PÁR MINÚT
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 400, color: "#AEB7C2", letterSpacing: -0.2 }}>
            nebezpečenstvá · opatrenia · ochranné prostriedky · zostatkové riziko
          </div>
        </div>

        {/* spodok: matica + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {matrix.map((c, i) => (
              <div key={i} style={{ display: "flex", width: 38, height: 38, borderRadius: 8, background: c }} />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#F5A524",
              color: "#111418",
              fontSize: 26,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 999,
              letterSpacing: -0.3,
            }}
          >
            Vyskúšajte zadarmo
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
