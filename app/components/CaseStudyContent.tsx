"use client";

import { useActiveProject } from "../context/ActiveProjectContext";
import {
  motion,
  AnimatePresence,
  MotionValue,
  useTransform,
} from "framer-motion";
import projects from "@/data/projects";
import { type CSSProperties, useEffect } from "react";
import { useTheme } from "next-themes";
import { PathIcon, ScrollIcon } from "@phosphor-icons/react";
import {
  HEADER_CONTENT_START_LVH,
  HEADER_IMAGE_FADE_START_PROGRESS,
} from "@/lib/caseStudyTransitions";

import CaseStudyOne from "./caseStudies/CaseStudyOne";
import CaseStudyTwo from "./caseStudies/CaseStudyTwo";
import CaseStudyThree from "./caseStudies/CaseStudyThree";
import CaseStudyFour from "./caseStudies/CaseStudyFour";
import CaseStudyFive from "./caseStudies/CaseStudyFive";
import CaseStudySix from "./caseStudies/CaseStudySix";
interface CaseStudyContentProps {
  scrollY: MotionValue<number>;
  headerIntroProgress: MotionValue<number>;
  isVisible?: boolean;
  exitDirection?: "up" | "down";
  onExitComplete?: () => void;
}

type CaseStudyComponentProps = Pick<CaseStudyContentProps, "scrollY">;

type ProjectSlug =
  | "case-study-one"
  | "case-study-two"
  | "case-study-three"
  | "case-study-four"
  | "case-study-five"
  | "case-study-six";

const caseStudyComponents: Record<
  ProjectSlug,
  React.FC<CaseStudyComponentProps>
> = {
  "case-study-one": CaseStudyOne,
  "case-study-two": CaseStudyTwo,
  "case-study-three": CaseStudyThree,
  "case-study-four": CaseStudyFour,
  "case-study-five": CaseStudyFive,
  "case-study-six": CaseStudySix,
};

const contentVariants = {
  initial: { y: 200, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: (direction: "up" | "down") => ({
    y: direction === "up" ? -500 : 500,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  }),
};

export default function CaseStudyContent({
  scrollY,
  headerIntroProgress,
  isVisible = true,
  exitDirection = "down",
  onExitComplete,
}: CaseStudyContentProps) {
  const { activeIndex } = useActiveProject();
  const { resolvedTheme } = useTheme();

  const project = projects[activeIndex];
  const slug = project.slug as ProjectSlug;
  const CaseStudyComponent = caseStudyComponents[slug];
  const peekOpacity = useTransform(headerIntroProgress, (progress) =>
    progress < HEADER_IMAGE_FADE_START_PROGRESS ? 1 : 0,
  );
  const contentOpacity = useTransform(headerIntroProgress, (progress) =>
    progress < HEADER_IMAGE_FADE_START_PROGRESS ? 0 : 1,
  );
  const peekBorderOpacity = useTransform(
    scrollY,
    [
      0,
      window.innerHeight * 2,
      document.body.scrollHeight - window.innerHeight * 2,
      document.body.scrollHeight - window.innerHeight * 1.2,
      document.body.scrollHeight - window.innerHeight,
    ],
    resolvedTheme === "dark" ? [0.25, 0, 0, 0.25, 0] : [1, 0, 0, 1, 0],
  );
  const peekBorderColor = useTransform(
    peekBorderOpacity,
    (opacity) => `rgba(255,255,255,${opacity})`,
  );
  const isBio = slug === "case-study-one";
  const PeekIcon = isBio ? PathIcon : ScrollIcon;
  const peekTitle = isBio ? "My Journey" : "Quick Take";

  // Dispatch event after animation completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("case-study-loaded"));
    }, 600);

    return () => clearTimeout(timeout);
  }, [project.id]);

  return (
    <div className="flex w-full min-w-0 flex-col">
      {isVisible && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-[calc(100lvh-3.5rem)] z-40 mx-auto h-16 w-full max-w-5xl px-2 md:top-[calc(100lvh-5rem)] md:h-24 md:px-4"
          style={{ opacity: peekOpacity }}
        >
          <motion.div
            key={`peek-${project.id}`}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            className="flex min-h-40 w-full flex-col rounded-6 border bg-background/90 p-3 text-foreground dark:bg-dark-background/90 dark:text-dark-foreground md:min-h-48 md:rounded-8 md:p-6"
            style={{ borderColor: peekBorderColor }}
          >
            <div className="mb-2 flex items-center gap-4">
              <PeekIcon
                size={40}
                weight="duotone"
                className="h-[30px] w-[30px] md:h-10 md:w-10"
              />
              <h3>{peekTitle}</h3>
            </div>
            <div className="invisible mb-16 h-0.5 w-full rounded-full dark:bg-dark-foreground" />
          </motion.div>
        </motion.div>
      )}
      <div
        className="h-[calc(var(--header-content-start)-3.5rem)] md:h-[calc(var(--header-content-start)-5rem)]"
        style={
          {
            "--header-content-start": `${HEADER_CONTENT_START_LVH}lvh`,
          } as CSSProperties
        }
      />
      <motion.div
        className="relative w-full min-w-0"
        style={{ opacity: contentOpacity }}
      >
        <AnimatePresence
          mode="wait"
          custom={exitDirection}
          onExitComplete={onExitComplete}
        >
          {isVisible && (
            <motion.div
              key={project.id}
              custom={exitDirection}
              variants={contentVariants}
              initial={false}
              animate="animate"
              exit="exit"
              className="relative z-40 flex w-full min-w-0 flex-col"
            >
              <CaseStudyComponent scrollY={scrollY} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="h-[max(60lvh,300px)]" />
    </div>
  );
}
