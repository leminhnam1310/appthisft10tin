import { askGemini } from "./gemini";
import { getMemory, updateMemory, addChat } from "./memory";

let lastOutput = "";
let lastReplyTime = 0;
let isProcessing = false;

const fallbackResponses = {
  mood_changed: [
    "Mình hiểu rồi 🌱",
    "Cảm ơn vì đã chia sẻ nhé 🤍",
    "Mình đang lắng nghe đây.",
  ],
  journal_saved: [
    "Viết ra được cũng là một bước tiến rồi 🌿",
    "Cảm ơn vì đã tin tưởng chia sẻ.",
    "Những dòng chữ này rất có ý nghĩa đó.",
  ],
  achievement_unlocked: [
    "Bạn vừa tiến thêm một bước rồi 🎉",
    "Đáng tự hào lắm đó ✨",
    "Mình vui cho bạn thật sự 🌟",
  ],
  click: ["👀"],
  scroll: ["Mình vẫn đang ở đây nè 🌱"],
  typing: ["Mình đang lắng nghe..."],
  default: [
    "Mình vẫn ở đây 🤍",
    "Mình vẫn đang lắng nghe nè 🌱",
    "Có mình ở đây rồi 😊",
    "Kể tiếp cho mình nghe nhé.",
  ],
};

function randomFallback(type) {
  const arr = fallbackResponses[type] || fallbackResponses.default;
  return arr[Math.floor(Math.random() * arr.length)];
}

// =========================
// MAIN AI FUNCTION (FIXED)
// =========================
export async function getAIResponse({
  type = "chat",
  message = "",
  context = {},
}) {
  try {
    if (isProcessing) {
      return {
        reply: randomFallback(type),
        emotion: "calm",
        emoji: "🌱",
        priority: 0.2,
        shouldSpeak: true,
        followUp: 0,
        action: "none",
      };
    }

    isProcessing = true;

    const mem = getMemory();

    // =========================
    // SAVE USER MESSAGE
    // =========================
    if (message?.trim()) {
      addChat("user", message.trim());
    }

    // =========================
    // LIGHTWEIGHT HISTORY (FIX)
    // =========================
    const history = (mem.chatHistory || [])
      .slice(-10) // 🔥 giảm từ 20 → 10
      .map((m) => `${m.role}: ${m.text}`) // 🔥 stringify nhẹ hơn
      .join("\n");

    // =========================
    // LIGHT SYSTEM PROMPT (FIX)
    // =========================
    const systemPrompt = `
Bạn là TENTIN - một người bạn đồng hành.

- Tự nhiên, ngắn gọn, cảm xúc
- Không lặp câu
- Không giới thiệu bản thân
- Không nói mình là AI

Mood: ${mem.mood || "unknown"}
XP: ${mem.xp || 0}
Streak: ${mem.streak || 0}

Journal: ${mem.lastJournal || "none"}
Event: ${type}

History:
${history}
`;

    // =========================
    // GEMINI CALL
    // =========================
    const result = await askGemini(
      [
        {
          role: "system",
          text: systemPrompt,
        },
        ...(message
          ? [
              {
                role: "user",
                text: message,
              },
            ]
          : []),
      ],
      context
    );

    // =========================
    // PARSE RESULT
    // =========================
    let text =
      typeof result === "string"
        ? result
        : result?.reply;

    text = (text || "")
      .replace(/\*/g, "")
      .replace(/\n/g, " ")
      .trim();

    if (!text) {
      return {
        reply: randomFallback(type),
        emotion: "calm",
        emoji: "🌱",
        priority: 0.3,
        shouldSpeak: true,
        followUp: 0,
        action: "none",
      };
    }

    // =========================
    // ANTI DUPLICATE RESPONSE
    // =========================
    const now = Date.now();

    if (
      text.toLowerCase() === lastOutput.toLowerCase() &&
      now - lastReplyTime < 45000
    ) {
      text = randomFallback(type);
    }

    lastOutput = text;
    lastReplyTime = now;

    // =========================
    // MEMORY UPDATE (SAFE)
    // =========================
    updateMemory("lastMessage", text);

    if (Array.isArray(result?.remember)) {
      updateMemory("remember", result.remember);
    }

    // =========================
    // SAVE ASSISTANT CHAT (FIX DUPLICATE RISK)
    // =========================
    addChat("assistant", text);

    return {
      reply: text,
      emotion: result?.emotion || "calm",
      emoji: result?.emoji || "🌱",
      priority: result?.priority ?? 0.5,
      shouldSpeak: result?.shouldSpeak ?? true,
      followUp: result?.followUp ?? 0,
      action: result?.action || "none",
    };
  } catch (err) {
    console.error("AI Brain Error:", err);

    return {
      reply: randomFallback(type),
      emotion: "calm",
      emoji: "🌱",
      priority: 0.2,
      shouldSpeak: true,
      followUp: 0,
      action: "none",
    };
  } finally {
    isProcessing = false;
  }
}