// utils/gemini.js
import "dotenv/config";

/**
 * Get a response from Gemini API.
 * Using gemini-2.5-flash (stable) since it's available in your project.
 */
export default async function getGeminiAPIResponse(message) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const apiVersion = process.env.GOOGLE_API_VERSION || "v1beta";

  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY in environment");
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Message must be a non-empty string");
  }

  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${encodeURIComponent(model)}:generateContent`;
  console.log("🔎 Calling Gemini model:", model);

  const body = {
    contents: [{ role: "user", parts: [{ text: message }] }],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 1024,
    },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const raw = await resp.text();
  if (!resp.ok) {
    throw new Error(`Gemini HTTP ${resp.status}: ${raw}`);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Gemini returned non-JSON response");
  }

  // Debug: log the raw API response (first 300 chars for readability)
  console.log("🔎 Raw Gemini response:", JSON.stringify(data).slice(0, 300));

  const candidates = data?.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return "⚠️ Gemini returned no candidates (possible quota or empty output).";
  }

  const parts = candidates[0]?.content?.parts;
  if (!Array.isArray(parts) || parts.length === 0) {
    return "⚠️ Gemini returned no content parts.";
  }

  // Collect text or JSON stringified versions of non-text parts
  const out = parts
    .map((p) => {
      if (typeof p.text === "string") return p.text;
      return JSON.stringify(p); // capture tool calls/structured outputs
    })
    .join(" ")
    .trim();

  if (!out) {
    return "⚠️ Gemini returned empty content.";
  }

  return out;
}
