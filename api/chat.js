// Vercel serverless function: POST /api/chat
// Streams a reply from Claude as plain text. The API key never reaches the browser.
//
// Required env var (Vercel → Settings → Environment Variables):
//   ANTHROPIC_API_KEY   your key from https://console.anthropic.com
// Optional:
//   ANTHROPIC_MODEL     defaults to claude-haiku-5-5 (fast + cheap, great for chat)

import { buildSystemPrompt } from "../src/chatbot/knowledge.js";

export const config = { maxDuration: 30 };

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";
const MAX_MESSAGES = 12;
const MAX_CHARS = 6000; // enough for a pasted job description
const MAX_TOKENS = 700;

// Best-effort per-instance rate limit (12 messages / minute / IP).
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 12;
}

function cleanMessages(input) {
  if (!Array.isArray(input)) return [];
  const msgs = input
    .filter((m) => m && typeof m.content === "string")
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content.slice(0, MAX_CHARS).trim(),
    }))
    .filter((m) => m.content)
    .slice(-MAX_MESSAGES);
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  return msgs;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(503).json({ error: "Chat is not configured yet." });

  const ip =
    String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "anon";
  if (limited(ip)) {
    return res
      .status(429)
      .json({ error: "You're sending messages quickly — give me a few seconds and try again." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }
  const messages = cleanMessages(body?.messages);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Invalid request." });
  }

  const ac = new AbortController();
  res.on("close", () => {
    if (!res.writableEnded) ac.abort();
  });

  let upstream;
  try {
    upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ac.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.5,
        stream: true,
        system: buildSystemPrompt(),
        messages,
      }),
    });
  } catch {
    return res.status(502).json({ error: "The AI service is unreachable." });
  }

  if (!upstream.ok || !upstream.body) {
    console.error("Anthropic API error", upstream.status, await upstream.text().catch(() => ""));
    return res.status(502).json({ error: "The AI service is unavailable." });
  }

  res.status(200);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  res.setHeader("X-Nk-Mode", "ai");

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const event = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const dataLine = event.split("\n").find((l) => l.startsWith("data:"));
        if (!dataLine) continue;
        try {
          const json = JSON.parse(dataLine.slice(5).trim());
          if (json.type === "content_block_delta" && json.delta?.type === "text_delta") {
            res.write(json.delta.text);
          } else if (json.type === "error") {
            console.error("Anthropic stream error", json.error);
            res.end();
            return;
          }
        } catch {
          /* ignore malformed event */
        }
      }
    }
  } catch {
    /* client aborted or upstream dropped */
  }
  res.end();
}
