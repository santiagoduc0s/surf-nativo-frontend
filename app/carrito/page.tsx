import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartView } from "./CartView";

export const metadata = {
  title: "Carrito",
  description: "Revisá los productos en tu carrito antes de pagar.",
  alternates: { canonical: "/carrito" },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div style={{ width: "100%" }}>
      <Header variant="light" />
      <CartView />
      <Footer />
    </div>
  );
}
