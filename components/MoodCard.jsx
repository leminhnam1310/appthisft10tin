"use client";

import { useState } from "react";

export default function MoodCard() {
const moods = [
{
emoji: "😊",
text: "Vui vẻ",
value: 4,
gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDYybDlta3lsOWtyNHR2Y3k3M3l5MHVpcGs4bWhnNHh5MmlpNTJzMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mhfqfSii6aBk3AUWY3/giphy.webp",
},
{
emoji: "😔",
text: "Buồn",
value: 2,
gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzhscmRnNWoweXBlazczMXZ3N2MxN2RpbGYxcW11ZnBmYXF5eGs3ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oFzlW0gwUrWOV2xhu/giphy.gif",
},
{
emoji: "😫",
text: "Mệt mỏi",
value: 1,
gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2xobzg1bm94Z3Nyb3Q1aTl4ODQ5Y2F3OXhwNW9td3B3cWQ1c3Z0ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UjGydqF9HolDG/giphy.gif",
},
{
emoji: "😴",
text: "Buồn ngủ",
value: 3,
gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnpsZWRoZzM4cmVnMHdleHpweno5NGszdXBvcnI4Z3Zmemt6d3dhOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oT3DYADp0vA3Mqj6Jw/giphy.gif",
},
];

const [selectedMood, setSelectedMood] = useState(null);
const [showGif, setShowGif] = useState(false);

const [achievementPopup, setAchievementPopup] =
  useState(null);

 const achievements = [
{
id: 1,
icon: "🌱",
title: "Khởi đầu mới",
description: "Ghi cảm xúc lần đầu",
target: 1,
reward: "50 XP",
rewardXP: 50,
rarity: "common",
},

{
id: 2,
icon: "🔥",
title: "Bền bỉ",
description: "Ghi cảm xúc 7 ngày",
target: 7,
reward: "100 XP",
rewardXP: 100,
rarity: "rare",
},

{
id: 3,
icon: "📖",
title: "Người tâm sự",
description: "Ghi cảm xúc 10 lần",
target: 10,
reward: "50 XP",
rewardXP: 50,
rarity: "common",
},

{
id: 4,
icon: "😊",
title: "Tích cực",
description: "Vui vẻ 1 lần",
target: 1,
mood: "😊",
reward: "50 XP",
rewardXP: 50,
rarity: "common",
},

{
id: 5,
icon: "😴",
title: "Gấu ngủ",
description: "Buồn ngủ 7 lần",
target: 7,
mood: "😴",
reward: "100 XP",
rewardXP: 100,
rarity: "rare",
},

{
id: 6,
icon: "🌞",
title: "Tràn năng lượng",
description: "Vui vẻ 10 lần",
target: 10,
mood: "😊",
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 7,
icon: "💪",
title: "Không bỏ cuộc",
description: "Check-in 20 lần",
target: 20,
reward: "100 XP",
rewardXP: 100,
rarity: "rare",
},

{
id: 8,
icon: "📅",
title: "Một tháng",
description: "Check-in 30 lần",
target: 30,
reward: "100 XP",
rewardXP: 100,
rarity: "rare",
},

{
id: 9,
icon: "📝",
title: "Nhà ghi chép",
description: "Check-in 50 lần",
target: 50,
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 10,
icon: "🏅",
title: "Chuyên gia cảm xúc",
description: "Check-in 100 lần",
target: 100,
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 11,
icon: "🌈",
title: "Lạc quan",
description: "Vui vẻ 25 lần",
target: 25,
mood: "😊",
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 12,
icon: "☁️",
title: "Tâm trạng",
description: "Buồn 10 lần",
target: 10,
mood: "😔",
reward: "50 XP",
rewardXP: 50,
rarity: "rare",
},

{
id: 13,
icon: "😫",
title: "Chiến binh",
description: "Mệt mỏi 10 lần",
target: 10,
mood: "😫",
reward: "50 XP",
rewardXP: 50,
rarity: "rare",
},

{
id: 14,
icon: "🌙",
title: "Cú đêm",
description: "Buồn ngủ 20 lần",
target: 20,
mood: "😴",
reward: "100 XP",
rewardXP: 100,
rarity: "epic",
},

{
id: 15,
icon: "👑",
title: "Huyền thoại",
description: "Check-in 200 lần",
target: 200,
reward: "150 XP",
rewardXP: 150,
rarity: "legendary",
},

{
id: 16,
icon: "👻",
title: "Bí mật",
description: "Đạt 365 check-in",
target: 365,
reward: "300 XP",
rewardXP: 300,
rarity: "legendary",
hidden: true,
},
];

const addXP = (amount) => {
  const playerData =
    JSON.parse(
      localStorage.getItem(
        "playerData"
      )
    ) || {
      xp: 0,
    };

  playerData.xp += amount;

  localStorage.setItem(
    "playerData",
    JSON.stringify(playerData)
  );
};

const checkAchievements = () => {
  const moodData =
    JSON.parse(localStorage.getItem("moods")) || [];

  const unlocked =
    JSON.parse(localStorage.getItem("unlockedAchievements")) || [];

  achievements.forEach((achievement) => {
    
    const count = moodData.length;

    const moodCount = (mood) =>
      moodData.filter((m) => m.mood === mood).length;

    let unlockedNow = false;

    // 🧠 CHECK LOGIC
    if (achievement.id <= 3) {
      unlockedNow = count >= achievement.target;
    }

    // 🎯 mood-based achievement
    else if (achievement.mood) {
      unlockedNow =
        moodCount(achievement.mood) >= achievement.target;
    }

    // 🧠 fallback
    else {
      unlockedNow = count >= achievement.target;
    }

    if (unlockedNow && !unlocked.includes(achievement.id)) {
  unlocked.push(achievement.id);

  localStorage.setItem(
    "unlockedAchievements",
    JSON.stringify(unlocked)
  );

  addXP(achievement.rewardXP);

  // 🤖 cập nhật memory
  const memory =
    JSON.parse(
      localStorage.getItem(
        "ai_memory"
      ) || "{}"
    );

  memory.lastAchievement =
    achievement.title;

  localStorage.setItem(
    "ai_memory",
    JSON.stringify(memory)
  );

  // 🤖 gửi sự kiện cho robot
  window.dispatchEvent(
    new CustomEvent(
      "robot:achievement",
      {
        detail: {
          id: achievement.id,
          title:
            achievement.title,
          description:
            achievement.description,
          rewardXP:
            achievement.rewardXP,
          rarity:
            achievement.rarity,
        },
      }
    )
  );

  setAchievementPopup({
    title: achievement.title,
    description:
      achievement.description,
    rewardXP:
      achievement.rewardXP,
  });

  setTimeout(() => {
    setAchievementPopup(
      null
    );
  }, 4000);
}
  });
};

const saveMood = (mood) => {
  setSelectedMood(mood);

  setShowGif(true);

  setTimeout(() => {
    setShowGif(false);
  }, 3000);

  // =========================
  // LƯU MOOD
  // =========================

  const oldData =
    JSON.parse(
      localStorage.getItem("moods")
    ) || [];

  const newMood = {
    mood: mood.emoji,
    text: mood.text,
    value: mood.value,
    date: new Date().toISOString(),
  };

  oldData.push(newMood);

  localStorage.setItem(
    "moods",
    JSON.stringify(oldData)
  );

  // =========================
  // AI MEMORY
  // =========================

  const memory =
    JSON.parse(
      localStorage.getItem(
        "ai_memory"
      ) || "{}"
    );

  memory.mood = mood.text;

  memory.lastMoodEmoji =
    mood.emoji;

  memory.lastMoodTime =
    Date.now();

  localStorage.setItem(
    "ai_memory",
    JSON.stringify(memory)
  );

  // =========================
  // ROBOT EVENT (WEB)
  // =========================

  window.dispatchEvent(
    new CustomEvent(
      "robot:mood",
      {
        detail: {
          mood: mood.text,
          emoji: mood.emoji,
          value: mood.value,
          date:
            new Date().toISOString(),
        },
      }
    )
  );

  // =========================
  // ROBOT DESKTOP (ELECTRON)
  // =========================

  if (window.electron) {
    let robotMessage =
      "Mình đang ở đây 🌱";

    if (mood.emoji === "😊") {
      robotMessage =
        "Hôm nay có vẻ là một ngày khá ổn nhỉ 😊";
    }

    if (mood.emoji === "😔") {
      robotMessage =
        "Nếu hôm nay hơi khó khăn thì mình vẫn ở đây cùng bạn 🤍";
    }

    if (mood.emoji === "😫") {
      robotMessage =
        "Bạn đã cố gắng nhiều rồi, nghỉ một chút nhé 🌿";
    }

    if (mood.emoji === "😴") {
      robotMessage =
        "Có lẽ cơ thể đang cần được nghỉ ngơi đó 😴";
    }

    window.electron.send(
      "robot-message",
      {
        type: "mood",
        mood: mood.text,
        emoji: mood.emoji,
        value: mood.value,
        message: robotMessage,
      }
    );
  }

  // =========================
  // ACHIEVEMENTS
  // =========================

  checkAchievements();
};

return (
<>
{showGif && selectedMood && ( <div
       className="
         fixed inset-0
         bg-black/60
         backdrop-blur-sm
         flex items-center justify-center
         z-50
       "
     > <div
         className="
           bg-white
           dark:bg-slate-900
           rounded-3xl
           p-6
           shadow-2xl
           text-center
         "
       > <img
           src={selectedMood.gif}
           alt="gif"
           className="
             w-72
             h-72
             object-contain
           "
         />

        <p
          className="
            mt-4
            text-2xl
            font-bold
          "
        >
          {selectedMood.emoji}
          {" "}
          {selectedMood.text}
        </p>
      </div>
    </div>
  )}

 {achievementPopup && (
  <div
    className="
      fixed
      bottom-5
      right-5
      z-[9999]

      w-[320px]

      bg-white
      dark:bg-slate-900

      border
      border-yellow-400

      rounded-2xl
      shadow-2xl

      p-4

      animate-slideInRight
    "
  >
    <div className="flex items-center gap-3">
      <div className="text-4xl">
        🏆
      </div>

      <div>
        <p className="font-bold text-yellow-500">
          Thành tựu mới!
        </p>

        <p className="font-semibold">
          {achievementPopup.title}
        </p>

        <p className="text-sm text-slate-500">
          {achievementPopup.description}
        </p>
      </div>
    </div>
  </div>
)}
  <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-lg">
    <h3 className="font-bold text-xl">
      🌸 Cảm xúc hôm nay
    </h3>

    <p
      className="
        text-slate-500
        dark:text-white/60
        mt-1
      "
    >
      Hôm nay bạn cảm thấy thế nào?
    </p>

    <div className="grid grid-cols-2 gap-4 mt-5">
      {moods.map((mood) => (
        <button
          key={mood.emoji}
          onClick={() =>
            saveMood(mood)
          }
          className="
            h-24
            rounded-2xl
            text-4xl

            flex
            items-center
            justify-center

            transition-all

            bg-slate-100
            dark:bg-white/10

            hover:scale-105
          "
        >
          {mood.emoji}
        </button>
      ))}
    </div>

    {selectedMood && (
      <div
        className="
          mt-5
          p-4

          rounded-2xl

          bg-slate-100
          dark:bg-white/10
        "
      >
        <p>
          Hôm nay bạn đang cảm thấy:
        </p>

        <p
          className="
            text-violet-400
            font-bold
            text-lg
            mt-1
          "
        >
          {selectedMood.emoji}
          {" "}
          {selectedMood.text}
        </p>
      </div>
    )}
  </div>
</>

);
}
