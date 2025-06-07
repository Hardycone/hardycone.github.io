"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";

import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";

import GlyphCarousel from "./GlyphCarousel";
import TopBar from "./TopBar";
import ProjectSummary from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";

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
      className={`relative flex w-full bg-inherit ${
        viewMode === "home" ? "" : ""
      }`}
    >
      <div
        className={`flex ${
          viewMode === "case-study" ? "w-0" : "w-20"
        } h-screen flex-col  xl:flex-1 justify-start xl:justify-center overflow-hidden`}
      >
        <GlyphCarousel />
      </div>

      <motion.div className="w-full bg-inherit flex flex-col gap-6 max-w-4xl relative px-2">
        <TopBar />
        <ProjectSummary />
        <CaseStudyContent />
        <ProjectSummary variant="bottom" />
        {children}
      </motion.div>
      <div className="flex-1" />
    </main>
  );
}
