// ===============================
// TENTIN Memory Engine v2
// ===============================

const STORAGE_KEY = "ai_memory";

const DEFAULT_MEMORY = {
  mood: null,
  lastMoodEmoji: "🌱",

  xp: 0,
  streak: 0,

  lastJournal: "",
  lastAchievement: "",

  lastMessage: "",

  relationship: 1,

  robotEmotion: "calm",

  robotEnergy: 100,

  lastReply: "",

  importantFacts: [],

  chatHistory: [],

  createdAt: Date.now(),

  updatedAt: Date.now(),
};

// ===============================
// LOAD
// ===============================

export const getMemory = () => {
  if (typeof window === "undefined")
    return DEFAULT_MEMORY;

  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw)
      return {
        ...DEFAULT_MEMORY,
      };

    return {
      ...DEFAULT_MEMORY,
      ...JSON.parse(raw),
    };
  } catch (err) {
    console.error(
      "Memory parse:",
      err
    );

    return {
      ...DEFAULT_MEMORY,
    };
  }
};

// ===============================
// SAVE
// ===============================

export const saveMemory = (
  memory
) => {
  if (typeof window === "undefined")
    return;

  memory.updatedAt =
    Date.now();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(memory)
  );
};

// ===============================
// UPDATE KEY
// ===============================

export const updateMemory = (
  key,
  value
) => {
  const mem =
    getMemory();

  mem[key] = value;

  saveMemory(mem);
};

// ===============================
// CLEAR
// ===============================

export const clearMemory =
  () => {
    if (
      typeof window ===
      "undefined"
    )
      return;

    localStorage.removeItem(
      STORAGE_KEY
    );
  };

// ===============================
// CHAT
// ===============================

export const addChat = (
  role,
  text
) => {
  if (!text?.trim())
    return;

  const mem =
    getMemory();

  const last =
    mem.chatHistory.at(-1);

  // chống spam
  if (
    last &&
    last.role === role &&
    last.text === text
  ) {
    return;
  }

  mem.chatHistory.push({
    role,
    text,
    time: Date.now(),
  });

  // chỉ giữ 50 tin
  mem.chatHistory =
    mem.chatHistory.slice(-50);

  saveMemory(mem);
};

export const clearChat =
  () => {
    const mem =
      getMemory();

    mem.chatHistory = [];

    saveMemory(mem);
  };

// ===============================
// LONG TERM MEMORY
// ===============================

export const rememberFact =
  (fact) => {
    if (!fact)
      return;

    const mem =
      getMemory();

    if (
      !mem.importantFacts.includes(
        fact
      )
    ) {
      mem.importantFacts.push(
        fact
      );
    }

    mem.importantFacts =
      mem.importantFacts.slice(
        -30
      );

    saveMemory(mem);
  };

// ===============================
// ROBOT
// ===============================

export const setRobotEmotion =
  (
    emotion,
    emoji = "🌱"
  ) => {
    const mem =
      getMemory();

    mem.robotEmotion =
      emotion;

    mem.lastMoodEmoji =
      emoji;

    saveMemory(mem);
  };

export const setRobotEnergy =
  (
    energy
  ) => {
    updateMemory(
      "robotEnergy",
      Math.max(
        0,
        Math.min(
          100,
          energy
        )
      )
    );
  };

export const increaseFriendship =
  (
    amount = 1
  ) => {
    const mem =
      getMemory();

    mem.relationship +=
      amount;

    saveMemory(mem);
  };

// ===============================
// USER DATA
// ===============================

export const saveMood = (
  mood,
  emoji = ""
) => {
  const mem =
    getMemory();

  mem.mood = mood;

  mem.lastMoodEmoji =
    emoji;

  saveMemory(mem);
};

export const saveXP = (
  xp
) => {
  updateMemory(
    "xp",
    xp
  );
};

export const saveStreak =
  (
    streak
  ) => {
    updateMemory(
      "streak",
      streak
    );
  };

export const saveJournal =
  (
    journal
  ) => {
    updateMemory(
      "lastJournal",
      journal
    );
  };

export const saveAchievement =
  (
    achievement
  ) => {
    updateMemory(
      "lastAchievement",
      achievement
    );
  };

// ===============================
// CONTEXT
// ===============================

export const getRobotContext =
  () => {
    const mem =
      getMemory();

    return {
      mood:
        mem.mood,

      moodEmoji:
        mem.lastMoodEmoji,

      xp:
        mem.xp,

      streak:
        mem.streak,

      journal:
        mem.lastJournal,

      achievement:
        mem.lastAchievement,

      relationship:
        mem.relationship,

      robotEmotion:
        mem.robotEmotion,

      robotEnergy:
        mem.robotEnergy,

      lastReply:
        mem.lastReply,

      lastMessage:
        mem.lastMessage,

      importantFacts:
        mem.importantFacts,

      chatHistory:
        mem.chatHistory,
    };
  };