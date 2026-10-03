"use client";

import { useEffect, useRef, useState } from "react";

/* Unsplash photo by id, cropped server-side to the width we need */
export const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

type Props = {
  id: string;
  alt: string;
  w?: number;
  className?: string;
  parallax?: boolean;
  priority?: boolean;
  sizes?: string;
};

/*
  Framed photo. The frame reserves its own size (aspect-ratio set in CSS), so
  nothing shifts while it loads. If a photo fails, the frame shows a woven
  fabric texture instead of a broken image.
*/
export default function Photo({ id, alt, w = 1600, className = "", parallax, priority, sizes = "(max-width: 768px) 100vw, 50vw" }: Props) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  // catch images that already failed before React attached onError
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <figure className={`photo ${failed ? "photo--fallback" : ""} ${className}`} data-parallax={parallax ? "" : undefined}>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={img}
          src={unsplash(id, w)}
          srcSet={`${unsplash(id, Math.round(w / 2))} ${Math.round(w / 2)}w, ${unsplash(id, w)} ${w}w`}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </figure>
  );
}
