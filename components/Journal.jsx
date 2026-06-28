"use client";

import { useEffect, useState } from "react";

export default function Journal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);

  // 📦 load data safely (avoid SSR crash)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("journals") || "[]");
    setEntries(saved);
  }, []);

  const saveJournal = () => {
  if (!text.trim()) return;

  const newEntry = {
    text: text.trim(),
    date: new Date().toISOString(),
  };

  const updated = [newEntry, ...entries];

  setEntries(updated);

  localStorage.setItem(
    "journals",
    JSON.stringify(updated)
  );

  // 🤖 AI Memory
  const memory = JSON.parse(
    localStorage.getItem("ai_memory") || "{}"
  );

  memory.lastJournal = text.trim();
  memory.journalCount = updated.length;
  memory.lastJournalDate = new Date().toISOString();

  localStorage.setItem(
    "ai_memory",
    JSON.stringify(memory)
  );

  // 🤖 gửi event cho robot
  window.dispatchEvent(
    new CustomEvent("robot:journal", {
      detail: {
        text: text.trim(),
        count: updated.length,
        date: new Date().toISOString(),
      },
    })
  );

  setText("");
};
  return (
    <div
      className="
        bg-white/80
        dark:bg-slate-900/80
        backdrop-blur-md

        border
        border-slate-200
        dark:border-white/10

        rounded-3xl
        p-5

        shadow-lg
      "
    >
      {/* HEADER */}
      <h3 className="font-bold text-xl flex items-center gap-2">
        📔 Nhật ký
      </h3>

      {/* TEXTAREA */}
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="
          w-full
          mt-4
          p-4
          rounded-2xl

          bg-slate-100
          dark:bg-white/5

          text-slate-900
          dark:text-white

          placeholder:text-slate-400
          dark:placeholder:text-white/40

          outline-none
          border
          border-transparent
          focus:border-violet-400

          transition
        "
        placeholder="Hôm nay bạn cảm thấy thế nào..."
      />

      {/* BUTTON */}
      <button
        onClick={saveJournal}
        className="
          mt-4

          bg-violet-500
          hover:bg-violet-400

          text-white
          font-medium

          px-5
          py-3
          rounded-xl

          transition
          active:scale-95
        "
      >
        💾 Lưu nhật ký
      </button>

      {/* HISTORY */}
      {entries.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-slate-700 dark:text-white/80">
            Lịch sử nhật ký
          </h4>

          {entries.map((entry, index) => (
            <div
              key={index}
              className="
                p-4
                rounded-2xl

                bg-slate-100
                dark:bg-white/5

                border
                border-slate-200
                dark:border-white/10
              "
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 dark:text-white/40 mb-2">
                    {new Date(entry.date).toLocaleString("vi-VN")}
                  </p>

                  <p className="text-slate-800 dark:text-white/90 leading-relaxed">
                    {entry.text}
                  </p>
                </div>

                <button
                  onClick={() => deleteJournal(index)}
                  className="
                    bg-red-500/90
                    hover:bg-red-400

                    text-white
                    text-sm

                    px-3
                    py-1
                    rounded-lg

                    transition
                    active:scale-95
                  "
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}