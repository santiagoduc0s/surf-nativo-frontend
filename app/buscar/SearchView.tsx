"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import type { Category, Product } from "@/lib/products";

export function SearchView({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = products;
    if (cat) list = list.filter((p) => p.cat === cat);
    if (query) {
      const tokens = query.split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const haystack = `${p.title} ${p.brand}`.toLowerCase();
        return tokens.every((t) => haystack.includes(t));
      });
    }
    return list;
  }, [q, cat, products]);

  return (
    <section
      className="sn-page"
      style={{
        paddingBlock: "40px 80px",
        maxWidth: 1500,
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
          marginBottom: 24,
        }}
      >
        <Link href="/">Inicio</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--sn-ink)" }}>Buscar</span>
      </div>

      <div
        style={{
          position: "relative",
          borderBottom: "1.5px solid var(--sn-ink)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingBottom: 4,
          marginBottom: 24,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          style={{ flexShrink: 0, color: "var(--sn-ink)" }}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar productos…"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--sn-serif)",
            fontSize: 22,
            fontWeight: 500,
            padding: "10px 0",
            color: "var(--sn-ink)",
            letterSpacing: "-0.01em",
          }}
        />
        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="Limpiar búsqueda"
            style={{
              fontFamily: "var(--sn-mono)",
              fontSize: 12,
              color: "var(--sn-mist)",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 32,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setCat(null)}
            style={{
              fontFamily: "var(--sn-mono)",
              fontSize: 12,
              padding: "6px 12px",
              border:
                cat === null
                  ? "1px solid var(--sn-ink)"
                  : "1px solid var(--sn-line)",
              background: cat === null ? "var(--sn-ink)" : "transparent",
              color: cat === null ? "var(--sn-bone)" : "var(--sn-ink)",
            }}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(cat === c.slug ? null : c.slug)}
              style={{
                fontFamily: "var(--sn-mono)",
                fontSize: 12,
                padding: "6px 12px",
                border:
                  cat === c.slug
                    ? "1px solid var(--sn-ink)"
                    : "1px solid var(--sn-line)",
                background: cat === c.slug ? "var(--sn-ink)" : "transparent",
                color: cat === c.slug ? "var(--sn-bone)" : "var(--sn-ink)",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
        <span
          className="sn-mono"
          style={{
            fontSize: 12,
            color: "var(--sn-mist)",
            letterSpacing: "0.05em",
          }}
        >
          {results.length} {results.length === 1 ? "resultado" : "resultados"}
        </span>
      </div>

      {results.length === 0 ? (
        <div
          style={{
            padding: "60px 32px",
            textAlign: "center",
            border: "1px solid var(--sn-line)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--sn-serif)",
              fontSize: 22,
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            Nada con esos términos.
          </p>
          <p style={{ color: "var(--sn-ink-2)", fontSize: 14, marginBottom: 20 }}>
            Probá con otra palabra o navegá por categoría.
          </p>
          <Link href="/categoria/wetsuits" className="sn-btn">
            Ver trajes →
          </Link>
        </div>
      ) : (
        <div className="sn-row sn-row-4" style={{ gap: 20 }}>
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
