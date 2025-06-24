"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import projects from "../../data/projects";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import { useTheme } from "next-themes";
import { useLighting, getShadows } from "../context/LightingContext";
import Image from "next/image";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

interface ProjectSummaryProps {
  variant?: "header" | "bottom";
  setTransitioningToNext?: (value: boolean) => void; // new optional callback
}

export default function ProjectSummary({
  variant = "header",
}: ProjectSummaryProps) {
  const { setTransitioningToNext } = useActiveProject();
  const hasMounted = useHasMounted();
  const { activeIndex, previousIndex } = useActiveProject();
  const { viewMode } = useViewMode();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);

  const { a, b, getTextColorClass, getBgColorClass, getLightColor } =
    useLighting();

  const lightColor = getLightColor(
    resolvedTheme || "light",
    projects[activeIndex].textColor
  );
  const themeShadows = getShadows(
    a,
    b,
    lightColor,
    resolvedTheme === "dark" ? "dark" : "light"
  );

  const homeViewVersion = {
    initial: (direction: "up" | "down") => ({
      y:
        direction === "up"
          ? window.innerHeight / 2 - 240
          : -window.innerHeight / 2 + 240,
      opacity: 0,
    }),
    animate: {
      boxShadow: themeShadows.baseCard,
      y: 0,
      opacity: 1,
      transition: {
        y: { duration: 0.1, ease: "easeInOut" },
        boxShadow: { duration: 0.1, ease: "easeInOut" },
      },
    },
    exit: (direction: "up" | "down") => ({
      y:
        direction === "up"
          ? -window.innerHeight / 2 + 240
          : window.innerHeight / 2 - 240,
      opacity: 0,
      transition: { duration: 0.1, ease: "easeOut" },
    }),
  };

  const caseStudyViewVersion = {
    initial: (variant: "header" | "bottom") => ({
      y: variant === "bottom" ? 500 : 500,
      boxShadow: themeShadows.baseCard,
      opacity: 0,
    }),
    animate: (variant: "header" | "bottom") => ({
      boxShadow: variant === "header" ? "none" : themeShadows.baseCard,
      y: 0,
      opacity: 1,
      transition:
        variant === "bottom"
          ? { delay: 0, duration: 0.2, ease: "easeInOut" }
          : {
              y: { duration: 0.2, ease: "easeInOut" },
              boxShadow: { delay: 0.9, duration: 0.3, ease: "easeIn" },
            },
    }),
    exit: (variant: "header" | "bottom") => ({
      y: variant === "bottom" ? -300 : 0,
      opacity: 0,
      transition:
        variant === "bottom"
          ? { y: { delay: 0.8, duration: 0.2, ease: "easeInOut" } }
          : { delay: 0, duration: 0 },
    }),
  };

  useLayoutEffect(() => {
    if (
      !hasMounted ||
      !imageLoaded ||
      !(viewMode === "home" && variant === "header")
    )
      return;

    if (!ref.current) return;

    const updateOffset = () => {
      const height = ref.current?.offsetHeight ?? 0;
      setOffset(Math.max(0, window.innerHeight / 2 - height / 2));
    };

    updateOffset();

    const observer = new ResizeObserver(updateOffset);
    observer.observe(ref.current);

    window.addEventListener("resize", updateOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, [hasMounted, imageLoaded, viewMode, variant, activeIndex]);

  if (!hasMounted || viewMode === "not-found") return null;
  if (variant === "bottom" && viewMode === "home") return null;

  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  let project;
  let clickable = false;
  let showButton = false;
  let margins = "";
  let dimensions = "";

  if (variant === "header") {
    project = projects[activeIndex];
    clickable = viewMode === "home";
    showButton = viewMode === "home";
    margins = viewMode === "home" ? "" : "mt-20 lg:mt-4";
    dimensions = viewMode === "home" ? "w-full h-auto" : "w-full h-auto";
  } else if (variant === "bottom") {
    const nextIndex = (activeIndex + 1) % projects.length;
    project = projects[nextIndex];
    clickable = true;
    showButton = true;
    margins = "mb-20";
    dimensions = "w-full h-auto";
  }

  if (!project) return null;

  const handleClick = () => {
    if (!clickable) return;

    if (variant === "bottom" && setTransitioningToNext) {
      setTransitioningToNext(true);
    }

    // Delay navigation to allow animation start
    setTimeout(() => {
      router.push(`/${project.slug}`);
    }, 200);
  };

  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    project.textColor
  );

  const bgColorClass = getBgColorClass(
    resolvedTheme || "light",
    project.bgColor
  );

  return (
    //Project summary container
    <motion.div
      layout
      transition={{ duration: 0.2, ease: "easeInOut" }}
      ref={ref}
      onClick={clickable ? handleClick : undefined}
      style={
        viewMode === "home" && variant === "header" && offset !== null
          ? { marginTop: `${offset}px` }
          : undefined
      }
      className={`relative flex z-10 ${margins} ${dimensions} ${
        clickable ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/*Project summary card*/}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={project.id}
          custom={viewMode === "home" ? direction : variant}
          variants={
            viewMode === "home" ? homeViewVersion : caseStudyViewVersion
          }
          initial={viewMode === "home" && offset === null ? false : "initial"}
          animate="animate"
          exit="exit"
          whileHover={
            viewMode === "case-study" && variant === "header"
              ? undefined
              : {
                  scale: 1.005,
                  boxShadow: themeShadows.hoverCard,
                }
          }
          className={`relative flex w-full gap-4 md:gap-6 p-2 md:p-6 rounded-xl md:rounded-[44px] bg-background dark:bg-dark-background ${
            showButton ? "flex-col sm:flex-row" : "flex-col"
          }`}
        >
          {/*Text and Button*/}
          <div className="flex flex-col w-full h-full">
            {/*Text*/}
            <motion.div
              layout="position"
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col gap-6"
            >
              {/*Title Block*/}
              <div className="flex flex-col gap-4">
                {/*Up Next*/}
                <h3
                  className={`text-serif text-foreground dark:text-dark-foreground ${
                    variant === "bottom" ? "text-sm sm:text-lg" : "hidden"
                  }`}
                >
                  Next Up
                </h3>

                {/*Title and Tags*/}
                <div className="flex flex-col gap-2">
                  {/*Title*/}
                  <h1
                    className={`font-sans font-bold ${textColorClass} text-3xl lg:text-5xl mb-2`}
                  >
                    {project.title}
                  </h1>

                  {/*Tags*/}
                  {project.tags && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-xs font-sans font-medium ${bgColorClass} text-dark-foreground dark:text-foreground`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/*Tagline*/}
                <h2
                  className={`font-sans font-semibold text-foreground dark:text-dark-foreground opacity-70 text-xl lg:text-2xl mb-2`}
                >
                  {project.tagline}
                </h2>
              </div>

              {/*Description*/}
              <p className="font-serif text-base text-foreground dark:text-dark-foreground mb-4 line-clamp-6 sm:line-clamp-4 md:line-clamp-6">
                {project.description}
              </p>
            </motion.div>
            {/*Button*/}
            <div className="flex mt-auto w-full justify-end sm:justify-start">
              <motion.button
                animate={{
                  boxShadow: themeShadows.baseButton,
                }}
                whileHover={{
                  scale: 0.97,
                  boxShadow: themeShadows.hoverButton,
                }}
                className={`font-serif font-bold px-4 py-2 text-sm md:text-base ${textColorClass} rounded-lg md:rounded-full ${
                  showButton ? "" : "hidden"
                } `}
              >
                {project.button}
              </motion.button>
            </div>
          </div>
          {/*Image*/}
          {project.image && (
            <div
              className={`relative shrink-0 overflow-hidden rounded-lg ${
                showButton
                  ? "w-full sm:w-1/2 aspect-[2/1] sm:aspect-[1/1]"
                  : "w-full aspect-[2/1] "
              }`}
            >
              <Image
                src={project.image}
                alt={`${project.title} preview image`}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover object-[center_bottom] rounded-lg md:rounded-[20px]"
                priority={viewMode === "home" && variant === "header"}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
