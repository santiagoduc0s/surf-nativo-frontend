// Surf Nativo — backend API client
// Base: NEXT_PUBLIC_API_URL (Laravel + Sanctum)

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8087/api/v1";

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  sort_order: number;
};

export type ApiImage = { url: string; sort_order: number };

export type ApiProduct = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  sku: string;
  condition: string;
  attributes?: Record<string, { id: string; value_name: string }>;
  category: { id: number; name: string; slug: string };
  images: ApiImage[];
  meli_permalink: string | null;
};

export type Paginated<T> = {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  data: T[];
};

export type ApiCustomer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

type FetchOpts = {
  revalidate?: number | false;
  cache?: RequestCache;
  token?: string;
};

async function request<T>(path: string, opts: FetchOpts = {}, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (init?.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  const next: { revalidate?: number | false } = {};
  if (opts.revalidate !== undefined) next.revalidate = opts.revalidate;

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers,
    cache: opts.cache,
    next: opts.cache ? undefined : next,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, body);
  }
  return res.json();
}

export class ApiError extends Error {
  status: number;
  body: string;
  errors?: Record<string, string[]>;

  constructor(status: number, body: string) {
    super(`API ${status}`);
    this.status = status;
    this.body = body;
    try {
      const parsed = JSON.parse(body) as { errors?: Record<string, string[]>; message?: string };
      this.errors = parsed.errors;
      if (parsed.message) this.message = parsed.message;
    } catch {}
  }
}

// ——— Public ———

export async function fetchCategories(): Promise<ApiCategory[]> {
  const json = await request<{ data: ApiCategory[] }>("/categories", { revalidate: 300 });
  return json.data;
}

export async function fetchCategory(slug: string): Promise<ApiCategory | null> {
  try {
    const json = await request<{ data: ApiCategory }>(`/categories/${slug}`, { revalidate: 300 });
    return json.data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export type ProductsQuery = {
  page?: number;
  per_page?: number;
  category?: string;
  q?: string;
};

export async function fetchProducts(params: ProductsQuery = {}): Promise<Paginated<ApiProduct>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.per_page) qs.set("per_page", String(params.per_page));
  if (params.category) qs.set("category", params.category);
  if (params.q) qs.set("q", params.q);
  const suffix = qs.toString() ? `?${qs}` : "";
  return request<Paginated<ApiProduct>>(`/products${suffix}`, { revalidate: 60 });
}

export async function fetchAllProducts(): Promise<ApiProduct[]> {
  const first = await fetchProducts({ per_page: 200 });
  return first.data;
}

export async function fetchProduct(slug: string): Promise<ApiProduct | null> {
  try {
    const json = await request<{ data: ApiProduct }>(`/products/${slug}`, { revalidate: 60 });
    return json.data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

// ——— Auth ———

export type AuthResponse = { customer: ApiCustomer; token: string };

export async function authRegister(payload: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", { cache: "no-store" }, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function authLogin(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", { cache: "no-store" }, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function authMe(token: string): Promise<ApiCustomer | null> {
  try {
    const json = await request<{ customer: ApiCustomer }>("/auth/me", {
      cache: "no-store",
      token,
    });
    return json.customer;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 404)) return null;
    throw e;
  }
}

export async function authLogout(token: string): Promise<void> {
  await request("/auth/logout", { cache: "no-store", token }, { method: "POST" });
}
