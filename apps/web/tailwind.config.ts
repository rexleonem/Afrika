import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        pearl: "#F5F1EA",
        gold: "#C89B5C",
        mist: "#D9D6CF"
      },
      boxShadow: {
        glow: "0 30px 80px rgba(200, 155, 92, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
