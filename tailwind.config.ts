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
        bg: "#F6F4EF",
        surface: "#FFFFFF",
        "surface-2": "#F1EEE6",
        ink: "#1B2330",
        "ink-2": "#2E3847",
        muted: "#4A5563",
        line: "#E4E0D6",
        "line-strong": "#D9D4C7",
        primary: {
          DEFAULT: "#0E6B5A",
          dark: "#0A4F43",
          soft: "#E6F2EF",
          track: "#0A4F43",
        },
        "on-primary-muted": "#D6EFE8",
        accent: {
          DEFAULT: "#B4501F",
          soft: "#F2B38A",
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
