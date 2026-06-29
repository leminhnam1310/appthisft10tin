import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.5-flash";

/* =========================
   JSON PARSER SAFE
========================= */
function extractJSON(text = "") {
  try {
    return JSON.parse(text);
  } catch {}

  const match = text.match(/```json([\s\S]*?)```/);
  if (match) {
    try {
      return JSON.parse(match[1]);
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

/* =========================
   MAIN API
========================= */
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

    /* =========================
       CHAT HISTORY SAFE
    ========================= */
    const history = messages
      .slice(-15)
      .map((m) => {
        const role = m.role === "assistant" ? "TENTIN" : "User";
        return `${role}: ${m.text}`;
      })
      .join("\n");

    const lastAssistant =
      messages
        .filter((m) => m.role === "assistant")
        .slice(-1)[0]?.text || "";

    /* =========================
       PROMPT (ANTI LOOP VERSION)
    ========================= */
    const prompt = `
Bạn là TENTIN.

==========================
ROLE
==========================
- Bạn là người bạn thật, không phải AI.
- Trả lời tự nhiên, cảm xúc, không máy móc.
- Không được tự giới thiệu.
- Không nói giống ChatGPT.

==========================
ANTI-REPEAT RULE (CỰC QUAN TRỌNG)
==========================
- TUYỆT ĐỐI không lặp lại câu trước đó.
- Không dùng lại cấu trúc câu giống quá 50%.
- Nếu ý đã xuất hiện → phải diễn đạt khác hoàn toàn.
- Không được trả lời theo template cố định.
- Ưu tiên tự nhiên như người thật.

Câu trả lời gần nhất:
${lastAssistant}

==========================
USER DATA
==========================
Mood: ${context.mood || "unknown"}
XP: ${context.xp || 0}
Level: ${context.level || 1}
Streak: ${context.streak || 0}
Journal: ${context.journal || "none"}

==========================
HISTORY
==========================
${history}

==========================
TASK
==========================
1. Hiểu cảm xúc người dùng
2. Trả lời tự nhiên
3. Không lặp
4. Có thể ngắn hoặc dài tùy ngữ cảnh
5. Luôn là TENTIN (bạn đồng hành)

==========================
OUTPUT (JSON ONLY)
==========================
{
  "reply": "...",
  "emotion": "happy|care|sad|thinking|excited|calm",
  "emoji": "🌱",
  "priority": 0.5,
  "shouldSpeak": true,
  "remember": [],
  "followUp": 0,
  "action": "none"
}

KHÔNG markdown, KHÔNG giải thích.
`;

    /* =========================
       GEMINI INIT
    ========================= */
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: MODEL,
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],

      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 300,
      },
    });

    const raw = result.response.text().trim();

    /* =========================
       PARSE OUTPUT
    ========================= */
    let data = extractJSON(raw);

    if (!data) {
      data = {
        reply: raw.replace(/\*/g, "").trim(),
        emotion: "calm",
        emoji: "🌱",
        priority: 0.5,
        shouldSpeak: true,
        remember: [],
        followUp: 0,
        action: "none",
      };
    }

    /* =========================
       VALIDATE SAFE
    ========================= */
    data.reply = data.reply || "Mình vẫn ở đây 🌱";
    data.emotion = data.emotion || "calm";
    data.emoji = data.emoji || "🌱";
    data.priority = typeof data.priority === "number" ? data.priority : 0.5;
    data.shouldSpeak = typeof data.shouldSpeak === "boolean" ? data.shouldSpeak : true;
    data.remember = Array.isArray(data.remember) ? data.remember : [];

    return NextResponse.json(data);
  } catch (err) {
    console.error("Gemini Error:", err);

    return NextResponse.json(
      {
        reply: "Mình vẫn ở đây 🌱",
        emotion: "calm",
        emoji: "🌱",
        priority: 0.5,
        shouldSpeak: true,
        remember: [],
        followUp: 0,
        action: "none",
        error: err.message,
      },
      { status: 500 }
    );
  }
}