"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import projects from "../../data/projects";
import { useActiveProject, wrapIndex } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";

export default function GlyphCarousel() {
  const { activeIndex, setActiveIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const isInteractive = viewMode === "home";

  // Touch tracking
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isInteractive) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (timeoutRef.current) return;

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, 400);

      const direction = e.deltaY > 0 ? 1 : -1;
      setActiveIndex((prev) => wrapIndex(prev + direction, projects.length));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (timeoutRef.current) return;

      const direction =
        e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
      if (!direction) return;

      setActiveIndex((prev) => wrapIndex(prev + direction, projects.length));

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, 300);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (timeoutRef.current || touchStartY.current === null) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - touchStartY.current;

      const threshold = 30; // min swipe distance
      let direction = 0;

      if (Math.abs(deltaY) > threshold) {
        direction = deltaY > 0 ? -1 : 1; // swipe down = previous, up = next
      }

      if (direction !== 0) {
        setActiveIndex((prev) => wrapIndex(prev + direction, projects.length));
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
        }, 400);
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
  }, [isInteractive, setActiveIndex]);

  if (!hasMounted || viewMode === "not-found") {
    return null;
  }

  return (
    <motion.div
      className="flex flex-col items-end gap-16 pr-28"
      animate={{
        y: `calc(124px * (2 - ${activeIndex}))`,
        x: isInteractive ? 0 : -300,
        opacity: isInteractive ? 1 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ pointerEvents: isInteractive ? "auto" : "none" }}
    >
      {projects.map((project, index) => {
        const Glyph = project.glyph;
        const isActive = index === activeIndex;

        return (
          <motion.div
            key={project.id}
            animate={{
              scale: isActive ? 2.5 : 1,
              opacity: isActive ? 1 : 0.3,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="h-16 w-16 select-none text-center cursor-pointer touch-manipulation"
            onClick={() => isInteractive && setActiveIndex(index)}
          >
            <Glyph />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
