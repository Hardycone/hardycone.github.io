"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import projects from "../../data/projects";
import { useActiveProject, wrapIndex } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import { useTheme } from "next-themes";

export default function GlyphCarousel() {
  const { activeIndex, setActiveIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const [hasMounted, setHasMounted] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const isInteractive = viewMode === "home";

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
        projects.length
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

  function useTailwindBreakpoint(query = "(min-width: 768px)") {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      setMatches(media.matches);

      const listener = () => setMatches(media.matches);
      media.addEventListener("change", listener);

      return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
  }

  const { resolvedTheme } = useTheme();

  const isLarge = useTailwindBreakpoint();
  const yOffset = isLarge
    ? -80 * (2 * activeIndex + 1 / 2)
    : -40 * (2 * activeIndex + 1 / 2);

  if (!hasMounted || viewMode === "not-found") return null;

  return (
    <motion.div
      className="flex flex-col items-end gap-10 md:gap-20 pt-[calc(50dvh)] px-6 md:px-12 lg:px-16 xl:px-24"
      animate={{
        y: yOffset,
        x: isInteractive ? 0 : -300,
        opacity: isInteractive ? 1 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ pointerEvents: isInteractive ? "auto" : "none" }}
    >
      {projects.map((project, index) => {
        const Glyph = project.glyph;
        const isActive = index === activeIndex;
        const isPreview = index === previewIndex;
        const isDark = resolvedTheme === "dark";

        const scale = isActive ? 2 : isPreview ? 1.2 : 1;
        const opacity = isActive ? 1 : isPreview ? 0.7 : 0.3;
        const boxShadow =
          isActive && isDark
            ? "0px 0px 1px 0px rgba(255, 255, 255, 0.6)"
            : isActive && !isDark
            ? "1px 1px 0px 0px rgba(0, 0, 0, 0.1), -1px -1px 0px 0px rgba(255, 255, 255, 0.8)"
            : "";

        return (
          <motion.div
            key={project.id}
            animate={{
              boxShadow,
              scale,
              opacity,
            }}
            transition={{ type: "tween", stiffness: 500, damping: 20 }}
            className="rounded-full p-1 h-10 w-10 md:p-2 md:h-20 md:w-20 select-none cursor-pointer touch-manipulation"
            onClick={() => isInteractive && setActiveIndex(index)}
          >
            <Glyph />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
