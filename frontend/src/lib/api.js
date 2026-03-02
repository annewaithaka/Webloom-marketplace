// =========================================
// FILE: frontend/src/lib/api.js
// =========================================
const DEFAULT_BASE = "http://127.0.0.1:5000";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;

const TOKEN_KEY = "webloom_token";
const FLASH_KEY = "webloom_flash";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setFlash(message) {
  sessionStorage.setItem(FLASH_KEY, message);
}

export function popFlash() {
  const msg = sessionStorage.getItem(FLASH_KEY);
  if (msg) sessionStorage.removeItem(FLASH_KEY);
  return msg;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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
    const apiMsg =
      (body && typeof body === "object" && (body.error || body.message)) ||
      (typeof body === "string" && body.trim()) ||
      "";

    const err = new Error(apiMsg || `Request failed (${res.status})`);
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

/** Public */
export async function getProducts() {
  const body = await request("/products");
  return unwrapList(body, "products");
}

export async function getPlans(slug) {
  const body = await request(`/products/${encodeURIComponent(slug)}/plans`);
  return body; // keep full {product, plans}
}

/** Auth */
export async function register(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  const body = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const token = body?.access_token;
  if (token) setToken(token);
  return body;
}

export async function getMe() {
  return request("/auth/me", { headers: { ...authHeaders() } });
}

/** Organizations (protected) */
export async function getOrganizations() {
  const body = await request("/organizations", {
    headers: { ...authHeaders() },
  });
  return unwrapList(body, "organizations");
}

export async function createOrganization(payload) {
  return request("/organizations", {
    method: "POST",
    headers: { ...authHeaders() },
    body: JSON.stringify(payload),
  });
}

