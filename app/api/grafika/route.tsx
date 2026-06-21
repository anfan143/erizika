import { ImageResponse } from "next/og";
import { brandFonts } from "@/lib/ogFont";

// Štvorcové brandové grafiky (1080×1080) na príspevky pre Instagram + Facebook.
// /api/grafika?t=intro | checklist | matica | cennik
export const runtime = "edge";

const hexR = (r: number) => (r <= 4 ? "#1E8E5A" : r <= 9 ? "#E09B00" : r <= 15 ? "#D96B1F" : "#C2382A");

function Header() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 84, height: 84, borderRadius: 18, background: "#1b1f24", border: "3px solid #F5A524", fontSize: 38, fontWeight: 700, color: "#fff" }}>HR</div>
      <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>e-rizika.sk</div>
    </div>
  );
}
function Footer() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: "#F5A524" }} />
      <div style={{ display: "flex", fontSize: 30, color: "#AEB7C2" }}>www.erizika.sk</div>
    </div>
  );
}
function Pill({ text }: { text: string }) {
  return <div style={{ display: "flex", background: "#F5A524", color: "#111418", fontSize: 38, fontWeight: 700, padding: "20px 44px", borderRadius: 999 }}>{text}</div>;
}

function telo(t: string) {
  if (t === "checklist") {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 42, color: "#F5A524", fontWeight: 700 }}>ZADARMO NA STIAHNUTIE</div>
        <div style={{ display: "flex", fontSize: 86, fontWeight: 700, color: "#fff", lineHeight: 1.05, letterSpacing: -2, marginTop: 10 }}>CHECKLIST BOZP DOKUMENTÁCIE</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 34, gap: 16 }}>
          <div style={{ display: "flex", fontSize: 38, color: "#C8D0DA" }}>✓ 10 oblastí povinnej dokumentácie</div>
          <div style={{ display: "flex", fontSize: 38, color: "#C8D0DA" }}>✓ podľa platnej legislatívy 2026</div>
          <div style={{ display: "flex", fontSize: 38, color: "#C8D0DA" }}>✓ pripravené na odškrtnutie</div>
        </div>
      </div>
    );
  }
  if (t === "matica") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#fff", letterSpacing: -2 }}>MATICA RIZÍK</div>
        <div style={{ display: "flex", fontSize: 46, color: "#F5A524", fontWeight: 700, marginTop: 4, marginBottom: 28 }}>R = P × Z</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[5, 4, 3, 2, 1].map((z) => (
            <div key={z} style={{ display: "flex", gap: 12 }}>
              {[1, 2, 3, 4, 5].map((p) => {
                const r = z * p;
                return (
                  <div key={p} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 116, height: 116, borderRadius: 14, background: hexR(r), color: "#fff", fontSize: 44, fontWeight: 700 }}>{r}</div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (t === "cennik") {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, color: "#fff", letterSpacing: -2 }}>ZAČNITE ZADARMO</div>
        <div style={{ display: "flex", fontSize: 38, color: "#AEB7C2", marginTop: 16 }}>Prvé hodnotenie rizík je na nás.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 36 }}>
          <div style={{ display: "flex", fontSize: 44, color: "#fff" }}>Jednorazový projekt — 15 €</div>
          <div style={{ display: "flex", fontSize: 44, color: "#fff" }}>Predplatné — od 19 € / mes</div>
        </div>
        <div style={{ display: "flex", marginTop: 40 }}><Pill text="Vyskúšajte zadarmo" /></div>
      </div>
    );
  }
  // intro (default)
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", fontSize: 100, fontWeight: 700, color: "#fff", lineHeight: 1.04, letterSpacing: -2 }}>HODNOTENIE RIZÍK BOZP</div>
      <div style={{ display: "flex", fontSize: 76, fontStyle: "italic", color: "#F5A524", marginTop: 6 }}>za pár minút</div>
      <div style={{ display: "flex", fontSize: 34, color: "#AEB7C2", marginTop: 30 }}>nebezpečenstvá · opatrenia · OOPP · zostatkové riziko</div>
      <div style={{ display: "flex", marginTop: 42 }}><Pill text="Vyskúšajte zadarmo" /></div>
    </div>
  );
}

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") || "intro";
  const fonts = await brandFonts();
  const ff = fonts ? "Brand" : "sans-serif";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage: "linear-gradient(135deg, #1B2A3D 0%, #111418 60%)",
          padding: 72,
          fontFamily: ff,
        }}
      >
        <Header />
        <div style={{ display: "flex", flexGrow: 1, alignItems: "center" }}>{telo(t)}</div>
        <Footer />
      </div>
    ),
    { width: 1080, height: 1080, fonts }
  );
}
