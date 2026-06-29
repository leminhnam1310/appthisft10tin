import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.5-flash";
const TIMEOUT_MS = 12000;
const MAX_HISTORY = 8; // 🔥 giảm token cost

// =========================
// SAFE JSON PARSER (ROBUST)
// =========================
function extractJSON(text = "") {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {}

  const match = text.match(/```json([\s\S]*?)```/);
  if (match) {
    try {
      return JSON.parse(match[1].trim());
    } catch {}
  }

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first !== -1 && last !== -1) {
    try {
      return JSON.parse(text.slice(first, last + 1));
    } catch {}
  }

  return null;
}

// =========================
// TIMEOUT WRAPPER (SAFE)
// =========================
function withTimeout(promise, ms = TIMEOUT_MS) {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("TIMEOUT"));
    }, ms);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeout,
  ]);
}

// =========================
// CLEAN HISTORY (TOKEN OPTIMIZED)
// =========================
function buildHistory(messages) {
  return (messages || [])
    .slice(-MAX_HISTORY)
    .map((m) => {
      const role = m.role === "assistant" ? "AI" : "User";
      const text = (m.text || "").replace(/\s+/g, " ").trim();
      return `${role}: ${text}`;
    })
    .join("\n");
}

// =========================
// NORMALIZE OUTPUT
// =========================
function normalize(data = {}, fallbackText = "") {
  return {
    reply:
      typeof data.reply === "string" && data.reply.trim()
        ? data.reply.trim()
        : fallbackText || "Mình vẫn ở đây 🌱",

    emotion: data.emotion || "calm",
    emoji: data.emoji || "🌱",

    priority:
      typeof data.priority === "number"
        ? Math.min(Math.max(data.priority, 0), 1)
        : 0.5,

    shouldSpeak:
      typeof data.shouldSpeak === "boolean" ? data.shouldSpeak : true,

    remember: Array.isArray(data.remember) ? data.remember : [],

    followUp: typeof data.followUp === "number" ? data.followUp : 0,

    action: typeof data.action === "string" ? data.action : "none",
  };
}

// =========================
// RETRY GEMINI (SMART)
// =========================
async function safeGenerate(model, prompt, retries = 2) {
  let lastErr;

  for (let i = 0; i <= retries; i++) {
    try {
      const result = await withTimeout(
        model.generateContent(prompt),
        TIMEOUT_MS
      );

      const response = await result.response;
      const text = (await response.text()).trim();

      if (text) return text;
    } catch (err) {
      lastErr = err;

      // exponential backoff nhẹ
      await new Promise((r) =>
        setTimeout(r, 300 * Math.pow(2, i))
      );
    }
  }

  throw lastErr || new Error("Gemini failed");
}

// =========================
// MAIN API
// =========================
export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const { messages = [], context = {} } = await req.json();

    const history = buildHistory(messages);

    const lastAssistant =
      [...messages]
        .reverse()
        .find((m) => m.role === "assistant")?.text || "";

    // =========================
    // LIGHTWEIGHT PROMPT (OPTIMIZED)
    // =========================
    const prompt = `
You are TENTIN.

Return ONLY valid JSON.

NO markdown. NO explanation.

Previous reply:
${lastAssistant}

Context:
Mood: ${context.mood || "unknown"}
XP: ${context.xp || 0}
Streak: ${context.streak || 0}

History:
${history}

RULES:
- Natural human tone
- No repetition
- Short or long depending on emotion
- No self introduction

OUTPUT JSON:
{
  "reply": "string",
  "emotion": "happy|care|sad|thinking|excited|calm",
  "emoji": "🌱",
  "priority": 0.5,
  "shouldSpeak": true,
  "remember": [],
  "followUp": 0,
  "action": "none"
}
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL });

    // =========================
    // CALL GEMINI (SAFE + RETRY)
    // =========================
    const rawText = await safeGenerate(model, prompt, 2);

    // =========================
    // PARSE OUTPUT
    // =========================
    let data = extractJSON(rawText);

    data = normalize(data, rawText);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Gemini Error:", err);

    const fallback =
      err.message === "TIMEOUT"
        ? "Hơi chậm một chút, thử lại giúp mình nhé 🌱"
        : "Mình vẫn ở đây 🌱";

    return NextResponse.json(
      normalize(
        {
          reply: fallback,
          emotion: "calm",
          emoji: "🌱",
          priority: 0.4,
          shouldSpeak: true,
          followUp: 0,
          action: "none",
        },
        fallback
      ),
      { status: 200 }
    );
  }
}