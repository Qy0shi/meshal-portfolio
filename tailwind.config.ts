import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        c1: "var(--c1)",
        c2: "var(--c2)",
        c3: "var(--c3)",
        c4: "var(--c4)",
        c5: "var(--c5)",
        c6: "var(--c6)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "var(--font-geist-sans)",
          "-apple-system",
          "SF Pro Display",
          "system-ui",
        ],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
