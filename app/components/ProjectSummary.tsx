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
  variant?: "header" | "bottom";
}

const summaryVariantsDirectional = {
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

const summaryVariantsFixed = {
  initial: { y: 500, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 2, ease: "easeInOut" },
  },
  exit: {
    y: -500,
    opacity: 0,
    transition: { duration: 2, ease: "easeInOut" },
  },
};

export default function ProjectSummary({
  variant = "header",
}: ProjectSummaryProps) {
  const hasMounted = useHasMounted();
  const { activeIndex, previousIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const router = useRouter();

  if (!hasMounted || viewMode === "not-found") return null;
  if (variant === "bottom" && viewMode === "home") return null;

  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  let project;
  let clickable = false;
  let showButton = false;
  let marginTop = "";

  if (variant === "header") {
    project = projects[activeIndex];
    clickable = viewMode === "home";
    showButton = viewMode === "home";
    marginTop = viewMode === "home" ? "mt-[calc(50vh-100px)]" : "mt-[60px]";
  } else if (variant === "bottom") {
    const nextIndex = (activeIndex + 1) % projects.length;
    project = projects[nextIndex];
    clickable = true;
    showButton = true;
    marginTop = "mt-20";
  }

  if (!project) return null;

  const handleClick = () => {
    if (!clickable) return;

    // Let the layout animation begin before pushing route
    setTimeout(() => {
      router.push(`/${project.slug}`);
    }, 100); // adjust delay to match animation timing
  };

  return (
    <motion.div
      layout
      onClick={clickable ? handleClick : undefined}
      initial={{ opacity: 0, y: 500 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -500 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={`relative flex p-12 z-10 ${
        clickable ? "cursor-pointer" : "cursor-default"
      } ${marginTop}`}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={project.id}
          custom={viewMode === "home" ? direction : undefined}
          variants={
            viewMode === "home"
              ? summaryVariantsDirectional
              : summaryVariantsFixed
          }
          initial="initial"
          animate="animate"
          exit="exit"
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
