"use client";

import { ReactNode, useEffect } from "react";
import ProjectSummary from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import TopBar from "./TopBar";
import GlyphCarousel from "./GlyphCarousel";

export default function MainColumn({ children }: { children: ReactNode }) {
  const { activeIndex } = useActiveProject();
  const { viewMode } = useViewMode();

  useEffect(() => {
    if (viewMode === "case-study") {
      const timeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
      }, 0); // Delay in ms

      return () => clearTimeout(timeout);
    }
  }, [activeIndex, viewMode]);

  return (
    <main className="bg-inherit relative flex w-screen ">
      <div className="bg-inherit flex-1 flex h-screen flex-col justify-center overflow-hidden ">
        <GlyphCarousel />
      </div>
      <div className="bg-inherit flex flex-col w-1/2 max-w-4xl relative my-12 ">
        <TopBar />
        <ProjectSummary />
        <CaseStudyContent />
        <ProjectSummary variant="bottom" />
        {children}
      </div>{" "}
      <div className="flex-1 "></div>
    </main>
  );
}
