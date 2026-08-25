// app/components/SectionContainer.tsx

"use client";

import { ReactNode, useRef } from "react";
import { IconProps } from "@phosphor-icons/react";
import {
  MotionValue,
  UseInViewOptions,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import projects from "@/data/projects";
import GradientHeadingReveal from "./GradientHeadingReveal";

interface SectionContainerBaseProps {
  textColorClass?: string;
  bgColorClass?: string;
  // bgOpacityClass?: string;

  borderColor?: MotionValue<string> | string;
  animateHeadingReveal?: boolean;
  cardClassName?: string;
  contentClassName?: string;
  exitOnScroll?: boolean;
  headingRevealAt?: number;
  revealOnScroll?: boolean;
  showDivider?: boolean;
  children: ReactNode;
}

type SectionContainerProps = SectionContainerBaseProps &
  (
    | {
        showHeading?: true;
        title: string;
        icon: React.ComponentType<IconProps>;
      }
    | {
        showHeading: false;
        title?: never;
        icon?: never;
      }
  );

export default function SectionContainer({
  title,
  showHeading = true,
  icon: Icon,
  textColorClass,
  bgColorClass,
  borderColor,
  animateHeadingReveal = true,
  cardClassName = "p-2 md:p-6 bg-background/90 dark:bg-dark-background/90",
  contentClassName = "p-2 md:p-6",
  exitOnScroll = true,
  headingRevealAt = 80,
  revealOnScroll = true,
  showDivider = false,
  children,
}: SectionContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimateEntry = revealOnScroll && !shouldReduceMotion;
  const shouldAnimateExit = exitOnScroll && !shouldReduceMotion;
  const shouldAnimateOnScroll = shouldAnimateEntry || shouldAnimateExit;
  const headingRevealViewportPosition = Math.min(
    100,
    Math.max(0, headingRevealAt),
  );
  const headingRevealRootMargin =
    `0px 0px -${100 - headingRevealViewportPosition}% 0px` as UseInViewOptions["margin"];
  const hasHeadingEnteredRevealZone = useInView(containerRef, {
    once: true,
    amount: "some",
    margin: headingRevealRootMargin,
  });
  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ["start 100%", "start 70%"],
  });
  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    offset: ["end 30%", "end 0%"],
  });
  const revealOriginY = useMotionValue(0);
  const hasEnteredExitZoneRef = useRef(false);
  const visibleProgress = useTransform(
    [entryProgress, exitProgress],
    ([entry, exit]: number[]) =>
      Math.min(
        shouldAnimateEntry ? entry : 1,
        shouldAnimateExit ? 1 - exit : 1,
      ),
  );
  const revealProgress = useSpring(visibleProgress, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
    restDelta: 0.001,
    restSpeed: 0.01,
  });
  const revealOpacity = useTransform(revealProgress, [0, 1], [0, 1]);
  const revealScale = useTransform(revealProgress, [0, 1], [0.9, 1]);
  const revealFilter = useTransform(
    revealProgress,
    [0, 1],
    ["blur(4px)", "blur(0px)"],
  );
  useMotionValueEvent(exitProgress, "change", (exit) => {
    if (!shouldAnimateExit || exit <= 0) return;

    hasEnteredExitZoneRef.current = true;
    revealOriginY.set(1);
  });
  useMotionValueEvent(revealProgress, "change", (progress) => {
    if (
      !hasEnteredExitZoneRef.current ||
      exitProgress.get() > 0 ||
      progress !== 1
    ) {
      return;
    }

    hasEnteredExitZoneRef.current = false;
    revealOriginY.set(0);
  });

  const { activeIndex } = useActiveProject();
  const theme = useProjectTheme(projects[activeIndex].id);

  return (
    <motion.div
      ref={containerRef}
      className={`section-container-scroll-reveal flex flex-col rounded-6 border text-foreground transition-[background-color] duration-150 supports-[corner-shape:squircle]:rounded-12 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:text-dark-foreground md:rounded-8 supports-[corner-shape:squircle]:md:rounded-16 ${cardClassName}`}
      style={{
        borderColor,
        opacity: shouldAnimateOnScroll ? revealOpacity : 1,
        originX: shouldAnimateOnScroll ? 0.5 : undefined,
        originY: shouldAnimateOnScroll ? revealOriginY : undefined,
        scale: shouldAnimateOnScroll ? revealScale : 1,
        filter: shouldAnimateOnScroll ? revealFilter : "blur(0px)",
      }}
    >
      {showHeading && Icon ? (
        <>
          <GradientHeadingReveal
            animateReveal={animateHeadingReveal}
            icon={Icon}
            isRevealed={!shouldAnimateEntry || hasHeadingEnteredRevealZone}
            primaryColor={theme.hex.primary}
            textColorClass={textColorClass}
            title={title}
          />
          <div
            className={`h-0.5 w-full rounded-full ${
              showDivider ? bgColorClass : "invisible"
            }`}
          />
        </>
      ) : null}
      <div className={`flex flex-col gap-8 ${contentClassName}`}>
        {children}
      </div>
    </motion.div>
  );
}
