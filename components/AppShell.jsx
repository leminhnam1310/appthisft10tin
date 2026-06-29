"use client";

import { useState } from "react";

import IntroScreen from "@/components/IntroScreen";
import BackgroundEffects from "@/components/BackgroundEffects";
import BearScene from "@/components/BearScene";
import PrivacyGate from "@/components/PrivacyGate";
import FloatingRobot from "@/components/FloatingRobot";
import ThemeLoader from "@/components/ThemeLoader";

export default function AppShell({ children }) {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <ThemeLoader />

      {/* ================= INTRO ================= */}
      {!introDone && (
        <IntroScreen onFinish={() => setIntroDone(true)} />
      )}

      {/* ================= APP ================= */}
      {introDone && (
        <>
          {/* BACKGROUND */}
          <div className="fixed inset-0 z-0">
            <BackgroundEffects />
          </div>

          {/* BEAR SCENE */}
          <div className="fixed inset-0 z-10 pointer-events-none">
            <BearScene />
          </div>

          {/* MAIN */}
          <main className="relative z-20">
            {children}
          </main>

          {/* SYSTEM UI */}
          <FloatingRobot />
          <PrivacyGate />
        </>
      )}
    </>
  );
}