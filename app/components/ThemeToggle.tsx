"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";

const rayPositions = Array.from({ length: 8 }, (_, index) => {
  const angle = (index * Math.PI) / 4;
  return {
    cx: 12 + Math.cos(angle) * 10,
    cy: 12 + Math.sin(angle) * 10,
  };
});

function AnimatedThemeIcon({ isDark }: { isDark: boolean }) {
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
      transition={bodyTransition}
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

  // Ensure client-only rendering to avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="p-2"
    >
      <AnimatedThemeIcon isDark={isDark} />
    </button>
  );
}
