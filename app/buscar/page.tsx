import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchView } from "./SearchView";
import { getAllProducts, getCategories } from "@/lib/products";

export const metadata = {
  title: "Buscar productos",
  description:
    "Buscá entre todos los productos de Surf Nativo: trajes de neoprene, tablas, bodyboards, aletas y accesorios.",
  alternates: { canonical: "/buscar" },
};

export const revalidate = 60;

export default async function BuscarPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <div style={{ width: "100%" }}>
      <Header variant="light" />
      <SearchView products={products} categories={categories} />
      <Footer />
    </div>
  );
}
