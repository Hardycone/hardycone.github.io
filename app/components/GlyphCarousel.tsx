"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import projects from "../../data/projects";
import { useActiveProject, wrapIndex } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";

export default function GlyphCarousel() {
  const { activeIndex, setActiveIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isDisabled = viewMode === "case-study";

  useEffect(() => {
    if (isDisabled) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (timeoutRef.current) return;

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, 400);

      if (e.deltaY > 0) {
        setActiveIndex((prev) => wrapIndex(prev + 1, projects.length));
      } else if (e.deltaY < 0) {
        setActiveIndex((prev) => wrapIndex(prev - 1, projects.length));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (timeoutRef.current) return;

      if (e.key === "ArrowDown") {
        setActiveIndex((prev) => wrapIndex(prev + 1, projects.length));
      } else if (e.key === "ArrowUp") {
        setActiveIndex((prev) => wrapIndex(prev - 1, projects.length));
      } else {
        return;
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, 400);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveIndex, isDisabled]);

  return (
    <motion.div
      className="flex flex-col items-end gap-16 pr-28 bg-orange-100"
      animate={{
        y: `calc(3.75rem + 7.75rem * (2 - ${activeIndex}))`,
        x: isDisabled ? -300 : 0,
        opacity: isDisabled ? 0 : 1,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        pointerEvents: isDisabled ? "none" : "auto",
      }}
    >
      {projects.map((project, index) => {
        const Glyph = project.glyph;
        return (
          <motion.div
            key={project.id}
            animate={{
              scale: index === activeIndex ? 2.5 : 1,
              opacity: index === activeIndex ? 1 : 0.3,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="h-16 w-16 select-none text-center cursor-pointer bg-red-500"
            onClick={() => !isDisabled && setActiveIndex(index)}
          >
            <Glyph />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
