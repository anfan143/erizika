import { ImageResponse } from "next/og";

// Štvorcové logo ako PNG (512×512) na stiahnutie pre Google Business, Facebook, LinkedIn...
// Otvor /api/logo → ulož obrázok → nahraj. Žiadne orezávanie.
export const runtime = "edge";

async function font(url: string) {
  const r = await fetch(url, { signal: AbortSignal.timeout(3000), cache: "force-cache" });
  if (!r.ok) throw new Error("font");
  return r.arrayBuffer();
}
async function nacitajFont() {
  try {
    return await font("https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf");
  } catch {
    return undefined;
  }
}

export async function GET() {
  const bold = await nacitajFont();
  const fonts = bold ? [{ name: "Logo", data: bold, weight: 700 as const, style: "normal" as const }] : undefined;
  const ff = fonts ? "Logo" : "sans-serif";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#16212D",
          fontFamily: ff,
        }}
      >
        <div style={{ display: "flex", fontSize: 210, fontWeight: 700, color: "#ffffff", letterSpacing: -6, lineHeight: 1 }}>HR</div>
        <div style={{ display: "flex", width: 156, height: 9, background: "#F5A524", borderRadius: 5, margin: "20px 0 16px" }} />
        <div style={{ display: "flex", fontSize: 48, fontWeight: 700, color: "#F5A524", letterSpacing: 1 }}>e-rizika.sk</div>
      </div>
    ),
    { width: 512, height: 512, fonts }
  );
}
