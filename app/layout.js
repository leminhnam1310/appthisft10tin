import localFont from "next/font/local";
import "./globals.css";

import BackgroundEffects from "@/components/BackgroundEffects";
import BearScene from "@/components/BearScene";
import ThemeLoader from "@/components/ThemeLoader";
import FloatingRobot from "@/components/FloatingRobot";
import PrivacyGate from "@/components/PrivacyGate";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "11TIN",
  description: "Psychological Care",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body
        id="app-body"
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          relative
        `}
      >
        {/* 🌗 theme system */}
        <ThemeLoader />

        {/* 🌌 background layer */}
        <BackgroundEffects />

        {/* 🐻 bear AI (low priority layer) */}
        <BearScene />

        {/* 📦 main content */}
        {children}

        {/* 🔐 privacy overlay (PHẢI TRÊN TẤT CẢ) */}
        <PrivacyGate />

        {/* 🤖 robot global (after consent) */}
        <FloatingRobot />
      </body>
    </html>
  );
}