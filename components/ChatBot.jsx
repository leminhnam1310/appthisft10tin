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
  const inputRef = useRef(null);
  const abortRef = useRef(false);

  // =========================
  // Auto scroll (smooth + stable)
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================
  // Cleanup safety
  // =========================
  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  // =========================
  // Send message (OPTIMIZED)
  // =========================
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const context = getRobotContext();

    const userMsg = {
      role: "user",
      text,
      time: Date.now(),
    };

    // ⚡ use functional update (fix stale state bug)
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg], // safe snapshot
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.reply || "Có lỗi xảy ra");
      }

      if (abortRef.current) return;

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

      if (abortRef.current) return;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Xin lỗi nhé, mình đang gặp chút vấn đề 😥",
          time: Date.now(),
        },
      ]);
    } finally {
      if (!abortRef.current) setLoading(false);

      // focus lại input cho UX tốt hơn
      inputRef.current?.focus();
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">

      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 backdrop-blur bg-white/70 dark:bg-slate-950/70 sticky top-0 z-10">
        <h1 className="text-lg font-semibold tracking-wide">
          TENTIN Companion
        </h1>
      </div>

      {/* MESSAGES */}
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
              className={`
                max-w-[80%]
                px-4 py-3
                rounded-3xl
                shadow-sm

                transition-all duration-200

                ${
                  m.role === "user"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                }
              `}
            >
              <p className="leading-relaxed whitespace-pre-wrap">
                {m.text}
              </p>

              <div
                className={`
                  text-[10px]
                  mt-2
                  opacity-60

                  ${
                    m.role === "user"
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                {new Date(m.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {/* TYPING */}
        {loading && (
          <div className="flex">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl px-4 py-3 animate-pulse text-slate-500 dark:text-slate-300">
              TENTIN đang suy nghĩ...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <div className="flex gap-3 items-end">

          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            placeholder="Nhắn gì đó với TENTIN..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="
              flex-1
              resize-none
              rounded-2xl

              bg-slate-100 dark:bg-slate-800

              px-4 py-3

              outline-none

              text-slate-900 dark:text-white

              placeholder:text-slate-400 dark:placeholder:text-slate-500

              focus:ring-2 focus:ring-violet-500/50

              transition
            "
          />

          <button
            disabled={loading}
            onClick={sendMessage}
            className="
              px-6 py-3

              rounded-2xl

              bg-violet-600
              hover:bg-violet-700
              active:scale-95

              disabled:opacity-50

              text-white

              transition-all
              duration-150
            "
          >
            {loading ? "..." : "Gửi"}
          </button>

        </div>
      </div>
    </div>
  );
}