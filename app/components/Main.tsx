"use client";

import { ReactNode, useEffect } from "react";
import ProjectSummary from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import TopBar from "./TopBar";
import GlyphCarousel from "./GlyphCarousel";

export default function Main({ children }: { children: ReactNode }) {
  const { activeIndex } = useActiveProject();
  const { viewMode } = useViewMode();

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);

    return () => clearTimeout(timeout);
  }, [activeIndex, viewMode]);

  return (
    <main
      className={`relative flex w-full ${
        viewMode === "home" ? "touch-none" : ""
      } bg-inherit`}
    >
      <div
        className={`flex ${
          viewMode === "case-study" ? "w-0" : "w-20"
        } h-screen flex-col  lg:flex-1 justify-start lg:justify-center overflow-hidden`}
      >
        <GlyphCarousel />
      </div>

      <div className="w-full lg:w-1/2 bg-inherit flex flex-col max-w-4xl relative my-12 px-2 lg:px-0 ">
        <TopBar />
        <ProjectSummary />
        <CaseStudyContent />
        <ProjectSummary variant="bottom" />
        {children}
      </div>
      <div className="flex-1" />
    </main>
  );
}
