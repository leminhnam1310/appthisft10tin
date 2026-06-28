// =========================================
// TENTIN Gemini Engine V2
// =========================================

const API = "/api/chat";

const TIMEOUT = 15000;

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

function withTimeout(ms) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, ms);

  return {
    controller,
    timeout,
  };
}

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

    priority: Math.max(
      0,
      Math.min(
        Number(data.priority) || 0.5,
        1
      )
    ),

    shouldSpeak:
      typeof data.shouldSpeak ===
      "boolean"
        ? data.shouldSpeak
        : true,

    remember: Array.isArray(
      data.remember
    )
      ? data.remember
      : [],

    followUp: Math.max(
      0,
      Math.min(
        Number(data.followUp) || 0,
        3600
      )
    ),

    action:
      typeof data.action ===
      "string"
        ? data.action
        : "none",
  };
}

async function request(
  messages,
  context
) {
  const {
    controller,
    timeout,
  } = withTimeout(
    TIMEOUT
  );

  try {
    const res = await fetch(
      API,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          messages,
          context,
        }),

        signal:
          controller.signal,
      }
    );

    clearTimeout(timeout);

    let data = {};

    try {
      data =
        await res.json();
    } catch {}

    if (!res.ok) {
      throw new Error(
        data.error ||
          data.reply ||
          "Có lỗi xảy ra."
      );
    }

    return normalize(data);
  } catch (err) {
    clearTimeout(timeout);

    throw err;
  }
}

export async function askGemini(
  messages = [],
  context = {}
) {
  if (
    !Array.isArray(messages)
  ) {
    throw new Error(
      "messages phải là Array"
    );
  }

  let lastError = null;

  // Retry 2 lần
  for (
    let i = 0;
    i < 2;
    i++
  ) {
    try {
      return await request(
        messages,
        context
      );
    } catch (err) {
      lastError = err;

      if (
        err.name ===
        "AbortError"
      ) {
        console.warn(
          "Gemini timeout"
        );
      }

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            800
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