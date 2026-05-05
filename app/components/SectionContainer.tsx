// app/components/SectionContainer.tsx

"use client";

import { ReactNode } from "react";
import { IconProps } from "@phosphor-icons/react";
import { MotionValue, motion, useReducedMotion } from "framer-motion";

interface SectionContainerProps {
  title: string;
  icon: React.ComponentType<IconProps>;
  textColorClass?: string;
  bgColorClass?: string;
  bgOpacityClass?: string;
  borderColor?: MotionValue<string> | string;
  cardClass?: string;
  revealOnScroll?: boolean;
  children: ReactNode;
}

export default function SectionContainer({
  title,
  icon: Icon,
  textColorClass,
  bgColorClass,
  bgOpacityClass = "bg-opacity-20 dark:bg-opacity-20",
  borderColor,
  cardClass = "mb-12",
  revealOnScroll = true,
  children,
}: SectionContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldRevealOnScroll = revealOnScroll && !shouldReduceMotion;

  return (
    <motion.div
      className={`flex flex-col rounded-[2.75rem] border bg-background/60 p-6 text-foreground backdrop-blur-xl dark:bg-dark-background/60 dark:text-dark-foreground ${cardClass}`}
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
      <div className={`mb-2 flex items-center gap-4`}>
        <Icon size={40} weight="duotone" className={`${textColorClass}`} />
        <h3 className={`font-sans text-4xl font-bold ${textColorClass}`}>
          {title}
        </h3>
      </div>
      <div className={`mb-16 h-[2px] w-full rounded-full ${bgColorClass}`} />
      {children}
    </motion.div>
  );
}
