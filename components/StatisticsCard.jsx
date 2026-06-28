"use client";

import { useEffect, useState } from "react";

export default function StatisticsCard() {
const [moods, setMoods] = useState([]);

useEffect(() => {
const data =
JSON.parse(localStorage.getItem("moods")) || [];

setMoods(data);

}, []);

const now = new Date();

const last7Days = moods.filter((m) => {
const date = new Date(m.date);
return now - date <= 7 * 24 * 60 * 60 * 1000;
});

const last30Days = moods.filter((m) => {
const date = new Date(m.date);
return now - date <= 30 * 24 * 60 * 60 * 1000;
});

const moodCount = (emoji) =>
moods.filter((m) => m.mood === emoji).length;

const total = moods.length || 1;

const percent = (emoji) =>
Math.round((moodCount(emoji) / total) * 100);

return ( <div className="p-6 rounded-3xl bg-white/10">

  <h3 className="text-2xl font-bold mb-5">
    📊 Thống kê cảm xúc
  </h3>

  <div className="space-y-2 mb-6">
    <p>📌 Tổng số lần check-in: {moods.length}</p>
    <p>📅 7 ngày gần đây: {last7Days.length}</p>
    <p>🗓️ 30 ngày gần đây: {last30Days.length}</p>
  </div>

  <div className="space-y-4">

    <MoodBar
      emoji="😊"
      label="Vui vẻ"
      count={moodCount("😊")}
      percent={percent("😊")}
    />

    <MoodBar
      emoji="😔"
      label="Buồn"
      count={moodCount("😔")}
      percent={percent("😔")}
    />

    <MoodBar
      emoji="😫"
      label="Mệt mỏi"
      count={moodCount("😫")}
      percent={percent("😫")}
    />

    <MoodBar
      emoji="😴"
      label="Buồn ngủ"
      count={moodCount("😴")}
      percent={percent("😴")}
    />

  </div>

</div>

);
}

function MoodBar({
emoji,
label,
count,
percent,
}) {
return ( <div>

  <div className="flex justify-between mb-1">
    <span>
      {emoji} {label}
    </span>

    <span>
      {count} lần
    </span>
  </div>

  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
    <div
      className="h-full bg-violet-500"
      style={{
        width: `${percent}%`,
      }}
    />
  </div>

  <div className="text-right text-sm text-white/60 mt-1">
    {percent}%
  </div>

</div>

);
}
