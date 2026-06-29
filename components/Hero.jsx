"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Hero() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [animating, setAnimating] = useState(false);

  // 👉 chỉ hiện 1 lần
  useEffect(() => {
    const seen = localStorage.getItem("seen_intro");

    if (!seen) {
      setShow(true);
    }
  }, []);

  // 👉 auto fallback (5s)
  useEffect(() => {
    if (!show) return;

    const t = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(t);
  }, [show]);

  const handleClose = (path) => {
    setAnimating(true);

    // mark đã xem intro
    localStorage.setItem("seen_intro", "true");

    setTimeout(() => {
      setShow(false);
      setAnimating(false);

      if (path) router.push(path);
    }, 400); // delay cho animation mượt
  };

  if (!show) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-gradient-to-br from-[#dcefdc] to-[#f3fff3]
        dark:from-[#0f172a] dark:to-[#020617]
        text-gray-900 dark:text-white
        transition-all duration-500
        ${animating ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}
    >
      <div className="grid md:grid-cols-2 w-full h-full">

        {/* LEFT */}
        <div className="flex flex-col justify-center p-10 md:p-16">

          <h1 className="text-5xl font-bold">
            Chào mừng bạn đến với 11TIN
          </h1>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Thư giãn - Kết nối - Thấu hiểu
          </p>

          <div className="mt-8 flex gap-4">

            {/* BẮT ĐẦU */}
            <button
              onClick={() => handleClose("/")}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Bắt đầu
            </button>

            {/* KHÁM PHÁ */}
            <button
              onClick={() => handleClose("/moods")}
              className="px-6 py-3 border border-green-600 rounded-xl text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition"
            >
              Khám phá
            </button>

          </div>
        </div>

        {/* RIGHT */}
        <div className="relative w-full h-full min-h-[400px] md:min-h-screen">
          <Image
            src="https://anhdephd.vn/wp-content/uploads/2022/06/hinh-anh-dong-de-thuong.gif"
            alt="pets"
            fill
            className="object-contain"
            priority
          />
        </div>

      </div>
    </div>
  );
}