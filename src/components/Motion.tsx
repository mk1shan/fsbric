"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Easing from the report: ease-out-expo cubic-bezier(0.19, 1, 0.22, 1) ≈ GSAP "expo.out" */
const EXPO = "expo.out";

/*
  Page-wide motion, all in one place:
  - Lenis smooth scrolling, synced to ScrollTrigger, plus smooth anchor links
  - Loader: a percentage counts up, then an aperture opens in the cover to reveal the hero
  - [data-lines]    headline lines rise in sequence (60 ms stagger)
  - [data-rise]     blocks of copy settle into place (800 ms)
  - [data-gallery]  grid images scale 0.96 → 1 while fading in
  - [data-parallax] images drift slightly inside their frame
  With reduced motion, the loader is skipped and everything is simply shown.
*/
export default function Motion() {
  const loader = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = loader.current;

    if (reduce) {
      if (el) el.style.display = "none";
      return;
    }

    // ---------- smooth scroll ----------
    const lenis = new Lenis({ lerp: 0.09 });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const target = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onAnchor);

    const ctx = gsap.context(() => {
      // ---------- loader: count, then open the aperture ----------
      const counter = { v: 0 };
      const intro = gsap.timeline({
        onComplete: () => {
          if (el) el.style.display = "none";
          gsap.set(".topbar, .hero-foot > *", { clearProps: "opacity" });
          lenis.start();
          ScrollTrigger.refresh();
        },
      });
      intro
        .to(counter, {
          v: 100,
          duration: 1.3,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count.current) count.current.textContent = `${Math.round(counter.v)}%`;
          },
        })
        .to(".loader-inner", { opacity: 0, duration: 0.35, ease: "power1.out" }, "+=0.1")
        .to(el, { "--r": "150vmax", duration: 1.5, ease: "expo.inOut" }, "<")
        .from(".hero [data-lines] .ln > span", { yPercent: 105, duration: 1.1, stagger: 0.06, ease: EXPO }, "<0.5")
        .from(".hero-foot > *, .topbar", { opacity: 0, duration: 0.8, stagger: 0.06, ease: "power1.out" }, "<0.3");

      // ---------- headline lines ----------
      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((h) => {
        if (h.closest(".hero")) return;
        gsap.from(h.querySelectorAll(".ln > span"), {
          yPercent: 105,
          duration: 0.9,
          stagger: 0.06,
          ease: EXPO,
          scrollTrigger: { trigger: h, start: "top 88%", once: true },
        });
      });

      // ---------- copy blocks ----------
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((b) => {
        gsap.from(b, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: EXPO,
          scrollTrigger: { trigger: b, start: "top 90%", once: true },
        });
      });

      // ---------- gallery: gentle scale + fade ----------
      gsap.utils.toArray<HTMLElement>("[data-gallery]").forEach((grid) => {
        gsap.from(grid.children, {
          scale: 0.96,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: EXPO,
          scrollTrigger: { trigger: grid, start: "top 85%", once: true },
        });
      });

      // ---------- parallax inside frames ----------
      gsap.utils.toArray<HTMLElement>("[data-parallax] img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.12 },
          {
            yPercent: 6,
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      document.removeEventListener("click", onAnchor);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="loader" ref={loader} aria-hidden="true">
      <div className="loader-inner">
        <span className="loader-word">Compreli</span>
        <span className="loader-count" ref={count}>0%</span>
      </div>
    </div>
  );
}
