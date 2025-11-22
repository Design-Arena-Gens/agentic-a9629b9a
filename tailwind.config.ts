import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "#1e293b",
          subtle: "#27334d"
        },
        accent: {
          DEFAULT: "#38bdf8",
          soft: "#0ea5e9"
        },
        income: "#10b981",
        expense: "#f87171"
      }
    }
  },
  plugins: []
};

export default config;
