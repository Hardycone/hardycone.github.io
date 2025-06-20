"use client";

import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import { motion, AnimatePresence } from "framer-motion";
import projects from "@/data/projects";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useLighting } from "../context/LightingContext";

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

function getShadows(a: number, b: number) {
  return {
    light: `${-a}px ${-b}px 4px 0px rgba(0, 0, 0, 0.1), ${a}px ${b}px 4px 0px rgba(255, 255, 255, 0.8)`,
    dark: `${-a}px ${-b}px 4px 0px rgba(0, 0, 0, 1), inset ${-a / 4}px ${
      -b / 4
    }px 4px 0px rgba(255, 255, 255, 0.6)`,
  };
}

export default function CaseStudyContent() {
  const { activeIndex, transitioningToNext, setTransitioningToNext } =
    useActiveProject();

  const { resolvedTheme } = useTheme();
  const { a, b } = useLighting();

  const themeShadows = getShadows(a, b)[
    resolvedTheme === "dark" ? "dark" : "light"
  ];
  const project = projects[activeIndex];
  const slug = project.slug as ProjectSlug;
  const CaseStudyComponent = caseStudyComponents[slug];
  const { viewMode } = useViewMode();
  const exitY = transitioningToNext ? -500 : 500;

  // Dispatch event after animation completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("case-study-loaded"));
    }, 600);

    return () => clearTimeout(timeout);
  }, [project.id]);

  return (
    <AnimatePresence mode="wait">
      {viewMode === "case-study" && CaseStudyComponent && (
        <motion.div
          layout
          key={project.id}
          className="font-serif text-foreground dark:text-dark-foreground p-2 md:p-6 w-full rounded-xl flex flex-col gap-10"
          initial={{
            y: 500,
            opacity: 0,
            boxShadow: themeShadows,
          }}
          animate={{
            y: 0,
            opacity: 1,
            boxShadow: "none",
            transition: {
              opacity: { delay: 0.2 },
              y: { delay: 0.2, duration: 0.2, ease: "easeOut" },
              boxShadow: { delay: 0.7, duration: 0.3, ease: "easeIn" },
            },
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
      )}
    </AnimatePresence>
  );
}
