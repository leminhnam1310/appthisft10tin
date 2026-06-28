"use client";

import { useEffect } from "react";

export function useUserActivityTracker(enabled, setActivity) {
  useEffect(() => {
    if (!enabled) return;

    let clickCount = 0;
    let lastScroll = Date.now();

    const handleClick = () => {
      clickCount++;
      setActivity((prev) => ({ ...prev, clicks: clickCount }));
    };

    const handleScroll = () => {
      const now = Date.now();
      const speed = now - lastScroll;
      lastScroll = now;

      setActivity((prev) => ({
        ...prev,
        scrollSpeed: speed < 200 ? "fast" : "normal",
      }));
    };

    const handleKey = () => {
      setActivity((prev) => ({
        ...prev,
        typing: true,
      }));
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, [enabled, setActivity]);
}