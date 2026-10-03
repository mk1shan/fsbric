"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Photo from "./Photo";

/* Placeholder photography (Unsplash). Swap for Compreli's own shoots. */
const LEFT = [
  { id: "1741176505800-caaa3a52631a", alt: "Workers sewing garments in a large factory" },
  { id: "1589793463357-5fb813435467", alt: "Garment workers at a production line" },
  { id: "1741176506261-73218298e4d8", alt: "Textile workers sorting fabric" },
];
const RIGHT = [
  { id: "1517146783983-418c681b56c5", alt: "Spools of coloured thread" },
  { id: "1698766902696-e3c98378d400", alt: "Needle threaded with red thread, close up" },
  { id: "1568288796918-03e7d93306bd", alt: "Hands sewing white fabric with needle and thread" },
];

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const m = window.matchMedia(REDUCE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getReduce = () => window.matchMedia(REDUCE).matches;

/*
  AOI-style split hero: two image fields side by side (the factory floor and the
  repair detail), each crossfading gently through its set while the composition
  holds still. A pause control stops the change; reduced motion starts paused.
*/
export default function HeroSplit({ children }: { children: React.ReactNode }) {
  const [i, setI] = useState(0);
  // "auto" follows the visitor's reduced-motion setting until they choose
  const [pref, setPref] = useState<"auto" | "play" | "pause">("auto");
  const reduce = useSyncExternalStore(subscribeReduce, getReduce, () => false);
  const playing = pref === "play" || (pref === "auto" && !reduce);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((n) => (n + 1) % LEFT.length), 3800);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero-media">
        {[LEFT, RIGHT].map((set, side) => (
          <div className="hero-field" key={side}>
            {set.map((p, k) => (
              <div className={`slide ${k === i ? "is-active" : ""}`} key={p.id} aria-hidden={k !== i}>
                <Photo id={p.id} alt={p.alt} w={1800} priority={k === 0} className="photo--fill" sizes="50vw" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="hero-center">{children}</div>

      <div className="hero-foot">
        <p>Garment repair for apparel manufacturers and brands</p>
        <a href="#about" className="hero-scroll">Scroll</a>
        <button className="hero-pause" onClick={() => setPref(playing ? "pause" : "play")} aria-pressed={!playing}>
          {playing ? "Pause images" : "Play images"}
        </button>
      </div>
    </section>
  );
}
