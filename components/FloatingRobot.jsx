"use client";

import { useEffect, useRef, useState } from "react";
import RobotChatBox from "@/components/RobotChatbox";
import { getAIResponse } from "@/app/lib/aiBrain";
import {
  getMemory,
  updateMemory,
  rememberFact,
  setRobotEmotion,
} from "@/app/lib/memory";

const DEFAULT_EMOJI = "🌱";

export default function FloatingRobot() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [robotMood, setRobotMood] = useState(DEFAULT_EMOJI);
  const [visibleBubble, setVisibleBubble] = useState(true);
  const [emotionState, setEmotionState] = useState("calm");

  const [messages, setMessages] = useState([
    {
      text: "Xin chào 🌱",
      emotion: "calm",
      emoji: DEFAULT_EMOJI,
      priority: 1,
      time: Date.now(),
    },
  ]);

  const mounted = useRef(false);

  // =========================
  // QUEUE SYSTEM (SAFE)
  // =========================
  const queue = useRef([]);
  const processing = useRef(false);

  const cooldown = useRef(0);
  const followTimer = useRef(null);
  const hideTimer = useRef(null);
  const idleTimer = useRef(null);

  // =========================
  // MEMORY CONTEXT
  // =========================
  const buildContext = (mem) => ({
    mood: mem.mood,
    energy: mem.robotEnergy,
    lastReply: mem.lastReply,
  });

  // =========================
  // BUBBLE
  // =========================
  const showBubble = () => {
    setVisibleBubble(true);

    clearTimeout(hideTimer.current);

    hideTimer.current = setTimeout(() => {
      setVisibleBubble(false);
    }, 7000);
  };

  // =========================
  // ADD MESSAGE
  // =========================
  const addMessage = (ai) => {
    if (!ai?.reply) return;

    setMessages((prev) => [
      ...prev.slice(-49),
      {
        text: ai.reply,
        emotion: ai.emotion,
        emoji: ai.emoji,
        priority: ai.priority,
        action: ai.action,
        time: Date.now(),
      },
    ]);

    setRobotMood(ai.emoji || DEFAULT_EMOJI);
    setRobotEmotion(ai.emotion, ai.emoji);
    updateMemory("lastReply", ai.reply);

    setEmotionState(ai.emotion || "calm");
    showBubble();

    if (Array.isArray(ai.remember)) {
      ai.remember.forEach(rememberFact);
    }
  };

  // =========================  
  // CORE SPEAK (FIXED)
  // =========================
  const speak = async (type, context = {}) => {
    const now = Date.now();
    const mem = getMemory();

    const wait = mem.robotEnergy < 30 ? 5000 : 1800;

    if (now - cooldown.current < wait) return;

    cooldown.current = now;

    setTyping(true);

    try {
      const ai = await getAIResponse({
        type,
        context: buildContext(mem),
      });

      if (!ai || ai.priority < 0.2) return;

      addMessage(ai);

      // follow up SAFE
      clearTimeout(followTimer.current);

      if (ai.followUp > 0) {
        followTimer.current = setTimeout(() => {
          requestSpeak("idle");
        }, ai.followUp);
      }
    } catch (err) {
      console.error(err);

      addMessage({
        reply: "Mình vẫn ở đây 🌱",
        emotion: "calm",
        emoji: "🌱",
        priority: 1,
        action: "none",
        remember: [],
      });
    } finally {
      setTyping(false);
    }
  };

  // =========================
  // QUEUE (FIXED)
  // =========================
  const processQueue = async () => {
    if (processing.current) return;
    processing.current = true;

    while (queue.current.length > 0) {
      const job = queue.current.shift();

      if (!job) continue;

      await speak(job.type, job.context);

      // 🔥 tránh spam CPU
      await new Promise((r) => setTimeout(r, 300));
    }

    processing.current = false;
  };

  const requestSpeak = (type, context = {}) => {
    queue.current.push({ type, context });

    // tránh spam trigger
    if (!processing.current) {
      processQueue();
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    requestSpeak("daily_checkin");

    idleTimer.current = setInterval(() => {
      if (Math.random() < 0.07) {
        requestSpeak("idle");
      }
    }, 120000);

    return () => {
      clearInterval(idleTimer.current);
      clearTimeout(followTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, []);

  // =========================
  // UI STATE
  // =========================
  const robotClass =
    {
      happy: "animate-bounce scale-110",
      excited: "animate-pulse scale-110",
      thinking: "rotate-3",
      sad: "opacity-70",
      calm: "animate-[pulse_5s_infinite]",
    }[emotionState] || "animate-[pulse_5s_infinite]";

  const latestMessage = messages.at(-1);

  // =========================
  // UI
  // =========================
  return (
    <>
      {!open && visibleBubble && (
        <div className="fixed bottom-24 left-5 max-w-[280px] px-4 py-3 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-2xl z-[99998]">
          {typing ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="animate-pulse">💭</span>
              <span>TENTIN đang suy nghĩ...</span>
            </div>
          ) : (
            <>
              <div className="text-lg mb-1">
                {latestMessage?.emoji || DEFAULT_EMOJI}
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {latestMessage?.text}
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-5 left-5 w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all z-[99999] ${robotClass}`}
      >
        {typing ? "💭" : robotMood}
      </button>

      {open && (
        <RobotChatBox
          messages={messages}
          robotMood={robotMood}
          typing={typing}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}