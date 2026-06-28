"use client";

import { useEffect, useMemo, useState } from "react";
import SakuraEffect from "./SakuraEffect";

export default function BackgroundEffects() {
  const [effect, setEffect] = useState("sakura");
  const [visible, setVisible] = useState(true);

  // load effect từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("effect") || "sakura";
    setEffect(saved);

    // listen từ SettingCard
    const handler = () => {
      const newEffect = localStorage.getItem("effect") || "sakura";

      setVisible(false);

      setTimeout(() => {
        setEffect(newEffect);
        setVisible(true);
      }, 250);
    };

    window.addEventListener("effect-change", handler);
    return () => window.removeEventListener("effect-change", handler);
  }, []);

  return (
    <div className={`effect-wrapper ${visible ? "show" : "hide"}`}>
      {effect === "sakura" && <SakuraEffect />}
      {effect === "stars" && <StarsEffect />}
    </div>
  );
}

/* =========================
   STARS EFFECT (NO FILE)
========================= */
function StarsEffect() {
  const stars = useMemo(
    () =>
      Array.from({ length: 15 }).map(() => ({
        top: Math.random() * 50,
        left: Math.random() * 100,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <div className="meteor-container">
      {stars.map((s, i) => (
        <span
          key={i}
          className="meteor"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}