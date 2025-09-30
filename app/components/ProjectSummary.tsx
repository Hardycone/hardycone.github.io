"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  MotionValue,
  useTransform,
  useMotionValue,
  useScroll,
} from "framer-motion";
import projects from "../../data/projects";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useTheme } from "next-themes";
import { useLighting, getShadows } from "../context/LightingContext";
import Image from "next/image";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

interface ProjectSummaryProps {
  variant: "preview" | "header" | "bottom";
}

export default function ProjectSummary({ variant }: ProjectSummaryProps) {
  const { setTransitioningToNext, activeIndex, previousIndex } =
    useActiveProject();
  const hasMounted = useHasMounted();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);

  const { a, b, getTextColorClass, getBgColorClass, getLightColor } =
    useLighting();

  const lightColor = getLightColor(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );
  const themeShadows = getShadows(
    a,
    b,
    lightColor,
    resolvedTheme === "dark" ? "dark" : "light",
  );
  const project =
    variant === "bottom"
      ? projects[(activeIndex + 1) % projects.length]
      : projects[activeIndex];
  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  const [key, setKey] = useState(`project-${project.id}`);
  const [frozenProject, setFrozenProject] = useState(project);

  useEffect(() => {
    if (variant !== "bottom") {
      setKey(`project-${project.id}`);
      setFrozenProject(project);
    }
  }, [project, variant]);

  const handleClick = () => {
    if (variant === "header") return;
    if (variant === "bottom" && setTransitioningToNext) {
      setTransitioningToNext(true);
      setKey(`project-${projects[(activeIndex + 1) % projects.length].id}`);
      setFrozenProject(project);
    }
    setTimeout(() => router.push(`/${project.slug}`), 200);
  };

  useLayoutEffect(() => {
    if (!hasMounted || !imageLoaded || variant !== "preview") return;
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
  }, [hasMounted, imageLoaded, variant, activeIndex]);

  if (!hasMounted) return null;

  // --- Framer Motion variants
  const variants = {
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
        boxShadow: themeShadows.baseCard,
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
      initial: {
        y: 0,
        scale: 0.95,
        opacity: 0,
        boxShadow: themeShadows.baseCard,
      },
      animate: {
        scale: 1,
        opacity: 1,
        boxShadow: "none",
        transition: {
          y: { duration: 0, ease: "easeInOut" },
          boxShadow: { delay: 0.5, duration: 0.2, ease: "easeIn" },
        },
      },
      exit: { y: 0, scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
    },
    bottom: {
      initial: {
        y: 0,
        scale: 0.95,
        opacity: 0,
        boxShadow: themeShadows.baseCard,
      },
      animate: {
        y: 0,
        scale: 1,
        opacity: 1,
        boxShadow: themeShadows.baseCard,
        transition: { duration: 0.2, ease: "easeInOut" },
      },
      exit: {
        y: 0,
        scale: 0.95,
        opacity: 0,
        transition: {
          y: { delay: 0, duration: 0, ease: "easeInOut" },
          duration: 0.2,
        },
      },
    },
  };

  // --- Pick correct project

  const containerClasses =
    variant === "header"
      ? " fixed inset-0 w-full h-screen items-center justify-center p-12"
      : variant === "preview"
        ? " relative my-auto w-full max-w-5xl"
        : "fixed items-center justify-center w-full h-screen max-w-5xl p-2";

  const cardClasses =
    variant === "header"
      ? "cursor-default h-full max-w-[2650px] gap-12 "
      : "cursor-pointer gap-6 ";

  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    frozenProject.textColor,
  );
  const bgColorClass = getBgColorClass(
    resolvedTheme || "light",
    frozenProject.bgColor,
  );

  return (
    // Container
    <div
      ref={ref}
      onClick={variant === "header" ? undefined : handleClick}
      // style={
      //   variant === "preview" && offset !== null
      //     ? { marginTop: `${offset}px` }
      //     : undefined
      // }
      className={`z-10 flex flex-col ${containerClasses}`}
    >
      <h1
        className={`${variant === "bottom" ? "mb-6 font-sans text-4xl font-semibold text-foreground dark:text-dark-foreground" : "hidden"}`}
      >
        Next Up
      </h1>
      {/* Card */}
      <motion.div
        layout
        key={key}
        custom={variant === "preview" ? direction : undefined}
        variants={variants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={
          variant === "header"
            ? undefined
            : { scale: 1, boxShadow: themeShadows.hoverCard }
        }
        className={`flex w-full rounded-[44px] bg-background p-6 dark:bg-dark-background ${cardClasses}`}
      >
        {/* Left */}
        <div className="flex h-full w-full flex-1 flex-col">
          {/* Text */}
          <motion.div layout="position" className="flex flex-col gap-4">
            {/* Title block */}
            <div className="flex flex-col">
              {/* Title */}
              <div
                className={`font-sans font-bold ${textColorClass} ${
                  variant === "preview" ? "text-3xl lg:text-5xl" : "text-5xl"
                }`}
              >
                {frozenProject.title}
              </div>
              {/* Tags */}
              {frozenProject.tags && (
                <div
                  className={`my-4 flex flex-wrap gap-2 ${
                    variant === "preview" ? "hidden lg:flex" : "flex"
                  }`}
                >
                  {frozenProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 font-sans text-xs font-semibold ${bgColorClass} text-dark-foreground dark:text-foreground`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* Tagline */}
              <h2
                className={`mb-2 font-sans font-semibold text-foreground opacity-70 dark:text-dark-foreground ${
                  variant === "preview" ? "text-lg lg:text-2xl" : "text-2xl"
                }`}
              >
                {frozenProject.tagline}
              </h2>
            </div>
            {/* Description */}
            <p
              className={`mb-4 font-serif text-foreground dark:text-dark-foreground ${
                variant === "preview"
                  ? "line-clamp-6 text-sm sm:line-clamp-4 md:line-clamp-6 lg:text-base"
                  : "text-base"
              }`}
            >
              {frozenProject.description}
            </p>
          </motion.div>
          {/* Button container */}
          <div className="mt-auto flex w-full justify-end sm:justify-start">
            {/* Button */}
            <motion.button
              animate={{ boxShadow: themeShadows.baseButton }}
              whileHover={{
                scale: 0.97,
                boxShadow: themeShadows.hoverButton,
              }}
              className={`px-4 py-2 font-serif text-sm font-bold md:text-base ${textColorClass} rounded-lg md:rounded-full ${
                variant === "header" ? "hidden" : ""
              } `}
            >
              {frozenProject.button}
            </motion.button>
          </div>
        </div>

        {/* Image container*/}
        {frozenProject.image && (
          <div className="relative flex-1 overflow-hidden rounded-[20px]">
            {/* Image */}
            <div
              className={`relative w-full ${
                variant === "header" ? "h-full" : "pb-[100%]"
              }`}
            >
              <Image
                src={frozenProject.image}
                alt={frozenProject.title}
                fill
                className="object-cover"
                priority={variant === "header"}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
