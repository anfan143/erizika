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
          backgroundImage: "linear-gradient(135deg, #1B2A3D 0%, #16212D 55%, #0F1822 100%)",
          fontFamily: ff,
        }}
      >
        <div style={{ display: "flex", fontSize: 420, fontWeight: 700, color: "#ffffff", letterSpacing: -12, lineHeight: 1 }}>HR</div>
        <div style={{ display: "flex", width: 312, height: 18, background: "#F5A524", borderRadius: 9, margin: "40px 0 32px" }} />
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, color: "#F5A524", letterSpacing: 2 }}>e-rizika.sk</div>
      </div>
    ),
    { width: 1024, height: 1024, fonts }
  );
}
