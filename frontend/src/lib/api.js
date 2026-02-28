// frontend/src/lib/api.js
const DEFAULT_BASE = "http://127.0.0.1:5000";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const err = new Error(
      typeof body === "object" && body?.message ? body.message : `Request failed (${res.status})`
    );
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

function unwrapList(body, key) {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object" && Array.isArray(body[key])) return body[key];
  return [];
}

export async function getProducts() {
  const body = await request("/products");
  return unwrapList(body, "products");
}

export async function getPlans(slug) {
  const body = await request(`/products/${encodeURIComponent(slug)}/plans`);
  return unwrapList(body, "plans");
}