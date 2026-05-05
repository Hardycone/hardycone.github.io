"use client";

import { useActiveProject } from "../context/ActiveProjectContext";
import { motion, AnimatePresence, MotionValue } from "framer-motion";
import projects from "@/data/projects";
import { useEffect } from "react";

import CaseStudyOne from "./caseStudies/CaseStudyOne";
import CaseStudyTwo from "./caseStudies/CaseStudyTwo";
import CaseStudyThree from "./caseStudies/CaseStudyThree";
import CaseStudyFour from "./caseStudies/CaseStudyFour";
import CaseStudyFive from "./caseStudies/CaseStudyFive";
import CaseStudySix from "./caseStudies/CaseStudySix";
interface CaseStudyContentProps {
  scrollY: MotionValue<number>;
  isVisible?: boolean;
  exitDirection?: "up" | "down";
}

type ProjectSlug =
  | "case-study-one"
  | "case-study-two"
  | "case-study-three"
  | "case-study-four"
  | "case-study-five"
  | "case-study-six";

const caseStudyComponents: Record<
  ProjectSlug,
  React.FC<CaseStudyContentProps>
> = {
  "case-study-one": CaseStudyOne,
  "case-study-two": CaseStudyTwo,
  "case-study-three": CaseStudyThree,
  "case-study-four": CaseStudyFour,
  "case-study-five": CaseStudyFive,
  "case-study-six": CaseStudySix,
};

const contentVariants = {
  initial: { y: 200, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: (direction: "up" | "down") => ({
    y: direction === "up" ? -500 : 500,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  }),
};

export default function CaseStudyContent({
  scrollY,
  isVisible = true,
  exitDirection = "down",
}: CaseStudyContentProps) {
  const { activeIndex } = useActiveProject();

  const project = projects[activeIndex];
  const slug = project.slug as ProjectSlug;
  const CaseStudyComponent = caseStudyComponents[slug];

  // Dispatch event after animation completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("case-study-loaded"));
    }, 600);

    return () => clearTimeout(timeout);
  }, [project.id]);

  return (
    <div className="flex flex-col">
      <div className="min-h-[calc(100svh-48px)]" />
      <AnimatePresence mode="wait" custom={exitDirection}>
        {isVisible && (
          <motion.div
            key={project.id}
            custom={exitDirection}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="z-40 flex w-full flex-col"
          >
            <CaseStudyComponent scrollY={scrollY} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-12 mt-12 h-[100svh] max-h-[360px]" />
    </div>
  );
}
