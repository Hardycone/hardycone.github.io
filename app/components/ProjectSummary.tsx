"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import { motion, MotionValue, useTransform, useSpring } from "framer-motion";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import SpinButton from "./SpinButton";
import { PALETTE } from "@/lib/palette";

import Kbd from "./Kbd";

import { useActiveProject } from "../context/ActiveProjectContext";
import projects from "../../data/projects";
import type { Project } from "../../data/projects";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

interface ProjectSummaryProps {
  variant: "preview" | "header" | "bottom";
  scrollY: MotionValue<number>;
  onLayoutAnimationComplete?: () => void;
}

export default function ProjectSummary({
  variant,
  scrollY,
  onLayoutAnimationComplete,
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

  const smoothScrollY = useSpring(scrollY, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });

  const headerOpacity = useTransform(
    scrollY,
    [0, 50, window.innerHeight / 2],
    [1, 1, 0],
  );

  const bottomOpacity = useTransform(
    scrollY,
    [
      document.body.scrollHeight - window.innerHeight * 1.5,
      document.body.scrollHeight - window.innerHeight,
    ],
    [0, 1],
  );

  const headerScale = useTransform(
    scrollY,
    [0, 50, window.innerHeight / 2],
    [1, 1, 0.95],
  );

  const bottomScale = useTransform(
    scrollY,
    [
      document.body.scrollHeight - window.innerHeight * 1.5,
      document.body.scrollHeight - window.innerHeight,
    ],
    [1.1, 1],
  );

  const {
    cardLightShadow,
    cardDarkShadow,
    cardHoverLightShadow,
    cardHoverDarkShadow,
    buttonLightShadow,
    buttonDarkShadow,
  } = useMouseShadow();

  const cardShadow =
    resolvedTheme === "dark" ? cardDarkShadow : cardLightShadow;

  const cardHoverShadow =
    resolvedTheme === "dark" ? cardHoverDarkShadow : cardHoverLightShadow;

  const buttonShadow =
    resolvedTheme === "dark" ? buttonDarkShadow : buttonLightShadow;

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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = () => {
    if (variant === "header") return;
    setIsNavigating(true);
    if (variant === "bottom" && setTransitioningToNext) {
      // mark that a click-initiated morph started
      isMorphingRef.current = true;
      morphTargetRef.current = project;
      setTransitioningToNext(true);
      setKey(`project-${project.id}`);
      setdisplayedProject(project);
    }
    const navigationDelay = variant === "bottom" ? 340 : 200;
    timerRef.current = setTimeout(() => {
      router.push(`/${project.slug}`);
      // No need to set isNavigating(false) here,
      // the useEffect above will handle it when the page/props change.
    }, navigationDelay);
  };

  useEffect(() => {
    setIsNavigating(false);
  }, [project.id, variant]);

  useEffect(() => {
    // Only avoid updating displayedProject if a click-initiated morph is in progress.
    if (!isMorphingRef.current) {
      setKey(`project-${project.id}`);
      setdisplayedProject(project);
    }
  }, [project, variant]);

  if (!hasMounted) return null;

  const layoutDependency = `${variant}-${displayedProject.id}`;
  const summaryOpacity = transitioningToNext
    ? 1
    : variant === "header"
      ? headerOpacity
      : variant === "bottom"
        ? bottomOpacity
        : 1;
  const summaryScale = transitioningToNext
    ? 1
    : variant === "header"
      ? headerScale
      : variant === "bottom"
        ? bottomScale
        : 1;

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

  const ghostVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0 },
  };

  const containerClasses =
    variant === "header"
      ? "fixed inset-0 w-full h-[100svh] items-center justify-center md:p-12"
      : variant === "preview"
        ? "relative h-[100svh] w-full max-w-5xl justify-center"
        : "fixed items-center justify-end w-full h-[100svh] max-w-5xl px-2 pt-2 ";

  const cardClasses =
    variant === "header"
      ? "cursor-default h-full max-w-[2650px] gap-12 p-6"
      : variant === "preview"
        ? "supertall:top-[3rem] wide:top-[2.5rem] superwide:top-0 cursor-pointer p-3 md:p-6 h-[clamp(16rem,50svh,20rem)] wide:h-[clamp(7rem,70svh,38rem)] superwide:h-[clamp(5rem,80svh,38rem)] tall:h-[70svh] supertall:h-[85svh]"
        : "cursor-pointer p-6 h-[100svh] max-h-[360px] mb-12";

  return (
    // Container
    <motion.div
      ref={ref}
      style={{
        opacity: summaryOpacity,
        scale: summaryScale,
      }}
      className={`z-10 flex flex-col ${containerClasses}`}
    >
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
        whileHover={variant === "header" ? undefined : "hover"}
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
            // clear the global transitioning flag if exists
            if (setTransitioningToNext) setTransitioningToNext(false);
          }
        }}
        className={`relative flex w-full flex-col rounded-[1.5rem] bg-background dark:bg-dark-background md:rounded-[2.75rem] ${cardClasses}`}
      >
        {/* Ghost div to display hover shadow in non-header variants */}
        {variant !== "header" && (
          <motion.div
            variants={ghostVariants}
            style={{ boxShadow: cardHoverShadow }}
            className="absolute inset-0 rounded-[1.5rem] md:rounded-[2.75rem]"
          />
        )}

        {/* Ghost div to display shadow in non-header variants */}
        <motion.div
          style={{ boxShadow: cardShadow }}
          animate={{ opacity: variant === "header" ? 0 : 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="absolute inset-0 rounded-[1.5rem] md:rounded-[2.75rem]"
        />

        {/* Bottom variant title bar */}
        {variant === "bottom" && (
          <div className={`mb-6 flex w-full justify-between`}>
            {/* "Next Up" */}
            <h6 className="text-lg font-bold">Next Up </h6>
            {/* Button */}
            <SpinButton
              isLoading={isNavigating}
              className={`border-2 ${theme.borderColorClass} border-opacity-40 hover:border-opacity-100 active:border-0 ${theme.bgSoftColorClass} h-[1.5rem] md:h-[2.5rem]`}
            >
              {displayedProject.button}
            </SpinButton>
          </div>
        )}

        {/* Main portion */}
        <div className="flex h-full w-full gap-2 tall:flex-col">
          {/* 1st half of card */}
          <div
            className={`flex min-h-0 min-w-0 flex-1 justify-between tall:order-1 ${variant === "bottom" ? "flex-row" : "flex-col"}`}
          >
            {/* Text */}
            <div className="flex w-full flex-col">
              {/* Title block */}
              <div className="flex flex-col">
                {/* Title text */}
                <h1
                  className={`flex font-sans font-bold ${theme.textColorClass} ${variant === "header" ? "text-3xl md:text-6xl" : "mb-1 text-2xl extremelywide:mb-0 extremelywide:text-sm"}`}
                >
                  {displayedProject.title}
                </h1>
                {/* Tags */}
                {variant !== "bottom" && displayedProject.tags && (
                  <div
                    className={`flex flex-wrap gap-1 ${variant === "header" ? "mb-2" : "mb-1 hidden tall:flex"}`}
                  >
                    {displayedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-1 font-sans md:px-2 md:py-1 ${variant === "header" ? "text-xs" : "text-xs"} font-semibold ${theme.bgColorClass} text-dark-foreground dark:text-foreground`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Tagline */}
                <h2
                  className={`line-clamp-2 font-sans font-semibold leading-tight text-foreground opacity-70 dark:text-dark-foreground md:mb-2 extremelywide:hidden ${
                    variant === "header" ? "text-md mb-2" : "text-md mb-2"
                  }`}
                >
                  {displayedProject.tagline}
                </h2>
              </div>
              {/* Description */}
              {variant !== "bottom" && (
                <p
                  className={`text-xs leading-tight text-foreground dark:text-dark-foreground md:mb-4 md:text-base superwide:hidden ${
                    variant === "preview"
                      ? "line-clamp-6 wide:line-clamp-5"
                      : "mb-2"
                  }`}
                >
                  {displayedProject.description}
                </p>
              )}
              {/* Bullet points */}
              {variant === "header" && displayedProject.bullets && (
                <ul>
                  {displayedProject.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className={`font-sans text-base font-semibold text-foreground dark:text-dark-foreground md:py-1 md:text-xl`}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Button container */}
            {variant === "preview" && (
              <div className={`flex w-full justify-start`}>
                {/* Button */}
                <SpinButton
                  isLoading={isNavigating}
                  className={`${theme.textColorClass} h-[1.5rem] dark:bg-dark-${displayedProject.id}-soft md:h-[2.5rem]`}
                  style={{
                    boxShadow: buttonShadow,
                    backgroundImage: buttonShadow,
                  }}
                >
                  {displayedProject.button}
                </SpinButton>
              </div>
            )}
          </div>
          {/* 2nd half of card */}
          {displayedProject.image && (
            <div
              className={`relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[1rem] md:rounded-[1.5rem]`}
            >
              {/* Image */}
              <Image
                src={displayedProject.image}
                alt={displayedProject.title}
                fill
                className="object-cover"
                priority={variant === "header"}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
