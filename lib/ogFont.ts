// Načítanie brandového fontu (DejaVu — plná slovenská diakritika + kurzíva)
// pre generované obrázky (next/og). Timeout + kontrola, aby pomalé CDN nezhodilo render.
async function f(url: string) {
  const r = await fetch(url, { signal: AbortSignal.timeout(3000), cache: "force-cache" });
  if (!r.ok) throw new Error("font");
  return r.arrayBuffer();
}

export async function brandFonts() {
  try {
    const b = "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/";
    const [reg, bold, obl] = await Promise.all([
      f(b + "DejaVuSans.ttf"),
      f(b + "DejaVuSans-Bold.ttf"),
      f(b + "DejaVuSans-Oblique.ttf"),
    ]);
    return [
      { name: "Brand", data: reg, weight: 400 as const, style: "normal" as const },
      { name: "Brand", data: bold, weight: 700 as const, style: "normal" as const },
      { name: "Brand", data: obl, weight: 400 as const, style: "italic" as const },
    ];
  } catch {
    return undefined;
  }
}
