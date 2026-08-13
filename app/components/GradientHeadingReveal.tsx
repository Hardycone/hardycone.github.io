"use client";

import { ComponentType, useEffect, useId, useRef } from "react";
import { IconProps } from "@phosphor-icons/react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

interface GradientHeadingRevealProps {
  animateReveal?: boolean;
  icon: ComponentType<IconProps>;
  iconSize: number;
  isRevealed: boolean;
  textColorClass?: string;
  title: string;
}

export default function GradientHeadingReveal({
  animateReveal = true,
  icon: Icon,
  iconSize,
  isRevealed,
  textColorClass,
  title,
}: GradientHeadingRevealProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const gradientId = `gradient-heading-reveal-${useId().replace(/:/g, "")}`;
  const shouldReduceMotion = useReducedMotion();

  const progress = useMotionValue(animateReveal ? 0 : 1);
  const headingWidth = useMotionValue(1);
  const renderedIconWidth = useMotionValue(iconSize);
  const textOffset = useMotionValue(iconSize);

  useEffect(() => {
    const updateMeasurements = () => {
      const headingBounds = headingRef.current?.getBoundingClientRect();
      const iconBounds = iconRef.current?.getBoundingClientRect();
      const textBounds = textRef.current?.getBoundingClientRect();

      if (!headingBounds || !iconBounds || !textBounds) return;

      headingWidth.set(Math.max(headingBounds.width, 1));
      renderedIconWidth.set(Math.max(iconBounds.width, 1));
      textOffset.set(textBounds.left - headingBounds.left);
    };

    updateMeasurements();

    const resizeObserver = new ResizeObserver(updateMeasurements);
    if (headingRef.current) resizeObserver.observe(headingRef.current);

    return () => resizeObserver.disconnect();
  }, [headingWidth, renderedIconWidth, textOffset]);

  useEffect(() => {
    if (shouldReduceMotion || !animateReveal) {
      progress.set(1);
      return;
    }

    if (!isRevealed) {
      progress.set(0);
      return;
    }

    const revealAnimation = animate(progress, 1, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => revealAnimation.stop();
  }, [animateReveal, isRevealed, progress, shouldReduceMotion]);

  const textBackgroundSize = useTransform(
    headingWidth,
    (width) => `${width * 3}px 100%`,
  );
  const textBackgroundPosition = useTransform(
    [progress, headingWidth, textOffset],
    ([currentProgress, width, offset]: number[]) =>
      `${-2 * width * (1 - currentProgress) - offset}px 0`,
  );
  const iconGradientX1 = useTransform(
    [progress, headingWidth, renderedIconWidth],
    ([currentProgress, width, currentIconWidth]: number[]) =>
      ((-2 * width * (1 - currentProgress)) / currentIconWidth) * 256,
  );
  const iconGradientX2 = useTransform(
    [progress, headingWidth, renderedIconWidth],
    ([currentProgress, width, currentIconWidth]: number[]) =>
      ((-2 * width * (1 - currentProgress) + 3 * width) / currentIconWidth) *
      256,
  );

  return (
    <div
      ref={headingRef}
      className="mb-2 flex w-fit max-w-full items-center gap-2"
    >
      <span ref={iconRef} className="inline-flex shrink-0">
        <Icon
          size={iconSize}
          weight="duotone"
          className={textColorClass}
          color={`url(#${gradientId})`}
        >
          <defs>
            <motion.linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1={iconGradientX1}
              x2={iconGradientX2}
              y1={128}
              y2={128}
            >
              <stop offset="0%" stopColor="currentColor" />
              <stop offset="33.33%" stopColor="currentColor" />
              <stop offset="40%" stopColor="#82bcff" />
              <stop offset="45%" stopColor="#2483ff" />
              <stop offset="50%" stopColor="#ff66f4" />
              <stop offset="55%" stopColor="#ff3029" />
              <stop offset="60%" stopColor="#fe7b02" />
              <stop offset="66.67%" stopColor="currentColor" stopOpacity={0} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </motion.linearGradient>
          </defs>
        </Icon>
      </span>
      <h3 className={textColorClass}>
        <motion.span
          ref={textRef}
          className="gradient-text-reveal inline"
          style={{
            backgroundPosition: textBackgroundPosition,
            backgroundSize: textBackgroundSize,
          }}
        >
          {title}
        </motion.span>
      </h3>
    </div>
  );
}
