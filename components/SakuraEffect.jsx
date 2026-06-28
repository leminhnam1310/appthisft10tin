"use client";

import { useEffect } from "react";

export default function SakuraEffect() {
  useEffect(() => {
    const container =
      document.getElementById(
        "sakura-container"
      );

    if (!container) return;

    const createPetal = () => {
      if (
        container.children.length > 30
      )
        return;

      const petal =
        document.createElement("div");

      petal.className = "sakura";

      petal.style.left =
        Math.random() * 100 + "vw";

      petal.style.animationDuration =
        6 + Math.random() * 6 + "s";

      petal.style.opacity =
        0.4 + Math.random() * 0.6;

      petal.style.width =
        10 + Math.random() * 15 + "px";

      petal.style.height =
        petal.style.width;

      petal.style.setProperty(
        "--drift",
        `${-100 + Math.random() * 200}px`
      );

      container.appendChild(
        petal
      );

      setTimeout(() => {
        petal.remove();
      }, 12000);
    };

    const interval =
      setInterval(
        createPetal,
        250
      );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div
      id="sakura-container"
      className="
        fixed
        inset-0
        pointer-events-none
        overflow-hidden
        z-50
      "
    />
  );
}