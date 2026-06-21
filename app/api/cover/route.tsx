import { ImageResponse } from "next/og";
import { brandFonts } from "@/lib/ogFont";

// Titulné fotky na mieru pre sociálne siete.
// /api/cover?t=fb  → Facebook (1640×624)
// /api/cover?t=li  → LinkedIn (1128×191)
export const runtime = "edge";

const MATRIX = ["#2BB673", "#2BB673", "#F5A524", "#F5A524", "#EF8C2B", "#EF8C2B", "#E5484D"];
const hexR = (r: number) => (r <= 4 ? "#1E8E5A" : r <= 9 ? "#E09B00" : r <= 15 ? "#D96B1F" : "#C2382A");

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") || "fb";
  const fonts = await brandFonts();
  const ff = fonts ? "Brand" : "sans-serif";

  if (t === "li") {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", backgroundImage: "linear-gradient(135deg, #1B2A3D 0%, #111418 60%)", fontFamily: ff }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 104, height: 104, borderRadius: 20, background: "#1b1f24", border: "3px solid #F5A524", fontSize: 46, fontWeight: 700, color: "#fff" }}>HR</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>e-rizika.sk</div>
              <div style={{ display: "flex", fontSize: 28, color: "#AEB7C2", marginTop: 4 }}>Hodnotenie rizík BOZP za pár minút</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {MATRIX.map((c, i) => (
              <div key={i} style={{ display: "flex", width: 40, height: 40, borderRadius: 8, background: c }} />
            ))}
          </div>
        </div>
      ),
      { width: 1128, height: 191, fonts }
    );
  }

  // Facebook (default)
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 90px", backgroundImage: "linear-gradient(135deg, #1B2A3D 0%, #111418 62%)", fontFamily: ff }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700, color: "#F5A524", letterSpacing: 1 }}>e-rizika.sk</div>
          <div style={{ display: "flex", fontSize: 80, fontWeight: 700, color: "#fff", letterSpacing: -2, lineHeight: 1.04, marginTop: 8 }}>HODNOTENIE RIZÍK BOZP</div>
          <div style={{ display: "flex", fontSize: 58, fontStyle: "italic", color: "#F5A524", marginTop: 2 }}>za pár minút</div>
          <div style={{ display: "flex", fontSize: 28, color: "#AEB7C2", marginTop: 22 }}>nebezpečenstvá · opatrenia · OOPP · zostatkové riziko · Word + PDF</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[5, 4, 3, 2, 1].map((z) => (
            <div key={z} style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((p) => (
                <div key={p} style={{ display: "flex", width: 62, height: 62, borderRadius: 10, background: hexR(z * p) }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1640, height: 624, fonts }
  );
}
