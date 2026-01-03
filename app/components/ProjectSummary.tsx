"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import { motion, MotionValue, useTransform, useSpring } from "framer-motion";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import SpinButton from "./SpinButton";
import Kbd from "./Kbd";

import { useActiveProject } from "../context/ActiveProjectContext";
import projects from "../../data/projects";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

interface ProjectSummaryProps {
  variant: "preview" | "header" | "bottom";
  scrollY: MotionValue<number>;
}

export default function ProjectSummary({
  variant,
  scrollY,
}: ProjectSummaryProps) {
  const { setTransitioningToNext, activeIndex, previousIndex } =
    useActiveProject();
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
    [0, window.innerHeight / 2],
    [1, 0],
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
    [0, window.innerHeight / 2],
    [1, 0.95],
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
  } = useMouseShadow();

  const cardShadow =
    resolvedTheme === "dark" ? cardDarkShadow : cardLightShadow;

  const cardHoverShadow =
    resolvedTheme === "dark" ? cardHoverDarkShadow : cardHoverLightShadow;

  const project =
    variant === "bottom"
      ? projects[(activeIndex + 1) % projects.length]
      : projects[activeIndex];

  const theme = useProjectTheme(project.id);

  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  const [key, setKey] = useState(`project-${project.id}`);
  const [displayedProject, setdisplayedProject] = useState(project);

  // near the top of ProjectSummary component
  const isMorphingRef = useRef(false);

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
      setTransitioningToNext(true);
      setKey(`project-${projects[(activeIndex + 1) % projects.length].id}`);
      setdisplayedProject(project);
    }
    timerRef.current = setTimeout(() => {
      router.push(`/${project.slug}`);
      // No need to set isNavigating(false) here,
      // the useEffect above will handle it when the page/props change.
    }, 200);
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
      ? " fixed inset-0 w-full h-[100dvh] items-center justify-center md:p-12"
      : variant === "preview"
        ? "relative h-[100dvh] w-full max-w-5xl justify-center"
        : "fixed items-center justify-end w-full h-screen max-w-5xl px-2 pt-2 ";

  const cardClasses =
    variant === "header"
      ? "cursor-default h-full max-w-[2650px] gap-12 p-6"
      : variant === "preview"
        ? "supertall:top-[32px] wide:top-[24px] superwide:top-0 cursor-pointer p-2 md:p-6 h-[clamp(240px,50dvh,320px)] wide:h-[clamp(100px,70dvh,600px)] superwide:h-[clamp(100px,80dvh,600px)] tall:h-[70dvh] supertall:h-[85dvh]"
        : "cursor-pointer p-6 h-[100dvh] max-h-[360px] mb-12";

  return (
    // Container
    <motion.div
      ref={ref}
      style={{
        opacity:
          variant === "header"
            ? headerOpacity
            : variant === "bottom"
              ? bottomOpacity
              : 1,
        scale:
          variant === "header"
            ? headerScale
            : variant === "bottom"
              ? bottomScale
              : 1,
      }}
      className={`z-10 flex flex-col ${containerClasses}`}
    >
      {/* Card */}
      <motion.div
        layout
        key={key}
        custom={variant === "preview" ? direction : undefined}
        variants={motionVariants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={variant === "header" ? undefined : "hover"}
        onClick={variant === "header" ? undefined : handleClick}
        onLayoutAnimationComplete={() => {
          // If we were morphing (click), commit the latest project once the layout animation finished.
          if (isMorphingRef.current) {
            isMorphingRef.current = false;
            // commit displayedProject to the latest "project"
            setKey(`project-${project.id}`);
            setdisplayedProject(project);
            // clear the global transitioning flag if exists
            if (setTransitioningToNext) setTransitioningToNext(false);
          }
        }}
        className={`relative flex w-full flex-col rounded-[24px] bg-background dark:bg-dark-background md:rounded-[44px] ${cardClasses}`}
      >
        {/* Ghost div to display hover shadow in non-header variants */}
        {variant !== "header" && (
          <motion.div
            variants={ghostVariants}
            style={{ boxShadow: cardHoverShadow }}
            className="absolute inset-0 rounded-[24px] md:rounded-[44px]"
          />
        )}

        {/* Ghost div to display shadow in non-header variants */}
        <motion.div
          style={{ boxShadow: cardShadow }}
          animate={{ opacity: variant === "header" ? 0 : 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="absolute inset-0 rounded-[24px] md:rounded-[44px]"
        />

        {/* Bottom variant title bar */}
        {variant === "bottom" && (
          <div className={`mb-6 flex w-full justify-between`}>
            {/* "Next Up" */}
            <h6 className="text-lg font-bold">Next Up </h6>
            {/* Button */}
            <SpinButton
              isLoading={isNavigating}
              className={`${theme.textColorClass} border-2 ${theme.borderColorClass} border-opacity-40 hover:border-opacity-100 active:border-0 ${theme.bgSoftColorClass} h-[24px] md:h-[40px]`}
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
                  className={`mb-1 flex font-sans font-bold md:mb-4 ${theme.textColorClass} ${variant === "header" ? "text-3xl md:text-6xl" : "superwide:text-3xl text-xl md:text-5xl"}`}
                >
                  {displayedProject.title}
                </h1>
                {/* Tags */}
                {variant !== "bottom" && displayedProject.tags && (
                  <div
                    className={`mb-2 flex flex-wrap gap-1 space-x-1 md:mb-4 md:gap-2 ${variant === "header" ? "block" : "hidden tall:block"}`}
                  >
                    {displayedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-1 font-sans md:px-2 md:py-1 ${variant === "header" ? "text-sm" : "text-xs"} font-semibold ${theme.bgColorClass} text-dark-foreground dark:text-foreground`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Tagline */}
                <h2
                  className={`extremelywide:hidden mb-1 line-clamp-2 font-sans font-semibold leading-none text-foreground opacity-70 dark:text-dark-foreground md:mb-2 ${
                    variant === "header"
                      ? "text-lg md:text-3xl"
                      : "text-md md:text-2xl"
                  }`}
                >
                  {displayedProject.tagline}
                </h2>
              </div>
              {/* Description */}
              {variant !== "bottom" && (
                <p
                  className={`superwide:hidden text-xs leading-none text-foreground dark:text-dark-foreground md:mb-4 md:text-base ${
                    variant === "preview" ? "line-clamp-4 md:line-clamp-6" : ""
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
                      className={`font-sans text-lg font-semibold text-foreground dark:text-dark-foreground md:py-1 md:text-xl`}
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
                  className={`${theme.textColorClass} border-2 ${theme.borderColorClass} border-opacity-40 hover:border-opacity-100 active:border-0 ${theme.bgSoftColorClass} h-[24px] md:h-[40px]`}
                >
                  {displayedProject.button}
                </SpinButton>
              </div>
            )}
          </div>
          {/* 2nd half of card */}
          {displayedProject.image && (
            <div
              className={`relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[16px] md:rounded-[24px]`}
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
