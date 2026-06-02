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

function isEditableKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();

  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    tagName === "button" ||
    tagName === "a"
  );
}

function KeyboardHint({
  children,
  isPressed = false,
}: {
  children: string;
  isPressed?: boolean;
}) {
  return (
    <motion.span
      animate={{ scale: isPressed ? 0.9 : 1 }}
      transition={{ duration: 0.08, ease: "easeOut" }}
      className="pointer-events-none flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 font-sans text-xs font-semibold text-background dark:bg-sky-400 dark:text-dark-background"
    >
      {children}
    </motion.span>
  );
}

export default function GlyphCarousel() {
  const { activeIndex, setActiveIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const [hasMounted, setHasMounted] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [pressedShortcut, setPressedShortcut] = useState<string | null>(null);
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
  const pressedShortcutTimeout = useRef<number | null>(null);

  const SCROLL_THRESHOLD = 10;
  const SCROLL_COOLDOWN = 500;
  const flashShortcutHint = (shortcut: string) => {
    setPressedShortcut(shortcut);
    if (pressedShortcutTimeout.current) {
      window.clearTimeout(pressedShortcutTimeout.current);
    }
    pressedShortcutTimeout.current = window.setTimeout(() => {
      setPressedShortcut(null);
      pressedShortcutTimeout.current = null;
    }, 120);
  };

  useEffect(() => {
    setHasMounted(true);
    return () => {
      if (pressedShortcutTimeout.current) {
        window.clearTimeout(pressedShortcutTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        setShowKeyboardHints(false);
        return;
      }

      if (event.repeat || isEditableKeyboardTarget(event.target)) return;
      setShowKeyboardHints(true);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setShowKeyboardHints(false);
    };

    const handleMouseMove = () => {
      setShowKeyboardHints(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handleMouseMove);
    };
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
      if (keyboardLocked.current) return;

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
  }, [isInteractive, activeIndex, setActiveIndex]);

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
            tabIndex={isNearby ? 0 : -1}
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
                  <KeyboardHint isPressed={pressedShortcut === "up"}>
                    ↑
                  </KeyboardHint>
                  <KeyboardHint isPressed={pressedShortcut === "down"}>
                    ↓
                  </KeyboardHint>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
