"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/cart";
import { Logo } from "./Logo";

const NAV: Array<{ label: string; href: string }> = [
  { label: "Tablas", href: "/categoria/surfboards" },
  { label: "Trajes", href: "/categoria/wetsuits" },
  { label: "Bodyboards", href: "/categoria/bodyboards" },
  { label: "Aletas", href: "/categoria/fins" },
  { label: "Accesorios", href: "/categoria/accesorios" },
];

export function Header({
  variant = "light",
  hideLogo = false,
}: {
  variant?: "light" | "dark";
  hideLogo?: boolean;
}) {
  const pathname = usePathname();
  const isDark = variant === "dark";
  const fg = isDark ? "var(--sn-bone)" : "var(--sn-ink)";
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  // close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock body scroll while drawer open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className="sn-header-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "16px clamp(20px, 4vw, 40px)",
          color: fg,
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid var(--sn-line)",
          gap: 16,
          background: isDark ? "transparent" : "var(--sn-bone)",
        }}
      >
        <div style={{ justifySelf: "start" }}>
          {hideLogo ? (
            <span style={{ width: 1 }} />
          ) : (
            <Link href="/" aria-label="Inicio Surf Nativo">
              <Logo size={56} shadow={false} />
            </Link>
          )}
        </div>

        {/* Desktop nav — always centered */}
        <nav
          className="sn-hide-mobile"
          style={{
            display: "flex",
            gap: 22,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.02em",
            justifySelf: "center",
          }}
        >
          {NAV.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  paddingBottom: 2,
                  borderBottom: active ? `1px solid ${fg}` : "1px solid transparent",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right side */}
        <div
          className="sn-hide-mobile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 13,
            justifySelf: "end",
          }}
        >
          <Link href="/buscar" style={{ opacity: 0.85 }}>
            Buscar
          </Link>
          <Link href="/cuenta" style={{ opacity: 0.85 }}>
            Cuenta
          </Link>
          <Link
            href="/carrito"
            style={{
              fontFamily: "var(--sn-mono)",
              fontSize: 12,
              padding: "6px 12px",
              border: `1px solid ${fg}`,
              letterSpacing: "0.05em",
            }}
          >
            Carrito · {count}
          </Link>
        </div>

        {/* Mobile right side: hamburger only */}
        <div
          className="sn-show-mobile"
          style={{ alignItems: "center", justifySelf: "end" }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="sn-mobile-toggle"
            style={{ color: fg }}
          >
            <span />
          </button>
        </div>
      </header>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div className="sn-drawer" role="dialog" aria-label="Menú">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                  minHeight: 56,
                }}
              >
                <Link href="/" onClick={() => setOpen(false)} style={{ lineHeight: 0 }}>
                  <Logo size={56} />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="sn-drawer-close"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6l-12 12" />
                  </svg>
                </button>
              </div>

              <nav>
                {NAV.map((l) => {
                  const active = pathname === l.href;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="sn-drawer-link"
                      style={{
                        color: active ? "var(--sn-clay)" : "var(--sn-ink)",
                      }}
                    >
                      {l.label}
                      <span style={{ color: "var(--sn-mist)", fontSize: 16 }}>→</span>
                    </Link>
                  );
                })}
              </nav>

              <div style={{ marginTop: 24 }}>
                <Link href="/buscar" onClick={() => setOpen(false)} className="sn-drawer-secondary">
                  <span>Buscar</span>
                  <span style={{ color: "var(--sn-mist)" }}>→</span>
                </Link>
                <Link href="/cuenta" onClick={() => setOpen(false)} className="sn-drawer-secondary">
                  <span>Cuenta</span>
                  <span style={{ color: "var(--sn-mist)" }}>→</span>
                </Link>
                <Link href="/carrito" onClick={() => setOpen(false)} className="sn-drawer-secondary">
                  <span>Carrito</span>
                  <span style={{ color: "var(--sn-mist)" }}>{count} ítems →</span>
                </Link>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
