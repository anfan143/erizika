// Odoslanie e-mailu cez Resend HTTP API.
const FROM = process.env.RESEND_FROM || "e-rizika.sk <noreply@erizika.sk>";
// Odpovede zákazníkov smerujeme na monitorovaný kontakt (nie na noreply).
const REPLY_TO = process.env.RESEND_REPLY_TO || "info@erizika.sk";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY nie je nastavený");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, reply_to: REPLY_TO, subject, html }),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`Resend ${r.status}: ${t}`);
  }
}
