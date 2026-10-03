import { type MouseEventHandler, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ROUNDED_SQUIRCLE_05, ROUNDED_SQUIRCLE_07_MD } from "@/lib/styleTokens";
import { useMouseShadow } from "../context/MouseShadowContext";
import { useTheme } from "next-themes";
import { useCardGroupActive } from "@/app/context/CardGroupContext";

export interface HighlightCardProps {
  children: ReactNode;
  highlightCardClassName?: string;
  contentClassName?: string;
  isActive?: boolean;
  highlightOnHover?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
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
  highlightCardClassName = "",
  contentClassName,
  isActive,
  highlightOnHover = true,
  onClick,
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
      data-cursor-shadow
      className={`${ROUNDED_SQUIRCLE_05} ${ROUNDED_SQUIRCLE_07_MD} group/card relative isolate w-full ${highlightCardClassName}`}
      style={{ boxShadow: cardSmallShadow }}
      onClick={onClick}
    >
      <div
        aria-hidden="true"
        className={`${ROUNDED_SQUIRCLE_05} ${ROUNDED_SQUIRCLE_07_MD} pointer-events-none absolute inset-0 -z-10 bg-white opacity-0 transition-opacity duration-300 motion-reduce:transition-none dark:bg-black ${canHighlightOnHover ? "md:group-hover/card:opacity-50" : ""}`}
      />
      {contentClassName ? (
        <div className={contentClassName}>{children}</div>
      ) : (
        children
      )}
    </motion.div>
  );
}
