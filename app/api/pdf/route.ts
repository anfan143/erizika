import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { zistiOpravnenie } from "@/lib/opravnenia";
import { renderRizikoPdf } from "@/lib/pdfDocument";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Neprihlásený." }, { status: 401 });

  const { ctx, vysledky } = await req.json();
  if (!Array.isArray(vysledky) || vysledky.length === 0) {
    return NextResponse.json({ error: "Žiadne dáta na export." }, { status: 400 });
  }

  // vodoznak má len verzia zadarmo / bez aktívneho balíka; platené sú bez vodoznaku
  const ent = await zistiOpravnenie(supabase, user.id);
  const watermark = ent.mode === "free" || ent.mode === "none";

  const buf = await renderRizikoPdf({ ctx: ctx || {}, vysledky, watermark });
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="hodnotenie-rizik.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
