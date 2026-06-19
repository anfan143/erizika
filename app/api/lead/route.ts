import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { sendEmail } from "@/lib/resend";
import { SEQUENCE } from "@/lib/emailSequence";

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
