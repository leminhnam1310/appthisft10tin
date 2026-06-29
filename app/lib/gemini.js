const API = "/api/chat";
const TIMEOUT = 20000;

// =========================
// DEFAULT RESPONSE
// =========================
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

// =========================
// SINGLE FLIGHT LOCK (FIX SPAM)
// =========================
let inFlight = false;

// =========================
// SAFE NORMALIZE
// =========================
function normalize(data = {}) {
  return {
    reply:
      typeof data.reply === "string" && data.reply.trim().length > 0
        ? data.reply.trim()
        : DEFAULT_RESPONSE.reply,

    emotion: typeof data.emotion === "string" ? data.emotion : "calm",

    emoji: typeof data.emoji === "string" ? data.emoji : "🌱",

    priority:
      typeof data.priority === "number"
        ? Math.min(Math.max(data.priority, 0), 1)
        : 0.5,

    shouldSpeak: typeof data.shouldSpeak === "boolean" ? data.shouldSpeak : true,

    remember: Array.isArray(data.remember) ? data.remember : [],

    followUp: typeof data.followUp === "number" ? data.followUp : 0,

    action: typeof data.action === "string" ? data.action : "none",
  };
}

// =========================
// FETCH CORE (FIXED)
// =========================
async function fetchGemini(messages, context) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
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

    clearTimeout(timeoutId);

    let json;

    try {
      json = await res.json();
    } catch {
      throw new Error("Invalid JSON response");
    }

    if (!res.ok) {
      throw new Error(json?.error || "API Error");
    }

    const normalized = normalize(json);

    // 🔥 reject empty/garbage replies early
    if (!normalized.reply || normalized.reply.trim().length < 1) {
      throw new Error("Empty reply from AI");
    }

    return normalized;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      throw new Error("Gemini timeout");
    }

    throw err;
  }
}

// =========================
// MAIN EXPORT (PRO MAX)
// =========================
export async function askGemini(messages = [], context = {}) {
  if (!Array.isArray(messages)) {
    throw new Error("messages must be array");
  }

  // =========================
  // BLOCK PARALLEL REQUESTS
  // =========================
  if (inFlight) {
    return {
      ...DEFAULT_RESPONSE,
      reply: "Mình đang xử lý câu trước 🌱",
    };
  }

  inFlight = true;

  let lastError;

  try {
    // =========================
    // SMART RETRY (3 TIMES)
    // =========================
    for (let i = 0; i < 3; i++) {
      try {
        const result = await fetchGemini(messages, context);

        return result; // ✅ success ngay
      } catch (err) {
        lastError = err;

        console.warn(`Gemini retry ${i + 1}:`, err.message);

        // exponential backoff nhẹ
        await new Promise((r) =>
          setTimeout(r, 400 * Math.pow(2, i))
        );
      }
    }

    console.error("Gemini failed:", lastError);

    return {
      ...DEFAULT_RESPONSE,
      error: lastError?.message || "Unknown error",
    };
  } finally {
    inFlight = false;
  }
}