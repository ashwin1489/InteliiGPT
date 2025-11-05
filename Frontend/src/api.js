// src/api.js
// Helper to centralize API base URL and fetch behaviour.
// Uses Vite environment variable VITE_API_URL injected at build time.
// Fallback to your Render backend if env var is not provided.

export const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_URL)
  || process.env.VITE_API_URL
  || "https://inteliigpt.onrender.com";

function buildUrl(path) {
  // Accept both "/api/..." and "api/..."
  const base = API_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function apiFetch(path, options = {}) {
  const url = buildUrl(path);

  const cfg = {
    method: options.method || "GET",
    headers: options.headers || {},
    // do not blindly include Content-Type if there is no body
    ...options,
  };

  // If body is a plain object and not already stringified, stringify it and set header
  if (cfg.body && typeof cfg.body === "object" && !(cfg.body instanceof FormData)) {
    cfg.body = JSON.stringify(cfg.body);
    cfg.headers = {
      "Content-Type": "application/json",
      ...cfg.headers,
    };
  }

  const resp = await fetch(url, cfg);

  // Try to parse JSON responses; if not JSON, return text
  const text = await resp.text();
  try {
    const data = text ? JSON.parse(text) : null;
    return data;
  } catch (err) {
    return text;
  }
}
