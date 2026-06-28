"use client";

import { useEffect, useRef, useState } from "react";
import { getRobotContext } from "@/app/lib/memory";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Chào bạn 👋",
      time: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();

    if (!text || loading) return;

    const context = getRobotContext();

    const newMessages = [
      ...messages,
      {
        role: "user",
        text,
        time: Date.now(),
      },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messages: newMessages,
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          data.reply ||
          "Có lỗi xảy ra"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            data.reply ||
            "Mình chưa nghĩ ra phải nói gì 🤍",
          time: Date.now(),
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Xin lỗi nhé, mình đang gặp chút vấn đề 😥",
          time: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950">

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">
          TENTIN Companion
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

        {messages.map((m, index) => (
          <div
            key={index}
            className={`flex ${
              m.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-4 py-3 shadow-sm ${
                m.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
              }`}
            >
              <p>{m.text}</p>

              <div
                className={`text-[10px] mt-2 opacity-60 ${
                  m.role === "user"
                    ? "text-white"
                    : ""
                }`}
              >
                {new Date(
                  m.time
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl px-4 py-3 animate-pulse">
              TENTIN đang suy nghĩ...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4">

        <div className="flex gap-3">

          <textarea
            rows={1}
            value={input}
            placeholder="Nhắn gì đó với TENTIN..."
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="
            flex-1
            resize-none
            rounded-2xl
            bg-slate-100
            dark:bg-slate-800
            px-4
            py-3
            outline-none
            text-slate-900
            dark:text-white
            "
          />

          <button
            disabled={loading}
            onClick={sendMessage}
            className="
            px-6
            rounded-2xl
            bg-violet-600
            hover:bg-violet-700
            disabled:opacity-50
            text-white
            transition
            "
          >
            Gửi
          </button>

        </div>

      </div>

    </div>
  );
}