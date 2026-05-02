import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactView } from "./ContactView";

export const metadata = {
  title: "Contacto · Surf Nativo",
  description:
    "Pasá por el local frente a Playa Brava o escribinos. Atendemos por WhatsApp, email y teléfono.",
};

export default function ContactoPage() {
  return (
    <div style={{ width: "100%" }}>
      <Header variant="light" />
      <ContactView />
      <Footer />
    </div>
  );
}
