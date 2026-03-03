const DEFAULT_BASE = "http://127.0.0.1:5000";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;

const TOKEN_KEY = "webloom_token";
const ADMIN_TOKEN_KEY = "webloom_admin_token";
const FLASH_KEY = "webloom_flash";

/** Client token */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** Admin token */
export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

/** Flash messages */
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

function adminAuthHeaders() {
  const token = getAdminToken();
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
  return request(`/products/${encodeURIComponent(slug)}/plans`);
}

/** Client Auth */
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

/** Admin Auth */
export async function adminLogin(payload) {
  const body = await request("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const token = body?.access_token;
  if (token) setAdminToken(token);
  return body;
}

export async function adminMe() {
  return request("/admin/auth/me", { headers: { ...adminAuthHeaders() } });
}

/** Admin Clients */
export async function adminGetClients({ q = "", account_status = "", page = 1, page_size = 20 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (account_status) params.set("account_status", account_status);
  params.set("page", String(page));
  params.set("page_size", String(page_size));
  return request(`/admin/clients?${params.toString()}`, { headers: { ...adminAuthHeaders() } });
}

export async function adminGetClient(clientId) {
  return request(`/admin/clients/${clientId}`, { headers: { ...adminAuthHeaders() } });
}

export async function adminActivateClient(clientId) {
  return request(`/admin/clients/${clientId}/activate`, {
    method: "POST",
    headers: { ...adminAuthHeaders() },
  });
}

export async function adminSuspendClient(clientId) {
  return request(`/admin/clients/${clientId}/suspend`, {
    method: "POST",
    headers: { ...adminAuthHeaders() },
  });
}

/** Organizations (protected) */
export async function getOrganizations() {
  const body = await request("/organizations", { headers: { ...authHeaders() } });
  return unwrapList(body, "organizations");
}

export async function createOrganization(payload) {
  return request("/organizations", {
    method: "POST",
    headers: { ...authHeaders() },
    body: JSON.stringify(payload),
  });
}
