"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getMemory,
} from "@/app/lib/memory";

export default function RobotChatBox({
  messages = [],
  robotMood = "🌱",
  typing = false,
  onClose,
  onSend,
}) {
  const [input, setInput] =
    useState("");

  const scrollRef =
    useRef(null);

  const inputRef =
    useRef(null);

  //--------------------------------------------------

  const memory =
    useMemo(
      () => getMemory(),
      [messages]
    );

  const level =
    Math.max(
      1,
      Math.floor(
        (memory.xp || 0) /
          100
      ) + 1
    );

  const progress =
    (memory.xp || 0) %
    100;

  //--------------------------------------------------

  useEffect(() => {
    scrollRef.current
      ?.scrollTo({
        top:
          scrollRef.current
            .scrollHeight,
        behavior:
          "smooth",
      });
  }, [
    messages,
    typing,
  ]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  //--------------------------------------------------

  const send = () => {
    const text =
      input.trim();

    if (!text)
      return;

    onSend?.(text);

    setInput("");
  };

  //--------------------------------------------------

  return (
    <div
      className="
fixed

bottom-24
left-5

w-[380px]
h-[600px]

rounded-[32px]

overflow-hidden

bg-white/70
dark:bg-slate-900/70

backdrop-blur-2xl

border
border-white/30
dark:border-slate-700/40

shadow-[0_25px_70px_rgba(0,0,0,.18)]

animate-in
fade-in
zoom-in-95

z-[99999]
"
    >
      {/* Background */}

      <div
        className="
absolute
inset-0

pointer-events-none

bg-gradient-to-br

from-violet-500/10

via-pink-500/5

to-cyan-500/10
"
      />

      {/* Header */}

      <div
        className="
relative

px-5
py-4

border-b

border-white/30
dark:border-slate-700/40

backdrop-blur
"
      >
        <div
          className="
flex

items-center

justify-between
"
        >
          <div
            className="
flex

items-center

gap-3
"
          >
            <div
              className="
w-12
h-12

rounded-full

bg-gradient-to-br

from-violet-500

to-fuchsia-500

flex

items-center

justify-center

text-2xl

shadow-lg

animate-pulse
"
            >
              {robotMood}
            </div>

            <div>
              <div
                className="
font-bold

text-slate-800
dark:text-white
"
              >
                TENTIN
              </div>

              <div
                className="
flex

items-center

gap-2

text-xs

text-slate-500
"
              >
                <div
                  className="
w-2
h-2

rounded-full

bg-green-500

animate-pulse
"
                />

                Đang lắng nghe
              </div>
            </div>
          </div>

          <button
            onClick={
              onClose
            }
            className="
w-9
h-9

rounded-full

hover:bg-white/40
dark:hover:bg-slate-700

transition
"
          >
            ✕
          </button>
        </div>

        {/* Status */}

        <div
          className="
mt-4

space-y-2
"
        >
          <div
            className="
flex

justify-between

text-xs

text-slate-500
"
          >
            <span>
              Lv.
              {level}
            </span>

            <span>
              XP{" "}
              {memory.xp ||
                0}
            </span>
          </div>

          <div
            className="
h-2

rounded-full

bg-slate-200
dark:bg-slate-700

overflow-hidden
"
          >
            <div
              className="
h-full

rounded-full

bg-gradient-to-r

from-violet-500

to-pink-500

transition-all

duration-700
"
              style={{
                width:
                  progress +
                  "%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}

      <div
        ref={scrollRef}
        className="
relative

h-[420px]

overflow-y-auto

px-4
py-5

space-y-4

scroll-smooth
"
      >
                {messages.map(
          (msg, index) => {
            const text =
              typeof msg ===
              "string"
                ? msg
                : msg.text;

            const emotion =
              msg.emotion ||
              "calm";

            const emoji =
              msg.emoji ||
              robotMood;

            const bubbleColor = {
              happy:
                "bg-yellow-100 dark:bg-yellow-500/20",
              care:
                "bg-pink-100 dark:bg-pink-500/20",
              sad:
                "bg-sky-100 dark:bg-sky-500/20",
              thinking:
                "bg-slate-100 dark:bg-slate-700/60",
              excited:
                "bg-orange-100 dark:bg-orange-500/20",
              calm:
                "bg-violet-100 dark:bg-violet-500/20",
            };

            return (
              <div
                key={index}
                className="
animate-in

fade-in

slide-in-from-bottom-2

duration-300
"
              >
                <div
                  className="
flex

items-start

gap-3
"
                >
                  {/* Avatar */}

                  <div
                    className="
w-10
h-10

rounded-full

bg-gradient-to-br

from-violet-500

to-fuchsia-500

flex

items-center

justify-center

text-lg

shadow
"
                  >
                    {emoji}
                  </div>

                  {/* Bubble */}

                  <div
                    className={`
max-w-[250px]

rounded-3xl

px-4

py-3

shadow-lg

transition-all

hover:scale-[1.02]

${
  bubbleColor[
    emotion
  ] ||
  bubbleColor
    .calm
}
`}
                  >
                    <div
                      className="
text-sm

leading-6

text-slate-700
dark:text-slate-100
"
                    >
                      {text}
                    </div>

                    {msg.time && (
                      <div
                        className="
mt-2

text-[10px]

text-slate-500
"
                      >
                        {new Date(
                          msg.time
                        ).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        )}

        {/* Typing */}

        {typing && (
          <div
            className="
flex

items-center

gap-3

animate-pulse
"
          >
            <div
              className="
w-10
h-10

rounded-full

bg-gradient-to-br

from-violet-500

to-fuchsia-500

flex

items-center

justify-center
"
            >
              {robotMood}
            </div>

            <div
              className="
px-4

py-3

rounded-3xl

bg-white

dark:bg-slate-800

shadow
"
            >
              <div
                className="
flex

gap-1
"
              >
                <span className="animate-bounce">
                  ●
                </span>

                <span
                  className="
animate-bounce

delay-150
"
                >
                  ●
                </span>

                <span
                  className="
animate-bounce

delay-300
"
                >
                  ●
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}

      <div
        className="
border-t

border-white/30

dark:border-slate-700/40

p-4
"
      >
        <div
          className="
flex

items-center

gap-3
"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key ===
                "Enter"
              ) {
                send();
              }
            }}
            placeholder="Nhắn với TENTIN..."
            className="
flex-1

rounded-full

px-4

py-3

bg-white/70

dark:bg-slate-800

outline-none

text-sm
"
          />

          <button
            onClick={send}
            className="
w-12

h-12

rounded-full

bg-gradient-to-br

from-violet-500

to-fuchsia-500

text-white

hover:scale-110

active:scale-95

transition
"
          >
            ➜
          </button>
        </div>

        <div
          className="
mt-3

text-center

text-[11px]

text-slate-400
"
        >
          🌱 Mình sẽ luôn ở đây khi bạn cần.
        </div>
      </div>
    </div>
  );
}