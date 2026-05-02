import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { fmtPrice, getProduct, getProducts } from "@/lib/products";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { ProductActions } from "./ProductActions";
import { ProductGallery } from "./ProductGallery";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Producto no encontrado" };

  const description =
    p.description?.length > 30
      ? p.description
      : `${p.title} · ${p.brand} · ${fmtPrice(p.price, p.currency)}. Envíos a todo Uruguay desde Punta del Este.`;

  const images = p.images.length > 0 ? p.images : undefined;

  return {
    title: `${p.title} — ${p.brand}`,
    description,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: {
      title: p.title,
      description,
      url: `/producto/${p.slug}`,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description,
      images,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const page = await getProducts({ category: p.cat, per_page: 8 });
  const related = page.data.filter((x) => x.id !== p.id).slice(0, 4);

  return (
    <div style={{ width: "100%" }}>
      <JsonLd
        data={[
          productJsonLd({
            title: p.title,
            description: p.description,
            images: p.images,
            brand: p.brand,
            sku: p.sku,
            price: p.price,
            currency: p.currency,
            stock: p.stock,
            url: `/producto/${p.slug}`,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", url: "/" },
            { name: p.catName, url: `/categoria/${p.cat}` },
            { name: p.title, url: `/producto/${p.slug}` },
          ]),
        ]}
      />
      <Header variant="light" />

      {/* Breadcrumbs */}
      <div
        className="sn-page"
        style={{ paddingBlock: "20px 0", maxWidth: 1500, margin: "0 auto" }}
      >
        <div
          className="sn-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--sn-mist)",
          }}
        >
          <Link href="/">Inicio</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link href={`/categoria/${p.cat}`}>{p.catName}</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--sn-ink)" }}>{p.title}</span>
        </div>
      </div>

      <section
        className="sn-page sn-row sn-row-detail"
        style={{
          paddingBlock: "32px 80px",
          maxWidth: 1500,
          margin: "0 auto",
          gap: "clamp(28px, 4vw, 60px)",
        }}
      >
        <ProductGallery images={p.images} title={p.title} />

        <div>
          <div
            className="sn-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--sn-clay-deep)",
              marginBottom: 14,
            }}
          >
            {p.brand} · {p.sku.toUpperCase()}
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.05,
              marginBottom: 18,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {p.title}
          </h1>
          {p.description && (
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--sn-ink-2)" }}>
              {p.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginTop: 32,
            }}
          >
            <div
              style={{
                fontFamily: "var(--sn-serif)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 500,
              }}
            >
              {fmtPrice(p.price, p.currency)}
            </div>
          </div>
          <ProductActions product={p} />

          <div
            style={{
              marginTop: 32,
              padding: 18,
              background: "var(--sn-bone-2)",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--sn-serif)",
                  fontSize: 15,
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Envío 48 hs
              </div>
              <div style={{ color: "var(--sn-ink-2)" }}>Gratis desde $U 5.000</div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--sn-serif)",
                  fontSize: 15,
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Cambios
              </div>
              <div style={{ color: "var(--sn-ink-2)" }}>Sin cargo, 30 días</div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="sn-page"
          style={{ paddingBlock: "30px 90px", maxWidth: 1500, margin: "0 auto" }}
        >
          <h2 className="sn-h2-sm" style={{ marginBottom: 24, fontWeight: 600 }}>
            Te puede servir también
          </h2>
          <div className="sn-row sn-row-4" style={{ gap: 20 }}>
            {related.map((r) => (
              <ProductCard key={r.id} product={r} variant="minimal" />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
