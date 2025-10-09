
import "dotenv/config";


export default async function getOpenAIAPIResponse(message) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // <-- correct header
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // or any chat-capable model you have access to
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ]
    })
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", options);

  if (!resp.ok) {
    // Surface server-side error clearly
    const text = await resp.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${resp.status}: ${text || resp.statusText}`);
  }

  const data = await resp.json();

  if (!data || !Array.isArray(data.choices) || data.choices.length === 0) {
    throw new Error("OpenAI response has no choices");
  }

  const content = data.choices[0]?.message?.content;
  if (typeof content !== "string" || content.trim() === "") {
    throw new Error("OpenAI returned empty content");
  }

  return content;
}
