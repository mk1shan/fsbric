"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Smooth scrolling (Lenis) synced to GSAP, plus the seam rail that gets sewn as you scroll */
export default function SmoothScroll() {
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`;
      },
    });

    return () => {
      st.kill();
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return (
    <div className="rail" aria-hidden="true">
      <div className="rail-fill" ref={fill} />
    </div>
  );
}
