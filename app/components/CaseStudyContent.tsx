"use client";

import { useActiveProject } from "../context/ActiveProjectContext";
import { motion, AnimatePresence } from "framer-motion";
import projects from "@/data/projects";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useLighting, getShadows } from "../context/LightingContext";

import CaseStudyOne from "./caseStudies/CaseStudyOne";
import CaseStudyTwo from "./caseStudies/CaseStudyTwo";
import CaseStudyThree from "./caseStudies/CaseStudyThree";
import CaseStudyFour from "./caseStudies/CaseStudyFour";
import CaseStudyFive from "./caseStudies/CaseStudyFive";
import CaseStudySix from "./caseStudies/CaseStudySix";

type ProjectSlug =
  | "case-study-one"
  | "case-study-two"
  | "case-study-three"
  | "case-study-four"
  | "case-study-five"
  | "case-study-six";

const caseStudyComponents: Record<ProjectSlug, React.FC> = {
  "case-study-one": CaseStudyOne,
  "case-study-two": CaseStudyTwo,
  "case-study-three": CaseStudyThree,
  "case-study-four": CaseStudyFour,
  "case-study-five": CaseStudyFive,
  "case-study-six": CaseStudySix,
};

export default function CaseStudyContent() {
  const { activeIndex, transitioningToNext, setTransitioningToNext } =
    useActiveProject();

  const { resolvedTheme } = useTheme();
  const { a, b, getLightColor } = useLighting();

  const lightColor = getLightColor(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );
  const themeShadows = getShadows(
    a,
    b,
    lightColor,
    resolvedTheme === "dark" ? "dark" : "light",
  );
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
      <div className="min-h-[85dvh]" />
      <AnimatePresence mode="wait">
        <motion.div
          layout
          key={project.id}
          className="z-40 flex w-full flex-col gap-10 rounded-[44px] bg-background/70 p-8 font-serif text-foreground backdrop-blur-xl dark:bg-dark-background/10 dark:text-dark-foreground"
          initial={{
            y: 100,
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
          <CaseStudyComponent />
        </motion.div>
      </AnimatePresence>
      <div className="min-h-[25vh]" />
    </>
  );
}
