"use client";

import { useState } from "react";

export default function BreathCard() {

  const [active, setActive] = useState(false);

  return (
    <div className="glass p-5 rounded-3xl">

      <h3 className="font-bold text-xl">
        (˵ •̀ ᴗ - ˵ ) ✧ Hít thở
      </h3>

      <div className="h-52 flex justify-center items-center">

        <div
          className={`
          w-28 h-28 rounded-full bg-violet-500
          transition-all duration-[4000ms]
          ${active ? "scale-150" : ""}
          `}
        />

      </div>

      <button
        onClick={() => setActive(!active)}
        className="bg-violet-500 px-5 py-3 rounded-2xl"
      >
        {active ? "Stop" : "Start"}
      </button>

    </div>
  );
}
