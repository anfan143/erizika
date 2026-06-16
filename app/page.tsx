import { LANDING_HTML } from "@/lib/landingHtml";
import LandingFX from "./LandingFX";

// Pred vykreslením zapne „fx-ready" (skryje prvky na reveal). Failsafe: ak by sa
// klientský JS nikdy nespustil, po 2,6 s sa fx-ready odstráni a stránka je celá viditeľná.
const FX_INIT =
  "(function(){try{if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('fx-ready');setTimeout(function(){if(!window.__fxInit){document.documentElement.classList.remove('fx-ready');}},2600);}catch(e){}})();";

export default function Landing() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: FX_INIT }} />
      <div className="land" dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />
      <LandingFX />
    </>
  );
}
