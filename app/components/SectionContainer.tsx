// app/components/SectionContainer.tsx

"use client";

import { ReactNode, useRef } from "react";
import { IconProps } from "@phosphor-icons/react";
import {
  MotionValue,
  motion,
  useInView,
  useReducedMotion,
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
  cardClass?: string;
  contentClassName?: string;
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
  // bgOpacityClass = "bg-opacity-20 dark:bg-opacity-20",

  borderColor,
  animateHeadingReveal = true,
  cardClass = "",
  contentClassName = "",
  revealOnScroll = true,
  showDivider = false,
  children,
}: SectionContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const shouldRevealOnScroll = revealOnScroll && !shouldReduceMotion;
  const isContainerInView = useInView(containerRef, {
    once: true,
    amount: "some",
    margin: "0px 0px -15% 0px",
  });

  const { activeIndex } = useActiveProject();
  const theme = useProjectTheme(projects[activeIndex].id);

  return (
    <motion.div
      ref={containerRef}
      className={`flex flex-col rounded-6 border bg-background/90 p-2 text-foreground supports-[corner-shape:squircle]:rounded-12 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-background/90 dark:text-dark-foreground md:rounded-8 md:p-6 supports-[corner-shape:squircle]:md:rounded-16 ${cardClass}`}
      style={{ borderColor }}
      initial={
        shouldRevealOnScroll
          ? { opacity: 0, y: 48, scale: 0.9, filter: "blur(4px)" }
          : false
      }
      animate={
        shouldRevealOnScroll && isContainerInView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : undefined
      }
      transition={
        shouldRevealOnScroll
          ? {
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }
          : undefined
      }
    >
      {showHeading && Icon ? (
        <>
          <GradientHeadingReveal
            animateReveal={animateHeadingReveal}
            icon={Icon}
            isRevealed={!shouldRevealOnScroll || isContainerInView}
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
      <div className={`flex flex-col gap-8 p-1 md:p-12 ${contentClassName}`}>
        {children}
      </div>
    </motion.div>
  );
}
