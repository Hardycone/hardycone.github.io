"use client";

import { useActiveProject } from "../context/ActiveProjectContext";
import {
  motion,
  AnimatePresence,
  MotionValue,
  useTransform,
} from "framer-motion";
import projects from "@/data/projects";
import { useEffect } from "react";
import { useTheme } from "next-themes";

import CaseStudyOne from "./caseStudies/CaseStudyOne";
import CaseStudyTwo from "./caseStudies/CaseStudyTwo";
import CaseStudyThree from "./caseStudies/CaseStudyThree";
import CaseStudyFour from "./caseStudies/CaseStudyFour";
import CaseStudyFive from "./caseStudies/CaseStudyFive";
import CaseStudySix from "./caseStudies/CaseStudySix";
interface CaseStudyContentProps {
  scrollY: MotionValue<number>;
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

export default function CaseStudyContent({ scrollY }: CaseStudyContentProps) {
  const { activeIndex, transitioningToNext, setTransitioningToNext } =
    useActiveProject();

  const project = projects[activeIndex];
  const slug = project.slug as ProjectSlug;
  const CaseStudyComponent = caseStudyComponents[slug];
  const exitY = transitioningToNext ? -500 : 500;

  // Dispatch event after animation completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("case-study-loaded"));
    }, 600);

    return () => clearTimeout(timeout);
  }, [project.id]);

  return (
    <>
      <div className="min-h-[calc(100dvh-48px)]" />
      <AnimatePresence mode="wait">
        <motion.div
          layout
          key={project.id}
          className="z-40 flex w-full flex-col"
          initial={{
            y: 200,
            opacity: 0,
            // boxShadow: themeShadows.content,
          }}
          animate={{
            y: 0,
            opacity: 1,
            // boxShadow: themeShadows.content,
          }}
          exit={{
            y: exitY,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeInOut" },
          }}
          onAnimationComplete={() => {
            if (transitioningToNext) {
              setTransitioningToNext(false);
            }
          }}
        >
          <CaseStudyComponent scrollY={scrollY} />
        </motion.div>
      </AnimatePresence>
      <div className="mb-12 mt-12 h-[100dvh] max-h-[240px]" />
    </>
  );
}
