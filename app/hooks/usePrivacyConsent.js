"use client";

import { useEffect, useState } from "react";

export function usePrivacyConsent() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ai_consent");
    setAllowed(saved === "true");
  }, []);

  const accept = () => {
    localStorage.setItem("ai_consent", "true");
    setAllowed(true);
  };

  const decline = () => {
    localStorage.setItem("ai_consent", "false");
    setAllowed(false);
  };

  return { allowed, accept, decline };
}