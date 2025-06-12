import lineClamp from "@tailwindcss/line-clamp";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jost)", "sans-serif"],
        serif: ["var(--font-merriweather)", "serif"],
      },
      colors: {
        background: colors.zinc[50],
        foreground: colors.zinc[900],
      },
    },
  },
  plugins: [lineClamp],
} satisfies Config;
