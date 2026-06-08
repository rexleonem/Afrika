import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        pearl: "#F5F1EA",
        mist: "#D9D6CF"
      }
    }
  }
};

export default config;
