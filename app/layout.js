"use client";

import { useEffect, useState } from "react";
import localFont from "next/font/local";
import "./globals.css";

import ThemeLoader from "@/components/ThemeLoader";
import FloatingRobot from "@/components/FloatingRobot";
import IntroScreen from "@/components/IntroScreen";
import SystemEffects from "@/components/SystemEffects";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {

  const [introDone, setIntroDone] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {

    setMounted(true);

    const saved =
      localStorage.getItem(
        "intro_done"
      );

    if (saved === "true") {
      setIntroDone(true);
    }

  }, []);

  function finishIntro() {

    localStorage.setItem(
      "intro_done",
      "true"
    );

    setIntroDone(true);

  }

  return (

    <html
      lang="vi"
      suppressHydrationWarning
    >

      <body
        id="app-body"
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          relative
          min-h-screen
          bg-slate-100
          dark:bg-slate-950
          text-slate-900
          dark:text-white
          overflow-x-hidden
        `}
      >

        {/* Theme */}

        <ThemeLoader />

        {/* Background Effects */}
        <SystemEffects />

        {/* Intro */}

        {!introDone && mounted && (

          <div
            className="
              fixed
              inset-0
              z-[999999]
              bg-black/80
              flex
              items-center
              justify-center
            "
          >

            <IntroScreen
              onFinish={finishIntro}
            />

          </div>

        )}

        {/* Main */}

        <div
          className={`
            transition-all
            duration-500
            ${
              !introDone
                ? "opacity-30 blur-sm pointer-events-none"
                : "opacity-100"
            }
          `}
        >

          {children}

        </div>

        {/* Robot */}

        <FloatingRobot />

      </body>

    </html>

  );

}