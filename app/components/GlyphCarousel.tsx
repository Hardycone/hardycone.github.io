"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import projects from "../../data/projects";
import { useActiveProject, wrapIndex } from "../context/ActiveProjectContext";

export default function GlyphCarousel() {
  const { activeIndex, setActiveIndex } = useActiveProject();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isTrackpad = (e: WheelEvent) =>
      Math.abs(e.deltaY) < 50 && e.deltaMode === 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (timeoutRef.current) return;

      const delay = isTrackpad(e) ? 600 : 300;
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, delay);

      if (e.deltaY > 0) {
        setActiveIndex((prev) => wrapIndex(prev + 1, projects.length));
      } else if (e.deltaY < 0) {
        setActiveIndex((prev) => wrapIndex(prev - 1, projects.length));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setActiveIndex((prev) => wrapIndex(prev + 1, projects.length));
      } else if (e.key === "ArrowUp") {
        setActiveIndex((prev) => wrapIndex(prev - 1, projects.length));
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveIndex]);

  return (
    <motion.div
      className="flex flex-col gap-16 p-16"
      animate={{ y: `calc(3.75rem + 7.75rem * (2 - ${activeIndex}))` }}
      initial={{ y: 800 }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ duration: 0.2 }}
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
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-6xl select-none text-center cursor-pointer"
            onClick={() => setActiveIndex(index)}
          >
            <Glyph />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
