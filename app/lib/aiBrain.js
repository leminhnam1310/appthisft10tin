import { askGemini } from "./gemini";
import {
  getMemory,
  updateMemory,
  addChat,
} from "./memory";

let lastOutput = "";
let lastReplyTime = 0;

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

  scroll: [
    "Mình vẫn đang ở đây nè 🌱",
  ],

  typing: [
    "Mình đang lắng nghe..."
  ],

  default: [
    "Mình vẫn ở đây 🤍",
    "Mình vẫn đang lắng nghe nè 🌱",
    "Có mình ở đây rồi 😊",
    "Kể tiếp cho mình nghe nhé."
  ],
};

function randomFallback(type) {
  const arr =
    fallbackResponses[type] ||
    fallbackResponses.default;

  return arr[
    Math.floor(Math.random() * arr.length)
  ];
}
export async function getAIResponse({
  type = "chat",
  message = "",
  context = {},
}) {
  try {
    const mem = getMemory();

    // Lưu tin nhắn người dùng
    if (message.trim()) {
      addChat("user", message);
    }

    // Lấy lịch sử gần nhất
    const history =
      (mem.chatHistory || [])
        .slice(-20)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

    // Prompt hệ thống
    const systemPrompt = `
Bạn là TENTIN.

Bạn KHÔNG phải ChatGPT.

Bạn là một người bạn đồng hành.

Tính cách:
- Tự nhiên.
- Ấm áp.
- Biết pha chút hài hước.
- Không giáo điều.
- Không lặp lại câu trả lời.
- Không tự giới thiệu.
- Không nói mình là AI.

Thông tin người dùng:

Mood: ${mem.mood || "Chưa có"}

XP: ${mem.xp || 0}

Streak: ${mem.streak || 0}

Journal:
${mem.lastJournal || "Không có"}

Achievement:
${mem.lastAchievement || "Không có"}

Sự kiện:
${type}

Hãy nhớ toàn bộ cuộc trò chuyện trước đó.
`;

    const result = await askGemini(
      [
        {
          role: "system",
          text: systemPrompt,
        },
        ...history,
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

    // askGemini giờ trả object
    let text =
      typeof result === "string"
        ? result
        : result.reply;

    text = (text || "")
      .replace(/\*/g, "")
      .replace(/\n/g, " ")
      .trim();

    if (!text) {
      return randomFallback(type);
    }

    // Chống lặp
    const now = Date.now();

    if (
      text.toLowerCase() === lastOutput.toLowerCase() &&
      now - lastReplyTime < 60000
    ) {
      text = randomFallback(type);
    }

    lastOutput = text;
    lastReplyTime = now;

    // Lưu lịch sử
    addChat("assistant", text);

    updateMemory("lastMessage", text);

    // Nếu API trả về ký ức mới
    if (
      result &&
      Array.isArray(result.remember)
    ) {
      updateMemory(
        "remember",
        result.remember
      );
    }

    // Trả nguyên object để RobotChatBox vẫn dùng được emotion, emoji...
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
    console.error("AI Brain:", err);

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
}