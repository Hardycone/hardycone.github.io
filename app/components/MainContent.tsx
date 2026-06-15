"use client";

import {
  motion,
  useScroll,
  AnimatePresence,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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
import {
  HEADER_INTRO_DISTANCE_LVH,
  HEADER_PANE_NAV_CONTENT_FADE_MS,
  HEADER_PANE_NAV_DESTINATION_FADE_MS,
  HEADER_PANE_NAV_MORPH_MS,
  HEADER_PANE_NAV_MORPH_PROGRESS,
} from "@/lib/headerIntro";
// import DebugViewport from "./DebugViewport";
import BottomBar from "./BottomBar";
type BottomNavigationState = {
  slug: string;
  phase: "nav-exit" | "exit" | "morph" | "route";
};

type PaneNavSurface = "pane" | "nav";

const BOTTOM_REVEAL_COMPLETION_BUFFER = 100;
const CENTER_NAV_EXIT_DURATION = 180;
const PANE_NAV_TRAVELER_BACKGROUND_OPACITY = 0.4;

function withAlpha(color: string, alpha: number) {
  const channels = color.match(
    /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/,
  );

  if (!channels) {
    return color;
  }

  return `rgba(${channels[1]}, ${channels[2]}, ${channels[3]}, ${alpha})`;
}

function visibleBorderRadius(style: CSSStyleDeclaration, rect: DOMRect) {
  const radius = Number.parseFloat(style.borderTopLeftRadius);

  return `${Math.min(radius, rect.width / 2, rect.height / 2)}px`;
}

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
  const headerIntroProgress = useMotionValue(0);
  const smoothHeaderIntroProgress = useSpring(headerIntroProgress, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
    restDelta: 0.001,
    restSpeed: 0.01,
  });
  const headerIntroEndRef = useRef<HTMLDivElement>(null);
  const bottomRevealProgress = useMotionValue(0);
  const smoothBottomRevealProgress = useSpring(bottomRevealProgress, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
    restDelta: 0.001,
    restSpeed: 0.01,
  });
  const bottomRevealAnchorRef = useRef<HTMLDivElement>(null);
  const floatingPaneRef = useRef<HTMLDivElement>(null);
  const centerNavRef = useRef<HTMLDivElement>(null);
  const paneNavSurfaceRef = useRef<PaneNavSurface>("pane");
  const paneNavMorphingRef = useRef(false);
  const paneNavCloneRef = useRef<HTMLElement | null>(null);
  const paneNavAnimationRef = useRef<Animation | null>(null);
  const paneNavMorphStarterRef = useRef<
    ((destination: PaneNavSurface) => void) | null
  >(null);
  const instantHomeNavigationRef = useRef(false);
  const headerFadeTailPendingRef = useRef(false);
  const [paneNavSurface, setPaneNavSurface] = useState<PaneNavSurface>("pane");
  const [isPaneNavMorphing, setIsPaneNavMorphing] = useState(false);
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

  const updateHeaderIntroProgress = useCallback(
    (scrollPosition = scrollY.get()) => {
      const anchor = headerIntroEndRef.current;
      if (!anchor || viewMode !== "case-study") {
        headerFadeTailPendingRef.current = false;
        headerIntroProgress.set(0);
        return 0;
      }

      const previousProgress = headerIntroProgress.get();
      const anchorRect = anchor.getBoundingClientRect();
      const introDistance = scrollPosition + anchorRect.top;
      const progress =
        introDistance > 0
          ? Math.min(1, Math.max(0, scrollPosition / introDistance))
          : 1;

      if (progress < 1) {
        headerFadeTailPendingRef.current = false;
      } else if (previousProgress < 1) {
        headerFadeTailPendingRef.current =
          smoothHeaderIntroProgress.get() < 0.999;
      }

      headerIntroProgress.set(progress);
      return progress;
    },
    [headerIntroProgress, scrollY, smoothHeaderIntroProgress, viewMode],
  );

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

  const cleanupPaneNavMorph = useCallback(() => {
    paneNavAnimationRef.current?.cancel();
    paneNavAnimationRef.current = null;
    paneNavCloneRef.current?.remove();
    paneNavCloneRef.current = null;
    paneNavMorphingRef.current = false;
  }, []);

  const setPaneNavSurfaceImmediately = useCallback(
    (surface: PaneNavSurface) => {
      paneNavSurfaceRef.current = surface;
      setPaneNavSurface(surface);
      paneNavMorphingRef.current = false;
      setIsPaneNavMorphing(false);
    },
    [],
  );

  const handleInstantHomeNavigationStart = useCallback(() => {
    instantHomeNavigationRef.current = true;
  }, []);

  const startPaneNavMorph = useCallback(
    (destination: PaneNavSurface) => {
      if (
        paneNavMorphingRef.current ||
        paneNavSurfaceRef.current === destination
      ) {
        return;
      }

      const source =
        destination === "nav" ? floatingPaneRef.current : centerNavRef.current;
      const target =
        destination === "nav" ? centerNavRef.current : floatingPaneRef.current;
      const canAnimate = typeof HTMLElement.prototype.animate === "function";

      if (!source || !target || !canAnimate) {
        setPaneNavSurfaceImmediately(destination);
        return;
      }

      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      if (
        sourceRect.width === 0 ||
        sourceRect.height === 0 ||
        targetRect.width === 0 ||
        targetRect.height === 0
      ) {
        setPaneNavSurfaceImmediately(destination);
        return;
      }

      const sourceStyle = window.getComputedStyle(source);
      const targetStyle = window.getComputedStyle(target);
      const sourceBorderRadius = visibleBorderRadius(sourceStyle, sourceRect);
      const targetBorderRadius = visibleBorderRadius(targetStyle, targetRect);
      const travelerSourceBackground = withAlpha(
        sourceStyle.backgroundColor,
        PANE_NAV_TRAVELER_BACKGROUND_OPACITY,
      );
      const travelerTargetBackground = withAlpha(
        targetStyle.backgroundColor,
        PANE_NAV_TRAVELER_BACKGROUND_OPACITY,
      );
      const clone = source.cloneNode(true) as HTMLElement;

      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach((element) => {
        element.removeAttribute("id");
      });
      clone.setAttribute("aria-hidden", "true");
      Object.assign(clone.style, {
        position: "fixed",
        inset: "auto",
        left: `${sourceRect.left}px`,
        top: `${sourceRect.top}px`,
        width: `${sourceRect.width}px`,
        height: `${sourceRect.height}px`,
        minWidth: "0",
        minHeight: "0",
        maxWidth: "none",
        maxHeight: "none",
        margin: "0",
        opacity: "1",
        transform: "none",
        transformOrigin: "top left",
        filter: "none",
        overflow: "hidden",
        pointerEvents: "none",
        boxSizing: "border-box",
        zIndex: "49",
        transition: "none",
        willChange:
          "left, top, width, height, padding, border-radius, background-color, box-shadow",
      });

      document.body.appendChild(clone);
      paneNavCloneRef.current = clone;
      paneNavMorphingRef.current = true;
      setIsPaneNavMorphing(true);

      Array.from(clone.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          child.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: HEADER_PANE_NAV_CONTENT_FADE_MS,
            easing: "ease-out",
            fill: "forwards",
          });
        }
      });

      clone.animate(
        [
          {
            backgroundColor: sourceStyle.backgroundColor,
            boxShadow: sourceStyle.boxShadow,
          },
          {
            backgroundColor: travelerSourceBackground,
            boxShadow: "none",
          },
        ],
        {
          duration: HEADER_PANE_NAV_CONTENT_FADE_MS,
          easing: "ease-out",
          fill: "forwards",
        },
      );

      const animation = clone.animate(
        [
          {
            left: `${sourceRect.left}px`,
            top: `${sourceRect.top}px`,
            width: `${sourceRect.width}px`,
            height: `${sourceRect.height}px`,
            borderRadius: sourceBorderRadius,
            backgroundColor: travelerSourceBackground,
            boxShadow: "none",
            paddingTop: sourceStyle.paddingTop,
            paddingRight: sourceStyle.paddingRight,
            paddingBottom: sourceStyle.paddingBottom,
            paddingLeft: sourceStyle.paddingLeft,
          },
          {
            left: `${targetRect.left}px`,
            top: `${targetRect.top}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            borderRadius: targetBorderRadius,
            backgroundColor: travelerTargetBackground,
            boxShadow: "none",
            paddingTop: targetStyle.paddingTop,
            paddingRight: targetStyle.paddingRight,
            paddingBottom: targetStyle.paddingBottom,
            paddingLeft: targetStyle.paddingLeft,
          },
        ],
        {
          duration: HEADER_PANE_NAV_MORPH_MS,
          delay: HEADER_PANE_NAV_CONTENT_FADE_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );

      paneNavAnimationRef.current = animation;
      animation.onfinish = () => {
        animation.onfinish = null;
        paneNavAnimationRef.current = null;

        clone.style.backgroundColor = travelerTargetBackground;
        clone.style.boxShadow = "none";
        if (destination === "pane") {
          clone.style.zIndex = "9";
        }

        flushSync(() => {
          setPaneNavSurfaceImmediately(destination);
        });
        paneNavMorphingRef.current = true;

        const handoffAnimation = clone.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          {
            duration: HEADER_PANE_NAV_DESTINATION_FADE_MS,
            easing: "ease-out",
            fill: "forwards",
          },
        );

        paneNavAnimationRef.current = handoffAnimation;
        handoffAnimation.onfinish = () => {
          handoffAnimation.onfinish = null;
          paneNavAnimationRef.current = null;
          clone.remove();
          paneNavCloneRef.current = null;
          paneNavMorphingRef.current = false;

          const desiredSurface =
            headerIntroProgress.get() >= HEADER_PANE_NAV_MORPH_PROGRESS
              ? "nav"
              : "pane";

          if (desiredSurface !== paneNavSurfaceRef.current) {
            paneNavMorphStarterRef.current?.(desiredSurface);
          }
        };
      };
    },
    [headerIntroProgress, setPaneNavSurfaceImmediately],
  );

  paneNavMorphStarterRef.current = startPaneNavMorph;

  useMotionValueEvent(headerIntroProgress, "change", (progress) => {
    if (
      instantHomeNavigationRef.current ||
      viewMode !== "case-study" ||
      bottomNavigation
    ) {
      return;
    }

    const destination =
      progress >= HEADER_PANE_NAV_MORPH_PROGRESS ? "nav" : "pane";

    if (
      !paneNavMorphingRef.current &&
      paneNavSurfaceRef.current !== destination
    ) {
      startPaneNavMorph(destination);
    }
  });

  useEffect(() => {
    instantHomeNavigationRef.current = false;
    cleanupPaneNavMorph();
    setPaneNavSurfaceImmediately("pane");
  }, [
    activeIndex,
    cleanupPaneNavMorph,
    setPaneNavSurfaceImmediately,
    viewMode,
  ]);

  useEffect(() => cleanupPaneNavMorph, [cleanupPaneNavMorph]);

  useEffect(() => {
    const handleGeometryChange = () => {
      if (instantHomeNavigationRef.current) {
        return;
      }

      const headerProgress = updateHeaderIntroProgress();
      const progress = updateBottomRevealProgress();

      if (
        bottomNavigation ||
        viewMode !== "case-study" ||
        headerProgress < 1 ||
        headerFadeTailPendingRef.current
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
    smoothHeaderIntroProgress,
    updateBottomRevealProgress,
    updateHeaderIntroProgress,
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

    const headerProgress = updateHeaderIntroProgress();
    const bottomProgress = updateBottomRevealProgress();

    if (headerProgress < 1 || headerFadeTailPendingRef.current) {
      setSummaryVariant("header");
    } else if (bottomProgress > 0) {
      setSummaryVariant("bottom");
    } else {
      setSummaryVariant(null);
    }
  }, [
    bottomNavigation,
    viewMode,
    scrollY,
    updateBottomRevealProgress,
    updateHeaderIntroProgress,
  ]);

  // Use useMotionValueEvent for efficient scroll handling
  useMotionValueEvent(scrollY, "change", (y) => {
    if (instantHomeNavigationRef.current) return;
    if (bottomNavigation) return;
    if (viewMode === "not-found") return;
    if (viewMode !== "case-study") {
      setSummaryVariant("preview");
      return;
    }

    const headerProgress = updateHeaderIntroProgress(y);
    const bottomProgress = updateBottomRevealProgress();

    if (headerProgress < 1 || headerFadeTailPendingRef.current) {
      setSummaryVariant("header");
    } else if (bottomProgress > 0) {
      setSummaryVariant("bottom");
    } else {
      setSummaryVariant(null);
    }
  });

  useMotionValueEvent(smoothHeaderIntroProgress, "change", (progress) => {
    if (
      instantHomeNavigationRef.current ||
      bottomNavigation ||
      viewMode !== "case-study" ||
      headerIntroProgress.get() < 1
    ) {
      return;
    }

    if (headerFadeTailPendingRef.current && progress < 0.999) {
      setSummaryVariant("header");
      return;
    }

    headerFadeTailPendingRef.current = false;
    setSummaryVariant(bottomRevealProgress.get() > 0 ? "bottom" : null);
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
    setBottomNavigation({ slug, phase: "nav-exit" });
  }, []);

  useEffect(() => {
    if (bottomNavigation?.phase !== "nav-exit") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setTransitioningToNext(true);
      setBottomNavigation((navigation) =>
        navigation?.phase === "nav-exit"
          ? { ...navigation, phase: "exit" }
          : navigation,
      );
    }, CENTER_NAV_EXIT_DURATION);

    return () => window.clearTimeout(timeout);
  }, [bottomNavigation, setTransitioningToNext]);

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
          ? "h-[100svh] touch-none overflow-y-hidden"
          : isCaseStudyScrollLocked
            ? "touch-none"
            : "touch-auto"
      }`}
    >
      {viewMode === "home" && <HomeSymbolBackdrop activeIndex={activeIndex} />}
      <TopBar
        centerNavRef={centerNavRef}
        showCenterNav={
          paneNavSurface === "nav" &&
          !isPaneNavMorphing &&
          !isBottomNavigationActive
        }
        retractCenterNav={isBottomNavigationActive}
        onInstantHomeNavigationStart={handleInstantHomeNavigationStart}
      />
      {viewMode === "case-study" && (
        <div
          ref={headerIntroEndRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${HEADER_INTRO_DISTANCE_LVH}lvh` }}
        />
      )}

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
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex items-center space-x-2 rounded-2 bg-sky-600 px-4 py-2 font-sans text-sm text-background shadow-md dark:bg-sky-400 dark:text-dark-background md:text-lg"
        >
          <span className="whitespace-nowrap">Use scroll</span>
          <span className="flex h-6 w-4 items-center justify-center rounded-full bg-background text-sky-600 dark:bg-dark-background dark:text-sky-400">
            <ArrowsVerticalIcon size={16} />
          </span>
          <span className="whitespace-nowrap"> or arrow keys</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-background text-sky-600 dark:bg-dark-background dark:text-sky-400">
            <ArrowUpIcon size={12} weight="bold" />
          </span>
          <span className="dark:text-sky-40 flex h-6 w-6 items-center justify-center rounded-md bg-background text-sky-600 dark:bg-dark-background dark:text-sky-400">
            <ArrowDownIcon size={12} weight="bold" />
          </span>
          <span className="whitespace-nowrap">to explore</span>
        </motion.div>
      )}
      <motion.div
        className={`relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 px-2 md:px-4`}
      >
        <MyName />
        {viewMode === "case-study" &&
          (caseStudyContentReady || transitioningToNext) && (
            <CaseStudyContent
              scrollY={scrollY}
              headerIntroProgress={headerIntroProgress}
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
              headerIntroProgress={headerIntroProgress}
              headerVisualProgress={smoothHeaderIntroProgress}
              bottomRevealProgress={bottomRevealProgress}
              bottomVisualProgress={smoothBottomRevealProgress}
              floatingPaneRef={floatingPaneRef}
              isFloatingPaneVisible={
                summaryVariant !== "header" ||
                (paneNavSurface === "pane" && !isPaneNavMorphing)
              }
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
