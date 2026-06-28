"use client";

import { useEffect } from "react";

export function useThemeSync() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const update = () => {
      document.documentElement.classList.toggle("dark", media.matches);
    };

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);
}