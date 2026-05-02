import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { getCategory, getProducts } from "@/lib/products";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return { title: "Categoría no encontrada" };
  const description = `${cat.name} en Surf Nativo · Punta del Este. Importados de marcas líderes con stock real. Envíos a todo Uruguay.`;
  return {
    title: cat.name,
    description,
    alternates: { canonical: `/categoria/${cat.slug}` },
    openGraph: {
      title: `${cat.name} · Surf Nativo`,
      description,
      url: `/categoria/${cat.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) notFound();

  const page = await getProducts({ category: slug, per_page: 100 });
  const products = page.data;
  const [firstWord, ...rest] = cat.name.split(" ");

  return (
    <div style={{ width: "100%", minHeight: "100%", background: "var(--sn-bone)" }}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: cat.name, url: `/categoria/${cat.slug}` },
        ])}
      />
      <Header variant="light" />

      <section
        className="sn-page"
        style={{ paddingBlock: "32px 20px", maxWidth: 1500, margin: "0 auto" }}
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
          <span style={{ color: "var(--sn-ink)" }}>{cat.name}</span>
        </div>
        <div
          className="sn-row sn-row-cat-head"
          style={{ alignItems: "flex-end" }}
        >
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {firstWord}{" "}
            <span style={{ color: "var(--sn-clay)" }}>{rest.join(" ")}</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "var(--sn-ink-2)",
              paddingBottom: 12,
            }}
          >
            Importados de marcas líderes, probados y elegidos por nuestro equipo en aguas
            uruguayas. Stock real al día de hoy.
          </p>
        </div>
      </section>

      <hr
        className="sn-rule-ink sn-page"
        style={{
          margin: "20px auto 0",
          maxWidth: 1500,
        }}
      />

      <section
        className="sn-page"
        style={{ paddingBlock: "30px 80px", maxWidth: 1500, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 16,
            borderBottom: "1px solid var(--sn-line)",
            marginBottom: 24,
            fontFamily: "var(--sn-mono)",
            fontSize: 12,
          }}
        >
          <span style={{ color: "var(--sn-ink-2)", letterSpacing: "0.05em" }}>
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        {products.length === 0 ? (
          <p style={{ color: "var(--sn-mist)" }}>
            Todavía no hay productos publicados en esta categoría.
          </p>
        ) : (
          <div className="sn-row sn-row-4" style={{ gap: 24 }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
