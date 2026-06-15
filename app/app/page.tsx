import { supabaseServer } from "@/lib/supabaseServer";
import { zistiOpravnenie } from "@/lib/opravnenia";
import { redirect } from "next/navigation";
import Generator from "./Generator";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const ent = await zistiOpravnenie(supabase, user.id);

  return (
    <Generator
      email={user.email ?? ""}
      plan={ent.planLabel}
      mode={ent.mode}
      maxCinnosti={ent.maxCinnosti}
    />
  );
}
