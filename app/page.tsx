import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { HeroBackground } from "@/components/HeroBackground";
import {
  getCategories,
  getProducts,
  categoryImage,
  shortCategoryName,
} from "@/lib/products";
import { localBusinessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tienda de surf en Punta del Este — trajes, tablas y accesorios",
  description:
    "Surf Nativo es la tienda de surf de Punta del Este. Trajes Gul, tablas, bodyboards, aletas y accesorios FCS, Quiksilver, Rip Curl. Envíos a todo Uruguay.",
  alternates: { canonical: "/" },
};

const MARQUEE_BRANDS = [
  { name: "Quiksilver", logo: "/brands/quiksilver.svg" },
  { name: "Rip Curl", logo: "/brands/ripcurl.svg" },
  { name: "O'Neill", logo: "/brands/oneill.svg" },
  { name: "Billabong", logo: "/brands/billabong.svg" },
  { name: "Decathlon", logo: "/brands/decathlon.svg" },
];

export const revalidate = 60;

export default async function Home() {
  const [categories, drops] = await Promise.all([
    getCategories(),
    getProducts({ per_page: 8 }),
  ]);
  const newDrops = drops.data;

  return (
    <div style={{ width: "100%", background: "var(--sn-bone)" }}>
      <JsonLd data={localBusinessJsonLd()} />
      {/* HERO */}
      <section
        style={{
          position: "relative",
          height: "100svh",
          minHeight: 560,
          maxHeight: 1000,
          overflow: "hidden",
        }}
      >
        <HeroBackground />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(10,20,30,0.78) 0%, rgba(10,20,30,0.55) 30%, rgba(10,20,30,0.20) 60%, rgba(10,20,30,0.0) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 4 }}>
          <Header variant="dark" hideLogo={true} />
        </div>

        <div
          style={{
            position: "absolute",
            top: 16,
            left: "clamp(20px, 4vw, 40px)",
            zIndex: 5,
          }}
        >
          <Image
            src="/assets/logo.jpg"
            alt="Surf Nativo"
            width={210}
            height={70}
            priority
            style={{
              height: "clamp(48px, 8vw, 70px)",
              width: "auto",
              display: "block",
              borderRadius: 14,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.18)",
            }}
          />
        </div>

        <div
          className="sn-hero-padding"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            color: "#ffffff",
            textShadow: "0 2px 24px rgba(0,0,0,0.45)",
            zIndex: 3,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ width: 32, height: 1, background: "#ffffff" }} />
            <span
              className="sn-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              Punta del Este
            </span>
          </div>
          <h1
            className="sn-hero-title"
            style={{
              fontWeight: 700,
              fontFamily: "var(--sn-serif)",
              maxWidth: 880,
              marginBottom: 24,
              color: "#ffffff",
            }}
          >
            Equipo de surf para la costa atlántica.
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              maxWidth: 540,
              marginBottom: 32,
              color: "#ffffff",
              opacity: 0.96,
            }}
          >
            Tablas, trajes, bodyboards y accesorios de las mejores marcas. Desde nuestro
            local frente a Playa Brava, despachamos a todo Uruguay.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              href="/categoria/surfboards"
              className="sn-btn"
              style={{
                background: "var(--sn-clay-deep)",
                color: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              }}
            >
              Ver toda la tienda →
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section
        className="sn-page"
        style={{ paddingBlock: "clamp(48px, 8vw, 80px) 60px", maxWidth: 1500, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 40,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span className="sn-eyebrow">Categorías</span>
            <h2 className="sn-h2" style={{ marginTop: 12, fontWeight: 600 }}>
              Encontrá tu equipo
            </h2>
          </div>
          <Link
            href="/categoria/surfboards"
            style={{
              fontFamily: "var(--sn-mono)",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderBottom: "1px solid var(--sn-ink)",
            }}
          >
            Ver todo →
          </Link>
        </div>
        <div
          className="sn-row sn-row-cats"
          style={{
            gap: 16,
            gridTemplateColumns: `repeat(${categories.length}, 1fr)`,
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              style={{ display: "block" }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: "var(--sn-bone-2)",
                  aspectRatio: "4/5",
                  backgroundImage: `url(${categoryImage(cat.slug)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.65) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    color: "var(--sn-bone)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--sn-serif)",
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {shortCategoryName(cat.slug, cat.name)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Drops */}
      <section
        className="sn-page"
        style={{ paddingBlock: 60, maxWidth: 1500, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <span className="sn-eyebrow">Recién llegados</span>
            <h2 className="sn-h2-sm" style={{ marginTop: 12, fontWeight: 600 }}>
              Lo nuevo en stock
            </h2>
          </div>
        </div>
        <div className="sn-row sn-row-4" style={{ gap: 20 }}>
          {newDrops.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Marcas — marquee */}
      <section
        style={{ padding: "60px 0", background: "var(--sn-bone-2)", marginTop: 40 }}
      >
        <div
          className="sn-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sn-clay)",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          Trabajamos con
        </div>
        <div className="sn-marquee">
          <div className="sn-marquee__track">
            {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((b, i) => (
              <img
                key={`${b.name}-${i}`}
                src={b.logo}
                alt={b.name}
                className="sn-marquee__logo"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
