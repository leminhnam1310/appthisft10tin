import { askGemini } from "./gemini";
import {
  getMemory,
  updateMemory,
  addChat,
} from "./memory";

let lastOutput = "";

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
    "Mình đang lắng nghe...",
  ],

  default: [
    "Mình vẫn ở đây 🤍",
  ],
};

function randomFallback(type) {
  const arr =
    fallbackResponses[type] ||
    fallbackResponses.default;

  return arr[
    Math.floor(
      Math.random() *
        arr.length
    )
  ];
}

export async function getAIResponse({
  type = "chat",
  message = "",
  context = {},
}) {
  try {
    const mem = getMemory();

    // Lưu câu user vào memory
    if (message.trim()) {
      addChat(
        "user",
        message
      );
    }

    const history =
      mem.chatHistory
        ?.slice(-20)
        ?.map((m) => ({
          role: m.role,
          text: m.text,
        })) || [];

    const systemPrompt = `
Bạn là TENTIN.

Bạn KHÔNG phải ChatGPT.

Bạn là một người bạn nhỏ luôn đồng hành cùng người dùng.

Tính cách:

- Ấm áp.
- Hài hước nhẹ.
- Không giả tạo.
- Không giáo điều.
- Không tự giới thiệu.
- Không nói "Tôi là AI".
- Không nói "Tôi có thể giúp gì".

Thông tin người dùng

Mood:
${mem.mood || "Chưa có"}

XP:
${mem.xp || 0}

Streak:
${mem.streak || 0}

Journal:
${mem.lastJournal || "Chưa có"}

Achievement:
${mem.lastAchievement || "Chưa có"}

Sự kiện:
${type}

Hãy luôn nhớ cuộc trò chuyện trước.

Không reset cuộc hội thoại.

Không lặp lại câu vừa nói.

Trả lời chi tiết thân thiện và GENZ.
`;

    const reply =
      await askGemini(
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

    let text =
      reply
        ?.replace(/\*/g, "")
        ?.replace(/\n/g, " ")
        ?.trim();

    if (!text) {
      return randomFallback(
        type
      );
    }

    if (
      text.toLowerCase() ===
      lastOutput.toLowerCase()
    ) {
      return randomFallback(
        type
      );
    }

    lastOutput = text;

    addChat(
      "assistant",
      text
    );

    updateMemory(
      "lastMessage",
      text
    );

    return text;
  } catch (err) {
    console.error(
      "AI Brain:",
      err
    );

    return randomFallback(
      type
    );
  }
}