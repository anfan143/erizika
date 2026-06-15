import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer, supabaseAdmin } from "@/lib/supabaseServer";

const PLANY: Record<string, { env: string; mode: "subscription" | "payment" }> = {
  mesacne: { env: "STRIPE_PRICE_MONTHLY", mode: "subscription" },
  stvrtrok: { env: "STRIPE_PRICE_3M", mode: "subscription" },
  polrok: { env: "STRIPE_PRICE_6M", mode: "subscription" },
  rok: { env: "STRIPE_PRICE_YEAR", mode: "subscription" },
  projekt: { env: "STRIPE_PRICE_PROJECT", mode: "payment" },
};

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Neprihlásený." }, { status: 401 });

  const { plan } = await req.json();
  const cfg = PLANY[plan];
  const price = cfg ? process.env[cfg.env] : undefined;
  if (!cfg || !price) return NextResponse.json({ error: "Neznámy balík." }, { status: 400 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const admin = supabaseAdmin();

  // zákazník v Stripe (vytvoriť raz, pamätať)
  const { data: profil } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single();
  let customer = profil?.stripe_customer_id as string | undefined;
  if (!customer) {
    const c = await stripe.customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id } });
    customer = c.id;
    await admin.from("profiles").update({ stripe_customer_id: customer }).eq("id", user.id);
  }

  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: cfg.mode,
    customer,
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/app?platba=ok`,
    cancel_url: `${origin}/app`,
    metadata: { user_id: user.id, plan },
    ...(cfg.mode === "subscription" ? { subscription_data: { metadata: { user_id: user.id } } } : {}),
  });
  return NextResponse.json({ url: session.url });
}
