// lib/palette.ts

export interface ProjectColorPalette {
  primary: string;
  secondary: string;
  soft: string; // This is your "20% opacity" background look
}

export const PALETTE = {
  // Base UI Colors
  base: {
    background: "#f4f4f5", // zinc-100
    foreground: "#27272a", // zinc-800
    darkBackground: "#18181b", // zinc-900
    darkForeground: "#f4f4f5", // zinc-100
  },

  // Project: Intro (Zinc/Grayscale)
  intro: {
    light: {
      primary: "#18181b", // zinc-900
      secondary: "#a8a29e", // stone-400
      soft: "#f4f4f5", // zinc-100
    },
    dark: {
      primary: "#f4f4f5", // zinc-100
      secondary: "#a8a29e", // stone-400
      soft: "#27272a", // zinc-800 (Dark grey for background)
    },
  },

  // Project: Flux (Purple)
  flux: {
    light: {
      primary: "#9333ea", // purple-600
      secondary: "#f0abfc", // fuchsia-300
      soft: "#faf5ff", // purple-50 (Very light purple)
    },
    dark: {
      primary: "#d8b4fe", // purple-300
      secondary: "#c026d3", // fuchsia-600
      soft: "#581c87", // purple-900 (Deep purple for background)
    },
  },

  // Project: Fantail (Yellow)
  fantail: {
    light: {
      primary: "#ca8a04", // yellow-600
      secondary: "#fdba74", // orange-300
      soft: "#fefce8", // yellow-50
    },
    dark: {
      primary: "#fde047", // yellow-300
      secondary: "#ea580c", // orange-600
      soft: "#713f12", // yellow-900
    },
  },

  // Project: Suits (Blue)
  suits: {
    light: {
      primary: "#2563eb", // blue-600
      secondary: "#a5b4fc", // indigo-300
      soft: "#eff6ff", // blue-50
    },
    dark: {
      primary: "#93c5fd", // blue-300
      secondary: "#4f46e5", // indigo-600
      soft: "#1e3a8a", // blue-900
    },
  },

  // Project: Wolcott (Green)
  wolcott: {
    light: {
      primary: "#16a34a", // green-600
      secondary: "#bef264", // lime-300
      soft: "#f0fdf4", // green-50
    },
    dark: {
      primary: "#86efac", // green-300
      secondary: "#65a30d", // lime-600
      soft: "#14532d", // green-900
    },
  },

  // Project: Chinatown (Red)
  chinatown: {
    light: {
      primary: "#dc2626", // red-600
      secondary: "#f9a8d4", // pink-300
      soft: "#fef2f2", // red-50
    },
    dark: {
      primary: "#fca5a5", // red-300
      secondary: "#db2777", // pink-600
      soft: "#7f1d1d", // red-900
    },
  },
} as const;
