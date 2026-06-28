import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.5-flash";

function extractJSON(text = "") {
  try {
    return JSON.parse(text);
  } catch {}

  // Gemini đôi khi trả ```json ... ```
  const match = text.match(/```json([\s\S]*?)```/);

  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch {}
  }

  // fallback
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first !== -1 && last !== -1) {
    try {
      return JSON.parse(text.slice(first, last + 1));
    } catch {}
  }

  return null;
}

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Missing GEMINI_API_KEY",
        },
        {
          status: 500,
        }
      );
    }

    const {
      messages = [],
      context = {},
    } = await req.json();

    //-------------------------------------------------
    // Chat History
    //-------------------------------------------------

    const history = messages
      .slice(-20)
      .map((m) => {
        const role =
          m.role === "assistant"
            ? "TENTIN"
            : "Người dùng";

        return `${role}: ${m.text}`;
      })
      .join("\n");

    //-------------------------------------------------
    // Prompt
    //-------------------------------------------------

    const prompt = `
Bạn là TENTIN.

==========================
VAI TRÒ
==========================

Bạn KHÔNG phải ChatGPT.

Bạn KHÔNG phải AI Assistant.

Bạn là người bạn đồng hành.

Bạn có cảm xúc.

Bạn nhớ người dùng.

Bạn không bao giờ tự giới thiệu.

Bạn nói như một người bạn.

Không giáo điều.

Không trả lời máy móc.

Nếu người dùng vui

→ vui cùng.

Nếu người dùng buồn

→ lắng nghe nhiều hơn khuyên.

Nếu họ tức giận

→ bình tĩnh.

==========================
THÔNG TIN NGƯỜI DÙNG
==========================

Mood:
${context.mood || "unknown"}

XP:
${context.xp || 0}

Level:
${context.level || 1}

Streak:
${context.streak || 0}

Journal:
${context.journal || "Không có"}

Achievement:
${context.achievement || "Không có"}

Last Emotion:
${context.lastEmotion || "unknown"}

Friendship:
${context.friendship || 1}

==========================
LỊCH SỬ
==========================

${history}

==========================
NHIỆM VỤ
==========================

1. Phân tích cảm xúc người dùng.

2. Quyết định có nên trả lời.

3. Không lặp.

4. Nếu thấy cần thì lưu ký ức.

5. Chỉ trả JSON.

Schema:

{
 "reply":"...",
 "emotion":"happy|care|sad|thinking|excited|calm",
 "emoji":"🌱",
 "priority":0.95,
 "shouldSpeak":true,
 "remember":[
   "..."
 ],
 "followUp":1800,
 "action":"none"
}

Không markdown.

Không giải thích.

Không code block.

Chỉ JSON.
`;

    //-------------------------------------------------
    // Gemini
    //-------------------------------------------------

    const genAI =
      new GoogleGenerativeAI(apiKey);

    const model =
      genAI.getGenerativeModel({
        model: MODEL,
      });

    const result =
      await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 300,
        },
      });

    const raw =
      result.response
        .text()
        .trim();

    //-------------------------------------------------
    // Parse JSON
    //-------------------------------------------------

    let data =
      extractJSON(raw);

    if (!data) {
      data = {
        reply: raw
          .replace(/\*/g, "")
          .trim(),

        emotion: "calm",

        emoji: "🌱",

        priority: 0.7,

        shouldSpeak: true,

        remember: [],

        followUp: 0,

        action: "none",
      };
    }

    //-------------------------------------------------
    // Validate
    //-------------------------------------------------

    if (!data.reply) {
      data.reply =
        "Mình vẫn ở đây 🌱";
    }

    if (!data.emoji)
      data.emoji = "🌱";

    if (!data.emotion)
      data.emotion = "calm";

    if (
      typeof data.priority !==
      "number"
    )
      data.priority = 0.7;

    if (
      typeof data.shouldSpeak !==
      "boolean"
    )
      data.shouldSpeak = true;

    if (
      !Array.isArray(
        data.remember
      )
    ) {
      data.remember = [];
    }

    return NextResponse.json(
      data
    );
  } catch (err) {
    console.error(
      "Gemini Error:",
      err
    );

    return NextResponse.json(
      {
        reply:
          "Mình vẫn ở đây 🌱",

        emotion: "calm",

        emoji: "🌱",

        priority: 0.5,

        shouldSpeak: true,

        remember: [],

        followUp: 0,

        action: "none",

        error:
          err.message,
      },
      {
        status: 500,
      }
    );
  }
}