"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";

import GlyphCarousel from "./GlyphCarousel";
import TopBar from "./TopBar";
import ProjectSummary from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";

export default function Main({ children }: { children: ReactNode }) {
  const { activeIndex } = useActiveProject();
  const { viewMode } = useViewMode();

  const [showPrompt, setShowPrompt] = useState(false);
  const hasPromptShown = useRef(false);
  // Landscape-blocker logic
  const [showLandscapeBlocker, setShowLandscapeBlocker] = useState(false);

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

  return (
    <main
      className={`relative flex w-full bg-inherit ${
        viewMode === "home" ? "touch-none" : ""
      }`}
    >
      <div
        className={`relative flex h-screen flex-col flex-1 overflow-hidden ${
          viewMode === "home" ? "min-w-max" : ""
        }`}
      >
        <GlyphCarousel />
      </div>
      <motion.div
        className={`relative w-full flex flex-col items-center gap-6 max-w-4xl px-2 bg-inherit ${
          viewMode === "home" ? "" : ""
        }`}
      >
        <TopBar />
        <ProjectSummary />

        {viewMode === "home" && showPrompt && (
          <div className="fixed bottom-6 w-full inset-x-0 flex justify-center z-50">
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
              className="font-sans text-sm md:text-xl p-2 md:p-4 rounded-lg shadow-md pointer-events-none bg-foreground text-background"
            >
              Scroll to explore
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 md:w-8 md:h-8 inline-block"
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
      <div className="flex-1 min-w-0" />
      {showLandscapeBlocker && (
        <div className="fixed flex flex-col inset-0 z-[999] bg-background text-foreground  items-center justify-center text-center">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="w-16 h-16"
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
          <p className="text-lg font-sans font-semibold">
            Please rotate your phone to portrait mode to view Home.
          </p>
        </div>
      )}
    </main>
  );
}
