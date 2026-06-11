"use client";

import {
  motion,
  useScroll,
  AnimatePresence,
  useMotionValueEvent,
  useMotionValue,
} from "framer-motion";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsVerticalIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";

import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";

import GlyphCarousel from "./GlyphCarousel";
import TopBar from "./TopBar";
import ProjectSummary from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";
import MyName from "./MyName";
import HomeSymbolBackdrop from "./HomeSymbolBackdrop";
// import DebugViewport from "./DebugViewport";
import BottomBar from "./BottomBar";
type BottomNavigationState = {
  slug: string;
  phase: "exit" | "morph" | "route";
};

const BOTTOM_REVEAL_COMPLETION_BUFFER = 100;

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
  const bottomRevealProgress = useMotionValue(0);
  const bottomRevealAnchorRef = useRef<HTMLDivElement>(null);
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

  // Single state for current variant
  const [summaryVariant, setSummaryVariant] = useState<
    "preview" | "header" | "bottom" | null
  >("preview");

  const updateBottomRevealProgress = useCallback(() => {
    const anchor = bottomRevealAnchorRef.current;
    if (!anchor || viewMode !== "case-study") {
      bottomRevealProgress.set(0);
      return 0;
    }

    const visualViewport = window.visualViewport;
    const viewportHeight = visualViewport?.height ?? window.innerHeight;
    const viewportBottom = (visualViewport?.offsetTop ?? 0) + viewportHeight;
    const distanceFromBottom =
      anchor.getBoundingClientRect().top - viewportBottom;
    const revealDistance = viewportHeight * 0.5;
    const animationDistance = Math.max(
      1,
      revealDistance - BOTTOM_REVEAL_COMPLETION_BUFFER,
    );
    const progress = Math.min(
      1,
      Math.max(0, (revealDistance - distanceFromBottom) / animationDistance),
    );

    bottomRevealProgress.set(progress);
    return progress;
  }, [bottomRevealProgress, viewMode]);

  useEffect(() => {
    const handleGeometryChange = () => {
      const progress = updateBottomRevealProgress();

      if (
        bottomNavigation ||
        viewMode !== "case-study" ||
        scrollY.get() < window.innerHeight / 2
      ) {
        return;
      }

      setSummaryVariant(progress > 0 ? "bottom" : null);
    };

    handleGeometryChange();

    const observer = new ResizeObserver(handleGeometryChange);
    observer.observe(document.body);

    window.addEventListener("resize", handleGeometryChange);
    window.visualViewport?.addEventListener("resize", handleGeometryChange);
    window.visualViewport?.addEventListener("scroll", handleGeometryChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleGeometryChange);
      window.visualViewport?.removeEventListener(
        "resize",
        handleGeometryChange,
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        handleGeometryChange,
      );
    };
  }, [
    activeIndex,
    bottomNavigation,
    scrollY,
    updateBottomRevealProgress,
    viewMode,
  ]);

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
    const winHeight = window.innerHeight;
    const bottomProgress = updateBottomRevealProgress();

    if (y < winHeight / 2) {
      setSummaryVariant("header");
    } else if (bottomProgress > 0) {
      setSummaryVariant("bottom");
    } else {
      setSummaryVariant(null);
    }
  }, [bottomNavigation, viewMode, scrollY, updateBottomRevealProgress]);

  // Use useMotionValueEvent for efficient scroll handling
  useMotionValueEvent(scrollY, "change", (y) => {
    if (bottomNavigation) return;
    if (viewMode === "not-found") return;
    if (viewMode !== "case-study") {
      setSummaryVariant("preview");
      return;
    }

    const winHeight = window.innerHeight;
    const bottomProgress = updateBottomRevealProgress();

    if (y < winHeight / 2) {
      setSummaryVariant("header");
    } else if (bottomProgress > 0) {
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

      {/* <DebugViewport /> */}
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
          className="rounded-2 pointer-events-none fixed bottom-6 left-1/2 z-50 flex items-center space-x-2 bg-foreground px-4 py-2 font-sans text-sm text-background shadow-md dark:bg-dark-foreground dark:text-dark-background md:text-lg"
        >
          <span className="whitespace-nowrap">Use scroll</span>
          <span className="flex h-6 w-4 items-center justify-center rounded-full bg-sky-600 dark:bg-sky-400">
            <ArrowsVerticalIcon size={16} />
          </span>
          <span className="whitespace-nowrap"> or arrow keys</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 dark:bg-sky-400">
            <ArrowUpIcon size={12} weight="bold" />
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 dark:bg-sky-400">
            <ArrowDownIcon size={12} weight="bold" />
          </span>
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
        {viewMode === "case-study" &&
          (caseStudyContentReady || transitioningToNext) && (
            <div
              ref={bottomRevealAnchorRef}
              data-bottom-reveal-anchor
              aria-hidden="true"
              className="h-0 w-full"
            />
          )}
        <AnimatePresence mode="wait">
          {summaryVariant && (
            <ProjectSummary
              key="project-summary"
              variant={summaryVariant}
              scrollY={scrollY}
              bottomRevealProgress={bottomRevealProgress}
              isTransitionLocked={isBottomNavigationActive}
              onLayoutAnimationComplete={handleSummaryLayoutComplete}
              onBottomNavigationStart={handleBottomNavigationStart}
            />
          )}
        </AnimatePresence>
        {children}
      </motion.div>
      <div className="relative z-10 min-w-0 flex-1" />

      <BottomBar />
    </main>
  );
}
