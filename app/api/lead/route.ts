import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { sendEmail } from "@/lib/resend";
import { SEQUENCE } from "@/lib/emailSequence";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Jednoduchý rate-limit na IP (best-effort, v pamäti inštancie). Pri Vercel to
// zachytí rýchle dávky z jednej IP; nie je to náhrada za Redis, ale výrazne zvýši
// latku proti zneužitiu verejného endpointu.
const HITS = new Map<string, number[]>();
function rateOk(ip: string, max = 6, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { HITS.set(ip, arr); return false; }
  arr.push(now);
  HITS.set(ip, arr);
  if (HITS.size > 5000) HITS.clear();
  return true;
}

export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch {}
  const email = String(body?.email || "").trim().toLowerCase();
  const source = String(body?.source || "neznamy").slice(0, 60);

  // Honeypot: skryté pole „website" vyplnia len boti → tichá akceptácia, nič neukladáme.
  if (String(body?.website || "").trim() !== "") {
    return NextResponse.json({ ok: true, pdf: "/api/checklist" });
  }

  // Rate-limit na IP.
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (!rateOk(ip)) {
    return NextResponse.json({ error: "Príliš veľa pokusov. Skúste to o chvíľu." }, { status: 429 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Zadajte platný e-mail." }, { status: 400 });
  }

  const admin = supabaseAdmin();
  let novy: { id: string; unsub_token: string } | null = null;
  try {
    const { data, error } = await admin
      .from("leads")
      .insert({ email, source })
      .select("id, unsub_token")
      .single();
    if (error) {
      // 23505 = duplicitný e-mail → berieme ako úspech, nič nepošleme
      if ((error as any).code === "23505") return NextResponse.json({ ok: true, pdf: "/api/checklist" });
      throw error;
    }
    novy = data as any;
  } catch {
    return NextResponse.json({ error: "Nepodarilo sa uložiť. Skúste to o chvíľu." }, { status: 500 });
  }

  // Nový kontakt → pošli uvítací e-mail (krok 0) hneď. Ak zlyhá, nechaj na cron.
  if (novy) {
    try {
      const unsubUrl = `https://www.erizika.sk/api/unsubscribe?t=${novy.unsub_token}`;
      await sendEmail({ to: email, subject: SEQUENCE[0].subject, html: SEQUENCE[0].render(unsubUrl) });
      await admin.from("leads").update({ sequence_step: 1, last_email_at: new Date().toISOString() }).eq("id", novy.id);
    } catch {}
  }

  // PDF doručíme okamžite aj priamo (odkaz v okne).
  return NextResponse.json({ ok: true, pdf: "/api/checklist" });
}
