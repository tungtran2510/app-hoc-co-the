import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg, #F5F6FA)",
        surface: "var(--color-surface, #FFFFFF)",
        "surface-2": "var(--color-surface-2, #EDEBF5)",
        ink: "var(--color-ink, #0F0A1C)",
        "ink-2": "var(--color-ink-2, #382B56)",
        muted: "var(--color-muted, #6B5D88)",
        line: "var(--color-line, #E2E4F0)",
        "line-strong": "var(--color-line-strong, #C9CCE0)",
        primary: {
          DEFAULT: "var(--color-primary, #7C3AED)",
          dark: "var(--color-primary-dark, #6D28D9)",
          soft: "var(--color-primary-soft, #EDE9FE)",
          track: "var(--color-primary-track, #DDD6FE)",
        },
        "on-primary-muted": "var(--color-on-primary-muted, #6D28D9)",
        accent: {
          DEFAULT: "#F8DF7B",
          soft: "#3D3012",
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
