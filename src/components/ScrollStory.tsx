"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Photo from "./Photo";

gsap.registerPlugin(ScrollTrigger);
const acts = [
  { word: "Rejected.", label: "01 / See the possibility", image: "1741176505800-caaa3a52631a", alt: "Garment production floor", copy: "A finished garment. A small imperfection. A different future waiting to happen." },
  { word: "Restored.", label: "02 / Work in the details", image: "1698766902696-e3c98378d400", alt: "Needle with red repair thread", copy: "Careful hands and a precise intervention put every thread back in its place." },
  { word: "Reimagined.", label: "03 / Return to the world", image: "1591047139829-d91aecb6caea", alt: "Finished jacket on a hanger", copy: "Back to export quality. Back to full value. Ready for its next beginning." },
];

export default function ScrollStory() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".story-act");
        gsap.set(panels.slice(1), { clipPath: "inset(0 0 0 100%)" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } });
        tl.fromTo(panels[0].querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 1.2, ease: "none" });
        panels.slice(1).forEach(panel => {
          tl.to(panel, { clipPath: "inset(0 0 0 0%)", duration: 1.2, ease: "power2.inOut" })
            .fromTo(panel.querySelector("img"), { scale: 1.15 }, { scale: 1, duration: 1.5, ease: "none" }, "<")
            .fromTo(panel.querySelector(".story-word"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: "power3.out" }, "<.45");
        });
        tl.to(".story-progress span", { scaleX: 1, ease: "none", duration: tl.duration() }, 0);
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  return <section className="scroll-story" ref={root} aria-label="From rejected to restored">
    <div className="story-sticky">
      {acts.map((act, i) => <article className={`story-act story-act-${i}`} key={act.word}>
        <Photo id={act.image} alt={act.alt} w={2000} sizes="100vw" />
        <div className="story-scrim" />
        <p className="story-label">{act.label}</p>
        <div className="story-title-mask"><h2 className="story-word">{act.word}</h2></div>
        <div className="story-bottom"><span>THE LIFE OF A GARMENT</span><p>{act.copy}</p><span>0{i+1} / 03</span></div>
      </article>)}
      <div className="story-progress" aria-hidden="true"><span /></div>
    </div>
  </section>;
}

export function EditorialMotion() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(".manifesto-word", { opacity: .18 }, { opacity: 1, stagger: .12, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top 65%", end: "bottom 75%", scrub: .5 } });
        gsap.utils.toArray<HTMLElement>(".lab-heading h2, .archive-title h2, .reach-title h2, .people-grid h3, .contact h2").forEach(title => {
          gsap.fromTo(title, { clipPath: "inset(0 0 100% 0)", y: 35 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.3, ease: "power3.inOut", scrollTrigger: { trigger: title, start: "top 90%", once: true } });
        });
        gsap.fromTo(".impact", { clipPath: "inset(5% 7% 5% 7%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ".impact", start: "top 85%", end: "top 15%", scrub: 1 } });
        gsap.fromTo(".impact-copy h2", { y: 70 }, { y: -35, ease: "none", scrollTrigger: { trigger: ".impact", start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.fromTo(".footer-word", { yPercent: 45, opacity: .2 }, { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: .8 } });
      });
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  return null;
}
