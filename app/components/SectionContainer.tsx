// app/components/SectionContainer.tsx

"use client";

import { ReactNode } from "react";
import { IconProps } from "@phosphor-icons/react";
import { MotionValue, motion, useReducedMotion } from "framer-motion";
import { useIsMdUp } from "@/hooks/useIsMdUp";

interface SectionContainerBaseProps {
  textColorClass?: string;
  bgColorClass?: string;
  // bgOpacityClass?: string;

  borderColor?: MotionValue<string> | string;
  cardClass?: string;
  revealOnScroll?: boolean;
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
  cardClass = "mb-12",
  revealOnScroll = true,
  children,
}: SectionContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldRevealOnScroll = revealOnScroll && !shouldReduceMotion;

  const isMdUp = useIsMdUp();

  return (
    <motion.div
      className={`rounded-4 md:rounded-8 flex flex-col border bg-background/90 p-3 text-foreground dark:bg-dark-background/90 dark:text-dark-foreground md:p-6 ${cardClass}`}
      style={{ borderColor }}
      initial={
        shouldRevealOnScroll ? { opacity: 0, y: 56, scale: 0.98 } : false
      }
      whileInView={
        shouldRevealOnScroll ? { opacity: 1, y: 0, scale: 1 } : undefined
      }
      viewport={
        shouldRevealOnScroll
          ? { once: true, amount: "some", margin: "0px 0px -25% 0px" }
          : undefined
      }
      transition={
        shouldRevealOnScroll
          ? {
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }
          : undefined
      }
    >
      {showHeading && Icon ? (
        <>
          <div className={`mb-2 flex items-center gap-4`}>
            <Icon
              size={isMdUp ? 40 : 30}
              weight="duotone"
              className={`${textColorClass}`}
            />
            <h3 className={` ${textColorClass}`}>{title}</h3>
          </div>
          <div
            className={`mb-16 h-[2px] w-full rounded-full ${bgColorClass}`}
          />
        </>
      ) : null}
      {children}
    </motion.div>
  );
}
