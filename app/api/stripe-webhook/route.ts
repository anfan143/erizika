import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Neplatný podpis." }, { status: 400 });
  }
  const admin = supabaseAdmin();

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = s.metadata?.user_id;
      if (userId && s.mode === "payment") {
        // jednorazový projekt: obmedzený počet činností (15) / 14 dní
        const expires = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString();
        await admin.from("projects").insert({
          user_id: userId, activities_limit: 15, activities_used: 0,
          expires_at: expires, stripe_session_id: s.id,
        });
      }
      if (userId && s.mode === "subscription" && s.subscription) {
        const sub = await stripe.subscriptions.retrieve(String(s.subscription));
        const until = new Date(((sub as any).current_period_end as number) * 1000).toISOString();
        await admin.from("profiles").update({
          subscription_until: until,
          stripe_customer_id: String(s.customer ?? ""),
        }).eq("id", userId);
      }
    }
    if (event.type === "invoice.paid") {
      // predĺženie predplatného pri každej úspešnej platbe
      const inv = event.data.object as Stripe.Invoice;
      const customer = String((inv as any).customer ?? "");
      const periodEnd = (inv.lines?.data?.[0] as any)?.period?.end as number | undefined;
      if (customer && periodEnd) {
        await admin.from("profiles")
          .update({ subscription_until: new Date(periodEnd * 1000).toISOString() })
          .eq("stripe_customer_id", customer);
      }
    }
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const customer = String((sub as any).customer ?? "");
      if (customer) {
        await admin.from("profiles")
          .update({ subscription_until: new Date().toISOString() })
          .eq("stripe_customer_id", customer);
      }
    }
  } catch (e) {
    console.error("webhook error", e);
    return NextResponse.json({ error: "spracovanie zlyhalo" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
