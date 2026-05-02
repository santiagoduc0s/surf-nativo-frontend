"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

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

export function AccountView() {
  const { user, hydrated, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [topError, setTopError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setTopError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ name, email, phone: phone || undefined, password });
      }
      // success — provider sets user
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) setErrors(err.errors);
        else setTopError(err.message || "Error al procesar la solicitud.");
      } else {
        setTopError("No pudimos conectar con el servidor. Probá de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) return <div style={{ minHeight: 600 }} />;

  if (user) {
    return <Dashboard onLogout={logout} user={user} />;
  }

  return (
    <section
      className="sn-page"
      style={{
        paddingBlock: "40px 80px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
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
        <span style={{ color: "var(--sn-ink)" }}>Cuenta</span>
      </div>

      <h1 className="sn-h1" style={{ marginBottom: 8, fontWeight: 600 }}>
        {mode === "login" ? "Ingresá a tu cuenta" : "Creá tu cuenta"}
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--sn-ink-2)",
          marginBottom: 40,
          maxWidth: 560,
        }}
      >
        {mode === "login"
          ? "Llevá el control de tus pedidos, direcciones y favoritos."
          : "Sumate y guardá tus direcciones, pedidos y favoritos."}
      </p>

      <div
        className="sn-row sn-row-account"
        style={{ gap: "clamp(28px, 5vw, 60px)", alignItems: "start" }}
      >
        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          {topError && (
            <div
              style={{
                padding: "10px 14px",
                background: "var(--sn-bone-2)",
                border: "1px solid var(--sn-rust)",
                color: "var(--sn-rust)",
                fontSize: 13,
              }}
            >
              {topError}
            </div>
          )}

          {mode === "register" && (
            <div>
              <Field
                label="Nombre"
                type="text"
                placeholder="Joaquín Pereira"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.name && (
                <FieldError messages={errors.name} />
              )}
            </div>
          )}
          <div>
            <Field
              label="Email"
              type="email"
              placeholder="vos@correo.uy"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <FieldError messages={errors.email} />}
          </div>
          {mode === "register" && (
            <div>
              <Field
                label="Teléfono (opcional)"
                type="tel"
                placeholder="099 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <FieldError messages={errors.phone} />}
            </div>
          )}
          <div>
            <Field
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === "register" ? 8 : 1}
            />
            {errors.password && <FieldError messages={errors.password} />}
          </div>

          <button
            type="submit"
            className="sn-btn"
            disabled={submitting}
            style={{
              justifyContent: "center",
              padding: "16px",
              marginTop: 8,
              opacity: submitting ? 0.5 : 1,
            }}
          >
            {submitting
              ? "Procesando…"
              : mode === "login"
                ? "Ingresar →"
                : "Crear cuenta →"}
          </button>

          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              color: "var(--sn-ink-2)",
            }}
          >
            {mode === "login" ? (
              <>
                ¿No tenés cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrors({});
                    setTopError(null);
                  }}
                  style={{
                    color: "var(--sn-clay-deep)",
                    borderBottom: "1px solid var(--sn-clay-deep)",
                    padding: 0,
                    fontFamily: "inherit",
                    fontSize: "inherit",
                  }}
                >
                  Creá una nueva
                </button>
              </>
            ) : (
              <>
                ¿Ya tenés cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrors({});
                    setTopError(null);
                  }}
                  style={{
                    color: "var(--sn-clay-deep)",
                    borderBottom: "1px solid var(--sn-clay-deep)",
                    padding: 0,
                    fontFamily: "inherit",
                    fontSize: "inherit",
                  }}
                >
                  Ingresá
                </button>
              </>
            )}
          </div>
        </form>

        <aside
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
            ◆ Por qué tener cuenta
          </div>
          <h3
            style={{
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            Compras más rápidas, beneficios para clientes.
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 18,
            }}
          >
            {[
              ["Tus pedidos", "Seguí tus envíos en tiempo real."],
              ["Direcciones guardadas", "Comprá sin tener que cargar de nuevo."],
              ["Favoritos", "Guardá productos para más tarde."],
              ["Newsletter", "Te avisamos cuando llegan drops nuevos."],
            ].map(([t, d]) => (
              <li key={t}>
                <div
                  style={{
                    fontFamily: "var(--sn-serif)",
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {t}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--sn-ink-2)",
                    lineHeight: 1.5,
                  }}
                >
                  {d}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

function FieldError({ messages }: { messages: string[] }) {
  return (
    <div
      style={{
        marginTop: 6,
        fontFamily: "var(--sn-mono)",
        fontSize: 11,
        color: "var(--sn-rust)",
      }}
    >
      {messages[0]}
    </div>
  );
}

function Dashboard({
  user,
  onLogout,
}: {
  user: { name: string; email: string; phone: string | null };
  onLogout: () => void | Promise<void>;
}) {
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <section
      className="sn-page"
      style={{
        paddingBlock: "40px 80px",
        maxWidth: 1300,
        margin: "0 auto",
      }}
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
        <span style={{ color: "var(--sn-ink)" }}>Mi cuenta</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 40,
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <span className="sn-eyebrow">Hola</span>
          <h1 className="sn-h1" style={{ marginTop: 8, fontWeight: 600 }}>
            {user.name}
          </h1>
          <p
            style={{
              fontFamily: "var(--sn-mono)",
              fontSize: 13,
              color: "var(--sn-ink-2)",
              marginTop: 8,
            }}
          >
            {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="sn-btn sn-btn-ghost"
          style={{ height: "fit-content", opacity: loggingOut ? 0.5 : 1 }}
        >
          {loggingOut ? "Cerrando…" : "Cerrar sesión →"}
        </button>
      </div>

      <div
        className="sn-row sn-row-4"
        style={{ gap: 16, marginBottom: 40 }}
      >
        {[
          { t: "Pedidos", v: "0", d: "Sin compras todavía" },
          { t: "Favoritos", v: "0", d: "Productos guardados" },
          { t: "Direcciones", v: "0", d: "Direcciones guardadas" },
          { t: "Cupones", v: "1", d: "OTOÑO26 disponible" },
        ].map((c) => (
          <div
            key={c.t}
            style={{
              padding: 24,
              border: "1px solid var(--sn-line)",
              background: "var(--sn-bone)",
            }}
          >
            <div
              className="sn-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--sn-mist)",
                marginBottom: 8,
              }}
            >
              {c.t}
            </div>
            <div
              style={{
                fontFamily: "var(--sn-serif)",
                fontSize: 36,
                fontWeight: 600,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {c.v}
            </div>
            <div style={{ fontSize: 12, color: "var(--sn-ink-2)" }}>{c.d}</div>
          </div>
        ))}
      </div>

      <div className="sn-row sn-row-detail" style={{ gap: 40 }}>
        <div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginBottom: 16,
              letterSpacing: "-0.015em",
            }}
          >
            Tus pedidos
          </h2>
          <div
            style={{
              border: "1px solid var(--sn-line)",
              padding: "60px 32px",
              textAlign: "center",
              background: "var(--sn-bone)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--sn-serif)",
                fontSize: 20,
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              Todavía no compraste nada.
            </p>
            <p style={{ color: "var(--sn-ink-2)", fontSize: 14, marginBottom: 24 }}>
              Cuando hagas tu primera compra, va a aparecer acá.
            </p>
            <Link href="/categoria/wetsuits" className="sn-btn">
              Empezar a mirar →
            </Link>
          </div>
        </div>

        <aside>
          <div
            style={{
              padding: 24,
              border: "1px solid var(--sn-line)",
              marginBottom: 16,
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
              ◆ Mis datos
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                ["Nombre", user.name],
                ["Email", user.email],
                ["Teléfono", user.phone ?? "—"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    paddingBottom: 10,
                    borderBottom: "1px solid var(--sn-line)",
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
                    {k}
                  </span>
                  <span style={{ fontSize: 14 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <nav
            style={{
              display: "grid",
              gap: 1,
              background: "var(--sn-line)",
              border: "1px solid var(--sn-line)",
            }}
          >
            {[
              { l: "Direcciones de envío", h: "#" },
              { l: "Favoritos", h: "#" },
              { l: "Métodos de pago", h: "#" },
              { l: "Notificaciones", h: "#" },
              { l: "Centro de ayuda", h: "#" },
            ].map((it) => (
              <a
                key={it.l}
                href={it.h}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "var(--sn-bone)",
                  fontSize: 14,
                }}
              >
                <span>{it.l}</span>
                <span style={{ color: "var(--sn-mist)" }}>→</span>
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </section>
  );
}
