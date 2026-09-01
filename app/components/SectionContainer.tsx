// app/components/SectionContainer.tsx

"use client";

import { ComponentType, ReactNode, useRef } from "react";
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
import SectionContainerHeading from "./SectionContainerHeading";

interface SectionContainerBaseProps {
  containerClassName?: string;
  contentClassName?: string;
  entryOnScroll?: boolean;
  exitOnScroll?: boolean;
  children: ReactNode;
}

type SectionContainerBorderProps =
  | {
      showBorder?: true;
      borderColor?: MotionValue<string> | string;
    }
  | {
      showBorder: false;
      borderColor?: never;
    };

type SectionContainerHeadingSweepProps =
  | {
      showHeadingSweep?: true;
      headingSweepColor?: string;
      headingSweepAt?: number;
    }
  | {
      showHeadingSweep: false;
      headingSweepColor?: never;
      headingSweepAt?: never;
    };

type SectionContainerDividerProps =
  | {
      showDivider?: false;
      dividerColorClassName?: never;
    }
  | {
      showDivider: true;
      dividerColorClassName: string;
    };

type SectionContainerHeadingProps =
  | ({
      showHeading?: true;
      headingIcon: ComponentType<IconProps>;
      heading: string;
      headingBaseColorClassName?: string;
    } & SectionContainerHeadingSweepProps &
      SectionContainerDividerProps)
  | {
      showHeading: false;
      headingIcon?: never;
      heading?: never;
      headingBaseColorClassName?: never;
      showHeadingSweep?: never;
      headingSweepColor?: never;
      headingSweepAt?: never;
      showDivider?: never;
      dividerColorClassName?: never;
    };

type SectionContainerProps = SectionContainerBaseProps &
  SectionContainerBorderProps &
  SectionContainerHeadingProps;

export default function SectionContainer(props: SectionContainerProps) {
  const {
    containerClassName = "p-2 md:p-6 bg-background/90 dark:bg-dark-background/90 rounded-6 supports-[corner-shape:squircle]:rounded-12 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-8 supports-[corner-shape:squircle]:md:rounded-16",
    contentClassName = "p-2 md:p-6",
    entryOnScroll = true,
    exitOnScroll = true,
    children,
  } = props;
  const showBorder = props.showBorder !== false;
  const headingSweepAt = Math.min(100, Math.max(0, props.headingSweepAt ?? 80));
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimateEntry = entryOnScroll && !shouldReduceMotion;
  const shouldAnimateExit = exitOnScroll && !shouldReduceMotion;
  const shouldAnimateOnScroll = shouldAnimateEntry || shouldAnimateExit;
  const headingSweepRootMargin =
    `0px 0px -${100 - headingSweepAt}% 0px` as UseInViewOptions["margin"];
  const hasHeadingEnteredSweepZone = useInView(containerRef, {
    once: true,
    amount: "some",
    margin: headingSweepRootMargin,
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
      className={`section-container-scroll-reveal flex flex-col text-foreground transition-[background-color] duration-150 dark:text-dark-foreground ${showBorder ? "border" : ""} ${containerClassName}`}
      style={{
        borderColor: showBorder ? props.borderColor : undefined,
        opacity: shouldAnimateOnScroll ? revealOpacity : 1,
        originX: shouldAnimateOnScroll ? 0.5 : undefined,
        originY: shouldAnimateOnScroll ? revealOriginY : undefined,
        scale: shouldAnimateOnScroll ? revealScale : 1,
        filter: shouldAnimateOnScroll ? revealFilter : "blur(0px)",
      }}
    >
      {props.showHeading !== false ? (
        <>
          <SectionContainerHeading
            showHeadingSweep={props.showHeadingSweep ?? true}
            headingIcon={props.headingIcon}
            isRevealed={!shouldAnimateEntry || hasHeadingEnteredSweepZone}
            headingSweepColor={props.headingSweepColor ?? theme.hex.primary}
            headingBaseColorClassName={props.headingBaseColorClassName}
            heading={props.heading}
          />
          {props.showDivider ? (
            <div
              className={`h-0.5 w-full rounded-full ${props.dividerColorClassName}`}
            />
          ) : null}
        </>
      ) : null}
      <div className={`flex flex-col gap-24 ${contentClassName}`}>
        {children}
      </div>
    </motion.div>
  );
}
