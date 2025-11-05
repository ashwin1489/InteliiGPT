// src/api.js
export const API_BASE =
  (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
  process.env.VITE_API_URL ||
  "https://inteliigpt.onrender.com"; // fallback to your render backend

export async function apiFetch(path, options = {}) {
  const url = API_BASE.replace(/\/$/, "") + (path.startsWith("/") ? path : `/${path}`);
  const cfg = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };
  return fetch(url, cfg);
}
