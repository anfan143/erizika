import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// OAuth callback (Google): výmena kódu za session
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/app", request.url));
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
