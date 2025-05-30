"use client";

import { ReactNode, useEffect } from "react";
import ProjectSummary from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";

export default function MainColumn({ children }: { children: ReactNode }) {
  const { activeIndex } = useActiveProject();
  const { viewMode } = useViewMode();

  useEffect(() => {
    if (viewMode === "case-study") {
      const timeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0); // Delay in ms

      return () => clearTimeout(timeout);
    }
  }, [activeIndex, viewMode]);

  return (
    <div className="flex flex-col w-1/2 max-w-4xl relative">
      <ProjectSummary />

      <CaseStudyContent />
      <ProjectSummary variant="bottom" />

      {children}
    </div>
  );
}
