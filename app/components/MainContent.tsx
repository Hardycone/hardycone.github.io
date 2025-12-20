"use client";

import {
  motion,
  useScroll,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  ArrowSquareUpIcon,
  ArrowSquareDownIcon,
  MouseScrollIcon,
} from "@phosphor-icons/react";

import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";

import GlyphCarousel from "./GlyphCarousel";
import TopBar from "./TopBar";
import ProjectSummary from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";
import MyName from "./MyName";

export default function MainContent({ children }: { children: ReactNode }) {
  const { activeIndex } = useActiveProject();
  const { viewMode } = useViewMode();

  const [showPrompt, setShowPrompt] = useState(false);
  const hasPromptShown = useRef(false);
  const [showLandscapeBlocker, setShowLandscapeBlocker] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { scrollY } = useScroll();

  // State for document dimensions
  const [docDimensions, setDocDimensions] = useState({
    height: 0,
    winHeight: 0,
  });

  // Single state for current variant
  const [summaryVariant, setSummaryVariant] = useState<
    "preview" | "header" | "bottom" | null
  >("preview");

  // Update document dimensions
  // 🔁 Reactive document height tracking
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const update = () => {
      setDocDimensions({
        height: document.body.scrollHeight,
        winHeight: window.innerHeight,
      });
    };

    // Run once on mount
    update();

    // Watch for any layout changes that affect document height
    const observer = new ResizeObserver(update);
    observer.observe(document.body);

    // Also handle viewport resizes
    window.addEventListener("resize", update);

    // Clean up on unmount
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [viewMode, activeIndex]);

  // Set initial variant based on viewMode
  useEffect(() => {
    if (viewMode === "not-found") {
      setSummaryVariant(null);
      return;
    }

    if (viewMode === "home") {
      setSummaryVariant("preview");
      return;
    }

    const y = scrollY.get();
    const { height: docHeight, winHeight } = docDimensions;

    if (docHeight > 0 && winHeight > 0) {
      if (y < winHeight / 2) {
        setSummaryVariant("header");
      } else if (y > docHeight - winHeight * 1.5) {
        setSummaryVariant("bottom");
      } else {
        setSummaryVariant(null);
      }
    }
  }, [viewMode, docDimensions, scrollY]);

  // Use useMotionValueEvent for efficient scroll handling
  useMotionValueEvent(scrollY, "change", (y) => {
    if (viewMode !== "case-study") {
      setSummaryVariant("preview");
      return;
    }

    // ALWAYS use fresh values
    const docHeight = document.body.scrollHeight;
    const winHeight = window.innerHeight;

    if (y < winHeight / 2) {
      setSummaryVariant("header");
    } else if (y > docHeight - winHeight * 1.5) {
      setSummaryVariant("bottom");
    } else {
      setSummaryVariant(null);
    }
  });

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

    handleOrientationChange();
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [viewMode]);

  useEffect(() => {
    // Scroll to top on page/view change
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

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [viewMode, activeIndex]);

  // Dismiss prompt on interaction
  useEffect(() => {
    if (viewMode !== "home" || !hasPromptShown.current) return;
    setShowPrompt(false);
  }, [activeIndex, viewMode]);

  useEffect(() => {
    if (showLandscapeBlocker) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [showLandscapeBlocker]);

  if (!mounted) return null;

  return (
    <main
      className={`relative flex w-full bg-background transition-colors dark:bg-dark-background ${
        viewMode === "home" ? "touch-none overflow-y-hidden" : "touch-auto"
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
        className={`relative flex w-full max-w-5xl flex-col items-center gap-6 px-2`}
      >
        <MyName />
        {viewMode === "home" && showPrompt && (
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
            className="pointer-events-none fixed bottom-6 z-50 flex items-center space-x-2 rounded-lg bg-foreground px-4 py-2 font-sans text-sm text-background shadow-md dark:bg-dark-foreground dark:text-dark-background md:text-lg"
          >
            <span>Use scroll</span>
            <MouseScrollIcon size={24} />
            <span> or arrow keys</span>
            <ArrowSquareUpIcon size={24} />
            <ArrowSquareDownIcon size={24} />
            <span>to explore</span>
          </motion.div>
        )}
        {viewMode === "case-study" && <CaseStudyContent scrollY={scrollY} />}
        <AnimatePresence mode="wait">
          {summaryVariant && (
            <ProjectSummary
              key="project-summary"
              variant={summaryVariant}
              scrollY={scrollY}
            />
          )}
        </AnimatePresence>
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
