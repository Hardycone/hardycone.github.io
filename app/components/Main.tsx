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
    if (viewMode === "case-study") {
      const timeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
      }, 0); // Delay in ms

      return () => clearTimeout(timeout);
    }
  }, [activeIndex, viewMode]);

  return (
    <main
      className={`bg-inherit relative flex w-screen ${
        viewMode === "home" ? "touch-none" : ""
      }`}
    >
      <div
        className={`flex ${
          viewMode === "case-study" ? "w-0" : "w-32"
        }  pr-6 lg:pr-16 h-screen flex-col  lg:flex-1 justify-start lg:justify-center overflow-hidden bg-red-500`}
      >
        <GlyphCarousel />
      </div>

      <div className="w-full lg:w-1/2 bg-inherit flex flex-col max-w-4xl relative my-12 mx-4 lg:mx-0 bg-green-500">
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
