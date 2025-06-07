"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import projects from "../../data/projects";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import Image from "next/image";

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
    y:
      direction === "up"
        ? window.innerHeight / 2 - 240
        : -window.innerHeight / 2 + 240,
    opacity: 0,
  }),
  animate: {
    boxShadow:
      "2px 2px 2px rgba(0, 0, 0, 0.1),-2px -2px 2px rgba(255, 255, 255, 1),-2px 2px 2px rgba(255, 255, 255, 1),2px -2px 2px rgba(255, 255, 255, 1)",
    y: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeIn" },
  },
  exit: (direction: "up" | "down") => ({
    y:
      direction === "up"
        ? -window.innerHeight / 2 + 240
        : window.innerHeight / 2 - 240,
    opacity: 0,
    transition: { duration: 0.1, ease: "easeOut" },
  }),
};

const caseStudyViewVersion = {
  initial: (variant: "header" | "bottom") => ({
    y: variant === "bottom" ? 500 : 500,
    boxShadow:
      "2px 2px 2px rgba(0, 0, 0, 0.1),-2px -2px 2px rgba(255, 255, 255, 1),-2px 2px 2px rgba(255, 255, 255, 1),2px -2px 2px rgba(255, 255, 255, 1)",
    opacity: 0,
  }),
  animate: (variant: "header" | "bottom") => ({
    boxShadow:
      variant === "header"
        ? "none"
        : "2px 2px 2px rgba(0, 0, 0, 0.1),-2px -2px 2px rgba(255, 255, 255, 1),-2px 2px 2px rgba(255, 255, 255, 1),2px -2px 2px rgba(255, 255, 255, 1)",
    y: 0,
    opacity: 1,
    transition:
      variant === "bottom"
        ? { delay: 0, duration: 0.2, ease: "easeInOut" }
        : {
            y: { duration: 0.2, ease: "easeInOut" },
            boxShadow: { delay: 0.9, duration: 0.3, ease: "easeIn" },
          },
  }),
  exit: (variant: "header" | "bottom") => ({
    y: variant === "bottom" ? -300 : 0,
    opacity: 0,
    transition:
      variant === "bottom"
        ? { y: { delay: 0.8, duration: 0.2, ease: "easeInOut" } }
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
  let marginBottom = "";

  if (variant === "header") {
    project = projects[activeIndex];
    clickable = viewMode === "home";
    showButton = viewMode === "home";
    marginTop = viewMode === "home" ? "mt-[calc(50vh-232px)]" : "mt-20";
    marginBottom = "";
  } else if (variant === "bottom") {
    const nextIndex = (activeIndex + 1) % projects.length;
    project = projects[nextIndex];
    clickable = true;
    showButton = true;
    marginTop = "";
    marginBottom = "mb-20";
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
    }, 200);
  };

  return (
    //Project summary card
    <motion.div
      layout
      onClick={clickable ? handleClick : undefined}
      className={`relative flex z-10 ${marginTop} ${marginBottom} ${
        clickable ? "cursor-pointer" : "cursor-default"
      } `}
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
                  scale: 1.005,
                  boxShadow:
                    "4px 4px 4px rgba(0, 0, 0, 0.1),-4px -4px 4px rgba(255, 255, 255, 1),-4px 4px 4px rgba(255, 255, 255, 1),4px -4px 4px rgba(255, 255, 255, 1)",
                }
          }
          className={`relative w-full flex gap-6 items-start p-6 rounded-xl ${
            showButton ? "flex-row" : "flex-col"
          }`}
        >
          <div className="flex flex-col w-full h-full">
            <motion.div layout="position">
              <h1
                className={`font-serif ${
                  variant === "bottom" ? "text-xl" : "hidden"
                }`}
              >
                Next Up
              </h1>
              <h1 className="font-sans font-semibold text-4xl mb-2">
                {project.title}
              </h1>
              <p className="font-serif text-base text-gray-600 mb-4">
                {project.description}
              </p>
            </motion.div>

            <div className="flex mt-auto w-full">
              <motion.button
                initial={{
                  boxShadow:
                    "inset 1px 1px 1px rgba(0, 0, 0, 0.1), inset -1px -1px 1px rgba(255, 255, 255, 1)",
                }}
                whileHover={{
                  scale: 0.99,
                  boxShadow:
                    "inset 2px 2px 2px rgba(0, 0, 0, 0.1), inset -2px -2px 2px rgba(255, 255, 255, 1)",
                }}
                className={`font-serif font-bold px-4 py-2 text-base rounded-full ${
                  showButton ? "" : "hidden"
                } `}
              >
                View Case Study
              </motion.button>
            </div>
          </div>
          {project.image && (
            <div
              className={`relative shrink-0 overflow-hidden rounded-lg ${
                showButton ? "w-1/2 aspect-[1/1] " : "w-full aspect-[3/2] "
              }`}
            >
              <Image
                src={project.image}
                alt={`${project.title} preview image`}
                fill
                className="object-cover"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
