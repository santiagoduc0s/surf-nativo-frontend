"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  sendChatMessage,
  type ChatMessage,
  type RecommendedProduct,
  ChatError,
} from "@/lib/chat";

const HISTORY_KEY = "sn-chat-v1";
const PRODUCTS_KEY = "sn-chat-products-v1";
const MAX_HISTORY = 30;

const SUGGESTED = [
  "Busco un traje para aguas frías, soy principiante",
  "Recomendame una tabla de surf para empezar",
  "¿Qué bodyboard me sirve para olas chicas?",
];

const fmtMoney = (price: number, currency: "UYU" | "USD") =>
  currency === "USD"
    ? "US$ " + price.toLocaleString("es-UY")
    : "$U " + price.toLocaleString("es-UY");

export function ProductChat() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const h = localStorage.getItem(HISTORY_KEY);
      const p = localStorage.getItem(PRODUCTS_KEY);
      if (h) setHistory(JSON.parse(h) as ChatMessage[]);
      if (p) setProducts(JSON.parse(p) as RecommendedProduct[]);
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch {}
  }, [history, products, mounted]);

  // body scroll lock when open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // auto-scroll on new message
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, products, loading]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || loading) return;
    setError(null);
    const userMsg: ChatMessage = { role: "user", content: text };
    const next: ChatMessage[] = [...history, userMsg].slice(-MAX_HISTORY);
    setHistory(next);
    setInput("");
    setLoading(true);
    try {
      const { message, recommended_products } = await sendChatMessage(next);
      setHistory((cur) => [...cur, { role: "assistant", content: message }]);
      setProducts(recommended_products);
    } catch (e) {
      const msg =
        e instanceof ChatError
          ? e.message
          : "No pude conectar con el servidor. Probá de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setHistory([]);
    setProducts([]);
    setError(null);
    try {
      localStorage.removeItem(HISTORY_KEY);
      localStorage.removeItem(PRODUCTS_KEY);
    } catch {}
  };

  if (!mounted) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir chat"
          className="sn-chat-fab"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500 }}>¿Qué buscás?</span>
        </button>
      )}

      {open &&
        createPortal(
          <div
            className="sn-chat-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div className="sn-chat-panel" role="dialog" aria-label="Chat de recomendaciones">
              {/* Header */}
              <div className="sn-chat-header">
                <div>
                  <div
                    className="sn-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--sn-clay)",
                      marginBottom: 4,
                    }}
                  >
                    ◆ Asistente Surf Nativo
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--sn-serif)",
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Te ayudo a elegir
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={reset}
                      className="sn-chat-icon-btn"
                      title="Empezar de nuevo"
                      aria-label="Empezar de nuevo"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="sn-chat-icon-btn"
                    aria-label="Cerrar chat"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 6l12 12M18 6l-12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="sn-chat-body" ref={scrollRef}>
                {history.length === 0 && !loading && (
                  <div className="sn-chat-empty">
                    <p
                      style={{
                        fontFamily: "var(--sn-serif)",
                        fontSize: 17,
                        fontWeight: 500,
                        marginBottom: 16,
                        lineHeight: 1.4,
                      }}
                    >
                      Contame qué andás buscando. Te recomiendo el equipo del
                      catálogo que mejor encaje.
                    </p>
                    <div
                      className="sn-mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--sn-mist)",
                        marginTop: 24,
                        marginBottom: 12,
                      }}
                    >
                      Probá con
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {SUGGESTED.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          className="sn-chat-suggestion"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {history.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user"
                        ? "sn-chat-msg sn-chat-msg-user"
                        : "sn-chat-msg sn-chat-msg-bot"
                    }
                  >
                    {m.content}
                  </div>
                ))}

                {/* Recommended products under last assistant message */}
                {history.length > 0 &&
                  history[history.length - 1].role === "assistant" &&
                  products.length > 0 && (
                    <div className="sn-chat-products">
                      {products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/producto/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="sn-chat-product"
                        >
                          {p.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image_url}
                              alt={p.title}
                              className="sn-chat-product-img"
                            />
                          ) : (
                            <div className="sn-chat-product-img" />
                          )}
                          <div className="sn-chat-product-meta">
                            {p.category && (
                              <div
                                className="sn-mono"
                                style={{
                                  fontSize: 9,
                                  letterSpacing: "0.15em",
                                  textTransform: "uppercase",
                                  color: "var(--sn-clay)",
                                  marginBottom: 2,
                                }}
                              >
                                {p.category.name}
                              </div>
                            )}
                            <div className="sn-chat-product-title">{p.title}</div>
                            <div className="sn-chat-product-price">
                              {fmtMoney(p.price, p.currency)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                {loading && (
                  <div className="sn-chat-msg sn-chat-msg-bot sn-chat-typing">
                    <span /> <span /> <span />
                  </div>
                )}

                {error && <div className="sn-chat-error">{error}</div>}
              </div>

              {/* Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="sn-chat-footer"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu pregunta…"
                  maxLength={4000}
                  disabled={loading}
                  className="sn-chat-input"
                  aria-label="Mensaje"
                />
                <button
                  type="submit"
                  disabled={loading || input.trim() === ""}
                  className="sn-chat-send"
                  aria-label="Enviar"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
