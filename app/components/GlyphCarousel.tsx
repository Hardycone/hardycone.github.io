"use client";

import { motion } from "framer-motion";
import projects from "../../data/projects";

type GlyphCarouselProps = {
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export default function GlyphCarousel({
  selectedIndex,
  onSelect,
}: GlyphCarouselProps) {
  return (
    <motion.div className="w-1/4 h-full flex items-center justify-end px-[64px] mr-[4%] overflow-hidden">
      <motion.div
        className="flex flex-col gap-16 pr-16"
        animate={{ y: `calc(3.75rem + 7.75rem * (2 - ${selectedIndex}))` }}
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
                scale: index === selectedIndex ? 2.5 : 1,
                opacity: index === selectedIndex ? 1 : 0.3,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-6xl select-none text-center cursor-pointer"
              onClick={() => onSelect(index)}
            >
              <Glyph />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
