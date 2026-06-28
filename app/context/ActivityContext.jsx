"use client";

import { createContext, useState } from "react";

export const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const [activity, setActivity] = useState({
    clicks: 0,
    scrollSpeed: "normal",
    typing: false,
  });

  return (
    <ActivityContext.Provider value={{ activity, setActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}