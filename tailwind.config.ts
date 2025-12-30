import type { Config } from "tailwindcss";
import { PALETTE } from "./lib/palette";
import containerQueries from "@tailwindcss/container-queries";

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
        /(text|bg|border)-(intro|flux|fantail|suits|wolcott|chinatown)(-secondary)?/,
      variants: ["dark"], // Safelists dark:text-dark-flux, etc.
    },
    {
      pattern:
        /(text|bg|border)-dark-(intro|flux|fantail|suits|wolcott|chinatown)(-secondary)?/,
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
        // 1. Base UI
        foreground: PALETTE.base.foreground,
        background: PALETTE.base.background,

        // 2. Project Colors (Light Mode)
        // usage: text-flux (primary), text-flux-secondary, bg-flux-soft
        intro: PALETTE.intro.light.primary,
        "intro-secondary": PALETTE.intro.light.secondary,
        "intro-soft": PALETTE.intro.light.soft,

        flux: PALETTE.flux.light.primary,
        "flux-secondary": PALETTE.flux.light.secondary,
        "flux-soft": PALETTE.flux.light.soft,

        fantail: PALETTE.fantail.light.primary,
        "fantail-secondary": PALETTE.fantail.light.secondary,
        "fantail-soft": PALETTE.fantail.light.soft,

        suits: PALETTE.suits.light.primary,
        "suits-secondary": PALETTE.suits.light.secondary,
        "suits-soft": PALETTE.suits.light.soft,

        wolcott: PALETTE.wolcott.light.primary,
        "wolcott-secondary": PALETTE.wolcott.light.secondary,
        "wolcott-soft": PALETTE.wolcott.light.soft,

        chinatown: PALETTE.chinatown.light.primary,
        "chinatown-secondary": PALETTE.chinatown.light.secondary,
        "chinatown-soft": PALETTE.chinatown.light.soft,

        // 3. Dark Mode Specifics (prefixed with 'dark-')
        dark: {
          foreground: PALETTE.base.darkForeground,
          background: PALETTE.base.darkBackground,

          intro: PALETTE.intro.dark.primary,
          "intro-secondary": PALETTE.intro.dark.secondary,
          "intro-soft": PALETTE.intro.dark.soft,

          flux: PALETTE.flux.dark.primary,
          "flux-secondary": PALETTE.flux.dark.secondary,
          "flux-soft": PALETTE.flux.dark.soft,

          fantail: PALETTE.fantail.dark.primary,
          "fantail-secondary": PALETTE.fantail.dark.secondary,
          "fantail-soft": PALETTE.fantail.dark.soft,

          suits: PALETTE.suits.dark.primary,
          "suits-secondary": PALETTE.suits.dark.secondary,
          "suits-soft": PALETTE.suits.dark.soft,

          wolcott: PALETTE.wolcott.dark.primary,
          "wolcott-secondary": PALETTE.wolcott.dark.secondary,
          "wolcott-soft": PALETTE.wolcott.dark.soft,

          chinatown: PALETTE.chinatown.dark.primary,
          "chinatown-secondary": PALETTE.chinatown.dark.secondary,
          "chinatown-soft": PALETTE.chinatown.dark.soft,
        },
      },
      screens: {
        tall: { raw: "(max-aspect-ratio:3/4)" },
        short: { raw: "(min-aspect-ratio:4/3)" },
      },
    },
  },
  plugins: [
    // 2. Use the imported variable here
    containerQueries,
  ],
} satisfies Config;
