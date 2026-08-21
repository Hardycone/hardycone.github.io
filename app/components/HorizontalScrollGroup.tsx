"use client";

import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { hexToRgba } from "@/lib/palette";

export interface HorizontalFilmstripCard {
  id?: string;
  content: ReactNode;
  className?: string;
}

export interface HorizontalFilmstripProps {
  body: ReactNode;
  cards: HorizontalFilmstripCard[];
  className?: string;
  bodyClassName?: string;
  cardClassName?: string;
  cardWidth?: string;
  cardAspectRatio?: string;
  cardHeight?: string;
  mobileCardMinHeight?: string;
  fillAvailableHeight?: boolean;
  bottomMargin?: string;
  primaryColor: string;
  hoverBorderOpacity?: number;
}

interface HorizontalFilmstripStyle extends CSSProperties {
  "--filmstrip-card-width": string;
  "--filmstrip-card-aspect-ratio"?: string;
  "--filmstrip-card-height": string;
  "--filmstrip-mobile-card-min-height": string;
  "--filmstrip-bottom-margin": string;
  "--filmstrip-primary-color": string;
  "--filmstrip-hover-color": string;
}

interface HorizontalGestureState {
  touchId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  axis: "pending" | "horizontal";
}

const HORIZONTAL_GESTURE_THRESHOLD_PX = 8;
const INERTIA_TIME_CONSTANT_MS = 280;
const INERTIA_RELEASE_DECAY_MS = 80;
const INERTIA_MIN_VELOCITY_PX_PER_MS = 0.06;
const INERTIA_STOP_VELOCITY_PX_PER_MS = 0.015;
const INERTIA_MAX_VELOCITY_PX_PER_MS = 2.5;

function getDocumentOffsetTop(element: HTMLElement) {
  let offsetTop = 0;
  let current: HTMLElement | null = element;

  while (current) {
    offsetTop += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return offsetTop;
}

export default function HorizontalFilmstrip({
  body,
  cards,
  className = "",
  bodyClassName = "",
  cardClassName = "",
  cardWidth = "min(42vw, 30rem)",
  cardAspectRatio,
  cardHeight = "min(60svh, 36rem)",
  mobileCardMinHeight = "20rem",
  fillAvailableHeight = false,
  bottomMargin = "6rem",
  primaryColor,
  hoverBorderOpacity = 0.6,
}: HorizontalFilmstripProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const horizontalGestureRef = useRef<HorizontalGestureState | null>(null);
  const suppressCardClickRef = useRef(false);
  const suppressCardClickTimeoutRef = useRef<number | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const [travel, setTravel] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, isEnabled ? -travel : 0]);

  const updateActiveCard = useCallback(
    (currentX: number) => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!isEnabled || !viewport || !track || cards.length === 0) {
        setActiveCardIndex(null);
        return;
      }

      const currentTravel = Math.min(travel, Math.max(0, -currentX));
      if (currentTravel <= 1 || travel <= 0) {
        setActiveCardIndex(0);
        return;
      }
      if (currentTravel >= travel - 1) {
        setActiveCardIndex(cards.length - 1);
        return;
      }

      const viewportCenter = currentTravel + viewport.clientWidth / 2;
      const cardElements = Array.from(track.children) as HTMLElement[];
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cardElements.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveCardIndex(closestIndex);
    },
    [cards.length, isEnabled, travel],
  );

  useMotionValueEvent(x, "change", updateActiveCard);

  useEffect(() => {
    updateActiveCard(x.get());
  }, [updateActiveCard, x]);

  const stopHorizontalInertia = useCallback(() => {
    if (inertiaFrameRef.current === null) return;
    window.cancelAnimationFrame(inertiaFrameRef.current);
    inertiaFrameRef.current = null;
  }, []);

  const startHorizontalInertia = useCallback(
    (initialVelocity: number) => {
      stopHorizontalInertia();

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        Math.abs(initialVelocity) < INERTIA_MIN_VELOCITY_PX_PER_MS
      ) {
        return;
      }

      let velocity = Math.min(
        INERTIA_MAX_VELOCITY_PX_PER_MS,
        Math.max(-INERTIA_MAX_VELOCITY_PX_PER_MS, initialVelocity),
      );
      let previousTime = window.performance.now();
      let scrollPosition = window.scrollY;

      const step = (currentTime: number) => {
        const elapsed = Math.min(32, Math.max(0, currentTime - previousTime));
        previousTime = currentTime;
        velocity *= Math.exp(-elapsed / INERTIA_TIME_CONSTANT_MS);

        if (Math.abs(velocity) < INERTIA_STOP_VELOCITY_PX_PER_MS) {
          inertiaFrameRef.current = null;
          return;
        }

        scrollPosition += velocity * elapsed;
        window.scrollTo({ top: scrollPosition, behavior: "auto" });

        inertiaFrameRef.current = window.requestAnimationFrame(step);
      };

      inertiaFrameRef.current = window.requestAnimationFrame(step);
    },
    [stopHorizontalInertia],
  );

  useEffect(() => {
    window.addEventListener("touchstart", stopHorizontalInertia, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", stopHorizontalInertia, true);
      stopHorizontalInertia();
    };
  }, [stopHorizontalInertia]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!isEnabled || !viewport) return;

    const findTouch = (touches: TouchList, touchId: number) =>
      Array.from(touches).find((touch) => touch.identifier === touchId);

    const handleTouchStart = (event: TouchEvent) => {
      if (suppressCardClickTimeoutRef.current !== null) {
        window.clearTimeout(suppressCardClickTimeoutRef.current);
        suppressCardClickTimeoutRef.current = null;
      }
      suppressCardClickRef.current = false;

      if (event.touches.length !== 1) {
        horizontalGestureRef.current = null;
        return;
      }

      const interactiveTarget = (event.target as HTMLElement).closest(
        "a, button, input, select, textarea, [role='button']",
      );
      if (interactiveTarget) return;

      const touch = event.touches[0];
      horizontalGestureRef.current = {
        touchId: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        lastX: touch.clientX,
        lastTime: event.timeStamp,
        velocity: 0,
        axis: "pending",
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      const gesture = horizontalGestureRef.current;
      if (!gesture || event.touches.length !== 1) {
        horizontalGestureRef.current = null;
        return;
      }

      const touch = findTouch(event.touches, gesture.touchId);
      if (!touch) return;

      if (gesture.axis === "pending") {
        const distanceX = Math.abs(touch.clientX - gesture.startX);
        const distanceY = Math.abs(touch.clientY - gesture.startY);

        if (Math.max(distanceX, distanceY) < HORIZONTAL_GESTURE_THRESHOLD_PX) {
          return;
        }

        if (distanceY >= distanceX) {
          horizontalGestureRef.current = null;
          return;
        }

        gesture.axis = "horizontal";
        suppressCardClickRef.current = true;
      }

      if (event.cancelable) event.preventDefault();

      const horizontalDelta = gesture.lastX - touch.clientX;
      const elapsed = Math.max(1, event.timeStamp - gesture.lastTime);
      const instantaneousVelocity = horizontalDelta / elapsed;
      gesture.velocity = gesture.velocity * 0.65 + instantaneousVelocity * 0.35;
      gesture.lastX = touch.clientX;
      gesture.lastTime = event.timeStamp;

      if (horizontalDelta === 0) return;

      window.scrollTo({
        top: window.scrollY + horizontalDelta,
        behavior: "auto",
      });
    };

    const finishTouchGesture = (event: TouchEvent) => {
      const gesture = horizontalGestureRef.current;
      if (!gesture || !findTouch(event.changedTouches, gesture.touchId)) return;

      const didDrag = gesture.axis === "horizontal";
      const releaseDelay = Math.max(0, event.timeStamp - gesture.lastTime);
      const releaseVelocity =
        gesture.velocity * Math.exp(-releaseDelay / INERTIA_RELEASE_DECAY_MS);
      horizontalGestureRef.current = null;

      if (didDrag) {
        if (event.type === "touchend") {
          startHorizontalInertia(releaseVelocity);
        }

        suppressCardClickTimeoutRef.current = window.setTimeout(() => {
          suppressCardClickRef.current = false;
          suppressCardClickTimeoutRef.current = null;
        }, 500);
      }
    };

    viewport.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    viewport.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    viewport.addEventListener("touchend", finishTouchGesture, {
      passive: true,
    });
    viewport.addEventListener("touchcancel", finishTouchGesture, {
      passive: true,
    });

    return () => {
      viewport.removeEventListener("touchstart", handleTouchStart);
      viewport.removeEventListener("touchmove", handleTouchMove);
      viewport.removeEventListener("touchend", finishTouchGesture);
      viewport.removeEventListener("touchcancel", finishTouchGesture);
      if (suppressCardClickTimeoutRef.current !== null) {
        window.clearTimeout(suppressCardClickTimeoutRef.current);
        suppressCardClickTimeoutRef.current = null;
      }
    };
  }, [isEnabled, startHorizontalInertia]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!isEnabled || travel <= 0 || !viewport) return;

    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        event.deltaX === 0 ||
        Math.abs(event.deltaX) <= Math.abs(event.deltaY)
      ) {
        return;
      }

      const target = targetRef.current;
      if (!target) return;

      const sectionStartY = getDocumentOffsetTop(target);
      const sectionEndY = sectionStartY + travel;
      const currentScrollY = window.scrollY;
      const isMovingForward = event.deltaX > 0;
      const canMove = isMovingForward
        ? currentScrollY < sectionEndY - 1
        : currentScrollY > sectionStartY + 1;

      if (!canMove) return;

      event.preventDefault();
      stopHorizontalInertia();

      const nextScrollY = isMovingForward
        ? Math.min(sectionEndY, currentScrollY + event.deltaX)
        : Math.max(sectionStartY, currentScrollY + event.deltaX);
      window.scrollTo({ top: nextScrollY, behavior: "auto" });
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [isEnabled, stopHorizontalInertia, travel]);

  const handleCardClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (suppressCardClickRef.current) {
        event.preventDefault();
        event.stopPropagation();
        suppressCardClickRef.current = false;
        if (suppressCardClickTimeoutRef.current !== null) {
          window.clearTimeout(suppressCardClickTimeoutRef.current);
          suppressCardClickTimeoutRef.current = null;
        }
        return;
      }

      if (!isEnabled || travel <= 0) return;

      const interactiveTarget = (event.target as HTMLElement).closest(
        "a, button, input, select, textarea, [role='button']",
      );
      const selection = window.getSelection();
      if (interactiveTarget || (selection && !selection.isCollapsed)) return;

      const target = targetRef.current;
      const viewport = viewportRef.current;
      if (!target || !viewport) return;

      const card = event.currentTarget;
      const sectionStartY = getDocumentOffsetTop(target);
      const centeredCardOffset =
        card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2;
      // Center when possible, but never travel past the rail endpoints:
      // 0 keeps the first card left-aligned; `travel` keeps the last right-aligned.
      const targetTravel = Math.min(travel, Math.max(0, centeredCardOffset));
      const targetScrollY = sectionStartY + targetTravel;
      const boundedTargetScrollY =
        targetTravel <= 0
          ? Math.floor(targetScrollY)
          : targetTravel >= travel
            ? Math.ceil(targetScrollY)
            : targetScrollY;

      window.scrollTo({
        top: boundedTargetScrollY,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
    [isEnabled, travel],
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const updateMode = () => setIsEnabled(media.matches);

    updateMode();
    media.addEventListener("change", updateMode);

    return () => media.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      setTravel(0);
      return;
    }

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const updateTravel = () => {
      const viewportWidth = viewport.clientWidth;
      const trackWidth = track.offsetWidth;
      setTravel(Math.max(0, trackWidth - viewportWidth));
    };

    updateTravel();

    const resizeObserver = new ResizeObserver(updateTravel);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
    window.addEventListener("resize", updateTravel);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTravel);
    };
  }, [isEnabled]);

  return (
    <div
      ref={targetRef}
      className={`relative ${className}`}
      style={
        {
          "--filmstrip-card-width": cardWidth,
          "--filmstrip-card-aspect-ratio": cardAspectRatio,
          "--filmstrip-card-height": cardHeight,
          "--filmstrip-mobile-card-min-height": mobileCardMinHeight,
          "--filmstrip-bottom-margin": bottomMargin,
          "--filmstrip-primary-color": primaryColor,
          "--filmstrip-hover-color": hexToRgba(
            primaryColor,
            hoverBorderOpacity,
          ),
          height: isEnabled
            ? travel > 0
              ? `calc(100svh + ${travel}px)`
              : "100svh"
            : undefined,
        } as HorizontalFilmstripStyle
      }
    >
      <div
        className={`flex flex-col md:sticky md:top-[2rem] ${fillAvailableHeight ? "md:h-[calc(100svh-2rem-var(--filmstrip-bottom-margin))]" : ""}`}
      >
        <div
          className={`relative z-10 mb-4 ${fillAvailableHeight ? "md:flex-none" : ""} ${bodyClassName}`}
        >
          {body}
        </div>
        <div
          className={`relative mb-24 h-auto w-full [container-type:inline-size] ${fillAvailableHeight ? "md:mb-0 md:min-h-0 md:flex-1" : "md:h-[var(--filmstrip-card-height)]"}`}
        >
          <div className="h-auto w-full overflow-visible md:absolute md:left-1/2 md:top-0 md:h-full md:w-screen md:-translate-x-1/2 md:overflow-x-clip md:overflow-y-visible">
            <div
              ref={viewportRef}
              className="h-auto w-full md:relative md:left-1/2 md:h-full md:w-[100cqw] md:-translate-x-1/2 md:[touch-action:pan-y_pinch-zoom]"
            >
              <motion.div
                ref={trackRef}
                style={{ x }}
                className="flex h-auto w-full flex-col gap-6 md:absolute md:left-0 md:top-0 md:h-full md:w-max md:flex-row md:gap-8 md:will-change-transform"
              >
                {cards.map((card, index) => (
                  <div
                    key={card.id ?? index}
                    onClick={handleCardClick}
                    className={`flex min-h-[var(--filmstrip-mobile-card-min-height)] w-full shrink-0 flex-col overflow-auto rounded-1 border border-white bg-zinc-50 p-8 shadow supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:border-white/25 dark:bg-zinc-800 md:h-full md:min-h-0 md:cursor-pointer md:rounded-2 md:transition-[border-color,filter] md:duration-300 md:hover:border-[var(--filmstrip-hover-color)] md:hover:brightness-105 supports-[corner-shape:squircle]:md:rounded-4 motion-reduce:md:transition-none ${cardAspectRatio ? "md:aspect-[var(--filmstrip-card-aspect-ratio)] md:w-auto" : "md:w-[var(--filmstrip-card-width)]"} ${cardClassName} ${card.className ?? ""}`}
                    style={{
                      borderColor:
                        isEnabled && activeCardIndex === index
                          ? primaryColor
                          : undefined,
                    }}
                  >
                    {card.content}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
