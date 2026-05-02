"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { fmtPrice } from "@/lib/products";
const fmtUYU = (n: number) => fmtPrice(n, "UYU");
import { ProductImg } from "@/components/ProductImg";

const STEPS = ["Datos", "Envío", "Pago"];

function Field({
  label,
  placeholder,
  ...rest
}: {
  label: string;
  placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: "block" }}>
      <div
        className="sn-mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--sn-mist)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <input
        placeholder={placeholder}
        {...rest}
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 14,
          fontFamily: "var(--sn-sans)",
          border: "1px solid var(--sn-ink)",
          background: "transparent",
          color: "var(--sn-ink)",
        }}
      />
    </label>
  );
}

export function CheckoutFlow() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const shipping = subtotal === 0 ? 0 : subtotal >= 5000 ? 0 : 350;
  const total = subtotal + shipping;

  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("mp");

  const finish = () => {
    clear();
    router.push("/pedido/confirmado");
  };

  return (
    <section
      className="sn-page"
      style={{
        paddingBlock: "32px 80px",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      {/* Stepper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
          fontFamily: "var(--sn-mono)",
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {STEPS.map((s, i) => (
          <Fragment key={s}>
            <button
              onClick={() => setStep(i + 1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: step === i + 1 ? "var(--sn-ink)" : "var(--sn-mist)",
                padding: 0,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "1px solid currentColor",
                  background: step >= i + 1 ? "var(--sn-ink)" : "transparent",
                  color: step >= i + 1 ? "var(--sn-bone)" : "currentColor",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                }}
              >
                {i + 1}
              </span>
              {s}
            </button>
            {i < STEPS.length - 1 && (
              <span style={{ flex: 1, height: 1, background: "var(--sn-line)" }} />
            )}
          </Fragment>
        ))}
      </div>

      <div className="sn-row sn-row-cart" style={{ gap: 60 }}>
        <div>
          {step === 1 && (
            <div>
              <h2
                style={{
                  fontSize: 36,
                  marginBottom: 8,
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                }}
              >
                ¿Quién recibe?
              </h2>
              <p style={{ fontSize: 14, color: "var(--sn-ink-2)", marginBottom: 28 }}>
                Te enviamos confirmación al mail y seguimiento por WhatsApp.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                <Field label="Nombre" placeholder="Joaquín" />
                <Field label="Apellido" placeholder="Pereira" />
                <Field label="Email" placeholder="vos@correo.uy" type="email" />
                <Field label="Teléfono" placeholder="099 123 456" />
                <Field label="Documento" placeholder="C.I. 4.123.456-7" />
              </div>
              <button
                onClick={() => setStep(2)}
                className="sn-btn"
                style={{ marginTop: 28 }}
              >
                Continuar a envío →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2
                style={{
                  fontSize: 36,
                  marginBottom: 8,
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                }}
              >
                ¿Adónde lo mandamos?
              </h2>
              <p style={{ fontSize: 14, color: "var(--sn-ink-2)", marginBottom: 28 }}>
                Despachamos en 24 a 48 hs hábiles desde Punta del Este.
              </p>
              <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
                {[
                  {
                    id: "home",
                    t: "Envío a domicilio",
                    d: "DAC / UES — todo Uruguay",
                    p: shipping === 0 ? "Gratis" : fmtUYU(shipping),
                  },
                  {
                    id: "pickup",
                    t: "Retiro en Punta del Este",
                    d: "Avenida Roosevelt — Lun a Sáb",
                    p: "Sin costo",
                  },
                  {
                    id: "express",
                    t: "Envío express Montevideo",
                    d: "Mismo día (compras antes de 11hs)",
                    p: fmtUYU(450),
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: 16,
                      alignItems: "center",
                      padding: 18,
                      border:
                        shippingMethod === opt.id
                          ? "1.5px solid var(--sn-ink)"
                          : "1px solid var(--sn-line)",
                      cursor: "pointer",
                      background:
                        shippingMethod === opt.id ? "var(--sn-bone-2)" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      checked={shippingMethod === opt.id}
                      onChange={() => setShippingMethod(opt.id)}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--sn-serif)",
                          fontSize: 18,
                          fontWeight: 500,
                        }}
                      >
                        {opt.t}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--sn-mono)",
                          fontSize: 12,
                          color: "var(--sn-ink-2)",
                          marginTop: 2,
                        }}
                      >
                        {opt.d}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--sn-mono)",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {opt.p}
                    </div>
                  </label>
                ))}
              </div>
              {shippingMethod !== "pickup" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 16,
                  }}
                >
                  <Field label="Dirección" placeholder="Calle, número, apto" />
                  <Field label="Código postal" placeholder="20000" />
                  <Field label="Ciudad" placeholder="Punta del Este" />
                  <Field label="Departamento" placeholder="Maldonado" />
                </div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button onClick={() => setStep(1)} className="sn-btn sn-btn-ghost">
                  ← Atrás
                </button>
                <button onClick={() => setStep(3)} className="sn-btn">
                  Continuar a pago →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2
                style={{
                  fontSize: 36,
                  marginBottom: 8,
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                }}
              >
                ¿Cómo lo pagás?
              </h2>
              <p style={{ fontSize: 14, color: "var(--sn-ink-2)", marginBottom: 28 }}>
                Pago seguro. Tarjeta procesada por Mercado Pago.
              </p>
              <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
                {[
                  {
                    id: "mp",
                    t: "Mercado Pago",
                    d: "Tarjeta de crédito o débito",
                    b: "MP",
                  },
                  {
                    id: "transfer",
                    t: "Transferencia bancaria",
                    d: "BROU, Itaú, Santander · 5% de descuento",
                    b: "$",
                  },
                  {
                    id: "cash",
                    t: "Efectivo en local",
                    d: "Pagás al retirar en Punta del Este",
                    b: "€",
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: 16,
                      alignItems: "center",
                      padding: 18,
                      border:
                        paymentMethod === opt.id
                          ? "1.5px solid var(--sn-ink)"
                          : "1px solid var(--sn-line)",
                      cursor: "pointer",
                      background:
                        paymentMethod === opt.id ? "var(--sn-bone-2)" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--sn-serif)",
                          fontSize: 18,
                          fontWeight: 500,
                        }}
                      >
                        {opt.t}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--sn-mono)",
                          fontSize: 12,
                          color: "var(--sn-ink-2)",
                          marginTop: 2,
                        }}
                      >
                        {opt.d}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 26,
                        border: "1px solid var(--sn-ink)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--sn-mono)",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {opt.b}
                    </div>
                  </label>
                ))}
              </div>
              {paymentMethod === "mp" && (
                <div style={{ display: "grid", gap: 16 }}>
                  <Field label="Número de tarjeta" placeholder="•••• •••• •••• ••••" />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: 16,
                    }}
                  >
                    <Field label="Vencimiento" placeholder="MM / AA" />
                    <Field label="CVV" placeholder="•••" />
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button onClick={() => setStep(2)} className="sn-btn sn-btn-ghost">
                  ← Atrás
                </button>
                <button
                  onClick={finish}
                  className="sn-btn sn-btn-clay"
                  style={{ flex: 1, justifyContent: "center" }}
                  disabled={items.length === 0}
                >
                  Pagar {fmtUYU(total)} →
                </button>
              </div>
            </div>
          )}
        </div>

        <aside>
          <div
            style={{
              background: "var(--sn-bone)",
              border: "1px solid var(--sn-line)",
              padding: 24,
              position: "sticky",
              top: 20,
            }}
          >
            <div
              className="sn-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--sn-clay-deep)",
                marginBottom: 16,
              }}
            >
              ◆ Tu pedido
            </div>
            {items.length === 0 ? (
              <p style={{ color: "var(--sn-mist)" }}>El carrito está vacío.</p>
            ) : (
              <div style={{ display: "grid", gap: 14 }}>
                {items.map((p) => (
                  <div
                    key={p.lineId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr auto",
                      gap: 14,
                      alignItems: "center",
                    }}
                  >
                    <ProductImg src={p.image} alt={p.title} ratio="1/1" />
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--sn-serif)",
                          fontSize: 14,
                          fontWeight: 500,
                          lineHeight: 1.2,
                        }}
                      >
                        {p.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--sn-mono)",
                          fontSize: 10,
                          color: "var(--sn-ink-2)",
                          marginTop: 2,
                        }}
                      >
                        {p.size} · {p.color} · ×{p.qty}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--sn-mono)",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {fmtPrice(p.price * p.qty, p.currency)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <hr className="sn-rule" style={{ margin: "20px 0" }} />
            <div
              style={{
                display: "grid",
                gap: 8,
                fontFamily: "var(--sn-mono)",
                fontSize: 13,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--sn-ink-2)" }}>Subtotal</span>
                <span>{fmtUYU(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--sn-ink-2)" }}>Envío</span>
                <span>{shipping === 0 ? "Gratis" : fmtUYU(shipping)}</span>
              </div>
            </div>
            <hr className="sn-rule" style={{ margin: "16px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--sn-mono)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "var(--sn-serif)",
                  fontSize: 30,
                  fontWeight: 500,
                }}
              >
                {fmtUYU(total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
