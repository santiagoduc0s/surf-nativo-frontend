// Surf Nativo — SEO helpers (URLs, metadata defaults, JSON-LD)

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3737";

export const SITE_NAME = "Surf Nativo";
export const SITE_LOCALE = "es_UY";
export const SITE_TAGLINE =
  "Tienda de surf en Punta del Este — trajes, tablas, bodyboards y accesorios.";

export const ORG = {
  legalName: "Surf Nativo",
  email: "hola@surfnativo.uy",
  phone: "+598 99 000 000",
  address: {
    street: "Avenida Roosevelt",
    city: "Punta del Este",
    region: "Maldonado",
    country: "UY",
    postalCode: "20100",
  },
  founded: "2008",
};

export function abs(path = "/"): string {
  if (path.startsWith("http")) return path;
  return new URL(path, SITE_URL).toString();
}

// ——— JSON-LD builders ———

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: abs("/assets/logo.jpg"),
    foundingDate: ORG.founded,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORG.phone,
      email: ORG.email,
      contactType: "customer service",
      areaServed: "UY",
      availableLanguage: ["Spanish"],
    },
    sameAs: [
      "https://www.facebook.com/surfnativo.uy",
      "https://www.instagram.com/surfnativo.uy",
    ],
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": SITE_URL + "#store",
    name: SITE_NAME,
    image: abs("/assets/hero-mano-punta.webp"),
    url: SITE_URL,
    telephone: ORG.phone,
    email: ORG.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.address.street,
      addressLocality: ORG.address.city,
      addressRegion: ORG.address.region,
      postalCode: ORG.address.postalCode,
      addressCountry: ORG.address.country,
    },
    foundingDate: ORG.founded,
    areaServed: { "@type": "Country", name: "Uruguay" },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "es-UY",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

export function productJsonLd(p: {
  title: string;
  description: string;
  images: string[];
  brand: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description || `${p.title} en ${SITE_NAME}.`,
    image: p.images.length > 0 ? p.images : undefined,
    brand: { "@type": "Brand", name: p.brand },
    sku: p.sku,
    offers: {
      "@type": "Offer",
      url: abs(p.url),
      priceCurrency: p.currency === "USD" ? "USD" : "UYU",
      price: p.price,
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}

