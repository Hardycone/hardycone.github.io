import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-background",
    "bg-flux",
    "bg-fantail",
    "bg-suits",
    "bg-wolcott",
    "bg-chinatown",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jost)", "sans-serif"],
        serif: ["var(--font-merriweather)", "serif"],
      },
      colors: {
        background: colors.zinc[100],
        foreground: colors.zinc[900],
        chinatown: colors.red[50],
        wolcott: colors.green[50],
        fantail: colors.yellow[50],
        suits: colors.blue[50],
        flux: colors.purple[50],

        dark: {
          background: colors.zinc[900],
          backgroundSecondary: colors.zinc[700],
          foreground: colors.zinc[100],
          foregroundSecondary: colors.zinc[200],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
