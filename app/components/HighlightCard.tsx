import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ROUNDED_SQUIRCLE_05, ROUNDED_SQUIRCLE_07_MD } from "@/lib/styleTokens";
import { useMouseShadow } from "../context/MouseShadowContext";
import { useTheme } from "next-themes";
import { useCardGroupActive } from "@/app/context/CardGroupContext";

export interface HighlightCardProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  isActive?: boolean;
  highlightOnHover?: boolean;
  // Previous appearance controls retained while the conic border is disabled.
  activeBackgroundClassName?: string;
  inactiveBackgroundClassName?: string;
  inactiveHoverBackgroundClassName?: string;
  borderBaseColor?: string;
  borderHighlightColor?: string;
  inactiveBorderColor?: string;
}

export default function HighlightCard({
  children,
  className = "",
  contentClassName,
  isActive,
  highlightOnHover = true,
}: HighlightCardProps) {
  const groupIsActive = useCardGroupActive();
  const resolvedIsActive = isActive ?? groupIsActive ?? false;
  const canHighlightOnHover = highlightOnHover && !resolvedIsActive;
  const { cardLightSmallShadow, cardDarkSmallShadow } = useMouseShadow();
  const { resolvedTheme } = useTheme();
  const cardSmallShadow =
    resolvedTheme === "dark" ? cardDarkSmallShadow : cardLightSmallShadow;

  return (
    <motion.div
      className={`${ROUNDED_SQUIRCLE_05} ${ROUNDED_SQUIRCLE_07_MD} group/card relative isolate w-full border border-white bg-background dark:border-white/25 dark:bg-dark-background ${className}`}
      style={{ boxShadow: cardSmallShadow }}
    >
      <div
        aria-hidden="true"
        className={`${ROUNDED_SQUIRCLE_05} ${ROUNDED_SQUIRCLE_07_MD} pointer-events-none absolute inset-0 -z-10 bg-white opacity-0 transition-opacity duration-300 motion-reduce:transition-none dark:bg-black ${canHighlightOnHover ? "md:group-hover/card:opacity-25" : ""}`}
      />
      {contentClassName ? (
        <div className={contentClassName}>{children}</div>
      ) : (
        children
      )}
    </motion.div>
  );
}
