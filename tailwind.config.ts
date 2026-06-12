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
        /(text|bg|border|from|to)-(intro|flux|fantail|suits|wolcott|chinatown)(-secondary)?/,
      variants: ["dark"], // Safelists dark:text-dark-flux, etc.
    },
    {
      pattern:
        /(text|bg|border|from|to)-dark-(intro|flux|fantail|suits|wolcott|chinatown)(-secondary)?/,
      variants: ["dark"],
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-bricolage-grotesque)", "sans-serif"],
        serif: ["var(--font-domine)", "serif"],
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
        tall: { raw: "(max-aspect-ratio:1/1)" },
        supertall: { raw: "(max-aspect-ratio:2/3)" },
        wide: { raw: "(min-aspect-ratio:4/3)" },
        superwide: { raw: "(min-aspect-ratio:2.7)" },
      },
      borderRadius: {
        0.5: "0.125rem",
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        4.5: "1.125rem",
        5: "1.25rem",
        5.5: "1.375rem",
        6: "1.5rem",
        6.5: "1.625rem",
        7: "1.75rem",
        7.5: "1.875rem",
        8: "2rem",
        8.5: "2.125rem",
        9: "2.25rem",
        9.5: "2.375rem",
        10: "2.5rem",
        10.5: "2.625rem",
        11: "2.75rem",
        11.5: "2.875rem",
        12: "3rem",
      },
    },
  },
  plugins: [
    // 2. Use the imported variable here
    containerQueries,
  ],
} satisfies Config;
