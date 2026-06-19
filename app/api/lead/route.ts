import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch {}
  const email = String(body?.email || "").trim().toLowerCase();
  const source = String(body?.source || "neznamy").slice(0, 60);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Zadajte platný e-mail." }, { status: 400 });
  }

  try {
    const admin = supabaseAdmin();
    // duplicitný e-mail neprepisujeme (ignoreDuplicates) — beriem ako úspech
    const { error } = await admin
      .from("leads")
      .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });
    if (error) throw error;
  } catch {
    return NextResponse.json({ error: "Nepodarilo sa uložiť. Skúste to o chvíľu." }, { status: 500 });
  }

  // PDF doručíme okamžite (priamy odkaz). E-mailová séria príde v ďalšom kroku.
  return NextResponse.json({ ok: true, pdf: "/api/checklist" });
}
