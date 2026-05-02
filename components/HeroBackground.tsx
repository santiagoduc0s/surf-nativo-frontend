"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "/assets/hero-mano-punta.webp",
    alt: "La Mano de Punta del Este",
    position: "center 35%",
  },
  {
    src: "/assets/hero-emir.jpg",
    alt: "Playa El Emir, Punta del Este",
    position: "center center",
  },
  {
    src: "/assets/hero-3.jpg",
    alt: "Surf en la costa atlántica",
    position: "center center",
  },
];

const ROTATE_MS = 8_000;
const TRANSITION_MS = 1200;

export function HeroBackground() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {SLIDES.map((s, i) => {
        const isActive = i === active;
        return (
          <div
            key={s.src}
            aria-hidden={!isActive}
            style={{
              position: "absolute",
              inset: 0,
              opacity: isActive ? 1 : 0,
              filter: isActive ? "blur(0px)" : "blur(24px)",
              transform: isActive ? "scale(1)" : "scale(1.05)",
              transition: `opacity ${TRANSITION_MS}ms ease-in-out, filter ${TRANSITION_MS}ms ease-in-out, transform ${TRANSITION_MS}ms ease-in-out`,
              willChange: "opacity, filter, transform",
            }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: s.position,
              }}
            />
          </div>
        );
      })}
    </>
  );
}
