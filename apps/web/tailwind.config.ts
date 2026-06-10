import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light mode
        "ivory": "#F7F4EE",
        "sand": "#EFE8DC",
        "earth-gold": "#C89B5E",
        "deep-clay": "#A66A4C",
        "forest-green": "#4E6A5E",
        "sunset-bronze": "#B77B57",
        "ink": "#161616",
        "ink-secondary": "#5E5A54",
        "ink-muted": "#8A837A",
        // Dark mode
        "night": "#0F0F10",
        "night-secondary": "#171719",
        "night-surface": "#1F1F22",
        "gold-accent": "#D2A66D",
        "clay-accent": "#C17B58",
        "forest-accent": "#6D8B7D",
        "warm-glow": "#E3B07A",
        "pearl": "#F6F1E8",
        "pearl-secondary": "#CFC7BC",
        "pearl-muted": "#8E877E",
        // Legacy
        "gold": "#C89B5C",
        "mist": "#D9D6CF",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Avenir Next", "Segoe UI", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 30px 80px rgba(200, 155, 92, 0.18)",
        "glow-sm": "0 10px 40px rgba(200, 155, 92, 0.12)",
        "glow-lg": "0 40px 120px rgba(200, 155, 92, 0.22)",
        "card": "0 24px 80px rgba(0,0,0,0.28)",
        "card-dark": "0 28px 100px rgba(0,0,0,0.45)",
        "panel": "0 8px 32px rgba(0,0,0,0.12)",
        "panel-dark": "0 24px 100px rgba(0,0,0,0.35)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "reveal-up": "reveal-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.5s ease forwards",
        "slide-in-left": "slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "ticker": "ticker 30s linear infinite",
        "ping-slow": "ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
