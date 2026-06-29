"use client";

import { useEffect, useState } from "react";
import { getMemory } from "@/app/lib/memory";

export default function StreakCard() {
  const [mem, setMem] = useState(getMemory());

  useEffect(() => {
    const refresh = () => setMem(getMemory());

    window.addEventListener("memory:update", refresh);
    refresh();

    return () => {
      window.removeEventListener("memory:update", refresh);
    };
  }, []);

  const xpPerLevel = 250;

  const xp = mem.xp || 0;
  const streak = mem.streak || 0;

  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentXP = xp % xpPerLevel;
  const progress = (currentXP / xpPerLevel) * 100;

  let rank = "🌱 Người mới";
  if (level >= 5) rank = "✨ Tích cực";
  if (level >= 10) rank = "🔥 Kiên trì";
  if (level >= 20) rank = "💎 Bậc thầy cảm xúc";
  if (level >= 30) rank = "👑 Huyền thoại";

  return (
    <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white">
      
      <div className="flex justify-between">
        <div className="text-center">
          <div className="text-4xl">🔥</div>
          <div className="text-4xl font-bold">{streak}</div>
          <div className="text-sm">ngày</div>
        </div>

        <div className="text-center">
          <div className="text-4xl">⭐</div>
          <div className="text-4xl font-bold">{level}</div>
          <div className="text-sm">level</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <span className="bg-white/20 px-4 py-2 rounded-full">
          {rank}
        </span>
      </div>

      <div className="mt-6">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-center mt-3">
          XP: {xp}
        </div>
      </div>
    </div>
  );
}