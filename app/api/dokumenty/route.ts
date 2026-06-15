import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { zistiOpravnenie } from "@/lib/opravnenia";

export async function GET() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { data } = await supabase.from("documents")
    .select("id, title, created_at")
    .eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
  return NextResponse.json({ documents: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { title, payload } = await req.json();
  if (!payload) return NextResponse.json({ error: "vstup" }, { status: 400 });

  const ent = await zistiOpravnenie(supabase, user.id);
  if (ent.mode === "none") return NextResponse.json({ error: "limit" }, { status: 402 });
  if (ent.mode === "free" && ent.docsCount >= 1) return NextResponse.json({ error: "limit" }, { status: 402 });

  const { data: doc, error } = await supabase.from("documents")
    .insert({ user_id: user.id, title: String(title || "Hodnotenie rizík").slice(0, 200), payload })
    .select("id").single();
  if (error) return NextResponse.json({ error: "ulozenie" }, { status: 500 });
  return NextResponse.json({ id: doc.id });
}
