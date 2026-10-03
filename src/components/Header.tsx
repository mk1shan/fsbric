"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export const WHATSAPP = "https://wa.me/94714363636";

const LEFT = [
  { href: "#repairs", label: "Repairs" },
  { href: "#process", label: "Process" },
  { href: "#impact", label: "Impact" },
];
const RIGHT = [
  { href: "https://www.wearnrepair.com/", label: "Wear N Repair", external: true },
];

/*
  AOI-style header: routes split around a centred wordmark.
  White over the hero photographs, then a solid canvas bar once the hero is passed.
  On narrow screens the routes move into a full-screen menu (Escape closes it,
  focus returns to the Menu button).
*/
export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ".hero",
      start: "bottom 72px",
      onEnter: () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`topbar ${solid ? "is-solid" : ""} ${open ? "is-open" : ""}`}>
        <nav className="topbar-side" aria-label="Sections">
          {LEFT.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a href="#top" className="wordmark" aria-label="Compreli, back to top">Compreli</a>
        <nav className="topbar-side topbar-side--right" aria-label="More">
          {RIGHT.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="topbar-cta">Talk to us</a>
        </nav>
        <button
          ref={button}
          className="menu-btn"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div id="menu" className={`menu ${open ? "is-open" : ""}`} hidden={!open}>
        <nav aria-label="Menu">
          {[...LEFT, { href: "#people", label: "People" }, { href: "#contact", label: "Contact" }].map((l, i) => (
            <a key={l.href} href={l.href} onClick={close} ref={i === 0 ? firstLink : undefined} style={{ ["--i" as string]: i }}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <a href="https://www.wearnrepair.com/" target="_blank" rel="noreferrer">Wear N Repair</a>
          <a href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp +94 71 436 3636</a>
        </div>
      </div>
    </>
  );
}
