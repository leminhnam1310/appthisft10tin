"use client";

import { useEffect, useState } from "react";

export default function PrivacyGate() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("ai_consent");
    if (!saved) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("ai_consent", "true");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("ai_consent", "false");
    setShow(false);
  };

  if (!mounted || !show) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      
      <div className="
        w-[360px] rounded-2xl p-6 text-center shadow-2xl
        bg-white text-slate-900
        dark:bg-slate-900 dark:text-slate-100
        transition-all
      ">
        
        <h2 className="text-lg font-bold">
          🤖 Cho phép AI hoạt động?
        </h2>

        <p className="text-sm mt-2 mb-5 opacity-70">
          Robot sẽ ghi nhớ hành vi nhẹ để phản hồi thông minh hơn.
        </p>

        <div className="flex gap-2">
          <button
            onClick={accept}
            className="
              flex-1 py-2 rounded-lg font-medium
              bg-green-500 hover:bg-green-600
              text-white transition
            "
          >
            Accept
          </button>

          <button
            onClick={decline}
            className="
              flex-1 py-2 rounded-lg font-medium
              bg-red-500 hover:bg-red-600
              text-white transition
            "
          >
            Decline
          </button>
        </div>

      </div>
    </div>
  );
}