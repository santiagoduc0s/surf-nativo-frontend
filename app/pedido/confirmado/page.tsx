import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Pedido confirmado",
  description: "¡Gracias por tu compra!",
  alternates: { canonical: "/pedido/confirmado" },
  robots: { index: false, follow: false },
};

export default function ConfirmedPage() {
  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Header variant="light" />
      <section
        style={{
          padding: "100px 40px",
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            margin: "0 auto 32px",
            border: "1.5px solid var(--sn-clay)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--sn-clay)",
            fontSize: 40,
          }}
        >
          ✓
        </div>
        <div
          className="sn-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sn-clay-deep)",
            marginBottom: 16,
          }}
        >
          Pedido №24-1188
        </div>
        <h1
          style={{
            fontSize: 56,
            lineHeight: 1.1,
            marginBottom: 20,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          Listo, lo tenemos.
          <br />
          <span style={{ color: "var(--sn-clay)" }}>Gracias.</span>
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            color: "var(--sn-ink-2)",
            maxWidth: 520,
            margin: "0 auto 36px",
          }}
        >
          Te mandamos la confirmación a tu mail y te avisamos por WhatsApp cuando
          salga del taller. Pasá por nuestro local en Punta del Este cuando estés
          por la zona.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/" className="sn-btn">
            Volver al inicio
          </Link>
          <Link href="/categoria/surfboards" className="sn-btn sn-btn-ghost">
            Seguir mirando
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
