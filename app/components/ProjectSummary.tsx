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

interface ProjectSummaryProps {
  variant?: "header" | "bottom"; // only applies in case-study mode
}

export default function ProjectSummary({
  variant = "header",
}: ProjectSummaryProps) {
  const hasMounted = useHasMounted();
  const { activeIndex, previousIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const router = useRouter();

  if (!hasMounted || viewMode === "not-found") return null;

  // Determine direction for animations (used in all views)
  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  // Home view: show active project, clickable, animated slide with AnimatePresence
  if (viewMode === "home") {
    const project = projects[activeIndex];
    if (!project) return null;

    const handleClick = () => {
      router.push(`/${project.slug}`);
    };

    return (
      <motion.div
        layout
        onClick={handleClick}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="cursor-pointer relative flex p-12 z-10 mt-[calc(50vh-100px)]"
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={project.id}
            custom={direction}
            variants={summaryVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full items-start justify-start "
          >
            <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-red-800 transition">
              View Case Study
            </button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  // Case-study view
  let project;
  let clickable = false;
  let showButton = false;

  if (variant === "header") {
    project = projects[activeIndex];
    clickable = false;
    showButton = false;
  } else if (variant === "bottom") {
    const nextIndex = (activeIndex + 1) % projects.length;
    project = projects[nextIndex];
    clickable = true;
    showButton = true;
  }

  if (!project) return null;

  const handleClick = () => {
    if (!clickable) return;
    router.push(`/${project.slug}`);
  };

  return (
    <motion.div
      layout
      onClick={clickable ? handleClick : undefined}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`relative flex p-12 z-10 ${
        clickable ? "cursor-pointer" : "cursor-default"
      } ${variant === "header" ? "mt-[60px]" : "mt-20"}`}
    >
      <AnimatePresence mode="wait" initial={true} custom={direction}>
        <motion.div
          key={project.id}
          className="relative w-full items-start justify-start"
        >
          <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          {showButton && (
            <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-red-800 transition">
              View Case Study
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Keep summaryVariants outside component for clarity
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
