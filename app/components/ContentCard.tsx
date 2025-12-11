// app/components/ContentCard.tsx

"use client";

import { ReactNode } from "react";
import { IconProps } from "@phosphor-icons/react";
import {
  MotionValue,
  useTransform,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useRef } from "react";

interface ContentCardProps {
  title: string;
  icon: React.ComponentType<IconProps>;
  textColorClass?: string;
  bgColorClass?: string;
  bgOpacityClass?: string;
  borderColor?: MotionValue<string> | string;
  cardClass?: string;
  children: ReactNode;
}

export default function ContentCard({
  title,
  icon: Icon,
  textColorClass,
  bgColorClass,
  bgOpacityClass = "bg-opacity-20 dark:bg-opacity-20",
  borderColor,
  cardClass = "",
  children,
}: ContentCardProps) {
  return (
    <motion.div
      className={`flex flex-col rounded-[44px] border bg-background/60 p-6 text-foreground backdrop-blur-xl dark:bg-dark-background/60 dark:text-dark-foreground ${cardClass}`}
      style={{ borderColor }}
    >
      <div className={`mb-8 flex items-center gap-4`}>
        <Icon size={40} weight="duotone" className={`${textColorClass}`} />
        <h3 className={`font-sans text-4xl font-bold ${textColorClass}`}>
          {title}
        </h3>
      </div>
      {/* <div
        className={`mb-6 h-[2px] w-full rounded-full ${dividerColorClass} ${dividerOpacityClass}`}
      /> */}
      {children}
    </motion.div>
  );
}
