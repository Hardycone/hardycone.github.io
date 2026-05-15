"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";

const iconColors = {
  light: "#27272a",
  transition: "#ffc600",
  dark: "#f4f4f5",
};

const colorTransitionDurationMs = 1050;

const rayPositions = Array.from({ length: 8 }, (_, index) => {
  const angle = (index * Math.PI) / 4;
  return {
    cx: 12 + Math.cos(angle) * 10,
    cy: 12 + Math.sin(angle) * 10,
  };
});

function AnimatedThemeIcon({
  isDark,
  color,
}: {
  isDark: boolean;
  color: string;
}) {
  const maskId = useId().replace(/:/g, "");
  const ease = [0.22, 1, 0.36, 1] as const;
  const rayTransition = isDark
    ? { duration: 0.6, ease: "easeInOut" }
    : { delay: 0.4, duration: 0.6, ease };
  const bodyTransition = isDark
    ? { delay: 0.6, duration: 0.4, ease }
    : { duration: 0.4, ease: "easeInOut" };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full fill-current"
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      initial={false}
      animate={{ color }}
      transition={{ color: { duration: 0.25, ease: "easeInOut" } }}
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="white" />
          <motion.circle
            initial={false}
            animate={{
              cx: isDark ? 16 : 19,
              cy: isDark ? 9 : 5,
              r: isDark ? 5 : 0,
            }}
            transition={bodyTransition}
            fill="black"
          />
        </mask>
      </defs>

      {rayPositions.map((ray, index) => (
        <motion.circle
          key={index}
          cx={ray.cx}
          cy={ray.cy}
          initial={false}
          animate={{
            r: isDark ? 0 : 1.25,
          }}
          transition={rayTransition}
        />
      ))}

      <motion.circle
        cx="12"
        cy="12"
        initial={false}
        animate={{ r: isDark ? 8 : 6 }}
        transition={bodyTransition}
        mask={`url(#${maskId})`}
      />
    </motion.svg>
  );
}

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isColorTransitioning, setIsColorTransitioning] = useState(false);
  const colorTransitionTimeout = useRef<number | null>(null);

  // Ensure client-only rendering to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      if (colorTransitionTimeout.current) {
        window.clearTimeout(colorTransitionTimeout.current);
      }
    };
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const iconColor = isColorTransitioning
    ? iconColors.transition
    : isDark
      ? iconColors.dark
      : iconColors.light;

  const toggleTheme = () => {
    if (colorTransitionTimeout.current) {
      window.clearTimeout(colorTransitionTimeout.current);
    }

    setIsColorTransitioning(true);
    setTheme(isDark ? "light" : "dark");

    colorTransitionTimeout.current = window.setTimeout(() => {
      setIsColorTransitioning(false);
      colorTransitionTimeout.current = null;
    }, colorTransitionDurationMs);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="h-full w-full rounded-full p-2"
    >
      <AnimatedThemeIcon isDark={isDark} color={iconColor} />
    </button>
  );
}
