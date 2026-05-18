import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm:   ["DM Sans", "sans-serif"],
      },
      colors: {
        accent:  "#6c5ce7",
        accent2: "#e84393",
        splitt: {
          bg:      "#f3f1ff",
          surface: "#ffffff",
          surface2:"#ede9ff",
          border:  "#ddd8f5",
          text:    "#1a1730",
          muted:   "#7b72a8",
        },
      },
      boxShadow: {
        glass:      "0 8px 32px rgba(108,92,231,0.12)",
        accent:     "0 4px 18px rgba(108,92,231,0.35)",
        "accent-lg":"0 8px 32px rgba(108,92,231,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;