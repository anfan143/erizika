import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// OAuth callback (Google) a obnova hesla: výmena kódu za session.
// next = cieľová relatívna cesta po prihlásení (napr. /auth/reset pri obnove hesla).
function safeNext(raw: string | null): string {
  // povolíme len internú relatívnu cestu (žiadny open-redirect na cudziu doménu)
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/app";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));
  if (code) {
    const supabase = supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
