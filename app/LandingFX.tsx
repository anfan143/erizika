"use client";
import { useEffect } from "react";

// Prvky pod záhybom, ktoré sa pri scrollovaní jemne vynoria (reveal).
// Hero má vlastný čisto-CSS nábeh, preto tu nie je.
const SEL = [
  ".land .misia blockquote",
  ".land .misia .body",
  ".land h2.sec",
  ".land .pcard",
  ".land .krok",
  ".land .demo",
  ".land .cena",
  ".land .cta-band",
].join(",");

export default function LandingFX() {
  useEffect(() => {
    (window as any).__fxInit = true;
    const root = document.documentElement;
    // .fx-ready pridáva inline skript v page.tsx; ak chýba (reduced-motion / failsafe), nič neskrývame
    if (!root.classList.contains("fx-ready")) return;
    if (!("IntersectionObserver" in window)) { root.classList.remove("fx-ready"); return; }

    const els = Array.from(document.querySelectorAll(SEL));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Navigácia: po scrollovaní zmenšiť + tieň
    const nav = document.querySelector(".land nav");
    const onScroll = () => { if (nav) nav.classList.toggle("scrolled", window.scrollY > 20); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return null;
}
