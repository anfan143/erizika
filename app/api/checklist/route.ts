import { NextResponse } from "next/server";
import { renderChecklistPdf } from "@/lib/checklistPdf";

// Verejný lead magnet — Checklist BOZP dokumentácie (PDF s vodoznakom).
export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  const buf = await renderChecklistPdf(true);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="checklist-bozp-dokumentacie.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
