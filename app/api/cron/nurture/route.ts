import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { sendEmail } from "@/lib/resend";
import { SEQUENCE } from "@/lib/emailSequence";

export const runtime = "nodejs";
export const maxDuration = 60;

// Denný cron — pošle ďalší krok série kontaktom, ktorým už „dozrel" (podľa afterDays).
export async function GET(req: NextRequest) {
  // Ak je nastavený CRON_SECRET, vyžadujeme ho (Vercel ho posiela ako Bearer).
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const admin = supabaseAdmin();
  const { data: leads } = await admin
    .from("leads")
    .select("id, email, created_at, sequence_step, unsub_token")
    .eq("unsubscribed", false)
    .lt("sequence_step", SEQUENCE.length)
    .limit(100);

  const now = Date.now();
  let sent = 0;
  for (const l of leads || []) {
    const step = SEQUENCE[l.sequence_step as number];
    if (!step) continue;
    const due = new Date(l.created_at as string).getTime() + step.afterDays * 86400000;
    if (now < due) continue;
    try {
      const unsubUrl = `https://www.erizika.sk/api/unsubscribe?t=${l.unsub_token}`;
      await sendEmail({ to: l.email as string, subject: step.subject, html: step.render(unsubUrl) });
      await admin
        .from("leads")
        .update({ sequence_step: (l.sequence_step as number) + 1, last_email_at: new Date().toISOString() })
        .eq("id", l.id);
      sent++;
    } catch {
      // necháme na ďalší beh
    }
  }

  return NextResponse.json({ ok: true, processed: leads?.length ?? 0, sent });
}
