"use client";

import {
  motion,
  useScroll,
  AnimatePresence,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  useTransform,
  LayoutGroup,
  type Variants,
} from "framer-motion";
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsVerticalIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";

import { useSiteNavigation } from "../context/SiteNavigationContext";
import { useIsMdUp } from "@/hooks/useIsMdUp";

import GlyphCarousel from "./GlyphCarousel";
import TopBar from "./TopBar";
import ProjectSummary from "./ProjectSummary";
import type { SummaryTransitionRect } from "./ProjectSummary";
import CaseStudyContent from "./CaseStudyContent";
import MyName from "./MyName";
import HomeSymbolBackdrop from "./HomeSymbolBackdrop";
import {
  HEADER_PANE_NAV_CONTENT_FADE_MS,
  HEADER_PANE_NAV_DESTINATION_FADE_MS,
  HEADER_PANE_NAV_MORPH_MS,
  HEADER_PANE_NAV_REVERSE_DELAY_MS,
  HEADER_PANE_NAV_MORPH_TRIGGER_PX,
  HEADER_PANE_NAV_REVERSE_OFFSET_PX,
  HEADER_STICKY_RUNWAY_PX,
  HEADER_BOTTOM_CLEARANCE_MOBILE_PX,
  HEADER_BOTTOM_CLEARANCE_DESKTOP_PX,
} from "@/lib/caseStudyTransitions";
// import DebugViewport from "./DebugViewport";
import BottomBar from "./BottomBar";
type BottomNavigationState = {
  slug: string;
  sourceIndex: number;
  targetIndex: number;
  sourceRect: SummaryTransitionRect | null;
  usesViewportAnchoredHandoff: boolean;
  phase: "nav-exit" | "exit" | "prepare" | "morph" | "route" | "settle";
};

type HomeToCaseTransitionState = {
  targetIndex: number;
  sourcePageLeft: number;
  pageWidth: number;
};

type PaneNavSurface = "pane" | "nav";

const CENTER_NAV_EXIT_DURATION = 180;
const HANDOFF_VIEWPORT_QUIET_MS = 120;
const HANDOFF_VIEWPORT_SETTLE_TIMEOUT_MS = 900;
const HANDOFF_VIEWPORT_STABLE_FRAMES = 3;
const HANDOFF_RELEASE_MIN_MS = 350;
const HISTORY_LANDING_MIN_MS = 700;
const HISTORY_LANDING_TIMEOUT_MS = 1400;
const HISTORY_LANDING_QUIET_MS = 160;
const PANE_NAV_TRAVELER_BACKGROUND_OPACITY = 0.6;
const HOME_PROJECT_TRANSITION = {
  duration: 0.36,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};
const HOME_RETURN_INPUT_LOCK_TIMEOUT_MS = 900;

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
  exit: ({ isHome, direction }: TopSummaryTransitionState) =>
    isHome
      ? {
          y:
            direction === "up"
              ? -homeProjectTravelDistance()
              : homeProjectTravelDistance(),
          opacity: 0,
          transition: {
            y: HOME_PROJECT_TRANSITION,
            opacity: HOME_PROJECT_TRANSITION,
          },
        }
      : {
          y: 0,
          opacity: 0,
          visibility: "hidden",
          transition: { duration: 0 },
        },
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
  const { activeIndex, previousIndex, setActiveIndex, viewMode } =
    useSiteNavigation();
  const isMdUp = useIsMdUp();
  const router = useRouter();

  const [showPrompt, setShowPrompt] = useState(false);
  const hasPromptShown = useRef(false);
  // const [showLandscapeBlocker, setShowLandscapeBlocker] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [bottomNavigation, setBottomNavigation] =
    useState<BottomNavigationState | null>(null);
  const [homeToCaseTransition, setHomeToCaseTransition] =
    useState<HomeToCaseTransitionState | null>(null);
  const [isHomeProjectTransitioning, setIsHomeProjectTransitioning] =
    useState(false);
  const [isHomeReturnMorphing, setIsHomeReturnMorphing] = useState(false);
  const [caseStudyIndex, setCaseStudyIndex] = useState(activeIndex);
  const [suppressedCaseStudyHeaderIndex, setSuppressedCaseStudyHeaderIndex] =
    useState<number | null>(null);
  const [projectSummaryLayoutVersion, setProjectSummaryLayoutVersion] =
    useState(0);
  const historyLandingRequestRef = useRef(0);
  const historyLandingPathRef = useRef<string | null>(null);
  const previousViewModeRef = useRef(viewMode);
  const [historyLandingVersion, setHistoryLandingVersion] = useState(0);
  const transitioningToNext =
    bottomNavigation !== null && bottomNavigation.phase !== "nav-exit";

  const handleHomeProjectTransitionStart = useCallback(() => {
    setIsHomeProjectTransitioning(true);
  }, []);

  const handleHomeProjectTransitionComplete = useCallback(() => {
    setIsHomeProjectTransitioning(false);
  }, []);

  const handleHomeReturnMorphComplete = useCallback(() => {
    setIsHomeReturnMorphing(false);
  }, []);

  useEffect(() => {
    if (viewMode !== "home" || !isHomeReturnMorphing) return;

    // Motion can omit layout-complete on mobile when the case header and home
    // preview resolve to the same measured layout during the route commit.
    // Never let that missing callback leave Home permanently non-interactive.
    const timeout = window.setTimeout(
      handleHomeReturnMorphComplete,
      HOME_RETURN_INPUT_LOCK_TIMEOUT_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [handleHomeReturnMorphComplete, isHomeReturnMorphing, viewMode]);

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
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const stickyHeaderHeight = useMotionValue("100svh");
  const headerExitProgress = useMotionValue(0);
  const headerVisibleProgress = useTransform(
    headerExitProgress,
    [0, 1],
    [1, 0],
  );
  const smoothHeaderVisibleProgress = useSpring(headerVisibleProgress, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
    restDelta: 0.001,
    restSpeed: 0.01,
  });
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
  const desiredPaneNavSurfaceRef = useRef<PaneNavSurface>("pane");
  const previousHeaderIntroProgressRef = useRef(0);
  const paneNavMorphingRef = useRef(false);
  const paneNavCloneRef = useRef<HTMLElement | null>(null);
  const paneNavAnimationRef = useRef<Animation | null>(null);
  const paneNavTrackingFrameRef = useRef<number | null>(null);
  const paneNavReverseDelayRef = useRef<number | null>(null);
  const paneNavMorphStarterRef = useRef<
    ((destination: PaneNavSurface) => void) | null
  >(null);
  const homeNavigationRequestedRef = useRef(false);
  const [paneNavSurface, setPaneNavSurface] = useState<PaneNavSurface>("pane");
  const [isPaneNavMorphing, setIsPaneNavMorphing] = useState(false);
  const [sectionHighlightEnabled, setSectionHighlightEnabled] = useState(false);
  const sectionHighlightEnabledRef = useRef(false);
  const caseStudyExitDirection = transitioningToNext ? "up" : "down";
  const isResettingBottomNavigationScroll =
    bottomNavigation?.phase === "settle" ||
    (bottomNavigation?.phase === "prepare" &&
      !bottomNavigation.usesViewportAnchoredHandoff);
  const isCaseStudyScrollLocked =
    viewMode === "case-study" &&
    ((transitioningToNext && !isResettingBottomNavigationScroll) ||
      homeToCaseTransition !== null);
  const isHomeScrollLocked = viewMode === "home";
  const isPageScrollLocked = isHomeScrollLocked || isCaseStudyScrollLocked;
  const isBottomNavigationActive = bottomNavigation !== null;
  const shouldReserveGlyphRail =
    viewMode === "home" || homeToCaseTransition !== null;
  const headerBottomClearance = isMdUp
    ? HEADER_BOTTOM_CLEARANCE_DESKTOP_PX
    : HEADER_BOTTOM_CLEARANCE_MOBILE_PX;

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
      const stickyHeader = stickyHeaderRef.current;
      if (!anchor || !stickyHeader || viewMode !== "case-study") {
        floatingPaneRef.current?.style.removeProperty("translate");
        stickyHeaderHeight.set("100svh");
        headerIntroProgress.set(0);
        headerExitProgress.set(0);
        updateSectionHighlightEnabled(false);
        return 0;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const introDistance = scrollPosition + anchorRect.top;
      const progress =
        introDistance > 0
          ? Math.min(1, Math.max(0, scrollPosition / introDistance))
          : 1;
      const collapseDistance = progress * headerBottomClearance;

      const viewportTop = window.visualViewport?.offsetTop ?? 0;
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const exitStart = viewportTop + viewportHeight * 0.3;
      const exitDistance = Math.max(1, exitStart - viewportTop);
      const stickyHeaderBottom = stickyHeader.getBoundingClientRect().bottom;
      const exitProgress = Math.min(
        1,
        Math.max(0, (exitStart - stickyHeaderBottom) / exitDistance),
      );

      floatingPaneRef.current?.style.removeProperty("translate");
      stickyHeaderHeight.set(
        collapseDistance > 0
          ? `calc(100svh - ${collapseDistance}px)`
          : "100svh",
      );
      headerIntroProgress.set(progress);
      headerExitProgress.set(exitProgress);
      updateSectionHighlightEnabled(progress >= 1);
      return progress;
    },
    [
      headerExitProgress,
      headerBottomClearance,
      headerIntroProgress,
      scrollY,
      stickyHeaderHeight,
      updateSectionHighlightEnabled,
      viewMode,
    ],
  );

  const scrollToHeaderHeroFocus = useCallback(() => {
    const target = headerIntroEndRef.current;
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

  const cancelPaneNavReverseDelay = useCallback(() => {
    if (paneNavReverseDelayRef.current === null) return;

    window.clearTimeout(paneNavReverseDelayRef.current);
    paneNavReverseDelayRef.current = null;
  }, []);

  const cleanupPaneNavMorph = useCallback(() => {
    cancelPaneNavReverseDelay();
    if (paneNavTrackingFrameRef.current !== null) {
      window.cancelAnimationFrame(paneNavTrackingFrameRef.current);
      paneNavTrackingFrameRef.current = null;
    }
    paneNavAnimationRef.current?.cancel();
    paneNavAnimationRef.current = null;
    paneNavCloneRef.current?.remove();
    paneNavCloneRef.current = null;
    paneNavMorphingRef.current = false;
  }, [cancelPaneNavReverseDelay]);

  const setPaneNavSurfaceImmediately = useCallback(
    (surface: PaneNavSurface) => {
      paneNavSurfaceRef.current = surface;
      setPaneNavSurface(surface);
      paneNavMorphingRef.current = false;
      setIsPaneNavMorphing(false);
    },
    [],
  );

  const handleHomeNavigationStart = useCallback(() => {
    homeNavigationRequestedRef.current = true;
    setHomeToCaseTransition(null);
    setIsHomeReturnMorphing(true);

    const homeIndex = bottomNavigation?.targetIndex ?? activeIndex;
    setActiveIndex(homeIndex);
    setCaseStudyIndex(homeIndex);

    if (!bottomNavigation) return;

    // An interrupted shared-layout handoff can leave Motion's lead/follow
    // projection pair attached to the surviving home summary. Recreate only
    // this layout group so the preview cannot inherit a hidden or projected
    // card from the aborted transaction.
    setProjectSummaryLayoutVersion((version) => version + 1);

    // Keep the outgoing case header suppressed through this render. If
    // it becomes visible once before Home mounts, AnimatePresence can retain
    // that stale visual node into the next home-to-case handoff.
    setSuppressedCaseStudyHeaderIndex(bottomNavigation.sourceIndex);
    setBottomNavigation(null);
  }, [activeIndex, bottomNavigation, setActiveIndex]);

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

      const sourceKeyframe: Keyframe = {
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
      };
      const targetKeyframe = (rect: DOMRect): Keyframe => ({
        offset: 1,
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: targetBorderRadius,
        backgroundColor: travelerTargetBackground,
        boxShadow: "none",
        paddingTop: targetStyle.paddingTop,
        paddingRight: targetStyle.paddingRight,
        paddingBottom: targetStyle.paddingBottom,
        paddingLeft: targetStyle.paddingLeft,
      });

      const animation = clone.animate(
        [sourceKeyframe, targetKeyframe(targetRect)],
        {
          duration: HEADER_PANE_NAV_MORPH_MS,
          delay: HEADER_PANE_NAV_CONTENT_FADE_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );

      const syncCloneToTarget = (rect: DOMRect) => {
        Object.assign(clone.style, {
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          borderRadius: targetBorderRadius,
          backgroundColor: travelerTargetBackground,
          boxShadow: "none",
          paddingTop: targetStyle.paddingTop,
          paddingRight: targetStyle.paddingRight,
          paddingBottom: targetStyle.paddingBottom,
          paddingLeft: targetStyle.paddingLeft,
        });
      };

      let isMorphComplete = false;
      const trackTarget = () => {
        if (paneNavCloneRef.current !== clone) {
          paneNavTrackingFrameRef.current = null;
          return;
        }

        const liveTargetRect = target.getBoundingClientRect();
        if (liveTargetRect.width > 0 && liveTargetRect.height > 0) {
          if (isMorphComplete) {
            syncCloneToTarget(liveTargetRect);
          } else {
            const effect = animation.effect as KeyframeEffect | null;
            effect?.setKeyframes([
              sourceKeyframe,
              targetKeyframe(liveTargetRect),
            ]);
          }
        }

        paneNavTrackingFrameRef.current =
          window.requestAnimationFrame(trackTarget);
      };

      paneNavTrackingFrameRef.current =
        window.requestAnimationFrame(trackTarget);

      paneNavAnimationRef.current = animation;
      animation.onfinish = () => {
        window.clearTimeout(cornerShapeSwitchTimeout);
        animation.onfinish = null;
        animation.oncancel = null;
        paneNavAnimationRef.current = null;

        animation.cancel();
        isMorphComplete = true;
        syncCloneToTarget(target.getBoundingClientRect());
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
          if (paneNavTrackingFrameRef.current !== null) {
            window.cancelAnimationFrame(paneNavTrackingFrameRef.current);
            paneNavTrackingFrameRef.current = null;
          }
          clone.remove();
          paneNavCloneRef.current = null;
          paneNavMorphingRef.current = false;

          const desiredSurface = desiredPaneNavSurfaceRef.current;

          if (desiredSurface !== paneNavSurfaceRef.current) {
            paneNavMorphStarterRef.current?.(desiredSurface);
          }
        };
      };
      animation.oncancel = () => {
        window.clearTimeout(cornerShapeSwitchTimeout);
        animation.onfinish = null;
        animation.oncancel = null;
        if (paneNavTrackingFrameRef.current !== null) {
          window.cancelAnimationFrame(paneNavTrackingFrameRef.current);
          paneNavTrackingFrameRef.current = null;
        }
      };
    },
    [setPaneNavSurfaceImmediately],
  );

  const schedulePaneNavMorph = useCallback(
    (destination: PaneNavSurface) => {
      if (destination === "nav") {
        cancelPaneNavReverseDelay();
        startPaneNavMorph(destination);
        return;
      }

      if (
        paneNavReverseDelayRef.current !== null ||
        paneNavMorphingRef.current ||
        paneNavSurfaceRef.current === destination
      ) {
        return;
      }

      paneNavReverseDelayRef.current = window.setTimeout(() => {
        paneNavReverseDelayRef.current = null;

        if (
          desiredPaneNavSurfaceRef.current !== destination ||
          paneNavMorphingRef.current ||
          paneNavSurfaceRef.current === destination
        ) {
          return;
        }

        startPaneNavMorph(destination);
      }, HEADER_PANE_NAV_REVERSE_DELAY_MS);
    },
    [cancelPaneNavReverseDelay, startPaneNavMorph],
  );

  paneNavMorphStarterRef.current = schedulePaneNavMorph;

  useMotionValueEvent(headerIntroProgress, "change", (progress) => {
    const previousProgress = previousHeaderIntroProgressRef.current;
    previousHeaderIntroProgressRef.current = progress;

    if (viewMode !== "case-study" || bottomNavigation) {
      cancelPaneNavReverseDelay();
      return;
    }

    const progressInPixels = progress * HEADER_STICKY_RUNWAY_PX;
    const previousProgressInPixels = previousProgress * HEADER_STICKY_RUNWAY_PX;
    let destination = desiredPaneNavSurfaceRef.current;

    if (
      progressInPixels > previousProgressInPixels &&
      progressInPixels >= HEADER_PANE_NAV_MORPH_TRIGGER_PX
    ) {
      destination = "nav";
    } else if (
      progressInPixels < previousProgressInPixels &&
      progressInPixels <=
        HEADER_STICKY_RUNWAY_PX - HEADER_PANE_NAV_REVERSE_OFFSET_PX
    ) {
      destination = "pane";
    } else if (progressInPixels <= 0) {
      destination = "pane";
    }

    desiredPaneNavSurfaceRef.current = destination;

    if (
      !paneNavMorphingRef.current &&
      paneNavSurfaceRef.current !== destination
    ) {
      schedulePaneNavMorph(destination);
    } else if (destination === "nav") {
      cancelPaneNavReverseDelay();
    }
  });

  useEffect(() => {
    cleanupPaneNavMorph();
    desiredPaneNavSurfaceRef.current = "pane";
    previousHeaderIntroProgressRef.current = 0;
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
    if (bottomNavigation) return;
    if (viewMode !== "case-study") return;

    updateHeaderIntroProgress(y);
    updateBottomRevealProgress();
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const handleHistoryNavigation = () => {
      // Safari can restore a history entry's document position after popstate
      // and after React's route commit. Record the destination so the route-
      // keyed landing guard below can own the scroll position until the visual
      // viewport has finished changing.
      window.history.scrollRestoration = "manual";
      historyLandingPathRef.current = window.location.pathname;
      historyLandingRequestRef.current += 1;
      setHistoryLandingVersion(historyLandingRequestRef.current);
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("popstate", handleHistoryNavigation);

    return () => {
      window.removeEventListener("popstate", handleHistoryNavigation);
      window.history.scrollRestoration = previousScrollRestoration;
    };
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
    cleanupPaneNavMorph();
    desiredPaneNavSurfaceRef.current = "pane";
    previousHeaderIntroProgressRef.current = 0;
    setPaneNavSurfaceImmediately("pane");
    window.scrollTo({ top: 0, behavior: "auto" });
    scrollY.set(0);
    headerIntroProgress.set(0);
    smoothHeaderIntroProgress.jump(0);
    stickyHeaderHeight.set("100svh");
    // Shared-layout measurement runs in the next React layout phase, before a
    // scheduled MotionValue render is guaranteed to reach the DOM.
    stickyHeaderRef.current?.style.setProperty("height", "100svh");
    headerExitProgress.set(0);
    smoothHeaderVisibleProgress.jump(1);
    bottomRevealProgress.set(0);
    smoothBottomRevealProgress.jump(0);
  }, [
    bottomRevealProgress,
    cleanupPaneNavMorph,
    headerExitProgress,
    headerIntroProgress,
    scrollY,
    setPaneNavSurfaceImmediately,
    smoothBottomRevealProgress,
    smoothHeaderIntroProgress,
    smoothHeaderVisibleProgress,
    stickyHeaderHeight,
  ]);

  useLayoutEffect(() => {
    if (bottomNavigation || viewMode !== "case-study") {
      return;
    }

    // Case-study history entries always open at their hero. Reset before paint
    // and once more on the next frame so iOS cannot restore the previous
    // document position after React has committed the route.
    resetCaseStudyScroll();
    const frame = window.requestAnimationFrame(resetCaseStudyScroll);
    return () => window.cancelAnimationFrame(frame);
    // A handoff owns project identity until its shared layout animation ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, viewMode, resetCaseStudyScroll]);

  useLayoutEffect(() => {
    const landingPath = historyLandingPathRef.current;
    if (!landingPath || window.location.pathname !== landingPath) return;

    if (viewMode !== "case-study") {
      window.scrollTo({ top: 0, behavior: "auto" });
      historyLandingPathRef.current = null;
      return;
    }

    // A bottom-card handoff owns its own scroll lifecycle. Normal case-study
    // history navigation reaches this branch only after that transaction has
    // completed or been cancelled.
    if (bottomNavigation) return;

    const requestId = historyLandingRequestRef.current;
    const startedAt = performance.now();
    let lastViewportChangeAt = startedAt;
    let frame: number | null = null;
    let previousGeometry = {
      width: window.visualViewport?.width ?? window.innerWidth,
      height: window.visualViewport?.height ?? window.innerHeight,
      offsetTop: window.visualViewport?.offsetTop ?? 0,
      offsetLeft: window.visualViewport?.offsetLeft ?? 0,
    };

    const requestIsCurrent = () =>
      historyLandingRequestRef.current === requestId &&
      historyLandingPathRef.current === landingPath;

    const removeInputListeners = () => {
      window.removeEventListener("touchstart", handleUserInput);
      window.removeEventListener("pointerdown", handleUserInput);
      window.removeEventListener("wheel", handleUserInput);
      window.removeEventListener("keydown", handleUserInput);
    };

    const finishLanding = () => {
      if (!requestIsCurrent()) return;
      resetCaseStudyScroll();
      historyLandingPathRef.current = null;
      removeInputListeners();
    };

    const handleUserInput = () => {
      finishLanding();
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    };

    const enforceLanding = (now: number) => {
      if (!requestIsCurrent()) return;

      // This deliberately runs beyond the route commit. In portrait Safari,
      // native history restoration and toolbar expansion can both happen a few
      // frames later than popstate.
      resetCaseStudyScroll();

      const geometry = {
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
        offsetTop: window.visualViewport?.offsetTop ?? 0,
        offsetLeft: window.visualViewport?.offsetLeft ?? 0,
      };
      const geometryChanged = Object.keys(geometry).some((key) => {
        const geometryKey = key as keyof typeof geometry;
        return (
          Math.abs(geometry[geometryKey] - previousGeometry[geometryKey]) > 0.5
        );
      });

      if (geometryChanged) {
        previousGeometry = geometry;
        lastViewportChangeAt = now;
      }

      const minimumHoldFinished = now - startedAt >= HISTORY_LANDING_MIN_MS;
      const viewportIsQuiet =
        now - lastViewportChangeAt >= HISTORY_LANDING_QUIET_MS;
      const hasTimedOut = now - startedAt >= HISTORY_LANDING_TIMEOUT_MS;

      if ((minimumHoldFinished && viewportIsQuiet) || hasTimedOut) {
        finishLanding();
        return;
      }

      frame = window.requestAnimationFrame(enforceLanding);
    };

    resetCaseStudyScroll();
    window.addEventListener("touchstart", handleUserInput, { passive: true });
    window.addEventListener("pointerdown", handleUserInput, { passive: true });
    window.addEventListener("wheel", handleUserInput, { passive: true });
    window.addEventListener("keydown", handleUserInput);
    frame = window.requestAnimationFrame(enforceLanding);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      removeInputListeners();
    };
  }, [
    activeIndex,
    bottomNavigation,
    historyLandingVersion,
    resetCaseStudyScroll,
    viewMode,
  ]);

  const handleBottomNavigationStart = useCallback(
    (slug: string, sourceRect: SummaryTransitionRect | null) => {
      if (bottomNavigation) return;

      const targetIndex = projects.findIndex(
        (project) => project.slug === slug,
      );
      if (targetIndex < 0) return;

      homeNavigationRequestedRef.current = false;
      setSuppressedCaseStudyHeaderIndex(null);
      setActiveIndex(targetIndex);
      setCaseStudyIndex(activeIndex);
      setBottomNavigation({
        slug,
        sourceIndex: activeIndex,
        targetIndex,
        sourceRect,
        usesViewportAnchoredHandoff: window.matchMedia(
          "(pointer: coarse) and (orientation: portrait)",
        ).matches,
        phase: "nav-exit",
      });
    },
    [activeIndex, bottomNavigation, setActiveIndex],
  );

  const handlePreviewNavigationStart = useCallback(
    (sourceRect: SummaryTransitionRect | null) => {
      homeNavigationRequestedRef.current = false;
      setSuppressedCaseStudyHeaderIndex(null);
      const pageRect = document.body.getBoundingClientRect();
      const sourcePageLeft = sourceRect ? sourceRect.left - pageRect.left : 0;

      setHomeToCaseTransition({
        targetIndex: activeIndex,
        sourcePageLeft,
        pageWidth: pageRect.width,
      });
    },
    [activeIndex],
  );

  useEffect(() => {
    if (bottomNavigation?.phase !== "nav-exit") {
      return;
    }

    const timeout = window.setTimeout(() => {
      if (homeNavigationRequestedRef.current) return;

      setBottomNavigation((navigation) =>
        navigation?.phase === "nav-exit"
          ? { ...navigation, phase: "exit" }
          : navigation,
      );
    }, CENTER_NAV_EXIT_DURATION);

    return () => window.clearTimeout(timeout);
  }, [bottomNavigation]);

  const prepareProjectHandoff = useCallback(
    (navigation: BottomNavigationState) => {
      if (homeNavigationRequestedRef.current) return;

      if (!navigation.usesViewportAnchoredHandoff) {
        resetCaseStudyScroll();

        // Some browsers can ignore scrollTo(0) while body scrolling is locked.
        // Temporarily unlock only when the first reset was rejected.
        if (Math.abs(window.scrollY) > 0.5) {
          document.body.style.overflow = "auto";
          resetCaseStudyScroll();
        }
      }

      flushSync(() => {
        setBottomNavigation({ ...navigation, phase: "prepare" });
      });
    },
    [resetCaseStudyScroll],
  );

  const beginProjectMorph = useCallback(
    (navigation: BottomNavigationState) => {
      if (homeNavigationRequestedRef.current) return;

      // The failed iOS scroll reset may have required a brief unlock. Restore
      // the transition lock before mounting the shared-layout destination.
      document.body.style.overflow = "hidden";

      flushSync(() => {
        setCaseStudyIndex(navigation.targetIndex);
        setBottomNavigation({ ...navigation, phase: "morph" });
      });

      router.push(`/${navigation.slug}`);
    },
    [router],
  );

  const handleCaseStudyExitComplete = useCallback(() => {
    if (homeNavigationRequestedRef.current) return;
    if (bottomNavigation?.phase !== "exit") return;
    prepareProjectHandoff(bottomNavigation);
  }, [bottomNavigation, prepareProjectHandoff]);

  useEffect(() => {
    if (bottomNavigation?.phase !== "prepare") return;

    const navigation = bottomNavigation;

    // On portrait touch browsers, do not scroll yet: that is what expands
    // Safari's collapsed toolbar. The source and destination are both fixed
    // during the morph, so the document can remain at the bottom until the
    // shared-layout animation has completed.
    if (navigation.usesViewportAnchoredHandoff) {
      const frame = window.requestAnimationFrame(() => {
        beginProjectMorph(navigation);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const startedAt = performance.now();
    let lastGeometryChangeAt = startedAt;
    let stableFrames = 0;
    let frame: number | null = null;
    let hasStartedMorph = false;
    let previousGeometry = {
      width: window.visualViewport?.width ?? window.innerWidth,
      height: window.visualViewport?.height ?? window.innerHeight,
      offsetTop: window.visualViewport?.offsetTop ?? 0,
      offsetLeft: window.visualViewport?.offsetLeft ?? 0,
      scale: window.visualViewport?.scale ?? 1,
      scrollY: window.scrollY,
    };

    const startMorph = () => {
      if (hasStartedMorph || homeNavigationRequestedRef.current) return;
      hasStartedMorph = true;
      beginProjectMorph(navigation);
    };

    const checkViewport = (now: number) => {
      if (Math.abs(window.scrollY) > 0.5) {
        // Do not let the timeout advance a broken handoff. Once overflow is
        // unlocked this succeeds synchronously in normal browsers and on iOS
        // as soon as Safari releases its collapsed-toolbar scroll state.
        document.body.style.overflow = "auto";
        resetCaseStudyScroll();
      }

      const geometry = {
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
        offsetTop: window.visualViewport?.offsetTop ?? 0,
        offsetLeft: window.visualViewport?.offsetLeft ?? 0,
        scale: window.visualViewport?.scale ?? 1,
        scrollY: window.scrollY,
      };
      const geometryChanged = Object.keys(geometry).some((key) => {
        const geometryKey = key as keyof typeof geometry;
        return (
          Math.abs(geometry[geometryKey] - previousGeometry[geometryKey]) > 0.5
        );
      });

      if (geometryChanged) {
        previousGeometry = geometry;
        lastGeometryChangeAt = now;
        stableFrames = 0;
      } else {
        stableFrames += 1;
      }

      const hasSettled =
        Math.abs(geometry.scrollY) <= 0.5 &&
        stableFrames >= HANDOFF_VIEWPORT_STABLE_FRAMES &&
        now - lastGeometryChangeAt >= HANDOFF_VIEWPORT_QUIET_MS;
      const hasTimedOut =
        Math.abs(geometry.scrollY) <= 0.5 &&
        now - startedAt >= HANDOFF_VIEWPORT_SETTLE_TIMEOUT_MS;

      if (hasSettled || hasTimedOut) {
        startMorph();
        return;
      }

      frame = window.requestAnimationFrame(checkViewport);
    };

    frame = window.requestAnimationFrame(checkViewport);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [beginProjectMorph, bottomNavigation, resetCaseStudyScroll]);

  useEffect(() => {
    if (
      !bottomNavigation ||
      bottomNavigation.phase === "prepare" ||
      bottomNavigation.phase === "morph" ||
      bottomNavigation.phase === "route" ||
      bottomNavigation.phase === "settle"
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (homeNavigationRequestedRef.current) return;

      prepareProjectHandoff(bottomNavigation);
    }, 1800);

    return () => clearTimeout(timeout);
  }, [bottomNavigation, prepareProjectHandoff]);

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
    setBottomNavigation(null);
  }, [resetCaseStudyScroll]);

  useEffect(() => {
    if (
      bottomNavigation?.phase !== "route" ||
      activeIndex !== bottomNavigation.targetIndex
    ) {
      return;
    }

    if (bottomNavigation.usesViewportAnchoredHandoff) {
      document.body.style.overflow = "auto";
      resetCaseStudyScroll();
      setBottomNavigation({ ...bottomNavigation, phase: "settle" });
      return;
    }

    const frame = requestAnimationFrame(finishProjectHandoff);
    return () => cancelAnimationFrame(frame);
  }, [
    activeIndex,
    bottomNavigation,
    finishProjectHandoff,
    resetCaseStudyScroll,
  ]);

  useEffect(() => {
    if (bottomNavigation?.phase !== "settle") return;

    const startedAt = performance.now();
    let lastGeometryChangeAt = startedAt;
    let frame: number | null = null;
    let previousGeometry = {
      width: window.visualViewport?.width ?? window.innerWidth,
      height: window.visualViewport?.height ?? window.innerHeight,
      offsetTop: window.visualViewport?.offsetTop ?? 0,
      offsetLeft: window.visualViewport?.offsetLeft ?? 0,
      scrollY: window.scrollY,
    };

    const checkRelease = (now: number) => {
      if (Math.abs(window.scrollY) > 0.5) {
        document.body.style.overflow = "auto";
        resetCaseStudyScroll();
      }

      const geometry = {
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
        offsetTop: window.visualViewport?.offsetTop ?? 0,
        offsetLeft: window.visualViewport?.offsetLeft ?? 0,
        scrollY: window.scrollY,
      };
      const geometryChanged = Object.keys(geometry).some((key) => {
        const geometryKey = key as keyof typeof geometry;
        return (
          Math.abs(geometry[geometryKey] - previousGeometry[geometryKey]) > 0.5
        );
      });

      if (geometryChanged) {
        previousGeometry = geometry;
        lastGeometryChangeAt = now;
      }

      const isAtTop = Math.abs(geometry.scrollY) <= 0.5;
      const minimumHoldFinished = now - startedAt >= HANDOFF_RELEASE_MIN_MS;
      const viewportIsQuiet =
        now - lastGeometryChangeAt >= HANDOFF_VIEWPORT_QUIET_MS;
      const hasTimedOut = now - startedAt >= HANDOFF_VIEWPORT_SETTLE_TIMEOUT_MS;

      if (isAtTop && minimumHoldFinished && (viewportIsQuiet || hasTimedOut)) {
        finishProjectHandoff();
        return;
      }

      frame = window.requestAnimationFrame(checkRelease);
    };

    frame = window.requestAnimationFrame(checkRelease);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [bottomNavigation, finishProjectHandoff, resetCaseStudyScroll]);

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

  useLayoutEffect(() => {
    const previousViewMode = previousViewModeRef.current;
    previousViewModeRef.current = viewMode;

    // Browser Back can reach Home without going through TopBar. Apply the
    // same cancellation contract before that home state is painted.
    if (viewMode === "home" && bottomNavigation) {
      handleHomeNavigationStart();
      return;
    }

    if (viewMode === "home" && previousViewMode !== "home") {
      setIsHomeReturnMorphing(true);
      if (homeToCaseTransition) {
        setHomeToCaseTransition(null);
      }
    }
  }, [
    bottomNavigation,
    handleHomeNavigationStart,
    homeToCaseTransition,
    viewMode,
  ]);

  useEffect(() => {
    if (viewMode !== "home" || suppressedCaseStudyHeaderIndex === null) return;

    // The outgoing presence node has already captured its hidden state. Do
    // not let that suppression become persistent identity state if browser
    // history later returns directly to the source case study.
    const frame = window.requestAnimationFrame(() => {
      setSuppressedCaseStudyHeaderIndex(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [suppressedCaseStudyHeaderIndex, viewMode]);

  if (!mounted) return null;

  const renderedCaseStudyIndex = bottomNavigation
    ? caseStudyIndex
    : activeIndex;
  const homeProjectIndex = activeIndex;
  const canonicalTopSummaryIndex =
    viewMode === "case-study" ? renderedCaseStudyIndex : homeProjectIndex;
  const topSummaryIndex =
    homeToCaseTransition?.targetIndex ?? canonicalTopSummaryIndex;
  const topSummaryVariant = viewMode === "case-study" ? "header" : "preview";
  const homeProjectDirection = getHomeProjectDirection(
    homeProjectIndex,
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
  const isBottomHandoffSourceHidden =
    bottomNavigation?.phase === "route" ||
    bottomNavigation?.phase === "settle" ||
    (bottomNavigation?.usesViewportAnchoredHandoff === true &&
      bottomNavigation.phase === "morph");
  const isOutgoingHeaderHidden =
    (bottomNavigation !== null &&
      topSummaryIndex === bottomNavigation.sourceIndex &&
      bottomNavigation.sourceIndex !== bottomNavigation.targetIndex) ||
    (viewMode === "case-study" &&
      suppressedCaseStudyHeaderIndex === topSummaryIndex);

  return (
    <main
      data-view-mode={viewMode}
      data-active-project-index={activeIndex}
      className={`relative isolate flex w-full overflow-x-clip bg-background transition-colors dark:bg-dark-background ${
        isHomeScrollLocked
          ? "h-[100svh] touch-none overflow-y-hidden"
          : "touch-auto"
      }`}
    >
      {viewMode === "home" && (
        <HomeSymbolBackdrop activeIndex={homeProjectIndex} />
      )}
      <TopBar
        centerNavRef={centerNavRef}
        showCenterNav={
          paneNavSurface === "nav" &&
          !isPaneNavMorphing &&
          !isBottomNavigationActive
        }
        retractCenterNav={isBottomNavigationActive}
        sectionHighlightEnabled={sectionHighlightEnabled}
        onHomeNavigationStart={handleHomeNavigationStart}
      />
      {/* <DebugViewport /> */}
      <div
        className={`relative z-10 flex flex-1 flex-col overflow-hidden ${
          shouldReserveGlyphRail ? "min-w-max" : ""
        } ${viewMode === "case-study" ? "pointer-events-none" : ""}`}
      >
        <GlyphCarousel
          navigationLocked={
            homeToCaseTransition !== null ||
            isHomeProjectTransitioning ||
            isHomeReturnMorphing
          }
          onProjectTransitionStart={handleHomeProjectTransitionStart}
        />
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
        <LayoutGroup
          key={`project-summaries-${projectSummaryLayoutVersion}`}
          id={`project-summaries-${projectSummaryLayoutVersion}`}
        >
          <div
            className="relative h-[100svh] w-full"
            style={
              viewMode === "case-study"
                ? {
                    height: `calc(100svh + ${HEADER_STICKY_RUNWAY_PX - headerBottomClearance}px)`,
                    width: homeToCaseTransition
                      ? `${homeToCaseTransition.pageWidth}px`
                      : "100vw",
                    marginLeft: homeToCaseTransition
                      ? `${-homeToCaseTransition.sourcePageLeft}px`
                      : "calc((100% - 100vw) / 2)",
                  }
                : undefined
            }
          >
            {viewMode === "case-study" && (
              <div
                ref={headerIntroEndRef}
                data-header-hero-focus-target
                aria-hidden="true"
                className="pointer-events-none absolute left-0 z-20 h-px w-px"
                style={{ top: `${HEADER_STICKY_RUNWAY_PX}px` }}
              />
            )}
            <motion.div
              ref={stickyHeaderRef}
              className={`h-[100svh] w-full ${viewMode === "case-study" ? "sticky top-0" : "relative"}`}
              style={
                viewMode === "case-study"
                  ? { height: stickyHeaderHeight }
                  : undefined
              }
            >
              <AnimatePresence
                initial={false}
                custom={topSummaryTransitionState}
                mode="popLayout"
                onExitComplete={handleHomeProjectTransitionComplete}
              >
                {showTopSummary && (
                  <motion.div
                    key={`top-summary-${projects[topSummaryIndex].id}`}
                    data-top-summary-project-index={topSummaryIndex}
                    custom={topSummaryTransitionState}
                    variants={topSummaryProjectVariants}
                    initial="initial"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full"
                    style={
                      viewMode === "case-study" && isOutgoingHeaderHidden
                        ? { visibility: "hidden", pointerEvents: "none" }
                        : undefined
                    }
                  >
                    <ProjectSummary
                      variant={topSummaryVariant}
                      projectIndex={topSummaryIndex}
                      headerVisualProgress={smoothHeaderIntroProgress}
                      headerExitVisualProgress={smoothHeaderVisibleProgress}
                      bottomVisualProgress={smoothBottomRevealProgress}
                      floatingPaneRef={
                        viewMode === "case-study" ? floatingPaneRef : undefined
                      }
                      isFloatingPaneVisible={
                        viewMode !== "case-study" ||
                        (paneNavSurface === "pane" && !isPaneNavMorphing)
                      }
                      isInteractionLocked={
                        homeToCaseTransition !== null ||
                        isHomeProjectTransitioning ||
                        isHomeReturnMorphing
                      }
                      isTransitionLocked={
                        viewMode === "case-study" && isBottomNavigationActive
                      }
                      transitioningToNext={transitioningToNext}
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
                          : isHomeReturnMorphing
                            ? handleHomeReturnMorphComplete
                            : undefined
                      }
                      onPreviewNavigationStart={handlePreviewNavigationStart}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
                headerVisualProgress={smoothHeaderIntroProgress}
                headerExitVisualProgress={smoothHeaderVisibleProgress}
                bottomVisualProgress={smoothBottomRevealProgress}
                isTransitionLocked={isBottomNavigationActive}
                transitioningToNext={transitioningToNext}
                isHandoffSourceHidden={isBottomHandoffSourceHidden}
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
