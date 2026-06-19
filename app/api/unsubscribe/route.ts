import { type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";

// Odhlásenie z e-mailovej série podľa tokenu (GDPR).
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("t");
  let ok = false;
  if (token) {
    try {
      const admin = supabaseAdmin();
      const { error } = await admin.from("leads").update({ unsubscribed: true }).eq("unsub_token", token);
      ok = !error;
    } catch {}
  }

  const html = `<!DOCTYPE html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Odhlásenie</title></head>
<body style="margin:0;background:#f3f5f7;font-family:Arial,Helvetica,sans-serif;color:#1b2430">
<div style="max-width:480px;margin:60px auto;background:#fff;border-radius:12px;padding:32px 28px;text-align:center">
  <div style="font-weight:800;font-size:18px;color:#16212D;margin-bottom:14px">e-rizika.sk</div>
  ${ok
    ? "<p style='font-size:15px;line-height:1.6'>Boli ste odhlásení z odberu e-mailov. Už vám nebudeme posielať tipy k BOZP.</p>"
    : "<p style='font-size:15px;line-height:1.6'>Odkaz na odhlásenie je neplatný alebo už bol použitý.</p>"}
  <p style="margin-top:18px"><a href="https://www.erizika.sk" style="color:#1E8E5A">Späť na e-rizika.sk</a></p>
</div>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
