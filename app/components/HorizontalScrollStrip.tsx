"use client";

import {
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useMouseShadow } from "@/app/context/MouseShadowContext";

const SLIDER_KNOB_SIZE_PX = 20;
const SLIDER_TRACK_PADDING_PX = 4;
const SLIDER_MAX = 1000;

interface HorizontalScrollStripProps {
  children: ReactNode;
  ariaLabel: string;
  contentClassName?: string;
  body?: ReactNode;
  bodyClassName?: string;
  knobBackgroundClassName?: string;
}

export default function HorizontalScrollStrip({
  children,
  ariaLabel,
  contentClassName = "flex w-max gap-4",
  body,
  bodyClassName = "",
  knobBackgroundClassName = "bg-background dark:bg-dark-background",
}: HorizontalScrollStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isKnobHovered, setIsKnobHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const {
    cardLightSmallShadow,
    cardDarkSmallShadow,
    indentLightShadow,
    indentDarkShadow,
  } = useMouseShadow();
  const knobShadow =
    resolvedTheme === "dark" ? cardDarkSmallShadow : cardLightSmallShadow;
  const railShadow =
    resolvedTheme === "dark" ? indentDarkShadow : indentLightShadow;

  const syncScroll = useCallback(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const maxScroll = Math.max(
      0,
      scrollElement.scrollWidth - scrollElement.clientWidth,
    );
    setIsOverflowing(maxScroll > 1);
    setScrollProgress(
      maxScroll > 0 ? Math.min(1, scrollElement.scrollLeft / maxScroll) : 0,
    );
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    const contentElement = contentRef.current;
    if (!scrollElement || !contentElement) return;

    const resizeObserver = new ResizeObserver(syncScroll);
    resizeObserver.observe(scrollElement);
    resizeObserver.observe(contentElement);
    scrollElement.addEventListener("scroll", syncScroll, { passive: true });
    syncScroll();

    return () => {
      resizeObserver.disconnect();
      scrollElement.removeEventListener("scroll", syncScroll);
    };
  }, [syncScroll]);

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const progress = Number(event.currentTarget.value) / SLIDER_MAX;
    const maxScroll = Math.max(
      0,
      scrollElement.scrollWidth - scrollElement.clientWidth,
    );
    scrollElement.scrollLeft = progress * maxScroll;
    setScrollProgress(progress);
  };

  const updateKnobHover = (event: ReactPointerEvent<HTMLInputElement>) => {
    if (event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const radius = SLIDER_KNOB_SIZE_PX / 2;
    const knobCenterX =
      bounds.left + radius + (bounds.width - SLIDER_KNOB_SIZE_PX) * scrollProgress;
    const knobCenterY = bounds.top + bounds.height / 2;
    setIsKnobHovered(
      Math.abs(event.clientX - knobCenterX) <= radius + 2 &&
        Math.abs(event.clientY - knobCenterY) <= radius + 2,
    );
  };

  return (
    <div className="relative flex flex-col">
      {body ? (
        <div className={`relative z-10 ${bodyClassName}`}>{body}</div>
      ) : null}
      <div className="relative w-full [container-type:inline-size]">
        <div
          ref={scrollRef}
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
          className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            ref={contentRef}
            className="w-max px-[max(0px,calc((100vw-100cqw)/2))]"
          >
            <div className={contentClassName}>{children}</div>
          </div>
        </div>
      </div>
      {isOverflowing ? (
        <div className="relative mx-auto mt-4 h-8 w-full max-w-[320px]">
          <input
            type="range"
            min="0"
            max={SLIDER_MAX}
            step="1"
            value={Math.round(scrollProgress * SLIDER_MAX)}
            aria-label={`Scroll ${ariaLabel} horizontally`}
            aria-valuetext={`${Math.round(scrollProgress * 100)}% through ${ariaLabel}`}
            onChange={handleSliderChange}
            onPointerMove={updateKnobHover}
            onPointerLeave={() => setIsKnobHovered(false)}
            onPointerDown={updateKnobHover}
            className="horizontal-scroll-strip-range peer absolute inset-y-0 z-10 h-full cursor-pointer opacity-0"
            style={{
              left: SLIDER_TRACK_PADDING_PX,
              width: `calc(100% - ${SLIDER_TRACK_PADDING_PX * 2}px)`,
            }}
          />
          <motion.div
            data-cursor-shadow
            className="pointer-events-none absolute left-0 top-1/2 h-7 w-full -translate-y-1/2 rounded-full border border-white bg-background dark:border-white/25 dark:bg-dark-background"
            style={{ boxShadow: railShadow }}
          />
          <div
            className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-foreground peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background dark:peer-focus-visible:ring-dark-foreground dark:peer-focus-visible:ring-offset-dark-background"
            style={{
              left: `calc(${SLIDER_TRACK_PADDING_PX}px + ${scrollProgress * 100}% - ${scrollProgress * (SLIDER_KNOB_SIZE_PX + SLIDER_TRACK_PADDING_PX * 2)}px)`,
            }}
          >
            <motion.div
              data-cursor-shadow
              className={`h-full w-full rounded-full border border-white dark:border-white/25 ${knobBackgroundClassName}`}
              style={{ boxShadow: knobShadow }}
              animate={{ scale: isKnobHovered ? 1.14 : 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
