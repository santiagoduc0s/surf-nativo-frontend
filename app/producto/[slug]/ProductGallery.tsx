"use client";

import { useState } from "react";
import { ProductImg } from "@/components/ProductImg";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.filter(Boolean);
  if (list.length === 0) return <div />;

  const showThumbs = list.length > 1;

  return (
    <div>
      <div style={{ position: "relative", marginBottom: showThumbs ? 12 : 0 }}>
        <ProductImg src={list[active] ?? list[0]} alt={title} ratio="1/1" />
      </div>
      {showThumbs && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(list.length, 6)}, 1fr)`,
            gap: 12,
          }}
        >
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              style={{
                position: "relative",
                border:
                  active === i
                    ? "1.5px solid var(--sn-ink)"
                    : "1px solid var(--sn-line)",
                cursor: "pointer",
                padding: 0,
                background: "transparent",
              }}
            >
              <ProductImg src={src} alt="" ratio="1/1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
