"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { type Ref, useEffect, useId, useRef, useState } from "react";
import { useCanHover } from "@/hooks/useCanHover";

const iconColors = {
  light: "#27272a",
  transition: "#ffc600",
  dark: "#f4f4f5",
};

const colorTransitionDurationMs = 1050;
const siteThemeTransitionDurationMs = 300;
const cursorShadowRestoreDurationMs = 150;

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

interface ThemeToggleProps {
  buttonRef?: Ref<HTMLButtonElement>;
}

export default function ThemeToggle({ buttonRef }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const canHover = useCanHover();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isColorTransitioning, setIsColorTransitioning] = useState(false);
  const colorTransitionTimeout = useRef<number | null>(null);
  const siteThemeTransitionTimeout = useRef<number | null>(null);
  const cursorShadowRestoreTimeout = useRef<number | null>(null);
  const siteThemeTransitionFrame = useRef<number | null>(null);

  // Ensure client-only rendering to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!canHover) setIsHovered(false);
  }, [canHover]);

  useEffect(() => {
    return () => {
      if (colorTransitionTimeout.current) {
        window.clearTimeout(colorTransitionTimeout.current);
      }
      if (siteThemeTransitionTimeout.current) {
        window.clearTimeout(siteThemeTransitionTimeout.current);
      }
      if (cursorShadowRestoreTimeout.current) {
        window.clearTimeout(cursorShadowRestoreTimeout.current);
      }
      if (siteThemeTransitionFrame.current) {
        window.cancelAnimationFrame(siteThemeTransitionFrame.current);
      }
      document.documentElement.classList.remove(
        "theme-transitioning",
        "theme-shadow-restoring",
      );
    };
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const iconColor =
    isColorTransitioning || isHovered
      ? iconColors.transition
      : isDark
        ? iconColors.dark
        : iconColors.light;

  const toggleTheme = () => {
    if (colorTransitionTimeout.current) {
      window.clearTimeout(colorTransitionTimeout.current);
    }
    if (siteThemeTransitionTimeout.current) {
      window.clearTimeout(siteThemeTransitionTimeout.current);
    }
    if (cursorShadowRestoreTimeout.current) {
      window.clearTimeout(cursorShadowRestoreTimeout.current);
    }
    if (siteThemeTransitionFrame.current) {
      window.cancelAnimationFrame(siteThemeTransitionFrame.current);
    }

    setIsColorTransitioning(true);
    document.documentElement.classList.remove("theme-shadow-restoring");
    document.documentElement.classList.add("theme-transitioning");

    // Give the browser one frame to register the transition properties before
    // next-themes swaps the root class and changes all theme colors.
    siteThemeTransitionFrame.current = window.requestAnimationFrame(() => {
      setTheme(isDark ? "light" : "dark");
      siteThemeTransitionFrame.current = null;

      siteThemeTransitionTimeout.current = window.setTimeout(() => {
        const root = document.documentElement;
        root.classList.remove("theme-transitioning");
        root.classList.add("theme-shadow-restoring");
        siteThemeTransitionTimeout.current = null;

        cursorShadowRestoreTimeout.current = window.setTimeout(() => {
          root.classList.remove("theme-shadow-restoring");
          cursorShadowRestoreTimeout.current = null;
        }, cursorShadowRestoreDurationMs);
      }, siteThemeTransitionDurationMs);
    });

    colorTransitionTimeout.current = window.setTimeout(() => {
      setIsColorTransitioning(false);
      colorTransitionTimeout.current = null;
    }, colorTransitionDurationMs);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      tabIndex={0}
      onClick={toggleTheme}
      onPointerEnter={(event) => {
        if (canHover && event.pointerType !== "touch") {
          setIsHovered(true);
        }
      }}
      onPointerLeave={(event) => {
        if (canHover && event.pointerType !== "touch") {
          setIsHovered(false);
        }
      }}
      onPointerUp={(event) => event.currentTarget.blur()}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="h-full w-full rounded-full p-2"
    >
      <AnimatedThemeIcon isDark={isDark} color={iconColor} />
    </button>
  );
}
