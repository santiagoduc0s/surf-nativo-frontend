// Surf Nativo — chat recommender API client.
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8087/api/v1";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type RecommendedProduct = {
  id: number;
  title: string;
  slug: string;
  price: number;
  currency: "UYU" | "USD";
  category: { slug: string; name: string } | null;
  image_url: string | null;
};

export type ChatResponse = {
  message: string;
  recommended_products: RecommendedProduct[];
};

export async function sendChatMessage(
  history: ChatMessage[],
): Promise<ChatResponse> {
  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ messages: history }),
  });
  if (!res.ok) {
    const status = res.status;
    let message = "No pudimos procesar tu mensaje. Probá de nuevo.";
    if (status === 429) message = "Estás escribiendo muy rápido, esperá unos segundos.";
    if (status >= 500) message = "Tuve un problema de mi lado, probá de nuevo.";
    throw new ChatError(status, message);
  }
  return res.json();
}

export class ChatError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
