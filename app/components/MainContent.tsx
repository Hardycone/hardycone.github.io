"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useTheme } from "next-themes";
import { useLighting } from "../context/LightingContext";
import projects from "../../data/projects";

import GlyphCarousel from "./GlyphCarousel";
import TopBar from "./TopBar";
import ProjectSummary from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";

export default function MainContent({ children }: { children: ReactNode }) {
  const { activeIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const { resolvedTheme } = useTheme();

  const [showPrompt, setShowPrompt] = useState(false);
  const hasPromptShown = useRef(false);
  // Landscape-blocker logic
  const [showLandscapeBlocker, setShowLandscapeBlocker] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const handleOrientationChange = () => {
      const isMobile = /iPhone|Android/i.test(navigator.userAgent);
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      const shouldBlock = isMobile && isLandscape && viewMode === "home";
      setShowLandscapeBlocker(shouldBlock);
    };

    handleOrientationChange(); // Run on mount
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [viewMode]);

  // Scroll to top on page/view change
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
    return () => clearTimeout(timeout);
  }, [activeIndex, viewMode]);

  // Inactivity prompt logic
  useEffect(() => {
    if (viewMode !== "home" || hasPromptShown.current) return;

    let timer: NodeJS.Timeout | null = null;

    timer = setTimeout(() => {
      if (!hasPromptShown.current) {
        setShowPrompt(true);
        hasPromptShown.current = true;
      }
    }, 3000);

    // If activeIndex changes during these 3 seconds, cancel showing prompt
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [viewMode, activeIndex]); // watch activeIndex to reset timer

  // Dismiss prompt on interaction (detected via activeIndex change)
  useEffect(() => {
    if (viewMode !== "home" || !hasPromptShown.current) return;
    setShowPrompt(false);
  }, [activeIndex, viewMode]);

  useEffect(() => {
    if (showLandscapeBlocker) {
      // Prevent body scroll globally
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      // Restore scroll
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [showLandscapeBlocker]);
  const { getBgColorClass } = useLighting();
  const project = projects[activeIndex];
  const bgColorClass = getBgColorClass(
    resolvedTheme || "light",
    project.bgColor,
  );
  if (!mounted) {
    // Avoid rendering on server or before mount to prevent mismatch
    return null;
  }
  return (
    <main
      className={`relative flex w-full bg-background transition-colors dark:bg-dark-background ${
        viewMode === "home" ? "touch-none overflow-y-hidden" : ""
      }`}
    >
      <TopBar />
      <div
        className={`relative flex h-screen flex-1 flex-col overflow-hidden ${
          viewMode === "home" ? "min-w-max" : ""
        }`}
      >
        <GlyphCarousel />
      </div>
      <motion.div
        className={`relative flex w-full max-w-5xl flex-col items-center gap-6 px-2 ${
          viewMode === "home" ? "" : ""
        }`}
      >
        <ProjectSummary />

        {viewMode === "home" && showPrompt && (
          <div className="fixed inset-x-0 bottom-6 z-50 flex w-full justify-center">
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{
                y: [0, 0, 8, 0, 0, -8, 0, 0],
                opacity: 1,
                transition: {
                  y: {
                    delay: 0.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 3,
                    ease: "easeInOut",
                  },
                  opacity: { duration: 0.5 },
                },
              }}
              exit={{ y: -100, opacity: 0 }}
              className="pointer-events-none rounded-lg bg-foreground py-1 pl-2 font-sans text-sm text-background shadow-md dark:bg-dark-foreground dark:text-dark-background md:text-lg"
            >
              Scroll to explore
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block h-7 w-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5l-4 4h3v6H8l4 4 4-4h-3V9h3l-4-4z" />
              </svg>
            </motion.div>
          </div>
        )}

        <CaseStudyContent />
        <ProjectSummary variant="bottom" />
        {children}
      </motion.div>
      <div className="min-w-0 flex-1" />
      {showLandscapeBlocker && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background text-center text-foreground">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="h-16 w-16"
            animate={{
              rotate: [90, 90, 0, 0, 0, 90, 90, 180, 180, 180, 90],
              transition: {
                rotate: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 6,
                  ease: "easeInOut",
                },
              },
            }}
          >
            <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </motion.svg>
          <p className="font-sans text-lg font-semibold">
            Please rotate your phone to portrait mode to view Home.
          </p>
        </div>
      )}
    </main>
  );
}
