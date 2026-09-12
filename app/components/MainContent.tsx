"use client";

import {
  motion,
  useScroll,
  AnimatePresence,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  LayoutGroup,
  type Variants,
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
import type { SummaryTransitionRect } from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";
import MyName from "./MyName";
import HomeSymbolBackdrop from "./HomeSymbolBackdrop";
import {
  HEADER_INTRO_DISTANCE_SVH,
  HEADER_PANE_NAV_CONTENT_FADE_MS,
  HEADER_PANE_NAV_DESTINATION_FADE_MS,
  HEADER_PANE_NAV_MORPH_MS,
  HEADER_PANE_NAV_MORPH_PROGRESS,
  HEADER_HERO_FOCUS_PROGRESS,
  HEADER_IMAGE_FADE_START_PROGRESS,
} from "@/lib/caseStudyTransitions";
// import DebugViewport from "./DebugViewport";
import BottomBar from "./BottomBar";
type BottomNavigationState = {
  slug: string;
  targetIndex: number;
  sourceRect: SummaryTransitionRect | null;
  phase: "nav-exit" | "exit" | "morph" | "route";
};

type HomeToCaseTransitionState = {
  viewportCenterOffset: number;
};

type PaneNavSurface = "pane" | "nav";

const CENTER_NAV_EXIT_DURATION = 180;
const PANE_NAV_TRAVELER_BACKGROUND_OPACITY = 0.6;
const HOME_PROJECT_TRANSITION = {
  duration: 0.36,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

type HomeProjectDirection = "up" | "down";

type TopSummaryTransitionState = {
  isHome: boolean;
  direction: HomeProjectDirection;
};

function getHomeProjectDirection(
  activeIndex: number,
  previousIndex: number | undefined,
): HomeProjectDirection {
  if (previousIndex === undefined || activeIndex === previousIndex) return "up";

  return activeIndex > previousIndex ? "up" : "down";
}

function homeProjectTravelDistance() {
  return window.innerHeight;
}

const topSummaryProjectVariants: Variants = {
  initial: ({ isHome, direction }: TopSummaryTransitionState) => ({
    y: isHome
      ? direction === "up"
        ? homeProjectTravelDistance()
        : -homeProjectTravelDistance()
      : 0,
    opacity: isHome ? 0 : 1,
    visibility: "visible",
  }),
  center: {
    y: 0,
    opacity: 1,
    visibility: "visible",
    transition: {
      y: HOME_PROJECT_TRANSITION,
      opacity: HOME_PROJECT_TRANSITION,
    },
  },
  exit: ({ isHome, direction }: TopSummaryTransitionState) => ({
    y: isHome
      ? direction === "up"
        ? -homeProjectTravelDistance()
        : homeProjectTravelDistance()
      : 0,
    opacity: isHome ? 0 : 1,
    transitionEnd: isHome ? { visibility: "hidden" } : undefined,
    transition: isHome
      ? {
          y: HOME_PROJECT_TRANSITION,
          opacity: HOME_PROJECT_TRANSITION,
        }
      : { duration: 0 },
  }),
};

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

function visibleCornerShape(style: CSSStyleDeclaration) {
  return style.getPropertyValue("corner-shape").trim();
}

export default function MainContent({ children }: { children: ReactNode }) {
  const {
    activeIndex,
    previousIndex,
    transitioningToNext,
    setTransitioningToNext,
  } = useActiveProject();
  const { viewMode } = useViewMode();
  const router = useRouter();

  const [showPrompt, setShowPrompt] = useState(false);
  const hasPromptShown = useRef(false);
  // const [showLandscapeBlocker, setShowLandscapeBlocker] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [bottomNavigation, setBottomNavigation] =
    useState<BottomNavigationState | null>(null);
  const [homeToCaseTransition, setHomeToCaseTransition] =
    useState<HomeToCaseTransitionState | null>(null);
  const [caseStudyIndex, setCaseStudyIndex] = useState(activeIndex);

  const { scrollY } = useScroll();
  const headerIntroProgress = useMotionValue(0);
  const smoothHeaderIntroProgress = useSpring(headerIntroProgress, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
    restDelta: 0.001,
    restSpeed: 0.01,
  });
  const headerHeroFocusRef = useRef<HTMLDivElement>(null);
  const headerIntroEndRef = useRef<HTMLDivElement>(null);
  const bottomRevealProgress = useMotionValue(0);
  const smoothBottomRevealProgress = useSpring(bottomRevealProgress, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
    restDelta: 0.001,
    restSpeed: 0.01,
  });
  const bottomSummaryRef = useRef<HTMLDivElement>(null);
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
  const [paneNavSurface, setPaneNavSurface] = useState<PaneNavSurface>("pane");
  const [isPaneNavMorphing, setIsPaneNavMorphing] = useState(false);
  const [sectionHighlightEnabled, setSectionHighlightEnabled] = useState(false);
  const sectionHighlightEnabledRef = useRef(false);
  const caseStudyExitDirection = transitioningToNext ? "up" : "down";
  const isCaseStudyScrollLocked =
    viewMode === "case-study" &&
    (transitioningToNext || homeToCaseTransition !== null);
  const isHomeScrollLocked = viewMode === "home";
  const isPageScrollLocked = isHomeScrollLocked || isCaseStudyScrollLocked;
  const isBottomNavigationActive = bottomNavigation !== null;
  const shouldReserveGlyphRail =
    viewMode === "home" || homeToCaseTransition !== null;

  const updateSectionHighlightEnabled = useCallback((enabled: boolean) => {
    if (sectionHighlightEnabledRef.current === enabled) {
      return;
    }

    sectionHighlightEnabledRef.current = enabled;
    setSectionHighlightEnabled(enabled);
  }, []);

  const updateHeaderIntroProgress = useCallback(
    (scrollPosition = scrollY.get()) => {
      const anchor = headerIntroEndRef.current;
      if (!anchor || viewMode !== "case-study") {
        floatingPaneRef.current?.style.removeProperty("translate");
        headerIntroProgress.set(0);
        updateSectionHighlightEnabled(false);
        return 0;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const introDistance = scrollPosition + anchorRect.top;
      const paneScrollCompensation = Math.min(
        Math.max(0, scrollPosition),
        Math.max(0, introDistance),
      );
      const progress =
        introDistance > 0
          ? Math.min(1, Math.max(0, scrollPosition / introDistance))
          : 1;

      floatingPaneRef.current?.style.setProperty(
        "translate",
        `0 ${paneScrollCompensation}px`,
      );
      headerIntroProgress.set(progress);
      updateSectionHighlightEnabled(
        progress >= HEADER_IMAGE_FADE_START_PROGRESS,
      );
      return progress;
    },
    [headerIntroProgress, scrollY, updateSectionHighlightEnabled, viewMode],
  );

  const scrollToHeaderHeroFocus = useCallback(() => {
    const target = headerHeroFocusRef.current;
    if (!target) return;

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, []);

  const updateBottomRevealProgress = useCallback(() => {
    const summary = bottomSummaryRef.current;
    if (!summary || viewMode !== "case-study") {
      bottomRevealProgress.set(0);
      return 0;
    }

    const visualViewport = window.visualViewport;
    const viewportHeight = visualViewport?.height ?? window.innerHeight;
    const viewportBottom = (visualViewport?.offsetTop ?? 0) + viewportHeight;
    const summaryRect = summary.getBoundingClientRect();
    const distanceIntoViewport = viewportBottom - summaryRect.top;
    const animationDistance = Math.max(1, summaryRect.height);
    const progress = Math.min(
      1,
      Math.max(0, distanceIntoViewport / animationDistance),
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
      const sourceCornerShape = visibleCornerShape(sourceStyle);
      const targetCornerShape = visibleCornerShape(targetStyle);
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
        translate: "none",
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
      if (sourceCornerShape) {
        clone.style.setProperty("corner-shape", sourceCornerShape);
      }

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

      const cornerShapeSwitchOffset = 0.5;
      const cornerShapeSwitchTimeout = window.setTimeout(
        () => {
          if (paneNavCloneRef.current !== clone) {
            return;
          }

          if (targetCornerShape) {
            clone.style.setProperty("corner-shape", targetCornerShape);
          } else {
            clone.style.removeProperty("corner-shape");
          }
        },
        HEADER_PANE_NAV_CONTENT_FADE_MS +
          HEADER_PANE_NAV_MORPH_MS * cornerShapeSwitchOffset,
      );

      const animation = clone.animate(
        [
          {
            offset: 0,
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
            offset: 1,
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
        window.clearTimeout(cornerShapeSwitchTimeout);
        animation.onfinish = null;
        animation.oncancel = null;
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
      animation.oncancel = () => {
        window.clearTimeout(cornerShapeSwitchTimeout);
        animation.onfinish = null;
        animation.oncancel = null;
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

      updateHeaderIntroProgress();
      updateBottomRevealProgress();
    };

    handleGeometryChange();

    const observer = new ResizeObserver(handleGeometryChange);
    observer.observe(document.body);

    window.addEventListener("scroll", handleGeometryChange, { passive: true });
    window.addEventListener("resize", handleGeometryChange);
    window.visualViewport?.addEventListener("resize", handleGeometryChange);
    window.visualViewport?.addEventListener("scroll", handleGeometryChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleGeometryChange);
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

  useMotionValueEvent(scrollY, "change", (y) => {
    if (instantHomeNavigationRef.current) return;
    if (bottomNavigation) return;
    if (viewMode !== "case-study") return;

    updateHeaderIntroProgress(y);
    updateBottomRevealProgress();
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
  const resetCaseStudyScroll = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    scrollY.set(0);
    headerIntroProgress.set(0);
    smoothHeaderIntroProgress.jump(0);
    bottomRevealProgress.set(0);
    smoothBottomRevealProgress.jump(0);
  }, [
    bottomRevealProgress,
    headerIntroProgress,
    scrollY,
    smoothBottomRevealProgress,
    smoothHeaderIntroProgress,
  ]);

  useEffect(() => {
    if (bottomNavigation || viewMode !== "case-study") {
      return;
    }

    const timeout = setTimeout(resetCaseStudyScroll, 0);
    return () => clearTimeout(timeout);
    // A handoff owns project identity until its shared layout animation ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, viewMode, resetCaseStudyScroll]);

  const handleBottomNavigationStart = useCallback(
    (slug: string, sourceRect: SummaryTransitionRect | null) => {
      if (bottomNavigation) return;

      const targetIndex = projects.findIndex(
        (project) => project.slug === slug,
      );
      if (targetIndex < 0) return;

      setCaseStudyIndex(activeIndex);
      setBottomNavigation({
        slug,
        targetIndex,
        sourceRect,
        phase: "nav-exit",
      });
    },
    [activeIndex, bottomNavigation],
  );

  const handlePreviewNavigationStart = useCallback(
    (sourceRect: SummaryTransitionRect | null) => {
      const viewportCenterOffset = sourceRect
        ? sourceRect.left + sourceRect.width / 2 - window.innerWidth / 2
        : 0;

      setHomeToCaseTransition({ viewportCenterOffset });
    },
    [],
  );

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

  const beginProjectHandoff = useCallback(
    (navigation: BottomNavigationState) => {
      resetCaseStudyScroll();

      flushSync(() => {
        setCaseStudyIndex(navigation.targetIndex);
        setBottomNavigation({ ...navigation, phase: "morph" });
      });

      router.push(`/${navigation.slug}`);
    },
    [resetCaseStudyScroll, router],
  );

  const handleCaseStudyExitComplete = useCallback(() => {
    if (bottomNavigation?.phase !== "exit") return;
    beginProjectHandoff(bottomNavigation);
  }, [beginProjectHandoff, bottomNavigation]);

  useEffect(() => {
    if (
      !bottomNavigation ||
      bottomNavigation.phase === "morph" ||
      bottomNavigation.phase === "route"
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      setTransitioningToNext(true);
      beginProjectHandoff(bottomNavigation);
    }, 1800);

    return () => clearTimeout(timeout);
  }, [bottomNavigation, beginProjectHandoff, setTransitioningToNext]);

  const handleSummaryLayoutComplete = useCallback(() => {
    if (viewMode === "case-study" && homeToCaseTransition) {
      setHomeToCaseTransition(null);
    }

    if (viewMode !== "case-study" || bottomNavigation?.phase !== "morph") {
      return;
    }

    const targetIndex = bottomNavigation.targetIndex;

    setBottomNavigation((navigation) =>
      navigation?.phase === "morph" && navigation.targetIndex === targetIndex
        ? { ...navigation, phase: "route" }
        : navigation,
    );
  }, [bottomNavigation, homeToCaseTransition, viewMode]);

  useEffect(() => {
    if (viewMode !== "case-study" || !homeToCaseTransition) return;

    const timeout = window.setTimeout(() => {
      setHomeToCaseTransition(null);
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [homeToCaseTransition, viewMode]);

  const finishProjectHandoff = useCallback(() => {
    resetCaseStudyScroll();
    setTransitioningToNext(false);
    setBottomNavigation(null);
  }, [resetCaseStudyScroll, setTransitioningToNext]);

  useEffect(() => {
    if (
      bottomNavigation?.phase !== "route" ||
      activeIndex !== bottomNavigation.targetIndex
    ) {
      return;
    }

    const frame = requestAnimationFrame(finishProjectHandoff);
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, bottomNavigation, finishProjectHandoff]);

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

  // A missed shared-layout completion callback should still hide the source,
  // but only the destination-index effect may unlock the handoff. Revealing the
  // source while the URL-derived active index is stale causes it to project
  // back across the new header.
  useEffect(() => {
    if (bottomNavigation?.phase !== "morph") return;

    const timeout = setTimeout(() => {
      setBottomNavigation((navigation) =>
        navigation?.phase === "morph"
          ? { ...navigation, phase: "route" }
          : navigation,
      );
    }, 1800);

    return () => clearTimeout(timeout);
  }, [bottomNavigation]);

  if (!mounted) return null;

  const renderedCaseStudyIndex = bottomNavigation
    ? caseStudyIndex
    : activeIndex;
  const topSummaryIndex =
    viewMode === "case-study" ? renderedCaseStudyIndex : activeIndex;
  const topSummaryVariant = viewMode === "case-study" ? "header" : "preview";
  const homeProjectDirection = getHomeProjectDirection(
    activeIndex,
    previousIndex,
  );
  const topSummaryTransitionState: TopSummaryTransitionState = {
    isHome: viewMode === "home",
    direction: homeProjectDirection,
  };
  const showTopSummary = viewMode === "home" || viewMode === "case-study";
  const nextProjectIndex = (renderedCaseStudyIndex + 1) % projects.length;
  const renderedBottomProjectIndex =
    bottomNavigation?.targetIndex ?? nextProjectIndex;
  const isOutgoingHeaderHidden =
    bottomNavigation?.phase === "nav-exit" ||
    bottomNavigation?.phase === "exit";

  return (
    <main
      className={`relative isolate flex w-full overflow-x-clip bg-background transition-colors dark:bg-dark-background ${
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
        sectionHighlightEnabled={sectionHighlightEnabled}
        onInstantHomeNavigationStart={handleInstantHomeNavigationStart}
      />
      {/* <DebugViewport /> */}
      <div
        className={`relative z-10 flex flex-1 flex-col overflow-hidden ${
          shouldReserveGlyphRail ? "min-w-max" : ""
        } ${viewMode === "case-study" ? "pointer-events-none" : ""}`}
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
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex items-center gap-2 rounded-2 bg-sky-600 px-4 py-2 font-sans text-sm text-background shadow-md supports-[corner-shape:squircle]:rounded-4 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-sky-400 dark:text-dark-background md:text-lg"
        >
          <span className="hidden whitespace-nowrap md:inline">Use scroll</span>
          <span className="inline md:hidden">Scroll</span>
          <span className="inline-flex h-6 w-4 items-center justify-center rounded-full bg-background text-sky-600 dark:bg-dark-background dark:text-sky-400">
            <ArrowsVerticalIcon size={16} />
          </span>
          <span className="hidden whitespace-nowrap md:inline">
            {" "}
            or arrow keys
          </span>
          <span className="hidden h-6 w-6 items-center justify-center rounded-md bg-background text-sky-600 dark:bg-dark-background dark:text-sky-400 md:inline-flex">
            <ArrowUpIcon size={12} weight="bold" />
          </span>
          <span className="dark:text-sky-40 hidden h-6 w-6 items-center justify-center rounded-md bg-background text-sky-600 dark:bg-dark-background dark:text-sky-400 md:inline-flex">
            <ArrowDownIcon size={12} weight="bold" />
          </span>
          <span className="whitespace-nowrap">to explore</span>
        </motion.div>
      )}
      <motion.div
        className={`relative z-10 flex w-full max-w-5xl flex-col items-start px-2 md:px-4 ${viewMode === "home" ? "gap-6" : "gap-0"}`}
      >
        <MyName />
        <LayoutGroup id="project-summaries">
          <div
            className="relative h-[100svh] w-full"
            style={
              viewMode === "case-study"
                ? {
                    width: "100vw",
                    marginLeft: `calc((100% - 100vw) / 2 + ${-(homeToCaseTransition?.viewportCenterOffset ?? 0)}px)`,
                  }
                : undefined
            }
          >
            {viewMode === "case-study" && (
              <>
                <div
                  ref={headerHeroFocusRef}
                  data-header-hero-focus-target
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 z-20 h-px w-full"
                  style={{
                    top: `${HEADER_INTRO_DISTANCE_SVH * HEADER_HERO_FOCUS_PROGRESS}svh`,
                  }}
                />
                <div
                  ref={headerIntroEndRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 z-20 h-px w-px"
                  style={{ top: `${HEADER_INTRO_DISTANCE_SVH}svh` }}
                />
              </>
            )}
            <AnimatePresence
              initial={false}
              custom={topSummaryTransitionState}
              mode="popLayout"
            >
              {showTopSummary && (
                <motion.div
                  key={`top-summary-${projects[topSummaryIndex].id}`}
                  custom={topSummaryTransitionState}
                  variants={topSummaryProjectVariants}
                  initial="initial"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full"
                >
                  <ProjectSummary
                    variant={topSummaryVariant}
                    projectIndex={topSummaryIndex}
                    headerIntroProgress={headerIntroProgress}
                    headerVisualProgress={smoothHeaderIntroProgress}
                    bottomVisualProgress={smoothBottomRevealProgress}
                    floatingPaneRef={
                      viewMode === "case-study" ? floatingPaneRef : undefined
                    }
                    isFloatingPaneVisible={
                      viewMode !== "case-study" ||
                      (paneNavSurface === "pane" && !isPaneNavMorphing)
                    }
                    isTransitionLocked={
                      viewMode === "case-study" && isBottomNavigationActive
                    }
                    isHandoffSourceHidden={
                      viewMode === "case-study" && isOutgoingHeaderHidden
                    }
                    onHeaderBackgroundClick={
                      viewMode === "case-study" && !transitioningToNext
                        ? scrollToHeaderHeroFocus
                        : undefined
                    }
                    onLayoutAnimationComplete={
                      viewMode === "case-study"
                        ? handleSummaryLayoutComplete
                        : undefined
                    }
                    onPreviewNavigationStart={handlePreviewNavigationStart}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {viewMode === "case-study" && (
            <CaseStudyContent
              projectIndex={renderedCaseStudyIndex}
              scrollY={scrollY}
              isVisible={!transitioningToNext}
              exitDirection={caseStudyExitDirection}
              onExitComplete={handleCaseStudyExitComplete}
            />
          )}

          {viewMode === "case-study" && (
            <div
              ref={bottomSummaryRef}
              className="relative h-[max(60svh,300px)]"
              style={{
                width: "min(100vw, 72rem)",
                marginLeft: "calc((100% - min(100vw, 72rem)) / 2)",
              }}
            >
              <ProjectSummary
                key={`bottom-${projects[renderedBottomProjectIndex].id}`}
                variant="bottom"
                projectIndex={renderedBottomProjectIndex}
                headerIntroProgress={headerIntroProgress}
                headerVisualProgress={smoothHeaderIntroProgress}
                bottomVisualProgress={smoothBottomRevealProgress}
                isTransitionLocked={isBottomNavigationActive}
                isHandoffSourceHidden={bottomNavigation?.phase === "route"}
                transitionRect={bottomNavigation?.sourceRect}
                onBottomNavigationStart={handleBottomNavigationStart}
              />
            </div>
          )}
        </LayoutGroup>
        {children}
      </motion.div>
      <div
        className={`relative z-10 min-w-0 flex-1 ${
          viewMode === "case-study" ? "pointer-events-none" : ""
        }`}
      />

      <BottomBar />
    </main>
  );
}
