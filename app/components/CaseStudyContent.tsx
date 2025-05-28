"use client";

import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import { motion, AnimatePresence } from "framer-motion";
import projects from "@/data/projects";

import CaseStudyOne from "./caseStudies/CaseStudyOne";
import CaseStudyTwo from "./caseStudies/CaseStudyTwo";
import CaseStudyThree from "./caseStudies/CaseStudyThree";
import CaseStudyFour from "./caseStudies/CaseStudyFour";
import CaseStudyFive from "./caseStudies/CaseStudyFive";
import CaseStudySix from "./caseStudies/CaseStudySix";

import ProjectSummary from "./ProjectSummary"; // <-- import ProjectSummary here
import { useEffect } from "react";

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
  const { activeIndex } = useActiveProject();
  const { viewMode } = useViewMode();

  const project = projects[activeIndex];
  const slug = project.slug as ProjectSlug;
  const CaseStudyComponent = caseStudyComponents[slug];

  // Scroll reset effect on project change, only in case-study mode
  useEffect(() => {
    if (viewMode === "case-study") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeIndex, viewMode]);

  return (
    <AnimatePresence mode="wait">
      {viewMode === "case-study" && CaseStudyComponent && (
        <motion.div
          key={project.id}
          className="prose w-full bg-violet-500 flex flex-col gap-10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="p-12">
            <CaseStudyComponent />
          </div>
          {/* Teaser preview at bottom */}
          <ProjectSummary variant="bottom" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
