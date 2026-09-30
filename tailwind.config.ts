import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-2": "#F1F5F9",
        ink: "#0F172A",
        "ink-2": "#1E293B",
        muted: "#475569",
        line: "#E2E8F0",
        "line-strong": "#CBD5E1",
        primary: {
          DEFAULT: "#1D58D8",
          dark: "#0F3DAA",
          soft: "#EFF6FF",
          track: "#1E40AF",
        },
        "on-primary-muted": "#DBEAFE",
        accent: {
          DEFAULT: "#D97706",
          soft: "#FEF3C7",
        },
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
