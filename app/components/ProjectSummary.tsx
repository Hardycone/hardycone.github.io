"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import projects from "../../data/projects";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

interface ProjectSummaryProps {
  variant?: "header" | "bottom";
  setTransitioningToNext?: (value: boolean) => void; // new optional callback
}

const homeViewVersion = {
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

const caseStudyViewVersion = {
  initial: (variant: "header" | "bottom") => ({
    y: variant === "bottom" ? 500 : 500,
    opacity: 0,
  }),
  animate: (variant: "header" | "bottom") => ({
    y: 0,
    opacity: 1,
    transition:
      variant === "bottom"
        ? { delay: 0.8, duration: 0.2, ease: "easeInOut" }
        : { delay: 0.2, duration: 0.2, ease: "easeInOut" },
  }),
  exit: (variant: "header" | "bottom") => ({
    y: variant === "bottom" ? -300 : 0,
    opacity: 0,
    transition:
      variant === "bottom"
        ? { delay: 0.2, duration: 0.2, ease: "easeInOut" }
        : { delay: 0, duration: 0 },
  }),
};

export default function ProjectSummary({
  variant = "header",
}: ProjectSummaryProps) {
  const { setTransitioningToNext } = useActiveProject();
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
    marginTop = viewMode === "home" ? "mt-[calc(50vh-200px)]" : "mt-4";
  } else if (variant === "bottom") {
    const nextIndex = (activeIndex + 1) % projects.length;
    project = projects[nextIndex];
    clickable = true;
    showButton = true;
    marginTop = "";
  }

  if (!project) return null;

  const handleClick = () => {
    if (!clickable) return;

    if (variant === "bottom" && setTransitioningToNext) {
      setTransitioningToNext(true);
    }

    // Delay navigation to allow animation start
    setTimeout(() => {
      router.push(`/${project.slug}`);
    }, 300);
  };

  return (
    <motion.div
      layout
      onClick={clickable ? handleClick : undefined}
      initial={{ opacity: 0, y: 500 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`relative flex z-10 ${
        clickable ? "cursor-pointer" : "cursor-default"
      } ${marginTop}`}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={project.id}
          custom={viewMode === "home" ? direction : variant}
          variants={
            viewMode === "home" ? homeViewVersion : caseStudyViewVersion
          }
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover={
            viewMode === "case-study" && variant === "header"
              ? undefined
              : {
                  scale: 1.01,
                  boxShadow:
                    "4px 4px 4px rgba(0, 0, 0, 0.1),-4px -4px 4px rgba(255, 255, 255, 1),-4px 4px 4px rgba(255, 255, 255, 1),4px -4px 4px rgba(255, 255, 255, 1)",
                }
          }
          className="relative flex flex-col gap-6 w-full items-start justify-start p-6 rounded-xl"
        >
          <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="flex justify-end w-full">
            <button
              className={`px-4 py-4 ${
                showButton
                  ? "text-black cursor-pointer hover:scale-95 hover:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1),inset_-2px_-2px_2px_white]"
                  : "text-transparent cursor-default"
              } rounded-full transition`}
            >
              View Case Study
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
