"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import projects from "../../data/projects";
import { useActiveProject, wrapIndex } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import { useTheme } from "next-themes";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import { useIsMdUp } from "@/hooks/useIsMdUp";
import AnimatedGlyph from "./AnimatedGlyph";
import KeyboardHint from "./KeyboardHint";
import { useKeyboardHints } from "../context/KeyboardHintsContext";
import { isTextEntryKeyboardTarget } from "@/lib/keyboard";

export default function GlyphCarousel() {
  const { activeIndex, setActiveIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const [hasMounted, setHasMounted] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const { showKeyboardHints, flashShortcutHint } = useKeyboardHints();
  const { resolvedTheme } = useTheme();

  const isInteractive = viewMode === "home";

  const { glyphLightShadow, glyphDarkShadow } = useMouseShadow();

  const glyphShadow =
    resolvedTheme === "dark" ? glyphDarkShadow : glyphLightShadow;

  const touchStartY = useRef<number | null>(null);
  const keyboardLocked = useRef(false);
  const lastScrollTime = useRef(0);
  const wheelAccum = useRef(0);
  const ticking = useRef(false);

  const SCROLL_THRESHOLD = 10;
  const SCROLL_COOLDOWN = 500;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isInteractive) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;

      wheelAccum.current += e.deltaY;
      const direction = wheelAccum.current > 0 ? 1 : -1;
      const candidateIndex = wrapIndex(
        activeIndex + direction,
        projects.length,
      );

      if (!ticking.current) {
        ticking.current = true;

        requestAnimationFrame(() => {
          if (Math.abs(wheelAccum.current) >= SCROLL_THRESHOLD) {
            setActiveIndex(candidateIndex);
            setPreviewIndex(null);
            lastScrollTime.current = Date.now(); // only cool down after committing
          } else {
            setPreviewIndex(candidateIndex);
          }

          wheelAccum.current = 0;
          ticking.current = false;
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        keyboardLocked.current ||
        e.repeat ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        isTextEntryKeyboardTarget(e.target)
      ) {
        return;
      }

      const direction =
        e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
      if (!direction) return;

      flashShortcutHint(direction > 0 ? "down" : "up");
      setActiveIndex((prev) => wrapIndex(prev + direction, projects.length));
      setPreviewIndex(null);

      keyboardLocked.current = true;
      setTimeout(() => {
        keyboardLocked.current = false;
      }, 300);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - touchStartY.current;
      const threshold = 20;

      if (Math.abs(deltaY) > threshold) {
        const direction = deltaY > 0 ? -1 : 1;
        setActiveIndex((prev) => wrapIndex(prev + direction, projects.length));
        setPreviewIndex(null);
      }

      touchStartY.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isInteractive, activeIndex, setActiveIndex, flashShortcutHint]);

  const isMdUp = useIsMdUp();
  const yOffset = isMdUp ? -80 - activeIndex * 200 : -24 - activeIndex * 64;

  if (!hasMounted || viewMode === "not-found") return null;

  return (
    <motion.div
      className="flex flex-col items-end gap-4 px-2 pt-[calc(50svh+2rem)] md:gap-10 md:px-6 lg:px-8 xl:px-10 supertall:pt-[calc(50svh+3rem)] superwide:pt-[calc(50svh)]"
      initial={false}
      animate={{
        y: yOffset,
        x: isInteractive ? 0 : -300,
        opacity: isInteractive ? 1 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ pointerEvents: isInteractive ? "auto" : "none" }}
    >
      {projects.map((project, index) => {
        const isActive = index === activeIndex;
        const isPreview = index === previewIndex;

        const scale = isMdUp
          ? isActive
            ? 1
            : isPreview
              ? 0.6
              : 0.5
          : isActive
            ? 1
            : 0.75;

        const isNearby = Math.abs(index - activeIndex) <= 1;

        return (
          <motion.button
            type="button"
            tabIndex={isInteractive && isNearby ? 0 : -1}
            disabled={!isInteractive}
            aria-hidden={!isInteractive}
            key={project.id}
            animate={{
              scale,
            }}
            style={{ boxShadow: isActive ? glyphShadow : "none" }}
            transition={{ type: "tween", stiffness: 500, damping: 20 }}
            className="relative h-12 w-12 cursor-pointer touch-manipulation select-none rounded-full bg-background p-0.5 dark:bg-dark-background md:h-40 md:w-40 md:p-0"
            onClick={() => isInteractive && setActiveIndex(index)}
          >
            <AnimatedGlyph
              animationData={project.glyphAnimation}
              isActive={isActive}
              shouldAnimate={isMdUp}
            />
            <AnimatePresence>
              {isInteractive && isActive && showKeyboardHints && (
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-[2rem] md:gap-[8.5rem]"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: 0.3, duration: 0.2, ease: "easeOut" },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                >
                  <KeyboardHint shortcut="up">↑</KeyboardHint>
                  <KeyboardHint shortcut="down">↓</KeyboardHint>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
