"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CaseStudyLoader from "./components/CaseStudyLoader";
import projects from "../data/projects";

import GlyphCarousel from "./components/GlyphCarousel";
import ProjectSummary from "./components/ProjectSummary";
import TopBar from "./components/TopBar";

export default function Home() {
  const [navState, setNavState] = useState({
    index: 0,
    dir: "down" as "up" | "down",
  });
  const [viewMode, setViewMode] = useState<"home" | "case-study">("home");

  const { index: selectedIndex, dir: scrollDir } = navState;

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedProject = projects[selectedIndex];

  // SCROLL HANDLING — HOME ONLY
  useEffect(() => {
    if (viewMode !== "home") return;

    const container = containerRef.current;
    if (!container) return;

    const isTrackpad = (e: WheelEvent) =>
      Math.abs(e.deltaY) < 50 && e.deltaMode === 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const trackpad = isTrackpad(e);
      if (timeoutRef.current) return;
      const delay = trackpad ? 600 : 300;
      timeoutRef.current = setTimeout(() => (timeoutRef.current = null), delay);

      if (delta > 0 && selectedIndex < projects.length - 1) {
        setNavState({ index: selectedIndex + 1, dir: "down" });
      } else if (delta < 0 && selectedIndex > 0) {
        setNavState({ index: selectedIndex - 1, dir: "up" });
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [selectedIndex, viewMode]);

  // KEYBOARD NAVIGATION — HOME ONLY
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "home") return;

      setNavState((prev) => {
        if (e.key === "ArrowDown" && prev.index < projects.length - 1)
          return { index: prev.index + 1, dir: "down" };
        else if (e.key === "ArrowUp" && prev.index > 0)
          return { index: prev.index - 1, dir: "up" };
        return prev;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewMode]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-y-auto scroll-smooth bg-white font-sans flex"
    >
      <ProjectSummary
        project={selectedProject}
        scrollDir={scrollDir}
        onViewCaseStudy={() => setViewMode("case-study")}
        viewMode={viewMode}
      />

      <AnimatePresence mode="wait">
        {viewMode === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex inset-0 w-full"
          >
            {/* Left column: glyph carousel */}
            <GlyphCarousel
              selectedIndex={selectedIndex}
              onSelect={(index) =>
                setNavState({
                  index,
                  dir: index > selectedIndex ? "down" : "up",
                })
              }
            />

            {/* Center column: project summary */}
          </motion.div>
        )}

        {viewMode === "case-study" && (
          <motion.div
            key="case-study"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo + Socials */}
            <div className="fixed w-full">
              <TopBar setViewMode={setViewMode} />
            </div>

            <motion.div
              initial={{ y: 800, opacity: 0 }}
              animate={{ y: 200, opacity: 1 }}
              exit={{ y: 800, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/4 h-screen w-1/2 prose max-w-3xl"
            >
              <CaseStudyLoader projectId={selectedProject.id} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
