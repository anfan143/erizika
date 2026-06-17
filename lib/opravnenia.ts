import type { SupabaseClient } from "@supabase/supabase-js";

export type Opravnenie = {
  mode: "sub" | "project" | "free" | "none";
  planLabel: string;
  maxCinnosti: number;
  projectId?: string;
  docsCount: number;
  freeGens: number;
};

/** Jediné miesto pravdy o tom, čo používateľ smie. Rozšíriteľné o ďalšie balíky/moduly. */
export async function zistiOpravnenie(supabase: SupabaseClient, userId: string): Promise<Opravnenie> {
  const now = new Date();
  const { data: profil } = await supabase
    .from("profiles").select("subscription_until, free_gens").eq("id", userId).single();
  const { count } = await supabase
    .from("documents").select("id", { count: "exact", head: true }).eq("user_id", userId);
  const docsCount = count ?? 0;
  const freeGens = profil?.free_gens ?? 0;

  const subUntil = profil?.subscription_until ? new Date(profil.subscription_until) : null;
  if (subUntil && subUntil > now) {
    return { mode: "sub", planLabel: `Predplatné do ${subUntil.toLocaleDateString("sk-SK")}`, maxCinnosti: 20, docsCount, freeGens };
  }

  const { data: projekty } = await supabase
    .from("projects").select("id, activities_limit, activities_used, expires_at")
    .eq("user_id", userId).gt("expires_at", now.toISOString())
    .order("created_at", { ascending: true });
  const aktivny = (projekty ?? []).find((p) => p.activities_used < p.activities_limit);
  if (aktivny) {
    const zostava = aktivny.activities_limit - aktivny.activities_used;
    return {
      mode: "project",
      planLabel: `Projekt: zostáva ${zostava} činností (do ${new Date(aktivny.expires_at).toLocaleDateString("sk-SK")})`,
      maxCinnosti: Math.min(zostava, 15),
      projectId: aktivny.id,
      docsCount, freeGens,
    };
  }

  if (docsCount < 1 && freeGens < 3) {
    return { mode: "free", planLabel: "1 činnosť zadarmo (náhľad)", maxCinnosti: 1, docsCount, freeGens };
  }
  return { mode: "none", planLabel: "Bez aktívneho balíka", maxCinnosti: 0, docsCount, freeGens };
}
