import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Neprihlásený." }, { status: 401 });
  const { data } = await supabase.from("documents")
    .select("id, title, payload, created_at")
    .eq("id", params.id).eq("user_id", user.id).single();
  if (!data) return NextResponse.json({ error: "Nenájdené." }, { status: 404 });
  return NextResponse.json(data);
}
