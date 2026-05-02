"use client";

import { useState } from "react";
import Link from "next/link";

const STORE = {
  address:
    "Calle 27 casi 26 - Edificio Ensenada L001a, 20100 Punta del Este, Maldonado",
  whatsapp: "+598 99 123 456",
  whatsappHref:
    "https://api.whatsapp.com/send?text=https%3A%2F%2Fmaps.app.goo.gl%2F1swdGgntqQGtoKsZ8",
  email: "hola@surfnativo.uy",
  hoursWeek: "Lun a Vie · 10:00 – 19:30",
  hoursSat: "Sábados · 10:00 – 17:00",
  hoursSun: "Domingos · cerrado (solo temporada)",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Surf+Nativo+Punta+del+Este",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3269.7558724637443!2d-54.941299!3d-34.962727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95750572fccc8687%3A0x552847470c25a73a!2sSurf%20Nativo!5e0!3m2!1sen!2suy!4v1777719482762!5m2!1sen!2suy",
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
        Tienda de surf en Punta del Este. Te respondemos por
        WhatsApp en el día y enviamos a todo Uruguay.
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

          <a
            href={STORE.whatsappHref}
            target="_blank"
            rel="noopener"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 22px",
              background: "#25D366",
              color: "#fff",
              border: "1px solid #128C7E",
              boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#fff",
                color: "#25D366",
                flexShrink: 0,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16.002 3.2C9.045 3.2 3.4 8.844 3.4 15.799c0 2.222.58 4.395 1.682 6.31L3.2 28.8l6.864-1.802a12.595 12.595 0 0 0 5.937 1.508h.005c6.957 0 12.602-5.643 12.602-12.598 0-3.366-1.31-6.532-3.69-8.913a12.51 12.51 0 0 0-8.916-3.795Zm0 23.024h-.004a10.46 10.46 0 0 1-5.33-1.46l-.382-.227-3.973 1.043 1.06-3.873-.249-.397a10.46 10.46 0 0 1-1.602-5.59c.002-5.785 4.71-10.49 10.484-10.49 2.8 0 5.43 1.092 7.41 3.073a10.41 10.41 0 0 1 3.072 7.418c-.002 5.785-4.71 10.503-10.486 10.503Zm5.748-7.852c-.314-.158-1.864-.92-2.153-1.024-.288-.105-.499-.158-.71.158-.21.314-.815 1.025-.999 1.236-.184.21-.368.236-.683.079-.314-.158-1.33-.49-2.534-1.563-.937-.836-1.57-1.868-1.754-2.182-.184-.314-.02-.484.137-.64.141-.14.314-.368.473-.552.157-.184.21-.314.314-.524.105-.21.053-.394-.026-.552-.078-.157-.71-1.71-.971-2.341-.256-.615-.516-.532-.71-.541l-.604-.011a1.16 1.16 0 0 0-.84.394c-.288.314-1.103 1.077-1.103 2.625 0 1.547 1.13 3.043 1.286 3.253.157.21 2.224 3.395 5.388 4.762.753.325 1.34.519 1.798.664.755.24 1.444.207 1.988.126.606-.09 1.864-.762 2.128-1.5.262-.736.262-1.367.184-1.498-.078-.131-.288-.21-.604-.368Z" />
              </svg>
            </span>
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: 1,
                minWidth: 0,
              }}
            >
              <span
                className="sn-mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  opacity: 0.9,
                }}
              >
                WhatsApp
              </span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                }}
              >
                {STORE.whatsapp}
              </span>
            </span>
            <span style={{ fontSize: 18, opacity: 0.9 }}>→</span>
          </a>

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
