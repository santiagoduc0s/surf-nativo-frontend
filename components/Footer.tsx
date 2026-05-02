import Link from "next/link";
import { Logo } from "./Logo";

const FOOTER_COLS: Array<{ t: string; l: Array<{ label: string; href: string }> }> = [
  {
    t: "Tienda",
    l: [
      { label: "Tablas", href: "/categoria/surfboards" },
      { label: "Trajes", href: "/categoria/wetsuits" },
      { label: "Bodyboards", href: "/categoria/bodyboards" },
      { label: "Aletas", href: "/categoria/fins" },
    ],
  },
  {
    t: "Ayuda",
    l: [{ label: "Contacto", href: "/contacto" }],
  },
];

export function Footer() {
  return (
    <footer
      className="sn-page"
      style={{
        background: "var(--sn-ink)",
        color: "var(--sn-bone)",
        paddingBlock: "60px 32px",
        marginTop: 0,
      }}
    >
      <div
        className="sn-row sn-row-footer"
        style={{
          gap: 40,
          marginBottom: 48,
          maxWidth: 1500,
          margin: "0 auto 48px",
        }}
      >
        <div>
          <Logo size={40} />
          <p
            style={{
              marginTop: 16,
              fontSize: 13,
              opacity: 0.7,
              lineHeight: 1.6,
              maxWidth: 280,
            }}
          >
            Tienda de surf con base en Punta del Este, Maldonado.
          </p>
        </div>
        {FOOTER_COLS.map((col) => (
          <div key={col.t}>
            <div
              className="sn-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--sn-sand)",
                marginBottom: 16,
              }}
            >
              {col.t}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 10,
                fontSize: 13,
              }}
            >
              {col.l.map((i) => (
                <li key={i.href} style={{ opacity: 0.85 }}>
                  <Link href={i.href}>{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <hr
        style={{
          height: 1,
          background: "rgba(255,255,255,0.15)",
          border: "none",
          margin: 0,
          maxWidth: 1500,
          marginInline: "auto",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 24,
          fontFamily: "var(--sn-mono)",
          fontSize: 11,
          opacity: 0.6,
          letterSpacing: "0.05em",
          maxWidth: 1500,
          margin: "0 auto",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>© 2026 Surf Nativo · Punta del Este, UY</span>
        <span>EST. 2008 — DESDE LA COSTA ATLÁNTICA</span>
      </div>
    </footer>
  );
}
