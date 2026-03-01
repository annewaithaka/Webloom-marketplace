// frontend/src/lib/api.js
const DEFAULT_BASE = "http://127.0.0.1:5000";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;

export function getToken() {
  return localStorage.getItem("webloom_token");
}

export function setToken(token) {
  localStorage.setItem("webloom_token", token);
}

export function clearToken() {
  localStorage.removeItem("webloom_token");
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

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Public */
export async function getProducts() {
  const body = await request("/products");
  return unwrapList(body, "products");
}

export async function getPlans(slug) {
  const body = await request(`/products/${encodeURIComponent(slug)}/plans`);
  return unwrapList(body, "plans");
}

/** Auth */
export async function register(payload) {
  // payload: {business_name, owner_name, email, phone, password}
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  // payload: {email, password}
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Organizations (protected) */
export async function getOrganizations() {
  const body = await request("/organizations", {
    headers: { ...authHeaders() },
  });
  return unwrapList(body, "organizations");
}

export async function createOrganization(payload) {
  // payload: {organization_name, organization_owner}
  return request("/organizations", {
    method: "POST",
    headers: { ...authHeaders() },
    body: JSON.stringify(payload),
  });
}