import Link from "next/link";
import { fmtPrice, type Product } from "@/lib/products";
import { ProductImg } from "./ProductImg";

export function ProductCard({
  product,
  variant = "default",
}: {
  product: Product;
  variant?: "default" | "minimal";
}) {
  const href = `/producto/${product.slug}`;

  if (variant === "minimal") {
    return (
      <Link href={href} className="sn-card" style={{ border: "none" }}>
        <div style={{ position: "relative", background: "var(--sn-bone-2)" }}>
          <ProductImg src={product.image} alt={product.title} ratio="1/1" />
        </div>
        <div style={{ paddingTop: 14 }}>
          <div
            className="sn-mono"
            style={{
              color: "var(--sn-mist)",
              marginBottom: 4,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {product.brand}
          </div>
          <div
            style={{
              fontFamily: "var(--sn-serif)",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              marginBottom: 6,
              lineHeight: 1.25,
            }}
          >
            {product.title}
          </div>
          <div style={{ fontFamily: "var(--sn-mono)", fontSize: 13, fontWeight: 500 }}>
            {fmtPrice(product.price, product.currency)}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="sn-card">
      <div style={{ position: "relative", background: "var(--sn-bone)" }}>
        <ProductImg src={product.image} alt={product.title} ratio="1/1" />
      </div>
      <div style={{ padding: "16px 16px 18px" }}>
        <div
          className="sn-mono"
          style={{
            color: "var(--sn-clay)",
            marginBottom: 6,
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {product.brand}
        </div>
        <div
          style={{
            fontFamily: "var(--sn-serif)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            marginBottom: 10,
            lineHeight: 1.2,
            minHeight: 41,
          }}
        >
          {product.title}
        </div>
        <hr className="sn-rule" style={{ margin: "0 0 12px" }} />
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontFamily: "var(--sn-mono)", fontSize: 14, fontWeight: 500 }}>
            {fmtPrice(product.price, product.currency)}
          </div>
          <div
            style={{
              fontFamily: "var(--sn-mono)",
              fontSize: 10,
              color: "var(--sn-ink-2)",
            }}
          >
            {product.stock <= 3 && product.stock > 0
              ? `Quedan ${product.stock}`
              : product.stock === 0
                ? "Agotado"
                : "En stock"}
          </div>
        </div>
      </div>
    </Link>
  );
}
