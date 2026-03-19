import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme (black/white) with gold accent
        surface: "#000000",
        panel: "#0B0B0D",
        panel2: "#101014",
        navy: "#0B0B0D",
        gold: "#C6A96B",
        "gold-hover": "#E2C48D",
        "gold/10": "rgba(198, 169, 107, 0.12)",
        "gold/20": "rgba(198, 169, 107, 0.2)",
        "navy/05": "rgba(255, 255, 255, 0.06)",
        "navy/10": "rgba(255, 255, 255, 0.1)",
        "navy/80": "rgba(255, 255, 255, 0.85)",
        slate: "#F5F7FA",
        muted: "#A1A1AA",
        "muted-light": "#D4D4D8",
        cream: "#0F0F12",
        "cream/30": "rgba(255, 255, 255, 0.06)",
        success: "#22C55E",
        "input-bg": "#0F0F12",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        badge: "4px",
        "hero": "24px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "card-strong": "0 1px 3px 0 rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
