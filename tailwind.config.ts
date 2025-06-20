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
    "text-intro",
    "text-flux",
    "text-fantail",
    "text-suits",
    "text-wolcott",
    "text-chinatown",
    "text-dark-intro",
    "text-dark-flux",
    "text-dark-fantail",
    "text-dark-suits",
    "text-dark-wolcott",
    "text-dark-chinatown",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jost)", "sans-serif"],
        serif: ["var(--font-besley)", "serif"],
      },
      colors: {
        foreground: colors.zinc[800],
        background: colors.zinc[100],
        light: colors.white,
        intro: colors.zinc[900],
        introBackground: "#ededf0",
        introLight: colors.zinc[50],
        chinatown: colors.red[500],
        chinatownBackground: "#ededf0",
        chinatownLight: colors.red[50],
        wolcott: colors.green[500],
        wolcottBackground: "#ededf0",
        wolcottLight: colors.green[50],
        fantail: colors.yellow[500],
        fantailBackground: "#ededf0",
        fantailLight: colors.yellow[50],
        suits: colors.blue[500],
        suitsBackground: "#ededf0",
        suitsLight: colors.blue[50],
        flux: colors.purple[700],
        fluxBackground: "#ededf0",
        fluxLight: colors.purple[50],

        dark: {
          foreground: colors.zinc[100],
          background: colors.zinc[900],
          light: colors.white,
          intro: colors.zinc[100],
          introBackground: colors.zinc[900],
          introLight: colors.zinc[50],
          chinatown: colors.red[300],
          chinatownBackground: colors.zinc[900],
          chinatownLight: colors.red[50],
          wolcott: colors.green[300],
          wolcottBackground: colors.zinc[900],
          wolcottLight: colors.green[50],
          fantail: colors.yellow[300],
          fantailBackground: colors.zinc[900],
          fantailLight: colors.yellow[50],
          suits: colors.blue[300],
          suitsBackground: colors.zinc[900],
          suitsLight: colors.blue[50],
          flux: colors.purple[300],
          fluxBackground: colors.zinc[900],
          fluxLight: colors.purple[50],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
