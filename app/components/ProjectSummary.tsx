/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import { useIsMdUp } from "@/hooks/useIsMdUp";
import { useSupportsSquircle } from "@/hooks/useSupportsSquircle";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionStyle,
} from "framer-motion";
// import { useSpring } from "framer-motion";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import SpinButton from "./SpinButton";
import KeyboardHint from "./KeyboardHint";
// import { PALETTE } from "@/lib/palette";

// import Kbd from "./Kbd";

import { useActiveProject } from "../context/ActiveProjectContext";
import { useKeyboardHints } from "../context/KeyboardHintsContext";
import { isInteractiveKeyboardTarget } from "@/lib/keyboard";
import {
  HEADER_IMAGE_FADE_START_PROGRESS,
  HEADER_PANE_NAV_MORPH_PROGRESS,
  HEADER_PANE_NAV_CONTENT_FADE_MS,
  HEADER_PANE_NAV_DESTINATION_FADE_MS,
} from "@/lib/caseStudyTransitions";
import projects from "../../data/projects";
import {
  PenNibIcon,
  MagnifyingGlassIcon,
  WrenchIcon,
  ChartBarIcon,
  SparkleIcon,
  RocketIcon,
  ChartLineIcon,
  FilmSlateIcon,
  VisorIcon,
  PlanetIcon,
  UsersThreeIcon,
  HandshakeIcon,
  FlowerTulipIcon,
  BuildingsIcon,
} from "@phosphor-icons/react";

const tagIconRegistry: Record<string, React.ElementType> = {
  PenNibIcon,
  MagnifyingGlassIcon,
  WrenchIcon,
  ChartBarIcon,
  SparkleIcon,
  RocketIcon,
  ChartLineIcon,
  FilmSlateIcon,
  VisorIcon,
  PlanetIcon,
  UsersThreeIcon,
  HandshakeIcon,
  FlowerTulipIcon,
  BuildingsIcon,
};

function hexToRgbChannels(hex: string) {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized;
  const value = Number.parseInt(expanded, 16);

  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

interface ProjectSummaryProps {
  variant: "preview" | "header" | "bottom";
  projectIndex: number;
  headerIntroProgress: MotionValue<number>;
  headerVisualProgress: MotionValue<number>;
  bottomVisualProgress: MotionValue<number>;
  floatingPaneRef?: React.RefObject<HTMLDivElement | null>;
  isFloatingPaneVisible?: boolean;
  isTransitionLocked?: boolean;
  isHandoffSourceHidden?: boolean;
  transitionRect?: SummaryTransitionRect | null;
  onHeaderBackgroundClick?: () => void;
  onLayoutAnimationComplete?: () => void;
  onPreviewNavigationStart?: (
    sourceRect: SummaryTransitionRect | null,
  ) => void;
  onBottomNavigationStart?: (
    slug: string,
    sourceRect: SummaryTransitionRect | null,
  ) => void;
}

export interface SummaryTransitionRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type MainFloatingStyle = MotionStyle & {
  "--summary-scrollbar-thumb": string;
  "--summary-scrollbar-thumb-rgb": string;
};

export default function ProjectSummary({
  variant,
  projectIndex,
  headerIntroProgress,
  headerVisualProgress,
  bottomVisualProgress,
  floatingPaneRef,
  isFloatingPaneVisible = true,
  isTransitionLocked = false,
  isHandoffSourceHidden = false,
  transitionRect,
  onHeaderBackgroundClick,
  onLayoutAnimationComplete,
  onPreviewNavigationStart,
  onBottomNavigationStart,
}: ProjectSummaryProps) {
  const { transitioningToNext } = useActiveProject();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const { showKeyboardHints, flashShortcutHint } = useKeyboardHints();
  const isMdUp = useIsMdUp();
  const supportsSquircle = useSupportsSquircle();
  const [hasBottomRevealCompleted, setHasBottomRevealCompleted] = useState(
    () => bottomVisualProgress.get() >= 0.9,
  );
  useMotionValueEvent(bottomVisualProgress, "change", (progress) => {
    const hasCompleted = progress >= 0.9;
    setHasBottomRevealCompleted((previous) =>
      previous === hasCompleted ? previous : hasCompleted,
    );
  });
  const isSummaryInteractionEnabled =
    variant !== "bottom" || (hasBottomRevealCompleted && !isTransitionLocked);
  const headerImageRadiusMultiplier = supportsSquircle ? 2 : 1;

  const headerImageBaseInset = isMdUp ? 16 : 8;
  const headerImageTargetXInset = isMdUp ? 26 : 14;
  const headerImageTargetTopInset = isMdUp ? 86 : 58;
  const headerImageTargetBottomInset = isMdUp ? 96 : 64;
  const headerImageBaseRadius =
    (isMdUp ? 32 : 24) * headerImageRadiusMultiplier;
  const headerImageTargetRadius =
    (isMdUp ? 22 : 18) * headerImageRadiusMultiplier;
  const headerImageProgressStops = [
    0,
    HEADER_PANE_NAV_MORPH_PROGRESS,
    HEADER_IMAGE_FADE_START_PROGRESS,
    1,
  ];
  const headerImageXInset = useTransform(
    headerVisualProgress,
    headerImageProgressStops,
    [
      headerImageBaseInset,
      headerImageTargetXInset,
      headerImageTargetXInset,
      headerImageTargetXInset,
    ],
  );
  const headerImageTopInset = useTransform(
    headerVisualProgress,
    headerImageProgressStops,
    [
      headerImageBaseInset,
      headerImageTargetTopInset,
      headerImageTargetTopInset,
      headerImageTargetTopInset,
    ],
  );
  const headerImageBottomInset = useTransform(
    headerVisualProgress,
    headerImageProgressStops,
    [
      headerImageBaseInset,
      headerImageTargetBottomInset,
      headerImageTargetBottomInset,
      headerImageTargetBottomInset,
    ],
  );
  const headerImageRadius = useTransform(
    headerVisualProgress,
    headerImageProgressStops,
    [
      headerImageBaseRadius,
      headerImageTargetRadius,
      headerImageTargetRadius,
      headerImageTargetRadius,
    ],
  );
  const holdExpandedHeaderImage = isTransitionLocked || transitioningToNext;

  const headerOpacity = useTransform(
    [headerIntroProgress, headerVisualProgress],
    (latest) => {
      const [rawProgress, visualProgress] = latest as number[];

      return rawProgress < HEADER_IMAGE_FADE_START_PROGRESS
        ? 1
        : visualProgress < HEADER_IMAGE_FADE_START_PROGRESS
          ? 1
          : 1 -
            (visualProgress - HEADER_IMAGE_FADE_START_PROGRESS) /
              (1 - HEADER_IMAGE_FADE_START_PROGRESS);
    },
  );

  const bottomOpacity = useTransform(bottomVisualProgress, [0, 1], [0, 1]);

  const headerScale = useTransform(
    headerVisualProgress,
    [0, HEADER_IMAGE_FADE_START_PROGRESS, 1],
    [1, 1, 0.95],
  );

  const headerBlur = useTransform(
    [headerIntroProgress, headerVisualProgress],
    (latest) => {
      const [rawProgress, visualProgress] = latest as number[];

      if (
        rawProgress < HEADER_IMAGE_FADE_START_PROGRESS ||
        visualProgress < HEADER_IMAGE_FADE_START_PROGRESS
      ) {
        return "blur(0px)";
      }

      const blurProgress =
        (visualProgress - HEADER_IMAGE_FADE_START_PROGRESS) /
        (1 - HEADER_IMAGE_FADE_START_PROGRESS);

      return `blur(${Math.min(10, Math.max(0, blurProgress * 10))}px)`;
    },
  );

  const bottomBlur = useTransform(
    bottomVisualProgress,
    [0, 1],
    ["blur(10px)", "blur(0px)"],
  );

  const bottomScale = useTransform(bottomVisualProgress, [0, 1], [0.8, 1]);

  const {
    cardLightShadow,
    cardDarkShadow,
    cardHoverLightShadow,
    cardHoverDarkShadow,
    buttonLightShadow,
    buttonDarkShadow,
    frameLightShadow,
    frameDarkShadow,
  } = useMouseShadow();

  const cardShadow =
    resolvedTheme === "dark" ? cardDarkShadow : cardLightShadow;

  const cardHoverShadow =
    resolvedTheme === "dark" ? cardHoverDarkShadow : cardHoverLightShadow;

  const buttonShadow =
    resolvedTheme === "dark" ? buttonDarkShadow : buttonLightShadow;

  const frameShadow =
    resolvedTheme === "dark" ? frameDarkShadow : frameLightShadow;

  const project = projects[projectIndex];

  const displayedProject = project;
  const theme = useProjectTheme(displayedProject.id);
  const floatingPaneNodeRef = useRef<HTMLDivElement>(null);

  const setFloatingPaneNode = useCallback((node: HTMLDivElement | null) => {
    floatingPaneNodeRef.current = node;
  }, []);

  useLayoutEffect(() => {
    const node = floatingPaneNodeRef.current;

    if (variant !== "header") {
      node?.style.removeProperty("translate");
    }

    if (!floatingPaneRef || variant !== "header") return;

    floatingPaneRef.current = node;

    return () => {
      if (floatingPaneRef.current === node) {
        floatingPaneRef.current = null;
      }
    };
  }, [displayedProject.id, floatingPaneRef, variant]);

  const [isNavigating, setIsNavigating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (variant === "header" || !isSummaryInteractionEnabled || isNavigating) {
      return;
    }
    setIsNavigating(true);
    const sourceRect = ref.current?.getBoundingClientRect();
    const measuredSourceRect = sourceRect
      ? {
          top: sourceRect.top,
          left: sourceRect.left,
          width: sourceRect.width,
          height: sourceRect.height,
        }
      : null;

    if (variant === "bottom") {
      onBottomNavigationStart?.(project.slug, measuredSourceRect);
      return;
    }

    onPreviewNavigationStart?.(measuredSourceRect);
    const navigationDelay = 200;
    timerRef.current = setTimeout(() => {
      router.push(`/${project.slug}`);
      // No need to set isNavigating(false) here,
      // the useEffect above will handle it when the page/props change.
    }, navigationDelay);
  }, [
    isNavigating,
    isSummaryInteractionEnabled,
    onBottomNavigationStart,
    onPreviewNavigationStart,
    project,
    router,
    variant,
  ]);

  useEffect(() => {
    if (variant === "header") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Enter" ||
        event.repeat ||
        event.defaultPrevented ||
        isInteractiveKeyboardTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      flashShortcutHint("enter");
      handleClick();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [flashShortcutHint, handleClick, variant]);

  useEffect(() => {
    setIsNavigating(false);
  }, [project.id, variant]);

  // Use this to style Intro separately
  // const isIntroPreview = variant === "preview" && displayedProject.id === "intro";

  const layoutDependency = `${variant}-${displayedProject.id}`;
  const layoutIdPrefix = `project-summary-${displayedProject.id}`;
  const participatesInSharedHandoff =
    variant === "bottom" || isTransitionLocked;
  const mainFloatingStyle = {
    boxShadow: frameShadow,
    "--summary-scrollbar-thumb": theme.hex.primary,
    "--summary-scrollbar-thumb-rgb": hexToRgbChannels(theme.hex.primary),
  } satisfies MainFloatingStyle;
  const summaryOpacity = isHandoffSourceHidden
    ? 0
    : isTransitionLocked || transitioningToNext
      ? 1
      : variant === "header"
        ? headerOpacity
        : variant === "bottom"
          ? bottomOpacity
          : 1;
  const summaryScale =
    isTransitionLocked || transitioningToNext
      ? 1
      : variant === "header"
        ? headerScale
        : variant === "bottom"
          ? bottomScale
          : 1;

  const summaryFilter =
    isTransitionLocked || transitioningToNext
      ? "blur(0px)"
      : variant === "header"
        ? headerBlur
        : variant === "bottom"
          ? bottomBlur
          : "blur(0px)";
  const floatingPaneOverflowY =
    isTransitionLocked || transitioningToNext
      ? "overflow-y-hidden"
      : "overflow-y-auto";
  const floatingPaneOpacity =
    variant === "header" && !isTransitionLocked && !transitioningToNext
      ? isFloatingPaneVisible
        ? 1
        : 0
      : 1;
  const floatingPanePointerEvents =
    variant === "header" && !isTransitionLocked && !transitioningToNext
      ? isFloatingPaneVisible
        ? "auto"
        : "none"
      : "auto";
  const isHeaderBackgroundInteractive =
    variant === "header" &&
    Boolean(onHeaderBackgroundClick) &&
    !isTransitionLocked &&
    !transitioningToNext;

  // --- Framer Motion variants
  const motionVariants = {
    preview: {
      initial: {},
      animate: {
        y: 0,
        opacity: 1,
        transition: {
          y: { duration: 0.1, ease: "easeInOut" },
          boxShadow: { duration: 0.1, ease: "easeInOut" },
        },
      },
      exit: {},
    },
    header: {
      initial: {},
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          boxShadow: { delay: 0.5, duration: 0.2, ease: "easeIn" },
        },
      },
      exit: { transition: { duration: 0.2 } },
    },
    bottom: {
      initial: {},
      animate: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.2, ease: "easeInOut" },
      },
      exit: {
        transition: {
          y: { delay: 0, duration: 0, ease: "easeInOut" },
          duration: 0.2,
        },
      },
    },
  };

  const containerClasses =
    variant === "header"
      ? "relative h-[100svh] w-full items-center justify-center"
      : variant === "preview"
        ? "relative h-[100svh] w-full max-w-5xl justify-center [container-type:inline-size]"
        : isTransitionLocked
          ? transitionRect
            ? "fixed max-w-none items-center justify-end p-2"
            : "fixed inset-x-0 bottom-0 mx-auto h-[max(60svh,300px)] w-full max-w-6xl items-center justify-end p-2"
          : "relative h-[max(60svh,300px)] w-full items-center justify-end p-2";

  const cardClasses =
    variant === "header"
      ? "cursor-default h-full max-w-[2650px] items-center p-10 justify-center pb-18 md:wide:pb-28"
      : variant === "preview"
        ? "supertall:top-12 top-8 superwide:top-0 cursor-pointer p-3 md:p-6 h-[max(70cqw,50svh)] md:h-[max(80cqw,50svh)] superwide:h-[90svh] wide:h-[min(60cqw,70svh)] lg:superwide:h-[min(60cqw,70svh)] lg:h-[max(60cqw,50svh)] supertall:h-[clamp(36cqw,70svh,150cqw)] "
        : `${isSummaryInteractionEnabled ? "cursor-pointer" : "pointer-events-none cursor-default"} p-3 md:p-6 h-full`;

  const backgroundImageStyle: MotionStyle =
    variant === "header"
      ? {
          left: holdExpandedHeaderImage
            ? headerImageBaseInset
            : headerImageXInset,
          right: holdExpandedHeaderImage
            ? headerImageBaseInset
            : headerImageXInset,
          top: holdExpandedHeaderImage
            ? headerImageBaseInset
            : headerImageTopInset,
          bottom: holdExpandedHeaderImage
            ? headerImageBaseInset
            : headerImageBottomInset,
          borderRadius: holdExpandedHeaderImage
            ? headerImageBaseRadius
            : headerImageRadius,
        }
      : {
          left: headerImageBaseInset,
          right: headerImageBaseInset,
          top: headerImageBaseInset,
          bottom: headerImageBaseInset,
          borderRadius: headerImageBaseRadius,
        };

  const floatingPaneLayoutClasses =
    variant === "header"
      ? "max-w-[28rem] wide:max-w-[30rem] md:max-w-2xl md:wide:max-w-full xl:max-w-5xl xl:wide:max-w-4xl"
      : variant === "preview"
        ? "mb-12 max-w-[30rem] sm:wide:max-w-full md:mb-14 md:max-w-full wide:mb-0 lg:w-[60%] lg:wide:mb-[3.25rem] lg:superwide:mb-0 xl:superwide:w-full"
        : "max-w-[30rem]";

  const floatingPaneContentClasses =
    variant === "header"
      ? "p-6 md:p-12"
      : variant === "preview"
        ? "p-3 md:p-6"
        : "p-3 md:p-6";

  return (
    // Container
    <motion.div
      ref={ref}
      style={{
        opacity: summaryOpacity,
        visibility: isHandoffSourceHidden ? "hidden" : undefined,
        originX: variant === "bottom" ? 0.5 : undefined,
        originY: variant === "bottom" ? 0 : undefined,
        scale: summaryScale,
        filter: summaryFilter,
        ...(variant === "bottom" && isTransitionLocked && transitionRect
          ? transitionRect
          : null),
        pointerEvents: isHandoffSourceHidden ? "none" : undefined,
        willChange: variant === "header" ? "filter, opacity" : undefined,
      }}
      aria-hidden={isHandoffSourceHidden || undefined}
      className={`z-10 flex flex-col ${containerClasses}`}
    >
      {/* Bottom variant title bar */}
      {variant === "bottom" && (
        <motion.h3
          initial={false}
          animate={
            transitioningToNext ? { y: -120, opacity: 0 } : { y: 0, opacity: 1 }
          }
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="relative mb-6 items-start"
        >
          Next Up
        </motion.h3>
      )}
      {/* Card */}
      <motion.div
        layout
        layoutId={
          participatesInSharedHandoff ? `${layoutIdPrefix}-card` : undefined
        }
        layoutDependency={layoutDependency}
        key={`project-${project.id}`}
        variants={motionVariants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={
          variant === "header" || !isSummaryInteractionEnabled
            ? undefined
            : handleClick
        }
        onLayoutAnimationComplete={() => {
          onLayoutAnimationComplete?.();
        }}
        className={`group relative flex w-full flex-col rounded-8 bg-background supports-[corner-shape:squircle]:rounded-16 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-background md:rounded-12 supports-[corner-shape:squircle]:md:rounded-24 ${cardClasses}`}
      >
        {/* Image as background */}
        {displayedProject.image && (
          <motion.div
            key={participatesInSharedHandoff ? "shared-image" : "local-image"}
            layoutId={
              participatesInSharedHandoff
                ? `${layoutIdPrefix}-image`
                : undefined
            }
            layoutDependency={
              participatesInSharedHandoff ? layoutDependency : undefined
            }
            onClick={
              isHeaderBackgroundInteractive
                ? onHeaderBackgroundClick
                : undefined
            }
            className={`${isHeaderBackgroundInteractive ? "cursor-default" : "pointer-events-none"} absolute overflow-hidden supports-[corner-shape:squircle]:[corner-shape:squircle]`}
            style={backgroundImageStyle}
          >
            <img
              src={displayedProject.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>
        )}

        {/* Ghost div to display hover shadow in non-header variants */}
        {variant !== "header" && (
          <motion.div
            style={{ boxShadow: cardHoverShadow }}
            className="pointer-events-none absolute inset-0 rounded-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100 supports-[corner-shape:squircle]:rounded-16 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-12 supports-[corner-shape:squircle]:md:rounded-24"
          />
        )}

        {/* Ghost div to display drop shadow */}
        <motion.div
          style={{ boxShadow: cardShadow }}
          animate={{ opacity: variant === "header" ? 0 : 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="pointer-events-none absolute inset-0 rounded-8 supports-[corner-shape:squircle]:rounded-16 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-12 supports-[corner-shape:squircle]:md:rounded-24"
        />

        {/* Floating pane portion */}

        <motion.div
          layout
          layoutId={
            participatesInSharedHandoff
              ? `${layoutIdPrefix}-pane-shell`
              : undefined
          }
          layoutDependency={layoutDependency}
          className={`z-50 flex h-fit max-h-full min-h-0 flex-col ${floatingPaneLayoutClasses}`}
          style={{ pointerEvents: floatingPanePointerEvents }}
        >
          <motion.div
            ref={setFloatingPaneNode}
            initial={false}
            animate={{ opacity: floatingPaneOpacity }}
            transition={{
              opacity: {
                duration:
                  (isFloatingPaneVisible
                    ? HEADER_PANE_NAV_DESTINATION_FADE_MS
                    : HEADER_PANE_NAV_CONTENT_FADE_MS) / 1000,
                ease: "easeOut",
              },
            }}
            aria-hidden={variant === "header" && !isFloatingPaneVisible}
            className={`project-summary-scrollbar flex h-fit max-h-full min-h-0 w-full flex-col ${floatingPaneContentClasses} ${floatingPaneOverflowY} overflow-x-hidden rounded-5 supports-[corner-shape:squircle]:rounded-10 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-6 supports-[corner-shape:squircle]:md:rounded-12 ${theme.bgSoftColorClass} bg-opacity-90 ${variant === "preview" ? "backdrop-blur-md" : ""} dark:bg-opacity-90`}
            style={{
              ...mainFloatingStyle,
              pointerEvents: floatingPanePointerEvents,
            }}
          >
            {/* Title text */}
            <motion.h1
              layout="position"
              layoutId={
                participatesInSharedHandoff
                  ? `${layoutIdPrefix}-title`
                  : undefined
              }
              layoutDependency={layoutDependency}
              className={`flex ${theme.textColorClass} ${variant === "header" ? "" : ""}`}
            >
              {displayedProject.title}
            </motion.h1>

            {/* Tags */}
            {displayedProject.tags && (
              <motion.div
                layout="position"
                layoutId={
                  participatesInSharedHandoff
                    ? `${layoutIdPrefix}-tags`
                    : undefined
                }
                layoutDependency={layoutDependency}
                className={`mb-2 flex flex-wrap gap-1 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7`}
              >
                {displayedProject.tags.map((tag) => {
                  const IconComponent = tagIconRegistry[tag.icon];
                  return (
                    <span
                      key={tag.label}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-xs font-semibold md:px-2 md:py-1 ${theme.bgColorClass} text-dark-foreground dark:text-foreground`}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={16}
                          weight="bold"
                          className="shrink-0"
                        />
                      )}
                      {tag.label}
                    </span>
                  );
                })}
              </motion.div>
            )}
            {/* Tagline */}
            <motion.h2
              layout="position"
              layoutId={
                participatesInSharedHandoff
                  ? `${layoutIdPrefix}-tagline`
                  : undefined
              }
              layoutDependency={layoutDependency}
              className={`extremelywide:hidden`}
            >
              {displayedProject.tagline}
            </motion.h2>

            {/* Description */}

            <motion.h5
              layout
              layoutId={
                participatesInSharedHandoff
                  ? `${layoutIdPrefix}-description`
                  : undefined
              }
              layoutDependency={layoutDependency}
              className={`mt-2 text-pretty font-sans text-[0.875rem] leading-snug md:mt-4 md:text-[1rem] lg:mt-5 xl:mt-6 2xl:mt-7 ${
                variant === "header"
                  ? "md:border-l-4 md:border-foreground md:py-2 md:pl-4 md:dark:border-dark-foreground xl:w-[70%]"
                  : variant === "preview"
                    ? ""
                    : "hidden"
              }`}
            >
              {displayedProject.description}
            </motion.h5>

            {/* Bullet points */}
            {variant === "header" && displayedProject.bullets && (
              <div className="overflow-clip">
                <motion.ul
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.2, ease: "easeOut" }}
                  className="mt-2 flex w-full flex-row justify-between gap-x-6 md:mt-4 lg:mt-5 lg:gap-x-12 xl:mt-6 2xl:mt-7 tall:flex-col tall:gap-x-0 tall:gap-y-3"
                >
                  {displayedProject.bullets.map((bullet) => (
                    <li
                      key={`${bullet.label}:${bullet.content}`}
                      className="min-w-0 flex-[1_1_auto] font-sans text-foreground dark:text-dark-foreground md:py-1"
                    >
                      <span className="block text-xs font-semibold opacity-60 md:text-sm">
                        {bullet.label}
                      </span>
                      <span className="mt-1 block text-base font-semibold md:text-xl">
                        {bullet.content}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Button container */}
        <AnimatePresence>
          {variant !== "header" && (
            <motion.div
              key="preview-button"
              className={`absolute bottom-3 left-3 md:bottom-6 md:left-6 wide:hidden lg:wide:block lg:superwide:hidden`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { delay: 0.4, ease: "easeOut" } }}
            >
              {/* Button */}
              <SpinButton
                isLoading={isNavigating}
                tabIndex={isSummaryInteractionEnabled ? 0 : -1}
                className={`relative flex h-10 items-center gap-2 rounded-5 bg-background pl-2 pr-4 font-sans text-base font-semibold text-foreground dark:bg-dark-background dark:text-dark-foreground md:h-12 md:rounded-6 md:pl-3 md:pr-5`}
                style={{ boxShadow: buttonShadow }}
              >
                {displayedProject.button}
              </SpinButton>
              {showKeyboardHints && isSummaryInteractionEnabled && (
                <KeyboardHint
                  shortcut="enter"
                  className="absolute left-[calc(100%-0.75rem)] top-1/2 -translate-y-1/2"
                >
                  Enter
                </KeyboardHint>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
