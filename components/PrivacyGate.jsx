"use client";

import { useEffect, useState } from "react";

export default function PrivacyGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ai_consent");
    if (!saved) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("ai_consent", "true");
    location.reload();
  };

  const decline = () => {
    localStorage.setItem("ai_consent", "false");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-black/60 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-[360px] text-center">
        <h2 className="text-lg font-bold">🤖 Cho phép AI hoạt động?</h2>

        <p className="text-sm opacity-70 mt-2 mb-4">
          Robot sẽ theo dõi hành vi nhẹ để phản hồi thông minh hơn.
        </p>

        <button
          onClick={accept}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
        >
          Accept
        </button>

        <button
          onClick={decline}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Decline
        </button>
      </div>
    </div>
  );
}