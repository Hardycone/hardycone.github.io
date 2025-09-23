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
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

interface ProjectSummaryProps {
  variant?: "preview" | "header" | "bottom";
  setTransitioningToNext?: (value: boolean) => void;
}

export default function ProjectSummary({
  variant = "preview",
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
    projects[activeIndex].textColor,
  );
  const themeShadows = getShadows(
    a,
    b,
    lightColor,
    resolvedTheme === "dark" ? "dark" : "light",
  );
  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  // --- Unified variants object
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
      initial: { y: 500, opacity: 0, boxShadow: themeShadows.baseCard },
      animate: {
        y: 0,
        opacity: 1,
        boxShadow: "none",
        transition: {
          y: { duration: 0.2, ease: "easeInOut" },
          boxShadow: { delay: 0.9, duration: 0.3, ease: "easeIn" },
        },
      },
      exit: { y: 0, opacity: 0, transition: { duration: 0 } },
    },
    bottom: {
      initial: { y: 500, opacity: 0, boxShadow: themeShadows.baseCard },
      animate: {
        y: 0,
        opacity: 1,
        boxShadow: themeShadows.baseCard,
        transition: { duration: 0.2, ease: "easeInOut" },
      },
      exit: {
        y: -300,
        opacity: 0,
        transition: { y: { delay: 0.8, duration: 0.2, ease: "easeInOut" } },
      },
    },
  };

  // --- Offset handling (preview centering)
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
  }, [hasMounted, imageLoaded, viewMode, variant, activeIndex]);

  if (!hasMounted || viewMode === "not-found") return null;
  if (viewMode === "home" && variant === "bottom") return null;

  // --- Variant-specific data
  const project =
    variant === "bottom"
      ? projects[(activeIndex + 1) % projects.length]
      : projects[activeIndex];

  const interactive = variant === "preview" || variant === "bottom";
  const margins =
    variant === "preview"
      ? ""
      : variant === "header"
        ? "mt-20 lg:mt-4"
        : "mb-20";
  const dimensions =
    variant === "preview"
      ? "w-full max-w-5xl"
      : variant === "header"
        ? "w-full h-screen"
        : "w-full max-w-5xl";

  const handleClick = () => {
    if (!interactive) return;
    if (variant === "bottom" && setTransitioningToNext) {
      setTransitioningToNext(true);
    }
    setTimeout(() => router.push(`/${project.slug}`), 200);
  };

  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    project.textColor,
  );
  const bgColorClass = getBgColorClass(
    resolvedTheme || "light",
    project.bgColor,
  );

  return (
    <motion.div
      layout
      ref={ref}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onClick={interactive ? handleClick : undefined}
      style={
        variant === "preview" && offset !== null
          ? { marginTop: `${offset}px` }
          : undefined
      }
      className={`relative z-10 flex ${margins} ${dimensions} ${
        interactive ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={project.id}
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
          className={`relative flex w-full gap-4 rounded-xl bg-background p-2 dark:bg-dark-background md:gap-6 md:rounded-[44px] md:p-6 ${
            interactive ? "flex-col sm:flex-row" : "flex-col"
          }`}
        >
          {/* Text + Button */}
          <div className="flex h-full w-full flex-col">
            <motion.div
              layout="position"
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col">
                <div
                  className={`font-sans font-bold ${textColorClass} ${
                    viewMode === "home" ? "text-3xl lg:text-5xl" : "text-5xl"
                  }`}
                >
                  {project.title}
                </div>

                {project.tags && (
                  <div
                    className={`my-4 flex flex-wrap gap-2 ${
                      viewMode === "home" ? "hidden lg:flex" : "flex"
                    }`}
                  >
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 font-sans text-xs font-semibold ${bgColorClass} text-dark-foreground dark:text-foreground`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2
                  className={`mb-2 font-sans font-semibold text-foreground opacity-70 dark:text-dark-foreground ${
                    viewMode === "home" ? "text-lg lg:text-2xl" : "text-2xl"
                  }`}
                >
                  {project.tagline}
                </h2>
              </div>

              <p
                className={`mb-4 font-serif text-foreground dark:text-dark-foreground ${
                  viewMode === "home"
                    ? "line-clamp-6 text-sm sm:line-clamp-4 md:line-clamp-6 lg:text-base"
                    : "text-base"
                }`}
              >
                {project.description}
              </p>
            </motion.div>

            <div className="mt-auto flex w-full justify-end sm:justify-start">
              <motion.button
                animate={{ boxShadow: themeShadows.baseButton }}
                whileHover={{
                  scale: 0.97,
                  boxShadow: themeShadows.hoverButton,
                }}
                className={`px-4 py-2 font-serif text-sm font-bold md:text-base ${textColorClass} rounded-lg md:rounded-full ${
                  interactive ? "" : "hidden"
                } `}
              >
                {project.button}
              </motion.button>
            </div>
          </div>

          {project.image && (
            <div
              className={`relative shrink-0 overflow-hidden rounded-lg ${
                interactive
                  ? "aspect-[2/1] w-full sm:aspect-[1/1] sm:w-1/2"
                  : "aspect-[2/1] w-full"
              }`}
            >
              <Image
                src={project.image}
                alt={`${project.title} preview image`}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="rounded-lg object-cover object-[center_bottom] md:rounded-[20px]"
                priority={variant === "header"}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
