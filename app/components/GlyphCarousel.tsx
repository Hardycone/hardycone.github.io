"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import projects from "../../data/projects";
import { useSiteNavigation, wrapIndex } from "../context/SiteNavigationContext";
import { useTheme } from "next-themes";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import { useIsMdUp } from "@/hooks/useIsMdUp";
import AnimatedGlyph from "./AnimatedGlyph";
import KeyboardHint from "./KeyboardHint";
import { useKeyboardHints } from "../context/KeyboardHintsContext";
import { isTextEntryKeyboardTarget } from "@/lib/keyboard";

type NavigationDirection = -1 | 1;
type NavigationSource = "keyboard" | "touch" | "wheel";
type BufferedNavigation = {
  direction: NavigationDirection;
  source: NavigationSource;
};

export default function GlyphCarousel({
  navigationLocked = false,
  onProjectTransitionStart,
}: {
  navigationLocked?: boolean;
  onProjectTransitionStart: () => void;
}) {
  const { activeIndex, setActiveIndex, viewMode } = useSiteNavigation();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const { showKeyboardHints, flashShortcutHint } = useKeyboardHints();
  const { resolvedTheme } = useTheme();

  const isVisible = viewMode === "home";
  const isInteractive = isVisible && !navigationLocked;

  const { glyphLightShadow, glyphDarkShadow } = useMouseShadow();

  const glyphShadow =
    resolvedTheme === "dark" ? glyphDarkShadow : glyphLightShadow;

  const touchStartY = useRef<number | null>(null);
  const projectTransitionStarting = useRef(false);
  const bufferedNavigation = useRef<BufferedNavigation | null>(null);
  const lastScrollTime = useRef(0);
  const lastWheelEventTime = useRef(0);
  const wheelGestureCanBuffer = useRef(false);
  const wheelAccum = useRef(0);
  const ticking = useRef(false);

  const SCROLL_THRESHOLD = 10;
  const SCROLL_COOLDOWN = 500;
  const WHEEL_NEW_GESTURE_GAP = 120;

  const performProjectNavigation = useCallback(
    (direction: NavigationDirection, source: NavigationSource) => {
      projectTransitionStarting.current = true;
      onProjectTransitionStart();

      if (source === "keyboard") {
        flashShortcutHint(direction > 0 ? "down" : "up");
      }

      setActiveIndex((previousIndex) =>
        wrapIndex(previousIndex + direction, projects.length),
      );
      setPreviewIndex(null);

      if (source === "wheel") {
        lastScrollTime.current = Date.now();
      }
    },
    [flashShortcutHint, onProjectTransitionStart, setActiveIndex],
  );

  const requestProjectNavigation = useCallback(
    (direction: NavigationDirection, source: NavigationSource) => {
      if (!isVisible) return;

      if (!isInteractive || projectTransitionStarting.current) {
        // Keep only the latest intent. This makes controls feel responsive
        // without allowing multiple AnimatePresence exits to overlap.
        bufferedNavigation.current = { direction, source };
        return;
      }

      performProjectNavigation(direction, source);
    },
    [isInteractive, isVisible, performProjectNavigation],
  );

  useEffect(() => {
    if (navigationLocked) return;

    const buffered = bufferedNavigation.current;
    if (!isVisible || !buffered) {
      projectTransitionStarting.current = false;
      if (!isVisible) bufferedNavigation.current = null;
      return;
    }

    bufferedNavigation.current = null;
    projectTransitionStarting.current = true;

    // Reserve the next transition immediately, then begin it on the next
    // frame after AnimatePresence has finished removing the outgoing card.
    const frame = window.requestAnimationFrame(() => {
      performProjectNavigation(buffered.direction, buffered.source);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isVisible, navigationLocked, performProjectNavigation]);

  useEffect(() => {
    if (!isVisible) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      const startsNewGesture =
        now - lastWheelEventTime.current > WHEEL_NEW_GESTURE_GAP;
      const inputIsLocked = !isInteractive || projectTransitionStarting.current;

      if (startsNewGesture) {
        wheelAccum.current = 0;
        wheelGestureCanBuffer.current = inputIsLocked;
      }
      lastWheelEventTime.current = now;

      if (!inputIsLocked && now - lastScrollTime.current < SCROLL_COOLDOWN) {
        return;
      }

      wheelAccum.current += e.deltaY;
      const direction: NavigationDirection = wheelAccum.current > 0 ? 1 : -1;
      const candidateIndex = wrapIndex(
        activeIndex + direction,
        projects.length,
      );

      if (!ticking.current) {
        ticking.current = true;

        requestAnimationFrame(() => {
          if (Math.abs(wheelAccum.current) >= SCROLL_THRESHOLD) {
            if (!inputIsLocked || wheelGestureCanBuffer.current) {
              requestProjectNavigation(direction, "wheel");
            }
            wheelGestureCanBuffer.current = false;
          } else if (!inputIsLocked) {
            setPreviewIndex(candidateIndex);
          }

          wheelAccum.current = 0;
          ticking.current = false;
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
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

      requestProjectNavigation(direction, "keyboard");
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
        const direction: NavigationDirection = deltaY > 0 ? -1 : 1;
        requestProjectNavigation(direction, "touch");
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
  }, [activeIndex, isInteractive, isVisible, requestProjectNavigation]);

  const isMdUp = useIsMdUp();
  const yOffset = isMdUp ? -80 - activeIndex * 200 : -24 - activeIndex * 64;

  if (viewMode === "not-found") return null;

  return (
    <motion.div
      className="flex flex-col items-end gap-4 px-2 pt-[calc(50svh+2rem)] md:gap-10 md:px-6 lg:px-8 xl:px-10 supertall:pt-[calc(50svh+3rem)] superwide:pt-[calc(50svh)]"
      initial={false}
      animate={{
        y: yOffset,
        x: isVisible ? 0 : -300,
        opacity: isVisible ? 1 : 0,
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
          <motion.div
            key={project.id}
            animate={{
              scale,
            }}
            style={{ boxShadow: isActive ? glyphShadow : "none" }}
            transition={{ type: "tween", stiffness: 500, damping: 20 }}
            className="relative h-12 w-12 rounded-full md:h-40 md:w-40"
          >
            <motion.button
              type="button"
              tabIndex={isInteractive && isNearby ? 0 : -1}
              disabled={!isInteractive}
              aria-hidden={!isInteractive}
              className={`relative h-full w-full cursor-pointer touch-manipulation select-none overflow-hidden rounded-full bg-background p-0.5 dark:bg-dark-background md:p-0 ${index === 0 ? "glyph-one" : index === 2 ? "glyph-three" : ""}`}
              onClick={() => {
                if (
                  isInteractive &&
                  index !== activeIndex &&
                  !projectTransitionStarting.current
                ) {
                  projectTransitionStarting.current = true;
                  onProjectTransitionStart();
                  setActiveIndex(index);
                  setPreviewIndex(null);
                }
              }}
            >
              <AnimatedGlyph
                animationData={project.glyphAnimation}
                isActive={isActive}
                shouldAnimate={isMdUp}
                colorPalette={index === 2 ? "glyph-three" : undefined}
              />
            </motion.button>
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
          </motion.div>
        );
      })}
    </motion.div>
  );
}
