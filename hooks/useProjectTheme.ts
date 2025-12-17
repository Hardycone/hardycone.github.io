import { useTheme } from "next-themes";
import { PALETTE } from "@/lib/palette";

// Helper to define valid project keys (excluding 'base')
type ProjectKey = keyof Omit<typeof PALETTE, "base">;

export const useProjectTheme = (projectKey: string) => {
  const { resolvedTheme } = useTheme();

  // 1. Validation
  // If the key passed in (e.g. from URL) isn't in our palette, fallback to 'intro'.
  // We also explicitly exclude 'base' to keep TypeScript happy.
  const key = (
    projectKey in PALETTE && projectKey !== "base" ? projectKey : "intro"
  ) as ProjectKey;

  // 2. Class Name Generators (Replaces getTextColorClass / getBgColorClass)
  // These strings leverage the Tailwind config we just set up.
  // Example result: "text-flux dark:text-dark-flux"
  const classes = {
    // Primary Colors
    textColorClass: `text-${key} dark:text-dark-${key}`,
    bgColorClass: `bg-${key} dark:bg-dark-${key}`, // Strong background (e.g. Buttons)
    borderColorClass: `border-${key} dark:border-dark-${key}`,

    // Secondary Colors (New functionality you wanted)
    textSecondaryColorClass: `text-${key}-secondary dark:text-dark-${key}-secondary`,
    bgSecondaryColorClass: `bg-${key}-secondary dark:bg-dark-${key}-secondary`,
    borderSecondaryColorClass: `border-${key}-secondary dark:border-dark-${key}-secondary`,

    // Soft Backgrounds (The 20% opacity look)
    bgSoftColorClass: `bg-${key}-soft dark:bg-dark-${key}-soft`,
  };

  // 3. Raw Hex Values (For Framer Motion)
  // Replaces the need to look up colors manually in components
  const isDark = resolvedTheme === "dark";
  const paletteGroup = PALETTE[key];

  const hex = {
    primary: isDark ? paletteGroup.dark.primary : paletteGroup.light.primary,
    secondary: isDark
      ? paletteGroup.dark.secondary
      : paletteGroup.light.secondary,
    soft: isDark ? paletteGroup.dark.soft : paletteGroup.light.soft,
    background: isDark ? PALETTE.base.darkBackground : PALETTE.base.background,
    foreground: isDark ? PALETTE.base.darkForeground : PALETTE.base.foreground,
  };

  return { ...classes, hex };
};
