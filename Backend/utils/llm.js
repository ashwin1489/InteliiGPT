// utils/llm.js
import getOpenAIAPIResponse from "./openai.js";
import getGeminiAPIResponse from "./gemini.js";

const isQuotaError = (err) => {
  const m = String(err?.message || "").toLowerCase();
  return m.includes("insufficient_quota") || m.includes("http 429");
};

export default async function getLLMResponse(message) {
  const provider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();

  if (provider === "gemini") {
    // primary: gemini
    return await getGeminiAPIResponse(message);
  }

  if (provider === "openai") {
    try {
      return await getOpenAIAPIResponse(message);
    } catch (err) {
      // auto-fallback if OpenAI quota is exceeded
      if (isQuotaError(err)) {
        return await getGeminiAPIResponse(message);
      }
      throw err;
    }
  }

  // default safety net
  return await getGeminiAPIResponse(message);
}
