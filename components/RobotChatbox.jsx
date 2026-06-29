"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getMemory } from "@/app/lib/memory";

export default function RobotChatBox({
  messages = [],
  robotMood = "🌱",
  typing = false,
  onClose,
  onSend,
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const memory = useMemo(() => getMemory(), [messages]);

  const level = Math.max(1, Math.floor((memory.xp || 0) / 100) + 1);
  const progress = (memory.xp || 0) % 100;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    onSend?.(text);
    setInput("");
  };

  return (
    <div
      className="
fixed bottom-24 left-5
w-[380px] max-w-[90vw]
h-[600px]

flex flex-col

rounded-3xl
overflow-hidden

bg-white/80 dark:bg-slate-900/80
backdrop-blur-2xl

border border-slate-200 dark:border-slate-700

shadow-2xl
z-[999999]
"
    >
      {/* HEADER */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-lg">
              {robotMood}
            </div>

            <div>
              <div className="font-bold">TENTIN</div>
              <div className="text-xs text-green-500">● online</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* XP BAR */}
        <div className="mt-3">
          <div className="flex justify-between text-xs">
            <span>Lv {level}</span>
            <span>{memory.xp || 0} XP</span>
          </div>

          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-violet-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.map((msg, i) => {
          const text = typeof msg === "string" ? msg : msg.text;

          return (
            <div key={i} className="flex items-start gap-2">
              {/* avatar */}
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-sm">
                🤖
              </div>

              {/* bubble */}
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl max-w-[75%]">
                <div className="text-sm">{text}</div>
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-500" />
            <div className="text-sm opacity-60">typing...</div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Nhắn với AI..."
          className="
flex-1 px-3 py-2 rounded-full
bg-slate-100 dark:bg-slate-800
outline-none text-sm
"
        />

        <button
          onClick={send}
          className="
px-4 py-2 rounded-full
bg-violet-500 text-white
hover:scale-105 transition
"
        >
          ➜
        </button>
      </div>
    </div>
  );
}