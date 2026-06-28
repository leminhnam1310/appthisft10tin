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
  const [open, setOpen] =
    useState(false);

  const [typing, setTyping] =
    useState(false);

  const [robotMood, setRobotMood] =
    useState(DEFAULT_EMOJI);

  const [visibleBubble, setVisibleBubble] =
    useState(true);

  const [messages, setMessages] =
    useState([
      {
        text: "Xin chào 🌱",
        emotion: "calm",
        emoji: DEFAULT_EMOJI,
        priority: 1,
        time: Date.now(),
      },
    ]);

  const mounted =
    useRef(false);

  const cooldown =
    useRef(0);

  const followTimer =
    useRef(null);

  const hideTimer =
    useRef(null);

  const idleTimer =
    useRef(null);

  //----------------------------------------------------
  // Bubble
  //----------------------------------------------------

  const showBubble = () => {
    setVisibleBubble(true);

    clearTimeout(
      hideTimer.current
    );

    hideTimer.current =
      setTimeout(() => {
        setVisibleBubble(false);
      }, 7000);
  };

  //----------------------------------------------------
  // Add Message
  //----------------------------------------------------

  const addMessage = (
    ai
  ) => {
    if (!ai?.reply) return;

    setMessages((prev) => {
      const next = [
        ...prev,
        {
          text: ai.reply,

          emotion:
            ai.emotion,

          emoji:
            ai.emoji,

          priority:
            ai.priority,

          action:
            ai.action,

          time:
            Date.now(),
        },
      ];

      return next.slice(-50);
    });

    setRobotMood(
      ai.emoji ||
        DEFAULT_EMOJI
    );

    setRobotEmotion(
      ai.emotion,
      ai.emoji
    );

    updateMemory(
      "lastReply",
      ai.reply
    );

    showBubble();

    if (
      Array.isArray(
        ai.remember
      )
    ) {
      ai.remember.forEach(
        rememberFact
      );
    }
  };

  //----------------------------------------------------
  // AI Speak
  //----------------------------------------------------

  const speak = async (
    type,
    context = {}
  ) => {
    const now =
      Date.now();

    const mem =
      getMemory();

    const wait =
      mem.robotEnergy <
      30
        ? 5000
        : 2000;

    if (
      now -
        cooldown.current <
      wait
    ) {
      return;
    }

    cooldown.current =
      now;

    setTyping(true);

    try {
      const ai =
        await getAIResponse({
          type,

          context: {
            ...context,

            mood:
              mem.mood,

            xp:
              mem.xp,

            streak:
              mem.streak,

            journal:
              mem.lastJournal,

            achievement:
              mem.lastAchievement,

            robotEmotion:
              mem.robotEmotion,

            robotEnergy:
              mem.robotEnergy,

            relationship:
              mem.relationship,

            lastReply:
              mem.lastReply,
          },
        });

      setTyping(false);

      if (!ai)
        return;

      if (
        !ai.shouldSpeak
      )
        return;

      if (
        ai.priority <
        0.35
      )
        return;

      addMessage(ai);

      //--------------------------------
      // Follow Up
      //--------------------------------

      clearTimeout(
        followTimer.current
      );

      if (
        ai.followUp >
        0
      ) {
        followTimer.current =
          setTimeout(() => {
            speak(
              "follow_up"
            );
          }, ai.followUp);
      }
    } catch (err) {
      console.error(err);

      setTyping(false);

      addMessage({
        reply:
          "Mình vẫn ở đây 🌱",

        emotion:
          "calm",

        emoji:
          "🌱",

        priority: 1,

        action:
          "none",

        remember: [],
      });
    }
  };

  //----------------------------------------------------
  // Init
  //----------------------------------------------------

  useEffect(() => {
    if (
      mounted.current
    )
      return;

    mounted.current =
      true;

    const mem =
      getMemory();

    if (
      mem.lastMoodEmoji
    ) {
      setRobotMood(
        mem.lastMoodEmoji
      );
    }

    speak(
      "daily_checkin"
    );

    idleTimer.current =
      setInterval(() => {
        if (
          Math.random() <
          0.15
        ) {
          speak(
            "idle"
          );
        }
      }, 120000);

    //--------------------------------
    // Events
    //--------------------------------

    const moodHandler =
      (e) => {
        speak(
          "mood_changed",
          e.detail
        );
      };

    const journalHandler =
      (e) => {
        speak(
          "journal_saved",
          {
            text:
              e.detail,
          }
        );
      };

    const achievementHandler =
      (e) => {
        speak(
          "achievement_unlocked",
          e.detail
        );
      };

    window.addEventListener(
      "robot:mood",
      moodHandler
    );

    window.addEventListener(
      "robot:journal",
      journalHandler
    );

    window.addEventListener(
      "robot:achievement",
      achievementHandler
    );
        return () => {
      window.removeEventListener(
        "robot:mood",
        moodHandler
      );

      window.removeEventListener(
        "robot:journal",
        journalHandler
      );

      window.removeEventListener(
        "robot:achievement",
        achievementHandler
      );

      clearInterval(
        idleTimer.current
      );

      clearTimeout(
        followTimer.current
      );

      clearTimeout(
        hideTimer.current
      );
    };
  }, []);

  //----------------------------------------------------
  // Latest Message
  //----------------------------------------------------

  const latestMessage =
    messages.at(-1);

  const robotClass =
    latestMessage?.action ===
    "celebrate"
      ? "animate-bounce scale-110"
      : latestMessage?.action ===
        "listen"
      ? "rotate-3"
      : latestMessage?.action ===
        "thinking"
      ? "animate-pulse"
      : "animate-[pulse_5s_infinite]";

  //----------------------------------------------------
  // UI
  //----------------------------------------------------

  return (
    <>
      {/* Bubble */}

      {!open &&
        visibleBubble && (
          <div
            className="
              fixed

              bottom-24
              left-5

              max-w-[280px]

              px-4
              py-3

              rounded-3xl

              bg-white/95
              dark:bg-slate-900/95

              backdrop-blur

              border

              border-slate-200
              dark:border-slate-700

              shadow-2xl

              z-[99998]

              transition-all
              duration-500

              animate-in
              fade-in
              slide-in-from-bottom-2
            "
          >
            {typing ? (
              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-sm

                  text-slate-500
                "
              >
                <span
                  className="
                    animate-pulse
                  "
                >
                  💭
                </span>

                <span>
                  TENTIN đang suy nghĩ...
                </span>
              </div>
            ) : (
              <>
                <div
                  className="
                    text-lg
                    mb-1
                  "
                >
                  {latestMessage?.emoji ||
                    DEFAULT_EMOJI}
                </div>

                <div
                  className="
                    text-sm

                    text-slate-800
                    dark:text-slate-200

                    leading-relaxed
                  "
                >
                  {
                    latestMessage?.text
                  }
                </div>
              </>
            )}
          </div>
        )}

      {/* Robot Button */}

      <button
        onClick={() =>
          setOpen(
            (v) => !v
          )
        }
        className={`
          fixed

          bottom-5
          left-5

          w-16
          h-16

          rounded-full

          bg-gradient-to-br
          from-violet-500
          to-purple-600

          shadow-2xl

          flex
          items-center
          justify-center

          text-3xl

          hover:scale-110
          active:scale-95

          transition-all

          z-[99999]

          ${robotClass}
        `}
      >
        {typing
          ? "💭"
          : robotMood}
      </button>

      {/* Chat */}

      {open && (
        <RobotChatBox
          messages={
            messages
          }
          robotMood={
            robotMood
          }
          typing={
            typing
          }
          onClose={() =>
            setOpen(false)
          }
        />
      )}
    </>
  );
}