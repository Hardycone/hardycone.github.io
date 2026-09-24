"use client";

import { motion, AnimatePresence, MotionValue } from "framer-motion";
import projects from "@/data/projects";
import { useEffect } from "react";

import CaseStudyOne from "./caseStudies/CaseStudyOne";
import CaseStudyTwo from "./caseStudies/CaseStudyTwo";
import CaseStudyThree from "./caseStudies/CaseStudyThree";
import CaseStudyFour from "./caseStudies/CaseStudyFour";
import CaseStudyFive from "./caseStudies/CaseStudyFive";

interface CaseStudyContentProps {
  projectIndex: number;
  scrollY: MotionValue<number>;
  horizontalOffset?: number;
  fadeInFirstSection?: boolean;
  firstSectionFadeReady?: boolean;
  isVisible?: boolean;
  exitDirection?: "up" | "down";
  disableExitAnimation?: boolean;
  onExitComplete?: () => void;
}

type CaseStudyComponentProps = Pick<
  CaseStudyContentProps,
  "scrollY" | "fadeInFirstSection" | "firstSectionFadeReady"
>;

type ProjectSlug = "about-me" | "flux" | "fantail" | "nasa-suits" | "wolcott";

const caseStudyComponents: Record<
  ProjectSlug,
  React.FC<CaseStudyComponentProps>
> = {
  "about-me": CaseStudyOne,
  flux: CaseStudyTwo,
  fantail: CaseStudyThree,
  "nasa-suits": CaseStudyFour,
  wolcott: CaseStudyFive,
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
  projectIndex,
  scrollY,
  horizontalOffset = 0,
  fadeInFirstSection = false,
  firstSectionFadeReady = true,
  isVisible = true,
  exitDirection = "down",
  disableExitAnimation = false,
  onExitComplete,
}: CaseStudyContentProps) {
  const project = projects[projectIndex];
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
    <div
      className="flex w-full min-w-0 flex-col"
      style={
        horizontalOffset
          ? { position: "relative", left: -horizontalOffset }
          : undefined
      }
    >
      <motion.div className="relative left-1/2 z-40 w-[calc(100vw-1rem)] min-w-0 max-w-6xl -translate-x-1/2 md:w-[calc(100vw-2rem)]">
        <AnimatePresence
          mode={disableExitAnimation ? "sync" : "wait"}
          custom={exitDirection}
          onExitComplete={onExitComplete}
        >
          {isVisible && (
            <motion.div
              key={project.id}
              custom={exitDirection}
              variants={contentVariants}
              initial={false}
              animate="animate"
              exit={
                disableExitAnimation
                  ? { opacity: 0, transition: { duration: 0 } }
                  : "exit"
              }
              className="relative z-40 flex w-full min-w-0 flex-col"
            >
              <CaseStudyComponent
                scrollY={scrollY}
                fadeInFirstSection={fadeInFirstSection}
                firstSectionFadeReady={firstSectionFadeReady}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
