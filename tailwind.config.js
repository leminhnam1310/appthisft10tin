/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: "var(--primary)",
        secondary: "var(--secondary)",

        border: "var(--border)",
        muted: "var(--muted)",

        card: "var(--card)",
        accent: "var(--accent)",

        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },

      borderRadius: {
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },

      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,.08)",
        glow: "0 0 30px rgba(99,102,241,.25)",
      },

      transitionDuration: {
        400: "400ms",
      },
    },
  },

  plugins: [],
};