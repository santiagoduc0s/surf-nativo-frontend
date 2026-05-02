// Surf Nativo — UI-friendly product types & helpers backed by the API.
// Server components import these to fetch data; client components receive
// already-normalized Product objects via props.

import {
  fetchAllProducts,
  fetchCategories,
  fetchCategory,
  fetchProduct,
  fetchProducts,
  type ApiCategory,
  type ApiProduct,
  type ProductsQuery,
} from "./api";

export type Product = {
  id: number;
  sku: string;            // 'sn-001'
  slug: string;           // canonical URL key
  title: string;
  description: string;
  brand: string;
  price: number;
  currency: string;
  stock: number;
  cat: string;            // category slug
  catName: string;        // category display name
  image: string;          // primary image (lowest sort_order)
  images: string[];       // all images
  meliUrl: string | null;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export function normalizeProduct(p: ApiProduct): Product {
  const sortedImages = [...p.images].sort((a, b) => a.sort_order - b.sort_order);
  const images = sortedImages.map((i) => i.url);
  const brand =
    p.attributes?.BRAND?.value_name ??
    extractBrand(p.description) ??
    "Surf Nativo";
  return {
    id: p.id,
    sku: p.sku,
    slug: p.slug,
    title: p.title,
    description: p.description,
    brand,
    price: p.price,
    currency: p.currency,
    stock: p.stock,
    cat: p.category.slug,
    catName: p.category.name,
    image: images[0] ?? "",
    images,
    meliUrl: p.meli_permalink,
  };
}

function extractBrand(desc: string): string | null {
  const m = desc.match(/Marca:\s*([^\n.|]+)/i);
  return m ? m[1].trim() : null;
}

export function normalizeCategory(c: ApiCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
  };
}

// ——— UI helpers ———

export function fmtPrice(price: number, currency = "UYU"): string {
  if (currency === "USD" || currency === "US$") {
    return "US$ " + price.toLocaleString("es-UY");
  }
  return "$U " + price.toLocaleString("es-UY");
}

// ——— Server-side data access (use in async server components) ———

export async function getCategories(): Promise<Category[]> {
  const cats = await fetchCategories();
  return cats.map(normalizeCategory);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const c = await fetchCategory(slug);
  return c ? normalizeCategory(c) : null;
}

export async function getProducts(params: ProductsQuery = {}) {
  const page = await fetchProducts(params);
  return {
    ...page,
    data: page.data.map(normalizeProduct),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const list = await fetchAllProducts();
  return list.map(normalizeProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const p = await fetchProduct(slug);
  return p ? normalizeProduct(p) : null;
}

// Image-like display category used in the home grid.
// Maps an existing category to a hero photo (the API doesn't carry images for categories).
const CATEGORY_IMAGES: Record<string, string> = {
  wetsuits: "/categories/wetsuits.jpg",
  surfboards: "/categories/surfboards.jpg",
  bodyboards: "/categories/bodyboards.jpg",
  fins: "/categories/fins.jpg",
  accesorios: "/categories/accesorios.jpg",
  sup: "/categories/sup.jpg",
};

export function categoryImage(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? CATEGORY_IMAGES.accesorios;
}

// Short labels used in the header nav.
const SHORT_LABELS: Record<string, string> = {
  surfboards: "Tablas",
  wetsuits: "Trajes",
  bodyboards: "Bodyboards",
  sup: "SUP",
  fins: "Aletas",
  accesorios: "Accesorios",
};

export function shortCategoryName(slug: string, fallback: string): string {
  return SHORT_LABELS[slug] ?? fallback;
}
