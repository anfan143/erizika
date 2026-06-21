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
  // Efekt 1: reveal animácie + zmenšenie navigácie. Môže skončiť skoro (reduced-motion).
  useEffect(() => {
    (window as any).__fxInit = true;
    const root = document.documentElement;
    const nav = document.querySelector(".land nav");
    const onScroll = () => { if (nav) nav.classList.toggle("scrolled", window.scrollY > 20); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let io: IntersectionObserver | null = null;
    if (root.classList.contains("fx-ready") && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add("is-visible"); io!.unobserve(e.target); }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
      );
      Array.from(document.querySelectorAll(SEL)).forEach((el) => io!.observe(el));
    } else {
      root.classList.remove("fx-ready");
    }

    return () => { if (io) io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  // Efekt 2: lead magnet — beží VŽDY (nezávisle od animácií).
  useEffect(() => {
    const form = document.getElementById("lead-form") as HTMLFormElement | null;
    if (!form) return;
    const onLead = async (ev: Event) => {
      ev.preventDefault();
      const input = document.getElementById("lead-email") as HTMLInputElement | null;
      const msg = document.getElementById("lead-msg");
      if (!input || !msg) return;
      const email = input.value.trim();
      msg.className = "lm-msg";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Zadajte platný e-mail."; msg.classList.add("err"); return; }
      // okno otvoríme synchrónne (v rámci kliknutia), aby ho neblokoval popup blocker
      const w = window.open("", "_blank");
      msg.textContent = "Posielam…";
      try {
        const hp = (document.getElementById("lead-website") as HTMLInputElement | null)?.value || "";
        const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "uvodka", website: hp }) });
        const d = await r.json();
        if (r.ok && d.pdf) {
          if (w) w.location.href = d.pdf;
          msg.innerHTML = 'Hotovo! Ak sa checklist neotvoril, <a href="/api/checklist" target="_blank" rel="noopener" style="color:#8fe3b4;text-decoration:underline">otvorte ho tu</a>.';
          msg.classList.add("ok");
          input.value = "";
        } else { if (w) w.close(); msg.textContent = d.error || "Nepodarilo sa odoslať. Skúste znova."; msg.classList.add("err"); }
      } catch { if (w) w.close(); msg.textContent = "Nepodarilo sa odoslať. Skúste znova."; msg.classList.add("err"); }
    };
    form.addEventListener("submit", onLead);
    return () => form.removeEventListener("submit", onLead);
  }, []);

  return null;
}
