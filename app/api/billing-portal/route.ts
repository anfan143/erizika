import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Neprihlásený." }, { status: 401 });

  const { data: profil } = await supabase
    .from("profiles").select("stripe_customer_id").eq("id", user.id).single();
  const customer = profil?.stripe_customer_id as string | undefined;
  if (!customer) return NextResponse.json({ error: "Žiadne predplatné na správu." }, { status: 400 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const origin = new URL(req.url).origin;
  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${origin}/app`,
  });
  return NextResponse.json({ url: session.url });
}
