"use client";

import {
  motion,
  useScroll,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowSquareUpIcon,
  ArrowSquareDownIcon,
  MouseScrollIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";

import DebugViewport from "./DebugViewport";

import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";

import GlyphCarousel from "./GlyphCarousel";
import TopBar from "./TopBar";
import ProjectSummary from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";
import MyName from "./MyName";
import HomeSymbolBackdrop from "./HomeSymbolBackdrop";

type BottomNavigationState = {
  slug: string;
  phase: "exit" | "morph" | "route";
};

export default function MainContent({ children }: { children: ReactNode }) {
  const { activeIndex, transitioningToNext, setTransitioningToNext } =
    useActiveProject();
  const { viewMode } = useViewMode();
  const router = useRouter();

  const [showPrompt, setShowPrompt] = useState(false);
  const hasPromptShown = useRef(false);
  // const [showLandscapeBlocker, setShowLandscapeBlocker] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [caseStudyContentReady, setCaseStudyContentReady] = useState(false);
  const [bottomNavigation, setBottomNavigation] =
    useState<BottomNavigationState | null>(null);

  const { scrollY } = useScroll();
  const caseStudyExitDirection = transitioningToNext ? "up" : "down";
  const isCaseStudyScrollLocked =
    viewMode === "case-study" &&
    (!caseStudyContentReady || transitioningToNext);
  const isHomeScrollLocked = viewMode === "home";
  const isPageScrollLocked = isHomeScrollLocked || isCaseStudyScrollLocked;
  const isBottomNavigationActive = bottomNavigation !== null;
  // Keep the home rail's intrinsic width during the preview-to-header morph so
  // Framer measures the ProjectSummary from a stable source rect.
  const shouldReserveGlyphRail =
    viewMode === "home" ||
    (viewMode === "case-study" &&
      !caseStudyContentReady &&
      !transitioningToNext);

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
    if (bottomNavigation) {
      return;
    }

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
  }, [bottomNavigation, viewMode, docDimensions, scrollY]);

  // Use useMotionValueEvent for efficient scroll handling
  useMotionValueEvent(scrollY, "change", (y) => {
    if (bottomNavigation) return;
    if (viewMode === "not-found") return;
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

  // useEffect(() => {
  //   const handleOrientationChange = () => {
  //     const isMobile = /iPhone|Android/i.test(navigator.userAgent);
  //     const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  //     const shouldBlock = isMobile && isLandscape && viewMode === "home";
  //     setShowLandscapeBlocker(shouldBlock);
  //   };

  //   handleOrientationChange();
  //   window.addEventListener("orientationchange", handleOrientationChange);
  //   window.addEventListener("resize", handleOrientationChange);
  //   return () => {
  //     window.removeEventListener("orientationchange", handleOrientationChange);
  //     window.removeEventListener("resize", handleOrientationChange);
  //   };
  // }, [viewMode]);
  useEffect(() => {
    // Scroll to top on page/view change
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      if (viewMode === "case-study") {
        setSummaryVariant("header");
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [activeIndex, viewMode]);

  const handleBottomNavigationStart = useCallback((slug: string) => {
    setSummaryVariant("bottom");
    setBottomNavigation({ slug, phase: "exit" });
  }, []);

  const handleCaseStudyExitComplete = useCallback(() => {
    setBottomNavigation((navigation) => {
      if (!navigation || navigation.phase !== "exit") {
        return navigation;
      }

      return { ...navigation, phase: "morph" };
    });
  }, []);

  useEffect(() => {
    if (bottomNavigation?.phase !== "morph") {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setSummaryVariant("header");
    });

    return () => cancelAnimationFrame(frame);
  }, [bottomNavigation]);

  useEffect(() => {
    if (bottomNavigation?.phase !== "route") {
      return;
    }

    if (projects[activeIndex]?.slug !== bottomNavigation.slug) {
      return;
    }

    let secondFrame: number | null = null;
    const firstFrame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      scrollY.set(0);

      secondFrame = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        scrollY.set(0);
        setCaseStudyContentReady(true);
        setTransitioningToNext(false);
        setBottomNavigation(null);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) {
        cancelAnimationFrame(secondFrame);
      }
    };
  }, [activeIndex, bottomNavigation, scrollY, setTransitioningToNext]);

  useEffect(() => {
    if (!bottomNavigation || bottomNavigation.phase === "route") {
      return;
    }

    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      scrollY.set(0);
      setSummaryVariant("header");
      setBottomNavigation({ slug: bottomNavigation.slug, phase: "route" });
      router.push(`/${bottomNavigation.slug}`);
    }, 1800);

    return () => clearTimeout(timeout);
  }, [bottomNavigation, router, scrollY]);

  const handleSummaryLayoutComplete = useCallback(() => {
    if (viewMode !== "case-study" || summaryVariant !== "header") {
      return;
    }

    if (bottomNavigation?.phase === "morph") {
      const targetSlug = bottomNavigation.slug;
      setBottomNavigation({ slug: targetSlug, phase: "route" });
      window.scrollTo({ top: 0, behavior: "auto" });
      scrollY.set(0);
      router.push(`/${targetSlug}`);
      return;
    }

    if (bottomNavigation) {
      return;
    }

    setCaseStudyContentReady(true);
  }, [bottomNavigation, router, scrollY, summaryVariant, viewMode]);

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
    if (isPageScrollLocked) {
      document.body.style.overflow = "hidden";
      // document.body.style.position = "fixed";
      // document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      // document.body.style.position = "";
      // document.body.style.width = "";
    }
  }, [isPageScrollLocked]);

  useEffect(() => {
    if (viewMode !== "case-study") {
      setCaseStudyContentReady(false);
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === "case-study") {
      setCaseStudyContentReady(false);
    }
  }, [activeIndex, viewMode]);

  useEffect(() => {
    if (transitioningToNext) {
      setCaseStudyContentReady(false);
    }
  }, [transitioningToNext]);

  // Never let a missed layout-complete callback strand the case study in its
  // scroll-locked transition state. This is mostly a mobile Safari guardrail.
  useEffect(() => {
    if (
      viewMode !== "case-study" ||
      caseStudyContentReady ||
      isBottomNavigationActive
    ) {
      return;
    }

    const timeout = setTimeout(
      () => {
        setSummaryVariant("header");
        setCaseStudyContentReady(true);
        if (transitioningToNext) {
          setTransitioningToNext(false);
        }
      },
      transitioningToNext ? 900 : 700,
    );

    return () => clearTimeout(timeout);
  }, [
    activeIndex,
    caseStudyContentReady,
    isBottomNavigationActive,
    setTransitioningToNext,
    transitioningToNext,
    viewMode,
  ]);

  // Keep the heavy case-study subtree out of the summary layout morph.
  useEffect(() => {
    if (
      viewMode !== "case-study" ||
      summaryVariant !== "header" ||
      caseStudyContentReady ||
      isBottomNavigationActive
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      setCaseStudyContentReady(true);
    }, 700);

    return () => clearTimeout(timeout);
  }, [
    caseStudyContentReady,
    isBottomNavigationActive,
    summaryVariant,
    viewMode,
  ]);

  if (!mounted) return null;

  return (
    <main
      className={`relative isolate flex w-full bg-background transition-colors dark:bg-dark-background ${
        isHomeScrollLocked
          ? "h-[100dvh] touch-none overflow-y-hidden"
          : isCaseStudyScrollLocked
            ? "touch-none"
            : "touch-auto"
      }`}
    >
      {viewMode === "home" && <HomeSymbolBackdrop activeIndex={activeIndex} />}
      <TopBar />
      <span className="fixed z-50 tall:hidden wide:hidden">Normal</span>
      <span className="fixed z-50 hidden wide:block superwide:hidden">
        Wide
      </span>
      <span className="fixed z-50 hidden superwide:block extremelywide:hidden">
        Super Wide
      </span>
      <span className="fixed z-50 hidden extremelywide:block">
        Extremely Wide
      </span>
      <span className="fixed z-50 hidden tall:block supertall:hidden">
        Tall
      </span>
      <span className="fixed z-50 hidden supertall:block">Super Tall</span>
      <DebugViewport />
      <div
        className={`relative z-10 flex flex-1 flex-col overflow-hidden ${
          shouldReserveGlyphRail ? "min-w-max" : ""
        }`}
      >
        <GlyphCarousel />
      </div>
      {viewMode === "home" && showPrompt && (
        <motion.div
          initial={{ x: "-50%", y: -100, opacity: 0 }}
          animate={{
            x: "-50%",
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
          exit={{ x: "-50%", y: -100, opacity: 0 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex items-center space-x-2 rounded-lg bg-foreground px-4 py-2 font-sans text-sm text-background shadow-md dark:bg-dark-foreground dark:text-dark-background md:text-lg"
        >
          <span className="whitespace-nowrap">Use scroll</span>
          <MouseScrollIcon size={24} />
          <span className="whitespace-nowrap"> or arrow keys</span>
          <ArrowSquareUpIcon size={24} />
          <ArrowSquareDownIcon size={24} />
          <span className="whitespace-nowrap">to explore</span>
        </motion.div>
      )}
      <motion.div
        className={`relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 px-2`}
      >
        <MyName />
        {viewMode === "case-study" &&
          (caseStudyContentReady || transitioningToNext) && (
            <CaseStudyContent
              scrollY={scrollY}
              isVisible={caseStudyContentReady && !transitioningToNext}
              exitDirection={caseStudyExitDirection}
              onExitComplete={handleCaseStudyExitComplete}
            />
          )}
        <AnimatePresence mode="wait">
          {summaryVariant && (
            <ProjectSummary
              key="project-summary"
              variant={summaryVariant}
              scrollY={scrollY}
              isTransitionLocked={isBottomNavigationActive}
              onLayoutAnimationComplete={handleSummaryLayoutComplete}
              onBottomNavigationStart={handleBottomNavigationStart}
            />
          )}
        </AnimatePresence>
        {children}
      </motion.div>
      <div className="relative z-10 min-w-0 flex-1" />
      {/* {showLandscapeBlocker && (
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
      )} */}
    </main>
  );
}
