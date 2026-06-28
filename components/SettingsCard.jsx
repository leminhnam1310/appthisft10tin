"use client";

import { useEffect, useState } from "react";

export default function SettingsCard() {
  const [darkMode, setDarkMode] = useState(true);
  const [effect, setEffect] = useState("sakura");
  const [tab, setTab] = useState("settings");

  // LOAD DATA
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedEffect = localStorage.getItem("effect") || "sakura";

    setEffect(savedEffect);

    if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // THEME
  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";

    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  // EFFECT CHANGE (QUAN TRỌNG)
  const changeEffect = (value) => {
    setEffect(value);
    localStorage.setItem("effect", value);

    window.dispatchEvent(
      new CustomEvent("effect-change", {
        detail: value,
      })
    );
  };

  // BACKGROUND
  const changeBackground = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      localStorage.setItem("background", reader.result);

      document.body.style.backgroundImage = `url(${reader.result})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    };

    reader.readAsDataURL(file);
  };

  const resetBackground = () => {
    localStorage.removeItem("background");
    document.body.style.backgroundImage = "none";
    alert("Đã xóa hình nền.");
  };

  const resetData = () => {
    const ok = confirm("⚠️ Xóa toàn bộ dữ liệu?");
    if (!ok) return;

    localStorage.removeItem("moods");
    localStorage.removeItem("streakData");
    localStorage.removeItem("unlockedAchievements");

    window.location.reload();
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-8 border shadow-xl">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">⚙️ Cài đặt</h1>

      {/* TAB BUTTONS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTab("settings")}
          className={tab === "settings" ? "font-bold text-violet-500" : ""}
        >
          ⚙️ Settings
        </button>

        <button
          onClick={() => setTab("game")}
          className={tab === "game" ? "font-bold text-violet-500" : ""}
        >
          🎮 Trò chơi
        </button>
      </div>

      {/* SETTINGS TAB */}
      {tab === "settings" && (
        <div className="space-y-8">

          {/* THEME */}
          <div>
            <h2 className="font-bold mb-3">🎨 Giao diện</h2>

            <button
              onClick={toggleTheme}
              className="bg-violet-500 hover:bg-violet-600 text-white px-5 py-3 rounded-xl"
            >
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          {/* EFFECT */}
          <div>
            <h2 className="font-bold mb-3">✨ Hiệu ứng nền</h2>

            <select
              value={effect}
              onChange={(e) => changeEffect(e.target.value)}
              className="px-3 py-2 rounded-lg text-black"
            >
              <option value="sakura">🌸 Hoa anh đào</option>
              <option value="stars">🌠 Sao băng</option>
            </select>
          </div>

          {/* BACKGROUND */}
          <div>
            <h2 className="font-bold mb-3">🖼️ Hình nền</h2>

            <input type="file" accept="image/*" onChange={changeBackground} />

            <button
              onClick={resetBackground}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl"
            >
              Xóa hình nền
            </button>
          </div>

          {/* RESET */}
          <div>
            <h2 className="font-bold mb-3">🗑️ Dữ liệu</h2>

            <button
              onClick={resetData}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl"
            >
              Reset toàn bộ dữ liệu
            </button>
          </div>

        </div>
      )}

      {/* GAME TAB */}
      {tab === "game" && (
        <div className="space-y-6">

          <h2 className="text-xl font-bold">🎮 Trò chơi</h2>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
            <p>🏆 Level: 12</p>
            <p>⭐ XP: 2450</p>
            <p>🔥 Streak: 7 ngày</p>
          </div>

          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
            ▶️ Chơi ngay
          </button>

        </div>
      )}

    </div>
  );
}