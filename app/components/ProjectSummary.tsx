// app/components/ProjectSummary.tsx
"use client";

import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import projects from "../../data/projects";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export default function ProjectSummary() {
  const hasMounted = useHasMounted();
  const { activeIndex, previousIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const router = useRouter();
  if (!hasMounted) return null; // Prevent hydration mismatch
  const project = projects[activeIndex];

  const handleClick = () => {
    setTimeout(() => {
      router.push(`/${project.slug}`);
    }, 300);
  };

  if (!project) return null;

  const isCaseStudy = viewMode === "case-study";

  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  const summaryVariants = {
    initial: (direction: "up" | "down") => ({
      y: direction === "up" ? 300 : -300,
      opacity: 0,
    }),
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeIn" },
    },
    exit: (direction: "up" | "down") => ({
      y: direction === "up" ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.1, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      layout
      className="relative flex p-12 z-50 bg-purple-100"
      animate={isCaseStudy ? "case-study" : "home"}
      initial={false}
    >
      <AnimatePresence mode="wait" initial={true} custom={direction}>
        <motion.div
          key={project.id}
          custom={direction}
          variants={summaryVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full items-start justify-start bg-cyan-200"
        >
          <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            View Case Study
          </button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
