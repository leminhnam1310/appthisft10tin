// =========================================
// TENTIN Gemini Engine V3
// =========================================

const API = "/api/chat";
const TIMEOUT = 20000;

const DEFAULT_RESPONSE = {
  reply: "Mình vẫn ở đây 🌱",
  emotion: "calm",
  emoji: "🌱",
  priority: 0.5,
  shouldSpeak: true,
  remember: [],
  followUp: 0,
  action: "none",
};

function normalize(data = {}) {
  return {
    reply:
      typeof data.reply === "string"
        ? data.reply.trim()
        : DEFAULT_RESPONSE.reply,

    emotion:
      typeof data.emotion === "string"
        ? data.emotion
        : DEFAULT_RESPONSE.emotion,

    emoji:
      typeof data.emoji === "string"
        ? data.emoji
        : DEFAULT_RESPONSE.emoji,

    priority:
      typeof data.priority === "number"
        ? Math.min(Math.max(data.priority, 0), 1)
        : DEFAULT_RESPONSE.priority,

    shouldSpeak:
      typeof data.shouldSpeak === "boolean"
        ? data.shouldSpeak
        : true,

    remember: Array.isArray(data.remember)
      ? data.remember
      : [],

    followUp:
      typeof data.followUp === "number"
        ? data.followUp
        : 0,

    action:
      typeof data.action === "string"
        ? data.action
        : "none",
  };
}

async function fetchGemini(messages, context) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  try {
    const res = await fetch(API, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        messages,
        context,
      }),

      signal: controller.signal,
    });

    clearTimeout(timeout);

    let json = {};

    try {
      json = await res.json();
    } catch {
      throw new Error("API trả dữ liệu không hợp lệ.");
    }

    if (!res.ok) {
      throw new Error(
        json.error ||
          json.reply ||
          "Gemini Error"
      );
    }

    return normalize(json);
  } catch (err) {
    clearTimeout(timeout);

    if (err.name === "AbortError") {
      throw new Error("Gemini timeout.");
    }

    throw err;
  }
}

export async function askGemini(
  messages = [],
  context = {}
) {
  if (!Array.isArray(messages)) {
    throw new Error(
      "messages phải là Array"
    );
  }

  let lastError;

  for (let i = 0; i < 3; i++) {
    try {
      const result =
        await fetchGemini(
          messages,
          context
        );

      if (
        result.reply &&
        result.reply.length > 0
      ) {
        return result;
      }
    } catch (err) {
      lastError = err;

      console.warn(
        `Gemini Retry ${i + 1}:`,
        err.message
      );

      await new Promise((r) =>
        setTimeout(
          r,
          700 * (i + 1)
        )
      );
    }
  }

  console.error(
    "Gemini Error:",
    lastError
  );

  return {
    ...DEFAULT_RESPONSE,
    error:
      lastError?.message ||
      "Unknown Error",
  };
}