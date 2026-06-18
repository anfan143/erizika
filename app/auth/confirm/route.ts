import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = supabaseServer();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      // pri obnove hesla pošli používateľa nastaviť nové heslo, inak do aplikácie
      const dest = type === "recovery" ? "/auth/reset" : "/app";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
