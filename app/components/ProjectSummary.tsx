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
  useSpring,
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
  const [offset, setOffset] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);

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
    smoothScrollY,
    [0, window.innerHeight / 2],
    [1, 0.95],
  );

  const bottomScale = useTransform(
    smoothScrollY,
    [
      document.body.scrollHeight - window.innerHeight * 1.5,
      document.body.scrollHeight - window.innerHeight,
    ],
    [0.95, 1],
  );

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

  // near the top of ProjectSummary component
  const isMorphingRef = useRef(false);

  const handleClick = () => {
    if (variant === "header") return;
    if (variant === "bottom" && setTransitioningToNext) {
      // mark that a click-initiated morph started
      isMorphingRef.current = true;
      setTransitioningToNext(true);
      setKey(`project-${projects[(activeIndex + 1) % projects.length].id}`);
      setFrozenProject(project);
    }
    setTimeout(() => router.push(`/${project.slug}`), 200);
  };

  useEffect(() => {
    // Only avoid updating frozenProject if a click-initiated morph is in progress.
    if (!isMorphingRef.current) {
      setKey(`project-${project.id}`);
      setFrozenProject(project);
    }
  }, [project, variant]);

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
        boxShadow: themeShadows.baseCard,
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        boxShadow: "none",
        transition: {
          boxShadow: { delay: 0.5, duration: 0.2, ease: "easeIn" },
        },
      },
      exit: { transition: { duration: 0.2 } },
    },
    bottom: {
      initial: {
        y: 48,
        boxShadow: themeShadows.baseCard,
      },
      animate: {
        y: 48,
        scale: 1,
        opacity: 1,
        boxShadow: themeShadows.baseCard,
        transition: { duration: 0.2, ease: "easeInOut" },
      },
      exit: {
        y: 48,
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
        : "fixed items-center justify-end w-full h-screen max-w-6xl px-2 pt-2 ";

  const cardClasses =
    variant === "header"
      ? "cursor-default h-full max-w-[2650px] gap-12 p-6"
      : variant === "preview"
        ? " cursor-pointer gap-6 p-6"
        : " cursor-pointer pb-12 pt-6 px-6";

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
    <motion.div
      ref={ref}
      style={{
        opacity:
          variant === "header"
            ? headerOpacity
            : variant === "bottom"
              ? bottomOpacity
              : undefined,
        scale:
          variant === "header"
            ? headerScale
            : variant === "bottom"
              ? bottomScale
              : undefined,
      }}
      onClick={variant === "header" ? undefined : handleClick}
      // style={
      //   variant === "preview" && offset !== null
      //     ? { marginTop: `${offset}px` }
      //     : undefined
      // }
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
        whileHover={
          variant === "header"
            ? undefined
            : { scale: 1, boxShadow: themeShadows.hoverCard }
        }
        onLayoutAnimationComplete={() => {
          // If we were morphing (click), commit the latest project once the layout animation finished.
          if (isMorphingRef.current) {
            isMorphingRef.current = false;
            // commit frozenProject to the latest "project"
            setKey(`project-${project.id}`);
            setFrozenProject(project);
            // clear the global transitioning flag if exists
            if (setTransitioningToNext) setTransitioningToNext(false);
          }
        }}
        className={`flex w-full rounded-[44px] bg-background dark:bg-dark-background ${cardClasses}`}
      >
        {/* Left */}
        <div
          className={`flex h-full w-full flex-1 ${variant === "bottom" ? "" : "flex-col"}`}
        >
          {/* Text */}
          <div className="flex-0 flex w-full flex-col gap-4">
            {/*Title button*/}
            {variant === "bottom" && (
              <div
                className={`mb-auto flex w-full flex-1 items-center justify-between`}
              >
                {/* "Next Up" */}
                <h6 className="font-serif text-lg font-bold">Next Up </h6>
                {/* Button */}
                <motion.button
                  animate={{ boxShadow: themeShadows.baseButton }}
                  whileHover={{
                    scale: 0.97,
                    boxShadow: themeShadows.hoverButton,
                  }}
                  className={`px-4 py-2 font-serif text-lg font-bold ${textColorClass} whitespace-nowrap rounded-full`}
                >
                  {frozenProject.button}
                </motion.button>
              </div>
            )}
            {/* Title block */}
            <div className="flex flex-col">
              {/* Title */}
              <div className="flex">
                {/* Title text */}
                <h1
                  className={`font-sans font-bold ${textColorClass} } text-5xl`}
                >
                  {frozenProject.title}
                </h1>
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
            {variant !== "bottom" && (
              <p
                className={`mb-4 font-serif text-base text-foreground dark:text-dark-foreground ${
                  variant === "preview" ? "line-clamp-6" : ""
                }`}
              >
                {frozenProject.description}
              </p>
            )}
            {/* Bullet points */}
            {variant === "header" && frozenProject.bullets && (
              <ul>
                {frozenProject.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className={`px-2 py-1 font-sans text-xl font-semibold text-foreground dark:text-dark-foreground`}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Button container */}
          {variant === "preview" && (
            <div className={`mt-auto flex w-full justify-start`}>
              {/* Button */}
              <motion.button
                animate={{ boxShadow: themeShadows.baseButton }}
                whileHover={{
                  scale: 0.97,
                  boxShadow: themeShadows.hoverButton,
                }}
                className={`px-4 py-2 font-serif text-lg font-bold ${textColorClass} whitespace-nowrap rounded-full`}
              >
                {frozenProject.button}
              </motion.button>
            </div>
          )}
        </div>

        {/* Image container*/}
        {frozenProject.image && (
          <div
            className={`${variant === "bottom" ? "flex-0" : "flex-1"} relative overflow-hidden rounded-[20px]`}
          >
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
    </motion.div>
  );
}
