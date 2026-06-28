"use client";

import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import MoodCard from "@/components/MoodCard";
import MusicCard from "@/components/MusicCard";
import Journal from "@/components/Journal";
import StreakCard from "@/components/StreakCard";

import FloatingRobot from "@/components/FloatingRobot";

import { useEffect, useState } from "react";

export default function Page() {
  const [consent, setConsent] = useState(null); 
  // 👆 null = chưa check xong (quan trọng)

  useEffect(() => {
    const saved = localStorage.getItem("ai_consent");
    setConsent(saved === "true");
  }, []);

  // 🧠 debug mode (bật robot luôn nếu cần test)
  const DEBUG_FORCE_ROBOT = false;

  return (
    <main
      className="
        min-h-screen
        bg-slate-100
        text-slate-900
        dark:bg-slate-950
        dark:text-white
        relative
      "
    >
      <Sidebar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div id="home">
          <StreakCard />
          <Hero />
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2"></div>

          <div className="space-y-6">
            <div id="mood">
              <MoodCard />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div id="music">
            <MusicCard />
          </div>

          <div id="journal">
            <Journal />
          </div>
        </div>
      </div>

      {/* 🤖 ROBOT FIXED */}
      {(DEBUG_FORCE_ROBOT || consent === true) && (
        <FloatingRobot />
      )}

      {/* 🧠 debug hint */}
      {consent === null && (
        <div className="fixed bottom-5 left-5 text-xs opacity-40">
          checking consent...
        </div>
      )}
    </main>
  );
}