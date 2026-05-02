import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckoutFlow } from "./CheckoutFlow";

export const metadata = {
  title: "Checkout",
  description: "Completá tu compra de forma segura.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div style={{ width: "100%" }}>
      <Header variant="light" />
      <CheckoutFlow />
      <Footer />
    </div>
  );
}
