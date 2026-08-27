"use client";

import { ComponentType, useEffect, useId, useMemo, useRef } from "react";
import { IconProps } from "@phosphor-icons/react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

interface SectionContainerHeadingProps {
  showHeadingSweep?: boolean;
  headingIcon: ComponentType<IconProps>;
  isRevealed: boolean;
  headingSweepColor: string;
  headingBaseColorClassName?: string;
  heading: string;
}

const SWEEP_SETTLE_CLEARANCE_RATIO = 0.1;
const SWEEP_BACKGROUND_WIDTH_RATIO = 3;
const UNREVEALED_OPACITY = 0.2;
const SWEEP_STOP_SHIFT_PERCENT =
  (SWEEP_SETTLE_CLEARANCE_RATIO / SWEEP_BACKGROUND_WIDTH_RATIO) * 100;

function shiftedSweepStop(stop: number) {
  return `${stop + SWEEP_STOP_SHIFT_PERCENT}%`;
}

function shiftHexHue(hex: string, degrees: number) {
  const normalizedHex = hex.replace("#", "");
  if (!/^[\da-f]{6}$/i.test(normalizedHex)) return hex;

  const [red, green, blue] = [0, 2, 4].map(
    (offset) => parseInt(normalizedHex.slice(offset, offset + 2), 16) / 255,
  );
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const range = maximum - minimum;
  const lightness = (maximum + minimum) / 2;

  let hue = 0;
  if (range !== 0) {
    if (maximum === red) hue = ((green - blue) / range) % 6;
    else if (maximum === green) hue = (blue - red) / range + 2;
    else hue = (red - green) / range + 4;
    hue *= 60;
  }

  const saturation =
    range === 0 ? 0 : range / (1 - Math.abs(2 * lightness - 1));
  const shiftedHue = (hue + degrees + 360) % 360;

  return `hsl(${shiftedHue} ${saturation * 100}% ${lightness * 100}%)`;
}

export default function SectionContainerHeading({
  showHeadingSweep = true,
  headingIcon: HeadingIcon,
  isRevealed,
  headingSweepColor,
  headingBaseColorClassName,
  heading,
}: SectionContainerHeadingProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const gradientId = `section-container-heading-${useId().replace(/:/g, "")}`;
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimateSweep = showHeadingSweep && !shouldReduceMotion;
  const sweepColors = useMemo(
    () => ({
      minusSmall: shiftHexHue(headingSweepColor, -36),
      minusTiny: shiftHexHue(headingSweepColor, -18),
      primary: headingSweepColor,
      plusTiny: shiftHexHue(headingSweepColor, 18),
      plusSmall: shiftHexHue(headingSweepColor, 36),
    }),
    [headingSweepColor],
  );
  const unrevealedColor = `color-mix(in srgb, currentColor ${UNREVEALED_OPACITY * 100}%, transparent)`;
  const textGradient = `linear-gradient(90deg, currentColor 0%, currentColor ${shiftedSweepStop(34)}, ${sweepColors.minusSmall} ${shiftedSweepStop(40)}, ${sweepColors.minusTiny} ${shiftedSweepStop(45)}, ${sweepColors.primary} ${shiftedSweepStop(50)}, ${sweepColors.plusTiny} ${shiftedSweepStop(55)}, ${sweepColors.plusSmall} ${shiftedSweepStop(60)}, transparent ${shiftedSweepStop(66.67)}, transparent 100%)`;

  const progress = useMotionValue(showHeadingSweep ? 0 : 1);
  const headingWidth = useMotionValue(1);
  const renderedIconWidth = useMotionValue(30);
  const textOffset = useMotionValue(30);

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
    if (shouldReduceMotion || !showHeadingSweep) {
      progress.set(1);
      return;
    }

    if (!isRevealed) {
      progress.set(0);
      return;
    }

    const revealAnimation = animate(progress, 1, {
      duration: 3,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => revealAnimation.stop();
  }, [isRevealed, progress, shouldReduceMotion, showHeadingSweep]);

  const textBackgroundSize = useTransform(
    headingWidth,
    (width) => `${width * SWEEP_BACKGROUND_WIDTH_RATIO}px 100%`,
  );
  const textBackgroundPosition = useTransform(
    [progress, headingWidth, textOffset],
    ([currentProgress, width, offset]: number[]) =>
      `${
        -(2 + SWEEP_SETTLE_CLEARANCE_RATIO) * width * (1 - currentProgress) -
        offset
      }px 0`,
  );
  const iconGradientX1 = useTransform(
    [progress, headingWidth, renderedIconWidth],
    ([currentProgress, width, currentIconWidth]: number[]) =>
      ((-(2 + SWEEP_SETTLE_CLEARANCE_RATIO) * width * (1 - currentProgress)) /
        currentIconWidth) *
      256,
  );
  const iconGradientX2 = useTransform(
    [progress, headingWidth, renderedIconWidth],
    ([currentProgress, width, currentIconWidth]: number[]) =>
      ((-(2 + SWEEP_SETTLE_CLEARANCE_RATIO) * width * (1 - currentProgress) +
        SWEEP_BACKGROUND_WIDTH_RATIO * width) /
        currentIconWidth) *
      256,
  );

  return (
    <div
      ref={headingRef}
      className={`mb-2 flex w-fit max-w-full items-start gap-1 ${headingBaseColorClassName ?? ""}`}
    >
      <span
        ref={iconRef}
        className="inline-flex h-[2.34375rem] w-[1.875rem] shrink-0 items-center justify-center md:h-[2.8125rem] md:w-[2.25rem]"
      >
        <HeadingIcon
          weight="fill"
          className="size-[1.875rem] md:size-[2.25rem]"
          color={shouldAnimateSweep ? `url(#${gradientId})` : "currentColor"}
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
              <stop offset={shiftedSweepStop(34)} stopColor="currentColor" />
              <stop
                offset={shiftedSweepStop(40)}
                stopColor={sweepColors.minusSmall}
              />
              <stop
                offset={shiftedSweepStop(45)}
                stopColor={sweepColors.minusTiny}
              />
              <stop
                offset={shiftedSweepStop(50)}
                stopColor={sweepColors.primary}
              />
              <stop
                offset={shiftedSweepStop(55)}
                stopColor={sweepColors.plusTiny}
              />
              <stop
                offset={shiftedSweepStop(60)}
                stopColor={sweepColors.plusSmall}
              />
              <stop
                offset={shiftedSweepStop(66.67)}
                stopColor="currentColor"
                stopOpacity={UNREVEALED_OPACITY}
              />
              <stop
                offset="100%"
                stopColor="currentColor"
                stopOpacity={UNREVEALED_OPACITY}
              />
            </motion.linearGradient>
          </defs>
        </HeadingIcon>
      </span>
      <h3>
        <motion.span
          ref={textRef}
          className={
            shouldAnimateSweep ? "gradient-text-reveal inline" : "inline"
          }
          style={
            shouldAnimateSweep
              ? {
                  backgroundColor: unrevealedColor,
                  backgroundImage: textGradient,
                  backgroundPosition: textBackgroundPosition,
                  backgroundSize: textBackgroundSize,
                }
              : undefined
          }
        >
          {heading}
        </motion.span>
      </h3>
    </div>
  );
}
