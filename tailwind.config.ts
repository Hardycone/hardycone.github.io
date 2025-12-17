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
    {
      pattern:
        /(text|bg)-(intro|flux|fantail|suits|wolcott|chinatown)(-secondary)?/,
      variants: ["dark"], // Safelists dark:text-dark-flux, etc.
    },
    {
      pattern:
        /(text|bg)-dark-(intro|flux|fantail|suits|wolcott|chinatown)(-secondary)?/,
      variants: ["dark"],
    },
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
        introBackground: colors.zinc[900],
        introLight: colors.zinc[50],
        chinatown: colors.red[600],
        chinatownBackground: colors.red[600],
        chinatownLight: colors.red[50],
        wolcott: colors.green[600],
        wolcottBackground: colors.green[600],
        wolcottLight: colors.green[50],
        fantail: colors.yellow[600],
        fantailBackground: colors.yellow[600],
        fantailLight: colors.yellow[50],
        suits: colors.blue[600],
        suitsBackground: colors.blue[600],
        suitsLight: colors.blue[50],
        flux: colors.purple[600],
        fluxBackground: colors.purple[600],
        fluxLight: colors.purple[50],

        dark: {
          foreground: colors.zinc[100],
          background: colors.zinc[900],
          light: colors.white,
          intro: colors.zinc[100],
          introBackground: colors.zinc[100],
          introLight: colors.zinc[50],
          chinatown: colors.red[300],
          chinatownBackground: colors.red[300],
          chinatownLight: colors.red[50],
          wolcott: colors.green[300],
          wolcottBackground: colors.green[300],
          wolcottLight: colors.green[50],
          fantail: colors.yellow[300],
          fantailBackground: colors.yellow[300],
          fantailLight: colors.yellow[50],
          suits: colors.blue[300],
          suitsBackground: colors.blue[300],
          suitsLight: colors.blue[50],
          flux: colors.purple[300],
          fluxBackground: colors.purple[300],
          fluxLight: colors.purple[50],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
