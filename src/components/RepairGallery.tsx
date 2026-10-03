"use client";

import { useEffect, useRef, useState } from "react";
import Photo from "./Photo";

const ITEMS = [
  { id: "1542044801-30d3e45ae49a", title: "Colour correction", code: "01", x: 4, y: 8, w: 28, h: 47 },
  { id: "1560796952-f1c9b838544c", title: "Seam alignment", code: "02", x: 38, y: 2, w: 23, h: 32 },
  { id: "1653220266006-27b87f590eaf", title: "Invisible darning", code: "03", x: 69, y: 12, w: 25, h: 45 },
  { id: "1627395831181-8195e8e7e804", title: "Panel restoration", code: "04", x: 12, y: 61, w: 25, h: 34 },
  { id: "1534639077088-d702bcf685e7", title: "Surface treatment", code: "05", x: 45, y: 47, w: 29, h: 47 },
  { id: "1591047139829-d91aecb6caea", title: "Final inspection", code: "06", x: 80, y: 64, w: 18, h: 29 },
];

export default function RepairGallery() {
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, y: 0, ox: 0, oy: 0 });
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      setView((v) => ({ ...v, scale: Math.min(1.7, Math.max(0.82, v.scale - event.deltaY * 0.0007)) }));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);

  return (
    <section className="gallery-section" id="repairs" aria-labelledby="gallery-title">
      <div className="gallery-heading">
        <p className="eyebrow">Repair archive / 60+ defects</p>
        <h2 id="gallery-title">Every flaw is<br /><em>an opportunity.</em></h2>
        <p className="gallery-instruction">Drag to explore · Scroll to zoom</p>
      </div>
      <div
        ref={viewport}
        className={`gallery-viewport ${dragging ? "is-dragging" : ""}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { down: true, x: event.clientX, y: event.clientY, ox: view.x, oy: view.y };
          setDragging(true);
        }}
        onPointerMove={(event) => {
          if (!drag.current.down) return;
          setView((v) => ({ ...v, x: drag.current.ox + event.clientX - drag.current.x, y: drag.current.oy + event.clientY - drag.current.y }));
        }}
        onPointerUp={() => { drag.current.down = false; setDragging(false); }}
        onPointerCancel={() => { drag.current.down = false; setDragging(false); }}
      >
        <div className="gallery-board" style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})` }}>
          {ITEMS.map((item) => (
            <article className="gallery-card" key={item.code} style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%`, height: `${item.h}%` }}>
              <Photo id={item.id} alt={item.title} w={1200} sizes="32vw" />
              <div><span>{item.code}</span><h3>{item.title}</h3></div>
            </article>
          ))}
        </div>
        <button className="gallery-reset" onClick={(event) => { event.stopPropagation(); setView({ x: 0, y: 0, scale: 1 }); }}>Reset view</button>
      </div>
    </section>
  );
}
