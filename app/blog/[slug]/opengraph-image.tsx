import { ImageResponse } from "next/og";
import { getArticle } from "@/lib/blog";
import { brandFonts } from "@/lib/ogFont";

// Dynamický náhľadový obrázok pre každý článok (s jeho názvom) — pekné zdieľanie na FB/LinkedIn.
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "e-rizika.sk — blog";

export default async function Image({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  const title = a?.title || "Hodnotenie rizík BOZP";
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
          backgroundImage: "linear-gradient(135deg, #1B2A3D 0%, #111418 62%)",
          padding: 70,
          fontFamily: ff,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 66, height: 66, borderRadius: 15, background: "#1b1f24", border: "3px solid #F5A524", fontSize: 30, fontWeight: 700, color: "#fff" }}>HR</div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>e-rizika.sk · Blog</div>
        </div>

        <div style={{ display: "flex", maxWidth: 1000, fontSize: 62, fontWeight: 700, color: "#fff", lineHeight: 1.12, letterSpacing: -1 }}>
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: "#F5A524" }} />
          <div style={{ display: "flex", fontSize: 28, color: "#AEB7C2" }}>www.erizika.sk · Hodnotenie rizík BOZP za pár minút</div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
