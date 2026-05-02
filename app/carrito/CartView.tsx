"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { fmtPrice } from "@/lib/products";
import { ProductImg } from "@/components/ProductImg";

export function CartView() {
  const { items, remove, setQty, subtotal, count } = useCart();
  const currency = items[0]?.currency ?? "UYU";
  const shipping = subtotal === 0 ? 0 : subtotal >= 5000 ? 0 : 350;
  const total = subtotal + shipping;

  return (
    <section
      className="sn-page"
      style={{
        paddingBlock: "40px 80px",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <div
        className="sn-mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--sn-mist)",
          marginBottom: 20,
        }}
      >
        <Link href="/">Inicio</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--sn-ink)" }}>Carrito</span>
      </div>

      <h1 className="sn-h1" style={{ marginBottom: 8, fontWeight: 600 }}>
        Tu carrito
      </h1>
      <p style={{ fontSize: 15, color: "var(--sn-ink-2)", marginBottom: 40 }}>
        {count} {count === 1 ? "ítem" : "ítems"}
        {count > 0 ? " · Reservados por 30 minutos" : ""}
      </p>

      {items.length === 0 ? (
        <div
          style={{
            border: "1px solid var(--sn-line)",
            padding: "60px 32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--sn-serif)",
              fontSize: 22,
              marginBottom: 16,
            }}
          >
            Tu carrito está vacío.
          </p>
          <Link href="/categoria/wetsuits" className="sn-btn">
            Ver trajes →
          </Link>
        </div>
      ) : (
        <div className="sn-row sn-row-cart" style={{ gap: 60 }}>
          <div>
            <div style={{ borderTop: "1px solid var(--sn-ink)" }}>
              {items.map((p) => (
                <div
                  key={p.lineId}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(80px, 120px) 1fr auto auto",
                    gap: "clamp(12px, 2vw, 24px)",
                    padding: "24px 0",
                    borderBottom: "1px solid var(--sn-line)",
                    alignItems: "center",
                  }}
                >
                  <ProductImg src={p.image} alt={p.title} ratio="1/1" />
                  <div>
                    <div
                      className="sn-mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--sn-clay-deep)",
                        marginBottom: 6,
                      }}
                    >
                      {p.brand}
                    </div>
                    <Link
                      href={`/producto/${p.slug}`}
                      style={{
                        fontFamily: "var(--sn-serif)",
                        fontSize: 18,
                        fontWeight: 500,
                        marginBottom: 8,
                        display: "block",
                      }}
                    >
                      {p.title}
                    </Link>
                    {(p.size !== "Único" || p.color !== "Único") && (
                      <div
                        style={{
                          fontFamily: "var(--sn-mono)",
                          fontSize: 11,
                          color: "var(--sn-ink-2)",
                          display: "flex",
                          gap: 12,
                        }}
                      >
                        {p.size !== "Único" && <span>Talle {p.size}</span>}
                        {p.color !== "Único" && (
                          <>
                            <span style={{ opacity: 0.4 }}>·</span>
                            <span>{p.color}</span>
                          </>
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 14,
                        fontFamily: "var(--sn-mono)",
                        fontSize: 11,
                      }}
                    >
                      <button
                        onClick={() => remove(p.lineId)}
                        style={{
                          color: "var(--sn-clay-deep)",
                          borderBottom: "1px solid var(--sn-clay-deep)",
                          padding: 0,
                        }}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid var(--sn-ink)",
                      height: "fit-content",
                    }}
                  >
                    <button
                      onClick={() => setQty(p.lineId, p.qty - 1)}
                      style={{ padding: "0 12px", fontSize: 16 }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        padding: "10px 12px",
                        fontFamily: "var(--sn-mono)",
                        fontSize: 13,
                        minWidth: 32,
                        textAlign: "center",
                      }}
                    >
                      {p.qty}
                    </span>
                    <button
                      onClick={() => setQty(p.lineId, p.qty + 1)}
                      style={{ padding: "0 12px", fontSize: 16 }}
                    >
                      +
                    </button>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 110 }}>
                    <div
                      style={{
                        fontFamily: "var(--sn-mono)",
                        fontSize: 16,
                        fontWeight: 500,
                      }}
                    >
                      {fmtPrice(p.price * p.qty, p.currency)}
                    </div>
                    {p.qty > 1 && (
                      <div
                        style={{
                          fontFamily: "var(--sn-mono)",
                          fontSize: 10,
                          color: "var(--sn-mist)",
                          marginTop: 4,
                        }}
                      >
                        {fmtPrice(p.price, p.currency)} c/u
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/categoria/surfboards"
              className="sn-btn sn-btn-ghost"
              style={{ marginTop: 24 }}
            >
              ← Seguir comprando
            </Link>
          </div>

          <aside>
            <div
              style={{
                background: "var(--sn-ink)",
                color: "var(--sn-bone)",
                padding: 32,
                position: "sticky",
                top: 20,
              }}
            >
              <div
                className="sn-mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--sn-sand)",
                  marginBottom: 18,
                }}
              >
                ◆ Resumen del pedido
              </div>
              <h3
                style={{
                  fontFamily: "var(--sn-serif)",
                  fontSize: 32,
                  fontWeight: 500,
                  marginBottom: 24,
                  color: "var(--sn-bone)",
                }}
              >
                Total a pagar
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: 12,
                  fontSize: 14,
                  fontFamily: "var(--sn-mono)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ opacity: 0.8 }}>
                    Subtotal ({count} {count === 1 ? "ítem" : "ítems"})
                  </span>
                  <span>{fmtPrice(subtotal, currency)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ opacity: 0.8 }}>Envío</span>
                  <span style={{ color: shipping === 0 ? "var(--sn-clay)" : "inherit" }}>
                    {shipping === 0 ? "Gratis ✓" : fmtPrice(shipping, currency)}
                  </span>
                </div>
              </div>

              <hr
                style={{
                  height: 1,
                  background: "rgba(244,234,216,0.2)",
                  border: "none",
                  margin: "20px 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 8,
                }}
              >
                <span
                  className="sn-mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--sn-serif)",
                    fontSize: 36,
                    fontWeight: 500,
                  }}
                >
                  {fmtPrice(total, currency)}
                </span>
              </div>
              <div style={{ marginBottom: 24 }} />

              <Link
                href="/checkout"
                className="sn-btn sn-btn-clay"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "16px",
                  fontSize: 14,
                }}
              >
                Ir al checkout →
              </Link>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
