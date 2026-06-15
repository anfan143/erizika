import { NextResponse } from "next/server";
import { supabaseServer, supabaseAdmin } from "@/lib/supabaseServer";
import { SYSTEM_PROMPT } from "@/lib/prompty";
import { findRefs, refsBlock } from "@/lib/kniznica";
import { zistiOpravnenie } from "@/lib/opravnenia";

export const maxDuration = 60;

function tryParse(s: string) { try { return JSON.parse(s); } catch { return null; } }
function parseWithSalvage(s: string) {
  let p = tryParse(s);
  if (p) return p;
  let idx = s.lastIndexOf("}");
  if (idx > -1) { p = tryParse(s.slice(0, idx + 1)); if (p) return p; }
  let guard = 0;
  while (idx > 0 && guard < 60) {
    p = tryParse(s.slice(0, idx + 1) + "]}");
    if (p && Array.isArray(p.nebezpecenstva) && p.nebezpecenstva.length > 0) return p;
    idx = s.lastIndexOf("}", idx - 1); guard++;
  }
  return null;
}

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const ent = await zistiOpravnenie(supabase, user.id);
  if (ent.mode === "none") return NextResponse.json({ error: "limit" }, { status: 402 });

  const { cinnost, ctx } = await req.json();
  if (!cinnost || typeof cinnost !== "string") return NextResponse.json({ error: "vstup" }, { status: 400 });

  const admin = supabaseAdmin();
  // spotreba PRED generovaním (atomická poistka proti súbežným požiadavkám)
  if (ent.mode === "project") {
    const { data: proj } = await admin.from("projects")
      .select("activities_used, activities_limit").eq("id", ent.projectId!).single();
    if (!proj || proj.activities_used >= proj.activities_limit) {
      return NextResponse.json({ error: "project_limit" }, { status: 402 });
    }
    await admin.from("projects").update({ activities_used: proj.activities_used + 1 }).eq("id", ent.projectId!);
  }
  if (ent.mode === "free") {
    if (ent.freeGens >= 3) return NextResponse.json({ error: "limit" }, { status: 402 });
    await admin.from("profiles").update({ free_gens: ent.freeGens + 1 }).eq("id", user.id);
  }

  const refs = findRefs(cinnost, ctx?.pozicia || "");
  const userMsg = `Spoločnosť: ${ctx?.firma || "neuvedená"}
Odvetvie: ${ctx?.odvetvie || "neuvedené"}
Pracovná pozícia: ${ctx?.pozicia || "neuvedená"}
Špecifiká pracoviska: ${ctx?.prostredie || "bez špecifík"}

Vypracuj hodnotenie rizík pre činnosť: "${cinnost.slice(0, 300)}"${refsBlock(refs)}`;

  let nebezpecenstva: any = null;
  for (let attempt = 0; attempt < 2 && !nebezpecenstva; attempt++) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
          max_tokens: 1600,
          temperature: 0.2,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      if (!r.ok) continue;
      const data = await r.json();
      const text = (data.content || []).map((i: any) => i.text || "").join("\n").replace(/```json|```/g, "").trim();
      const start = text.indexOf("{");
      if (start === -1) continue;
      const parsed = parseWithSalvage(text.slice(start));
      if (parsed && Array.isArray(parsed.nebezpecenstva) && parsed.nebezpecenstva.length > 0) {
        nebezpecenstva = parsed.nebezpecenstva;
      }
    } catch {}
  }

  if (!nebezpecenstva) {
    // vrátiť spotrebovanú jednotku, generovanie zlyhalo
    if (ent.mode === "project") {
      const { data: proj } = await admin.from("projects").select("activities_used").eq("id", ent.projectId!).single();
      if (proj) await admin.from("projects").update({ activities_used: Math.max(0, proj.activities_used - 1) }).eq("id", ent.projectId!);
    }
    return NextResponse.json({ error: "gen" }, { status: 502 });
  }
  return NextResponse.json({ nebezpecenstva, refs: refs.length, locked: ent.mode === "free" });
}
