import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountView } from "./AccountView";

export const metadata = {
  title: "Mi cuenta",
  description: "Ingresá o registrate para llevar el control de tus pedidos.",
  alternates: { canonical: "/cuenta" },
  robots: { index: false, follow: true },
};

export default function CuentaPage() {
  return (
    <div style={{ width: "100%" }}>
      <Header variant="light" />
      <AccountView />
      <Footer />
    </div>
  );
}
