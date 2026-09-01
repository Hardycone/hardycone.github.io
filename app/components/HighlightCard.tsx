import { CSSProperties, ReactNode, useLayoutEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  MotionStyle,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useCursorEffects } from "@/hooks/useCursorEffects";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import projects from "@/data/projects";
import { ROUNDED_SQUIRCLE_05, ROUNDED_SQUIRCLE_07_MD } from "@/lib/styleTokens";
import { useMouseShadow } from "../context/MouseShadowContext";
import { useTheme } from "next-themes";
import { hexToRgba } from "@/lib/palette";
import { useCardGroupActive } from "@/app/context/CardGroupContext";

export interface HighlightCardProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  isActive?: boolean;
  activeBackgroundClassName?: string;
  inactiveBackgroundClassName?: string;
  inactiveHoverBackgroundClassName?: string;
  borderBaseColor?: string;
  borderHighlightColor?: string;
  inactiveBorderColor?: string;
}

type HighlightCardStyle = MotionStyle & {
  "--highlight-card-active-background": string;
  "--highlight-card-inactive-background": string;
};

const borderMaskStyle: CSSProperties = {
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
};

const borderLayerClassName = `${ROUNDED_SQUIRCLE_05} ${ROUNDED_SQUIRCLE_07_MD} pointer-events-none absolute inset-0 box-border p-px`;

export default function HighlightCard({
  children,
  className = "",
  contentClassName,
  isActive,
  activeBackgroundClassName = "bg-[var(--highlight-card-active-background)]",
  inactiveBackgroundClassName = "bg-[var(--highlight-card-inactive-background)]",
  inactiveHoverBackgroundClassName = "md:hover:bg-[var(--highlight-card-active-background)]",
  borderBaseColor,
  borderHighlightColor,
  inactiveBorderColor = "rgba(255, 255, 255, 1)",
}: HighlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardAspectRatio = useMotionValue(1);
  const { activeIndex } = useActiveProject();
  const theme = useProjectTheme(projects[activeIndex].id);
  const { cursorAngle } = useCursorEffects();
  const groupIsActive = useCardGroupActive();
  const resolvedIsActive = isActive ?? groupIsActive ?? true;
  const resolvedBorderBaseColor = borderBaseColor ?? theme.hex.primary;
  const resolvedBorderHighlightColor =
    borderHighlightColor ??
    `color-mix(in oklab, ${theme.hex.primary} 30%, white 70%)`;
  const backgroundClassName = resolvedIsActive
    ? activeBackgroundClassName
    : `${inactiveBackgroundClassName} ${inactiveHoverBackgroundClassName}`;
  const { cardLightSmallShadow, cardDarkSmallShadow } = useMouseShadow();
  const { resolvedTheme } = useTheme();
  const cardSmallShadow =
    resolvedTheme === "dark" ? cardDarkSmallShadow : cardLightSmallShadow;

  useLayoutEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const updateAspectRatio = () => {
      const { width, height } = card.getBoundingClientRect();

      if (height > 0) {
        cardAspectRatio.set(width / height);
      }
    };

    updateAspectRatio();

    const resizeObserver = new ResizeObserver(updateAspectRatio);
    resizeObserver.observe(card);

    return () => resizeObserver.disconnect();
  }, [cardAspectRatio]);

  const adjustedCursorAngle = useTransform(
    [cursorAngle, cardAspectRatio],
    ([angle, aspectRatio]: number[]) => {
      const angleInRadians = ((angle - 90) * Math.PI) / 180;
      const sourceAngle = Math.atan2(
        Math.sin(angleInRadians),
        Math.cos(angleInRadians) / aspectRatio,
      );

      return (sourceAngle * 180) / Math.PI + 90;
    },
  );

  const borderGradient = `conic-gradient(
    from -180deg,
    ${resolvedBorderBaseColor} 0deg,
    ${resolvedBorderBaseColor} 100deg,
    ${resolvedBorderHighlightColor} 150deg,
    ${resolvedBorderHighlightColor} 210deg,
    ${resolvedBorderBaseColor} 260deg,
    ${resolvedBorderBaseColor} 360deg
  )`;

  return (
    <motion.div
      ref={cardRef}
      className={`${ROUNDED_SQUIRCLE_05} ${ROUNDED_SQUIRCLE_07_MD} ${backgroundClassName} ${className} relative w-full transition-colors duration-300 motion-reduce:transition-none`}
      style={
        {
          boxShadow: cardSmallShadow,
          "--highlight-card-active-background": hexToRgba(
            theme.hex.primary,
            0.05,
          ),
          "--highlight-card-inactive-background": theme.hex.background,
        } as HighlightCardStyle
      }
    >
      {contentClassName ? (
        <div className={contentClassName}>{children}</div>
      ) : (
        children
      )}
      <div
        aria-hidden="true"
        className={borderLayerClassName}
        style={{ ...borderMaskStyle, background: inactiveBorderColor }}
      />
      <AnimatePresence initial={false}>
        {resolvedIsActive ? (
          <motion.div
            aria-hidden="true"
            className={borderLayerClassName}
            style={borderMaskStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative aspect-square h-full shrink-0"
                style={{ scaleX: cardAspectRatio }}
              >
                <motion.div
                  className="absolute inset-[-20.710678%] will-change-transform"
                  style={{
                    background: borderGradient,
                    rotate: adjustedCursorAngle,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
