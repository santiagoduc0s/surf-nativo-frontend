"use client";

import { useState } from "react";
import Link from "next/link";

const STORE = {
  address: "Calle 28 esq. Av. Roosevelt, Punta del Este, Maldonado",
  phone: "+598 4244 1234",
  phoneHref: "tel:+59842441234",
  whatsapp: "+598 99 123 456",
  whatsappHref: "https://wa.me/59899123456",
  email: "hola@surfnativo.uy",
  emailHref: "mailto:hola@surfnativo.uy",
  hoursWeek: "Lun a Vie · 10:00 – 19:30",
  hoursSat: "Sábados · 10:00 – 17:00",
  hoursSun: "Domingos · cerrado (solo temporada)",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Playa+Brava+Punta+del+Este",
  mapsEmbed:
    "https://www.google.com/maps?q=Playa+Brava+Punta+del+Este&z=14&output=embed",
};

export function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
    const href = `mailto:${STORE.email}?subject=${encodeURIComponent(
      subject || "Consulta desde surfnativo.uy",
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <section
      className="sn-page"
      style={{ paddingBlock: "40px 80px", maxWidth: 1300, margin: "0 auto" }}
    >
      <div
        className="sn-mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--sn-mist)",
          marginBottom: 20,
        }}
      >
        <Link href="/">Inicio</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--sn-ink)" }}>Contacto</span>
      </div>

      <span className="sn-eyebrow">Contacto</span>
      <h1
        className="sn-h2"
        style={{
          marginTop: 12,
          marginBottom: 16,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          maxWidth: 820,
        }}
      >
        Pasá por el local o escribinos.
      </h1>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.55,
          color: "var(--sn-ink-2)",
          maxWidth: 620,
          marginBottom: 56,
        }}
      >
        Estamos frente a Playa Brava desde 2008. Te respondemos por WhatsApp en
        el día. Para envíos a todo Uruguay, mandanos tu CP y te cotizamos.
      </p>

      <div
        className="sn-row sn-row-account"
        style={{ gap: 60, alignItems: "start" }}
      >
        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <Field
            label="Nombre"
            type="text"
            placeholder="Joaquín Pereira"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Field
            label="Email"
            type="email"
            placeholder="vos@correo.uy"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Field
            label="Asunto"
            type="text"
            placeholder="Consulta sobre wetsuit"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
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
              Mensaje
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              placeholder="Contanos en qué te podemos ayudar."
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 14,
                fontFamily: "var(--sn-sans)",
                border: "1px solid var(--sn-ink)",
                background: "transparent",
                color: "var(--sn-ink)",
                resize: "vertical",
                minHeight: 140,
              }}
            />
          </label>

          <button
            type="submit"
            className="sn-btn"
            style={{ justifyContent: "center", padding: "16px", marginTop: 8 }}
          >
            Enviar mensaje →
          </button>

          <p
            style={{
              fontSize: 12,
              color: "var(--sn-ink-2)",
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            Al enviar, abrimos tu cliente de email con el mensaje listo para{" "}
            <strong style={{ color: "var(--sn-ink)" }}>{STORE.email}</strong>.
            Si preferís, escribinos directo por{" "}
            <a
              href={STORE.whatsappHref}
              target="_blank"
              rel="noopener"
              style={{
                color: "var(--sn-clay-deep)",
                borderBottom: "1px solid var(--sn-clay-deep)",
              }}
            >
              WhatsApp
            </a>
            .
          </p>
        </form>

        <aside style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              background: "var(--sn-bone-2)",
              padding: 32,
              border: "1px solid var(--sn-line)",
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
              ◆ El local
            </div>
            <h3
              style={{
                fontFamily: "var(--sn-serif)",
                fontSize: 22,
                fontWeight: 600,
                marginBottom: 6,
                lineHeight: 1.25,
              }}
            >
              Frente a Playa Brava
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--sn-ink-2)",
                lineHeight: 1.55,
                marginBottom: 16,
              }}
            >
              {STORE.address}
            </p>
            <a
              href={STORE.mapsHref}
              target="_blank"
              rel="noopener"
              className="sn-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--sn-ink)",
                borderBottom: "1px solid var(--sn-ink)",
                paddingBottom: 2,
              }}
            >
              Cómo llegar →
            </a>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              border: "1px solid var(--sn-line)",
            }}
          >
            <ContactRow
              label="WhatsApp"
              value={STORE.whatsapp}
              href={STORE.whatsappHref}
              external
            />
            <ContactRow
              label="Teléfono"
              value={STORE.phone}
              href={STORE.phoneHref}
            />
            <ContactRow
              label="Email"
              value={STORE.email}
              href={STORE.emailHref}
            />
          </ul>

          <div
            style={{
              padding: 24,
              border: "1px solid var(--sn-line)",
            }}
          >
            <div
              className="sn-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--sn-clay-deep)",
                marginBottom: 14,
              }}
            >
              ◆ Horarios
            </div>
            <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
              <span>{STORE.hoursWeek}</span>
              <span>{STORE.hoursSat}</span>
              <span style={{ color: "var(--sn-ink-2)" }}>{STORE.hoursSun}</span>
            </div>
          </div>
        </aside>
      </div>

      <div
        style={{
          marginTop: 60,
          aspectRatio: "21 / 9",
          width: "100%",
          border: "1px solid var(--sn-line)",
          background: "var(--sn-bone-2)",
          overflow: "hidden",
        }}
      >
        <iframe
          src={STORE.mapsEmbed}
          title="Ubicación Surf Nativo"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        />
      </div>
    </section>
  );
}

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
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

function ContactRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <li style={{ display: "block", borderBottom: "1px solid var(--sn-line)" }}>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          fontSize: 14,
        }}
      >
        <span
          className="sn-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--sn-mist)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span style={{ color: "var(--sn-ink)" }}>
          {value} <span style={{ color: "var(--sn-mist)" }}>→</span>
        </span>
      </a>
    </li>
  );
}
