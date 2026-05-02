import type { MetadataRoute } from "next";
import { getAllProducts, getCategories } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/buscar`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/cuenta`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  let categoryEntries: MetadataRoute.Sitemap = [];
  let productEntries: MetadataRoute.Sitemap = [];

  try {
    const [cats, products] = await Promise.all([
      getCategories(),
      getAllProducts(),
    ]);
    categoryEntries = cats.map((c) => ({
      url: `${SITE_URL}/categoria/${c.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    }));
    productEntries = products.map((p) => ({
      url: `${SITE_URL}/producto/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // backend offline at build time → still emit a valid sitemap with static routes
  }

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
