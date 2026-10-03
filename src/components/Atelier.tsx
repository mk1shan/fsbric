"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Photo from "./Photo";

gsap.registerPlugin(ScrollTrigger);
const archive = [
  { title: "The fabric of possibility", type: "Material study", image: "1517146783983-418c681b56c5" },
  { title: "A second beginning", type: "Garment restoration", image: "1591047139829-d91aecb6caea" },
  { title: "Almost invisible. Always intentional.", type: "The human touch", image: "1698766902696-e3c98378d400" },
  { title: "Made to keep moving", type: "Circular thinking", image: "1490481651871-ab68de25d43d" },
];

export function AtelierHero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".atelier-tile", { y: 160, rotation: 9, opacity: 0, stagger: .12, duration: 1.5, ease: "power4.out" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } });
      tl.to(".tile-one", { yPercent: -45, rotation: -12 }, 0).to(".tile-two", { yPercent: 28, rotation: 10 }, 0).to(".tile-three", { yPercent: -60, rotation: 15 }, 0).to(".atelier-word", { xPercent: -12, opacity: .2 }, 0);
    }, root);
    return () => ctx.revert();
  }, []);
  return <section className="hero atelier-hero" id="top" ref={root}>
    <div className="atelier-topline"><span>A garment restoration company</span><span>Colombo · Working worldwide</span></div>
    <div className="atelier-word" aria-hidden="true">RE / MAKE</div>
    <div className="atelier-tile tile-one"><Photo id="1741176505800-caaa3a52631a" alt="Garment makers at work" priority /><span>01 — HUMAN INGENUITY</span></div>
    <div className="atelier-tile tile-two"><Photo id="1698766902696-e3c98378d400" alt="Red thread passing through a needle" priority /><span>02 — EXTRAORDINARY DETAIL</span></div>
    <div className="atelier-tile tile-three"><Photo id="1591047139829-d91aecb6caea" alt="A garment ready for its next chapter" priority /><span>03 — ANOTHER LIFE</span></div>
    <div className="atelier-caption"><span className="atelier-star" aria-hidden="true">✳</span><h1>Not the end.<br /><em>The next beginning.</em></h1><p>We restore the garments the world almost gave up on.</p></div>
    <a className="atelier-explore" href="#about">Scroll to unravel <span>↓</span></a>
    <span className="atelier-edition">THE ART OF REPAIR / VOL. 01</span>
  </section>;
}

export function RepairLab() {
  const [repair, setRepair] = useState(48);
  return <section className="repair-lab" id="process">
    <div className="lab-heading"><p className="eyebrow">02 / The intervention</p><h2>Small detail.<br /><em>Everything changes.</em></h2><p>Move the seam. Watch the damage disappear.</p></div>
    <div className="fabric-study" style={{ "--repair": `${repair}%` } as React.CSSProperties}>
      <div className="fabric-weave" /><div className="fabric-damage"><svg viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true"><path d="M260 0 295 38 265 73 310 115 273 151 304 190 275 237 307 279 272 318 302 357 275 400 L345 400 357 350 326 312 359 269 329 230 359 185 326 144 359 107 325 68 350 30 325 0Z" /></svg></div>
      <div className="repair-scan"><span>RESTORATION FRONTIER</span></div><div className="lab-tags"><span>BEFORE / REJECTED</span><span>AFTER / RESTORED</span></div>
      <div className="lab-cross cross-one">+</div><div className="lab-cross cross-two">+</div>
      <label className="lab-slider">Explore the repair<input aria-label="Repair progress" type="range" min="0" max="100" value={repair} onChange={e => setRepair(Number(e.target.value))} /></label>
    </div>
    <div className="lab-footer"><span>Interactive material illustration</span><p>From a single broken thread to export quality.<br />Precision you can feel. A repair you cannot see.</p><span>{String(repair).padStart(2, "0")}% / RESTORED</span></div>
  </section>;
}

export function LivingArchive() {
  const root = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".living-card").forEach((card, i) => {
        gsap.fromTo(card, { y: i % 2 ? 120 : 40 }, { y: i % 2 ? -80 : -30, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.from(card.querySelector(".photo"), { clipPath: "inset(15% 0 85% 0)", duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: card, start: "top 90%", once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return <section className="living-archive" id="repairs" ref={root}>
    <div className="archive-title"><p className="eyebrow">03 / An ongoing practice</p><h2>Nothing lost.<br /><em>Something found.</em></h2><span>SELECTED STUDIES<br />2026 — ONGOING</span></div>
    <div className="living-grid">{archive.map((item, i) => <button className={`living-card living-card-${i}`} key={item.title} onClick={() => { setSelected(i); dialog.current?.showModal(); }} onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${(e.clientX-r.left)/r.width*100}%`); e.currentTarget.style.setProperty("--my", `${(e.clientY-r.top)/r.height*100}%`); }}>
      <div className="living-image"><Photo id={item.image} alt={item.title} /><div className="living-lens" aria-hidden="true"><Photo id={item.image} alt="" /></div><span className="view-study">VIEW<br />STUDY ↗</span><span className="card-corner">0{i+1}</span></div><div className="living-card-caption"><h3>{item.title}</h3><span>{item.type} ↗</span></div>
    </button>)}</div>
    <div className="kinetic-band" aria-hidden="true"><div>REPAIR. REIMAGINE. REPEAT. ✳ REPAIR. REIMAGINE. REPEAT. ✳&nbsp;</div></div>
    <dialog ref={dialog} className="study-dialog" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}><button className="study-close" onClick={() => dialog.current?.close()} autoFocus>Close ×</button>{selected !== null && <><Photo id={archive[selected].image} alt={archive[selected].title} /><div><p className="eyebrow">Material study / 0{selected+1}</p><h2>{archive[selected].title}</h2><p>Every garment holds material, time and human effort. Our work starts with preserving that value, through careful inspection and a repair suited to the defect.</p><a href="#contact" onClick={() => dialog.current?.close()}>Discuss a repair ↗</a></div></>}</dialog>
  </section>;
}
