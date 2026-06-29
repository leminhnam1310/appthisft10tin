const STORAGE_KEY = "ai_memory_v2";

/* =========================
   DEFAULT STATE
========================= */
const DEFAULT = {
  xp: 0,
  streak: 0,

  lastLogin: null, // 👈 FIX STREAK REAL

  mood: null,
  lastMoodEmoji: "🌱",

  lastJournal: "",
  lastAchievement: "",
  lastMessage: "",

  chatHistory: [],

  robotEmotion: "calm",
  robotEnergy: 100,

  updatedAt: Date.now(),
};

/* =========================
   LOAD SAFE
========================= */
export const getMemory = () => {
  if (typeof window === "undefined") return DEFAULT;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT };

    return {
      ...DEFAULT,
      ...JSON.parse(raw),
    };
  } catch {
    return { ...DEFAULT };
  }
};

/* =========================
   SAVE + SYNC (REALTIME FIX)
========================= */
export const saveMemory = (mem) => {
  if (typeof window === "undefined") return;

  mem.updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mem));

  // realtime sync across components
  window.dispatchEvent(new Event("memory:update"));
};

/* =========================
   SAFE UPDATE
========================= */
export const updateMemory = (key, value) => {
  const mem = getMemory();
  mem[key] = value;
  saveMemory(mem);
};

/* =========================
   XP SYSTEM (FIXED + SAFE)
========================= */
export const addXP = (amount = 0) => {
  const mem = getMemory();

  mem.xp = (mem.xp || 0) + amount;

  saveMemory(mem);
  return mem.xp;
};

/* =========================
   🔥 REAL STREAK SYSTEM (FIX QUAN TRỌNG NHẤT)
========================= */
export const syncStreak = () => {
  const mem = getMemory();

  const today = new Date().toDateString();
  const last = mem.lastLogin;

  if (!last) {
    mem.streak = 1;
  } else {
    const lastDate = new Date(last).toDateString();

    if (lastDate === today) {
      return mem.streak; // đã tính hôm nay rồi
    }

    const diff =
      (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      mem.streak += 1;
    } else {
      mem.streak = 1;
    }
  }

  mem.lastLogin = Date.now();

  saveMemory(mem);
  return mem.streak;
};

/* =========================
   ROBOT STATE
========================= */
export const setRobotEmotion = (emotion, emoji = "🌱") => {
  const mem = getMemory();

  mem.robotEmotion = emotion;
  mem.lastMoodEmoji = emoji;

  saveMemory(mem);
};

/* =========================
   CHAT HISTORY
========================= */
export const addChat = (role, text) => {
  if (!text?.trim()) return;

  const mem = getMemory();

  mem.chatHistory.push({
    role,
    text,
    time: Date.now(),
  });

  mem.chatHistory = mem.chatHistory.slice(-50);

  saveMemory(mem);
};

/* =========================
   CONTEXT FOR AI
========================= */
export const getRobotContext = () => {
  const mem = getMemory();

  return {
    xp: mem.xp,
    streak: mem.streak,
    mood: mem.mood,
    robotEmotion: mem.robotEmotion,
    lastMessage: mem.lastMessage,
  };
};

/* =========================
   RESET (DEBUG)
========================= */
export const resetMemory = () => {
  localStorage.removeItem(STORAGE_KEY);
};