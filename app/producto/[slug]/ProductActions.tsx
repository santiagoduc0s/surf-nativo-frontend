"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { fmtPrice, type Product } from "@/lib/products";

const SIZES_BY_CAT: Record<string, string[]> = {
  wetsuits: ["XS", "S", "M", "L", "XL", "XXL"],
  surfboards: ["5'10\"", "6'0\"", "6'2\"", "6'4\"", "6'6\""],
  bodyboards: ["38\"", "40\"", "41\"", "42\""],
  fins: ["S", "M", "L", "XL"],
  sup: ["10'6\"", "11'0\"", "12'0\""],
  accesorios: ["Único"],
};

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();

  const sizes = SIZES_BY_CAT[product.cat] ?? ["Único"];
  const colors = ["Único"];

  const [size, setSize] = useState<string>(sizes[Math.floor(sizes.length / 2)] ?? sizes[0]);
  const [color, setColor] = useState<string>(colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = (goCart: boolean) => {
    add(product, { size, color, qty });
    if (goCart) {
      router.push("/carrito");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      {colors.length > 1 && (
        <div style={{ marginTop: 30 }}>
          <div
            className="sn-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--sn-mist)",
              marginBottom: 12,
            }}
          >
            Color · <span style={{ color: "var(--sn-ink)" }}>{color}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  padding: "10px 14px",
                  fontSize: 12,
                  border:
                    color === c
                      ? "1.5px solid var(--sn-ink)"
                      : "1px solid var(--sn-line)",
                  background: "transparent",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 1 && (
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              className="sn-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--sn-mist)",
              }}
            >
              Talle · <span style={{ color: "var(--sn-ink)" }}>{size}</span>
            </span>
            <span
              className="sn-mono"
              style={{
                fontSize: 11,
                color: "var(--sn-clay-deep)",
                borderBottom: "1px solid var(--sn-clay-deep)",
                cursor: "pointer",
              }}
            >
              Guía de talles →
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  minWidth: 52,
                  padding: "12px 14px",
                  fontFamily: "var(--sn-mono)",
                  fontSize: 12,
                  border:
                    size === s
                      ? "1.5px solid var(--sn-ink)"
                      : "1px solid var(--sn-line)",
                  background: size === s ? "var(--sn-ink)" : "transparent",
                  color: size === s ? "var(--sn-bone)" : "var(--sn-ink)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        <div style={{ display: "flex", border: "1px solid var(--sn-ink)" }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "0 16px", fontSize: 18 }}>
            −
          </button>
          <span
            style={{
              padding: "14px 16px",
              fontFamily: "var(--sn-mono)",
              fontSize: 14,
              minWidth: 40,
              textAlign: "center",
            }}
          >
            {qty}
          </span>
          <button onClick={() => setQty(qty + 1)} style={{ padding: "0 16px", fontSize: 18 }}>
            +
          </button>
        </div>
        <button
          onClick={() => handleAdd(false)}
          className="sn-btn"
          disabled={product.stock === 0}
          style={{
            flex: 1,
            justifyContent: "center",
            padding: "14px 22px",
            background:
              product.stock === 0
                ? "var(--sn-mist)"
                : added
                  ? "var(--sn-moss)"
                  : "var(--sn-ink)",
            cursor: product.stock === 0 ? "not-allowed" : "pointer",
          }}
        >
          {product.stock === 0
            ? "Sin stock"
            : added
              ? "✓ Agregado al carrito"
              : `Agregar al carrito · ${fmtPrice(product.price * qty, product.currency)}`}
        </button>
      </div>
      {product.stock > 0 && (
        <button
          onClick={() => handleAdd(true)}
          className="sn-btn sn-btn-clay"
          style={{ width: "100%", marginTop: 8, justifyContent: "center" }}
        >
          Comprar ahora →
        </button>
      )}
    </>
  );
}
