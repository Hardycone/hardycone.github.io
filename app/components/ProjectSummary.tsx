/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useTransform,
  type MotionStyle,
} from "framer-motion";
// import { useSpring } from "framer-motion";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import SpinButton from "./SpinButton";
// import { PALETTE } from "@/lib/palette";

// import Kbd from "./Kbd";

import { useActiveProject } from "../context/ActiveProjectContext";
import projects from "../../data/projects";
import type { Project } from "../../data/projects";
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

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

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

function isEditableKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();

  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    tagName === "button" ||
    tagName === "a"
  );
}

interface ProjectSummaryProps {
  variant: "preview" | "header" | "bottom";
  scrollY: MotionValue<number>;
  bottomRevealProgress: MotionValue<number>;
  isTransitionLocked?: boolean;
  onLayoutAnimationComplete?: () => void;
  onBottomNavigationStart?: (slug: string) => void;
}

type MainFloatingStyle = MotionStyle & {
  "--summary-scrollbar-thumb": string;
  "--summary-scrollbar-thumb-rgb": string;
};

export default function ProjectSummary({
  variant,
  scrollY,
  bottomRevealProgress,
  isTransitionLocked = false,
  onLayoutAnimationComplete,
  onBottomNavigationStart,
}: ProjectSummaryProps) {
  const {
    setTransitioningToNext,
    transitioningToNext,
    activeIndex,
    previousIndex,
  } = useActiveProject();
  const hasMounted = useHasMounted();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // const smoothScrollY = useSpring(scrollY, {
  //   stiffness: 120,
  //   damping: 20,
  //   mass: 0.2,
  // });

  const headerOpacity = useTransform(
    scrollY,
    [0, 50, window.innerHeight / 2],
    [1, 1, 0],
  );

  const bottomOpacity = useTransform(bottomRevealProgress, [0, 1], [0, 1]);

  const headerScale = useTransform(
    scrollY,
    [0, 50, window.innerHeight / 2],
    [1, 1, 0.95],
  );

  const headerBlur = useTransform(
    scrollY,
    [0, 50, window.innerHeight / 2],
    ["blur(0px)", "blur(0px)", "blur(10px)"],
  );

  const bottomBlur = useTransform(
    bottomRevealProgress,
    [0, 1],
    ["blur(10px)", "blur(0px)"],
  );

  const bottomScale = useTransform(bottomRevealProgress, [0, 1], [1.1, 1]);

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

  const project =
    variant === "bottom"
      ? projects[(activeIndex + 1) % projects.length]
      : projects[activeIndex];

  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  const [key, setKey] = useState(`project-${project.id}`);
  const [displayedProject, setdisplayedProject] = useState(project);
  const theme = useProjectTheme(displayedProject.id);

  // near the top of ProjectSummary component
  const isMorphingRef = useRef(false);
  const morphTargetRef = useRef<Project | null>(null);

  const [isNavigating, setIsNavigating] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [pressedShortcut, setPressedShortcut] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pressedShortcutTimeout = useRef<number | null>(null);

  const flashShortcutHint = useCallback((shortcut: string) => {
    setPressedShortcut(shortcut);
    if (pressedShortcutTimeout.current) {
      window.clearTimeout(pressedShortcutTimeout.current);
    }
    pressedShortcutTimeout.current = window.setTimeout(() => {
      setPressedShortcut(null);
      pressedShortcutTimeout.current = null;
    }, 120);
  }, []);

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pressedShortcutTimeout.current) {
        window.clearTimeout(pressedShortcutTimeout.current);
      }
    };
  }, []);

  const handleClick = useCallback(() => {
    if (variant === "header") return;
    setIsNavigating(true);
    if (variant === "bottom" && setTransitioningToNext) {
      // mark that a click-initiated morph started
      isMorphingRef.current = true;
      morphTargetRef.current = project;
      setTransitioningToNext(true);
      setKey(`project-${project.id}`);
      setdisplayedProject(project);
      onBottomNavigationStart?.(project.slug);
      return;
    }
    const navigationDelay = 200;
    timerRef.current = setTimeout(() => {
      router.push(`/${project.slug}`);
      // No need to set isNavigating(false) here,
      // the useEffect above will handle it when the page/props change.
    }, navigationDelay);
  }, [
    onBottomNavigationStart,
    project,
    router,
    setTransitioningToNext,
    variant,
  ]);

  useEffect(() => {
    if (variant === "header") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Enter" ||
        event.repeat ||
        event.defaultPrevented ||
        isEditableKeyboardTarget(event.target)
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        setShowKeyboardHints(false);
        return;
      }

      if (event.repeat || isEditableKeyboardTarget(event.target)) return;
      setShowKeyboardHints(true);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setShowKeyboardHints(false);
    };

    const handleMouseMove = () => {
      setShowKeyboardHints(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    setIsNavigating(false);
  }, [project.id, variant]);

  useEffect(() => {
    // Only avoid updating displayedProject if a click-initiated morph is in progress.
    if (!isMorphingRef.current && !isTransitionLocked) {
      setKey(`project-${project.id}`);
      setdisplayedProject(project);
    }
  }, [isTransitionLocked, project, variant]);

  if (!hasMounted) return null;

  const layoutDependency = `${variant}-${displayedProject.id}`;
  const mainFloatingStyle = {
    boxShadow: frameShadow,
    "--summary-scrollbar-thumb": theme.hex.primary,
    "--summary-scrollbar-thumb-rgb": hexToRgbChannels(theme.hex.primary),
  } satisfies MainFloatingStyle;
  const summaryOpacity =
    isTransitionLocked || transitioningToNext
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

  // --- Framer Motion variants
  const motionVariants = {
    preview: {
      initial: (dir: "up" | "down") => ({
        y:
          dir === "up"
            ? window.innerHeight / 2 - 240
            : -window.innerHeight / 2 + 240,
        opacity: 0,
      }),
      animate: {
        y: 0,
        opacity: 1,
        transition: {
          y: { duration: 0.1, ease: "easeInOut" },
          boxShadow: { duration: 0.1, ease: "easeInOut" },
        },
      },
      exit: (dir: "up" | "down") => ({
        y:
          dir === "up"
            ? -window.innerHeight / 2 + 240
            : window.innerHeight / 2 - 240,
        opacity: 0,
        transition: { duration: 0.1, ease: "easeOut" },
      }),
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
      ? "fixed inset-0 w-full h-[100svh] items-center justify-center "
      : variant === "preview"
        ? "relative h-[100svh] w-full max-w-5xl justify-center [container-type:inline-size]"
        : "fixed items-center justify-end w-full h-[max(40lvh,300px)] bottom-0 max-w-5xl p-2 ";

  const cardClasses =
    variant === "header"
      ? "cursor-default h-full max-w-[2650px] gap-12 items-center p-10 pt-[15svh] pb-[4.5rem] md:wide:pb-[6.5rem]"
      : variant === "preview"
        ? "supertall:top-[3rem] top-[2rem] superwide:top-0 cursor-pointer p-3 md:p-6 h-[max(70cqw,50svh)] md:h-[max(80cqw,50svh)] superwide:h-[90svh] wide:h-[min(60cqw,70svh)] lg:superwide:h-[min(60cqw,70svh)] lg:h-[max(60cqw,50svh)] supertall:h-[clamp(36cqw,70svh,150cqw)] "
        : "cursor-pointer p-3 md:p-6 h-full";

  const backgroundImageClasses =
    variant === "header"
      ? "inset-2 md:inset-4"
      : variant === "preview"
        ? "inset-2 md:inset-4 "
        : "inset-2 md:inset-4";

  const floatingPaneClasses =
    variant === "header"
      ? "max-w-[28rem] wide:max-w-[30rem] md:max-w-2xl md:wide:max-w-full xl:max-w-5xl xl:wide:max-w-4xl md:p-12 p-6"
      : variant === "preview"
        ? "max-w-[30rem] sm:wide:max-w-full md:max-w-full p-3 mb-[3rem] md:mb-[3.5rem] wide:mb-0 lg:wide:mb-[3.25rem] lg:superwide:mb-0 lg:w-[60%] md:p-6 xl:superwide:w-full "
        : "p-3 md:p-6 max-w-[30rem]";

  return (
    // Container
    <motion.div
      ref={ref}
      style={{
        opacity: summaryOpacity,
        scale: summaryScale,
        filter: summaryFilter,
        willChange: variant === "header" ? "filter, opacity" : undefined,
      }}
      className={`z-10 flex flex-col ${containerClasses}`}
    >
      {/* Bottom variant title bar */}
      {variant === "bottom" && (
        <h6 className="relative mb-6 items-start font-serif text-lg font-bold">
          Next Up
        </h6>
      )}
      {/* Card */}
      <motion.div
        layout
        layoutDependency={layoutDependency}
        key={key}
        custom={variant === "preview" ? direction : undefined}
        variants={motionVariants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={variant === "header" ? undefined : handleClick}
        onLayoutAnimationComplete={() => {
          onLayoutAnimationComplete?.();

          // If we were morphing (click), commit the latest project once the layout animation finished.
          if (isMorphingRef.current) {
            isMorphingRef.current = false;
            const targetProject = morphTargetRef.current ?? project;
            morphTargetRef.current = null;
            setKey(`project-${targetProject.id}`);
            setdisplayedProject(targetProject);
          }
        }}
        className={`group relative flex w-full flex-col rounded-[1.5rem] bg-background dark:bg-dark-background md:rounded-[3rem] ${cardClasses}`}
      >
        {/* Image as background */}
        {displayedProject.image && (
          <div
            className={`pointer-events-none absolute overflow-hidden rounded-[1rem] md:rounded-[2rem] ${backgroundImageClasses}`}
          >
            <img
              src={displayedProject.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}

        {/* Ghost div to display hover shadow in non-header variants */}
        {variant !== "header" && (
          <motion.div
            style={{ boxShadow: cardHoverShadow }}
            className="pointer-events-none absolute inset-0 rounded-[1.5rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:rounded-[3rem]"
          />
        )}

        {/* Ghost div to display drop shadow */}
        <motion.div
          style={{ boxShadow: cardShadow }}
          animate={{ opacity: variant === "header" ? 0 : 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="pointer-events-none absolute inset-0 rounded-[1.5rem] md:rounded-[3rem]"
        />

        {/* Floating pane portion */}

        <motion.div
          layout
          layoutDependency={layoutDependency}
          className={`project-summary-scrollbar z-10 flex h-fit ${floatingPaneClasses} flex-col ${floatingPaneOverflowY} overflow-x-hidden rounded-[0.75rem] md:rounded-[1.5rem] ${theme.bgSoftColorClass} bg-opacity-90 ${variant !== "header" ? "backdrop-blur-md" : ""} dark:bg-opacity-90`}
          style={mainFloatingStyle}
        >
          {/* Title text */}
          <motion.h1
            layout="position"
            layoutDependency={layoutDependency}
            className={`flex ${theme.textColorClass} ${variant === "header" ? "" : ""}`}
          >
            {displayedProject.title}
          </motion.h1>

          {/* Tags */}
          {displayedProject.tags && (
            <motion.div
              layout="position"
              layoutDependency={layoutDependency}
              className={`mb-2 flex flex-wrap gap-1 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7`}
            >
              {displayedProject.tags.map((tag) => {
                const IconComponent = tagIconRegistry[tag.icon];
                return (
                  <span
                    key={tag.label}
                    className={`inline-flex items-center gap-1 rounded-full px-2 font-sans text-xs font-semibold md:px-2 md:py-1 ${theme.bgColorClass} text-dark-foreground dark:text-foreground`}
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
            layoutDependency={layoutDependency}
            className={`extremelywide:hidden } mb-2 text-foreground opacity-70 dark:text-dark-foreground md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7`}
          >
            {displayedProject.tagline}
          </motion.h2>

          {/* Description */}

          <motion.p
            layout
            layoutDependency={layoutDependency}
            className={`text-xs leading-tight text-foreground dark:text-dark-foreground sm:text-sm xl:text-base ${
              variant === "header"
                ? "mb-2 md:mb-4 md:border-l-4 md:border-foreground md:py-2 md:pl-4 md:dark:border-dark-foreground lg:mb-5 xl:mb-6 xl:w-[70%] 2xl:mb-7"
                : variant === "preview"
                  ? ""
                  : "hidden"
            }`}
          >
            {displayedProject.description}
          </motion.p>

          {/* Bullet points */}
          {variant === "header" && displayedProject.bullets && (
            <div className="overflow-clip">
              <motion.ul
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2, ease: "easeOut" }}
                className="flex flex-row gap-12 tall:flex-col tall:gap-0"
              >
                {displayedProject.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className={`font-sans text-base font-semibold text-foreground dark:text-dark-foreground md:py-1 md:text-xl`}
                  >
                    {bullet}
                  </li>
                ))}
              </motion.ul>
            </div>
          )}
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
                className={`relative flex h-[2.5rem] items-center gap-2 rounded-[0.75rem] bg-background pl-2 pr-4 font-sans text-base font-semibold text-foreground dark:bg-dark-background dark:text-dark-foreground md:h-[3rem] md:rounded-[1.5rem] md:pl-3 md:pr-5`}
                style={{ boxShadow: buttonShadow }}
              >
                {displayedProject.button}
              </SpinButton>
              {showKeyboardHints && (
                <div className="pointer-events-none absolute left-[calc(100%-0.75rem)] top-1/2 -translate-y-1/2 whitespace-nowrap">
                  <motion.div
                    animate={{ scale: pressedShortcut === "enter" ? 0.9 : 1 }}
                    transition={{ duration: 0.08, ease: "easeOut" }}
                    className="block rounded-md bg-sky-700"
                  >
                    <div className="flex h-6 w-11 items-center justify-center rounded-md bg-sky-600 font-sans text-xs font-semibold text-background dark:bg-sky-400 dark:text-dark-background">
                      Enter
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
