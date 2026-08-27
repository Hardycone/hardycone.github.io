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

export interface HorizontalCard {
  id?: string;
  content: ReactNode;
  className?: string;
}

export type HorizontalCardAlignment = "aligned" | "centered";

export interface HorizontalGroupProps {
  body?: ReactNode;
  cards: HorizontalCard[];
  alignment?: HorizontalCardAlignment;
  className?: string;
  bodyClassName?: string;
  cardClassName?: string;
  cardWidth?: string;
  cardAspectRatio?: string;
  cardHeight?: string;
  mobileCardMinHeight?: string;
  fillAvailableHeight?: boolean;
  stickyTop?: string;
  bottomMargin?: string;
  primaryColor: string;
  hoverBorderOpacity?: number;
}

interface HorizontalGroupStyle extends CSSProperties {
  "--horizontal-card-width": string;
  "--horizontal-card-aspect-ratio"?: string;
  "--horizontal-card-height": string;
  "--horizontal-mobile-card-min-height": string;
  "--horizontal-sticky-top": string;
  "--horizontal-bottom-margin": string;
  "--horizontal-primary-color": string;
  "--horizontal-hover-color": string;
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

let nativeScrollSnapUsers = 0;
let nativeScrollSnapSuspensions = 0;
let previousScrollSnapType = "";
let previousScrollSnapPriority = "";

function updateNativeVerticalScrollSnap() {
  if (nativeScrollSnapUsers === 0) return;

  document.documentElement.style.setProperty(
    "scroll-snap-type",
    nativeScrollSnapSuspensions > 0 ? "none" : "y proximity",
  );
}

function enableNativeVerticalScrollSnap() {
  const scrollingElement = document.documentElement;

  if (nativeScrollSnapUsers === 0) {
    previousScrollSnapType =
      scrollingElement.style.getPropertyValue("scroll-snap-type");
    previousScrollSnapPriority =
      scrollingElement.style.getPropertyPriority("scroll-snap-type");
  }

  nativeScrollSnapUsers += 1;
  updateNativeVerticalScrollSnap();

  return () => {
    nativeScrollSnapUsers = Math.max(0, nativeScrollSnapUsers - 1);
    if (nativeScrollSnapUsers > 0) {
      updateNativeVerticalScrollSnap();
      return;
    }

    nativeScrollSnapSuspensions = 0;

    if (previousScrollSnapType) {
      scrollingElement.style.setProperty(
        "scroll-snap-type",
        previousScrollSnapType,
        previousScrollSnapPriority,
      );
    } else {
      scrollingElement.style.removeProperty("scroll-snap-type");
    }
  };
}

function suspendNativeVerticalScrollSnap() {
  nativeScrollSnapSuspensions += 1;
  updateNativeVerticalScrollSnap();

  let isReleased = false;

  return (behavior: ScrollBehavior = "auto") => {
    if (isReleased) return;
    isReleased = true;
    nativeScrollSnapSuspensions = Math.max(0, nativeScrollSnapSuspensions - 1);
    updateNativeVerticalScrollSnap();

    if (
      behavior === "smooth" &&
      nativeScrollSnapUsers > 0 &&
      nativeScrollSnapSuspensions === 0
    ) {
      window.scrollTo({ top: window.scrollY, behavior: "smooth" });
    }
  };
}

function getDocumentOffsetTop(element: HTMLElement) {
  let offsetTop = 0;
  let current: HTMLElement | null = element;

  while (current) {
    offsetTop += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return offsetTop;
}

export default function HorizontalGroup({
  body,
  cards,
  alignment = "aligned",
  className = "",
  bodyClassName = "",
  cardClassName = "rounded-1 md:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:md:rounded-4",
  cardWidth = "min(42vw, 30rem)",
  cardAspectRatio,
  cardHeight = "min(60svh, 36rem)",
  mobileCardMinHeight = "20rem",
  fillAvailableHeight = false,
  stickyTop = "2rem",
  bottomMargin = "6rem",
  primaryColor,
  hoverBorderOpacity = 0.6,
}: HorizontalGroupProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const horizontalGestureRef = useRef<HorizontalGestureState | null>(null);
  const suppressCardClickRef = useRef(false);
  const suppressCardClickTimeoutRef = useRef<number | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const releaseNativeSnapRef = useRef<(() => void) | null>(null);
  const nativeSnapResumeTimeoutRef = useRef<number | null>(null);
  const [railStartX, setRailStartX] = useState(0);
  const [travel, setTravel] = useState(0);
  const [snapOffsets, setSnapOffsets] = useState<number[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const railEndX = railStartX - travel;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    isEnabled ? [railStartX, railEndX] : [0, 0],
  );

  const updateActiveCard = useCallback(
    (currentX: number) => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!isEnabled || !viewport || !track || cards.length === 0) {
        setActiveCardIndex(null);
        return;
      }

      const currentTravel = Math.min(
        travel,
        Math.max(0, railStartX - currentX),
      );
      if (currentTravel <= 1 || travel <= 0) {
        setActiveCardIndex(0);
        return;
      }
      if (currentTravel >= travel - 1) {
        setActiveCardIndex(cards.length - 1);
        return;
      }

      const viewportCenter = viewport.clientWidth / 2 - currentX;
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
    [cards.length, isEnabled, railStartX, travel],
  );

  useMotionValueEvent(x, "change", updateActiveCard);

  useEffect(() => {
    updateActiveCard(x.get());
  }, [updateActiveCard, x]);

  const resumeNativeSnap = useCallback(() => {
    if (nativeSnapResumeTimeoutRef.current !== null) {
      window.clearTimeout(nativeSnapResumeTimeoutRef.current);
      nativeSnapResumeTimeoutRef.current = null;
    }

    releaseNativeSnapRef.current?.();
    releaseNativeSnapRef.current = null;
  }, []);

  const suspendNativeSnap = useCallback(() => {
    if (releaseNativeSnapRef.current) return;
    releaseNativeSnapRef.current = suspendNativeVerticalScrollSnap();
  }, []);

  const scheduleNativeSnapResume = useCallback(
    (delay: number) => {
      if (nativeSnapResumeTimeoutRef.current !== null) {
        window.clearTimeout(nativeSnapResumeTimeoutRef.current);
      }

      nativeSnapResumeTimeoutRef.current = window.setTimeout(() => {
        nativeSnapResumeTimeoutRef.current = null;
        resumeNativeSnap();
      }, delay);
    },
    [resumeNativeSnap],
  );

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
        resumeNativeSnap();
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
          resumeNativeSnap();
          return;
        }

        scrollPosition += velocity * elapsed;
        window.scrollTo({ top: scrollPosition, behavior: "auto" });

        inertiaFrameRef.current = window.requestAnimationFrame(step);
      };

      inertiaFrameRef.current = window.requestAnimationFrame(step);
    },
    [resumeNativeSnap, stopHorizontalInertia],
  );

  useEffect(() => {
    const handleTouchStart = () => {
      stopHorizontalInertia();
      resumeNativeSnap();
    };

    window.addEventListener("touchstart", handleTouchStart, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart, true);
      stopHorizontalInertia();
      resumeNativeSnap();
    };
  }, [resumeNativeSnap, stopHorizontalInertia]);

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
        suspendNativeSnap();
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
        } else {
          resumeNativeSnap();
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
      resumeNativeSnap();
    };
  }, [isEnabled, resumeNativeSnap, startHorizontalInertia, suspendNativeSnap]);

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
      suspendNativeSnap();
      scheduleNativeSnapResume(160);

      const nextScrollY = isMovingForward
        ? Math.min(sectionEndY, currentScrollY + event.deltaX)
        : Math.max(sectionStartY, currentScrollY + event.deltaX);
      window.scrollTo({ top: nextScrollY, behavior: "auto" });
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      resumeNativeSnap();
    };
  }, [
    isEnabled,
    resumeNativeSnap,
    scheduleNativeSnapResume,
    stopHorizontalInertia,
    suspendNativeSnap,
    travel,
  ]);

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
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const centeredCardX = viewport.clientWidth / 2 - cardCenter;
      const targetX = Math.min(railStartX, Math.max(railEndX, centeredCardX));
      // Center the selected card when possible while respecting the selected
      // alignment mode's measured first- and last-card endpoints.
      const targetTravel = railStartX - targetX;
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
    [isEnabled, railEndX, railStartX, travel],
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const updateMode = () => setIsEnabled(media.matches);

    updateMode();
    media.addEventListener("change", updateMode);

    return () => media.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    if (!isEnabled || snapOffsets.length === 0) return;

    return enableNativeVerticalScrollSnap();
  }, [isEnabled, snapOffsets.length]);

  useEffect(() => {
    if (!isEnabled) {
      setRailStartX(0);
      setTravel(0);
      setSnapOffsets([]);
      return;
    }

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const updateTravel = () => {
      const viewportWidth = viewport.clientWidth;
      const cardElements = Array.from(track.children) as HTMLElement[];
      const firstCard = cardElements[0];
      const lastCard = cardElements.at(-1);

      if (!firstCard || !lastCard) {
        setRailStartX(0);
        setTravel(0);
        setSnapOffsets([]);
        return;
      }

      const firstCardLeft = firstCard.offsetLeft;
      const firstCardCenter = firstCardLeft + firstCard.offsetWidth / 2;
      const lastCardRight = lastCard.offsetLeft + lastCard.offsetWidth;
      const lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
      const nextStartX =
        alignment === "centered"
          ? viewportWidth / 2 - firstCardCenter
          : -firstCardLeft;
      const nextEndX =
        alignment === "centered"
          ? viewportWidth / 2 - lastCardCenter
          : viewportWidth - lastCardRight;
      const nextTravel = Math.max(0, nextStartX - nextEndX);
      const nextSnapOffsets = cardElements.map((card, index) => {
        if (alignment === "aligned" && index === 0) return 0;
        if (alignment === "aligned" && index === cardElements.length - 1) {
          return nextTravel;
        }

        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const centeredCardX = viewportWidth / 2 - cardCenter;
        const targetX = Math.min(nextStartX, Math.max(nextEndX, centeredCardX));

        return Math.min(nextTravel, Math.max(0, nextStartX - targetX));
      });

      setRailStartX(nextStartX);
      setTravel(nextTravel);
      setSnapOffsets(nextSnapOffsets);
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
  }, [alignment, cards.length, isEnabled]);

  return (
    <div
      ref={targetRef}
      className={`relative ${className}`}
      style={
        {
          "--horizontal-card-width": cardWidth,
          "--horizontal-card-aspect-ratio": cardAspectRatio,
          "--horizontal-card-height": cardHeight,
          "--horizontal-mobile-card-min-height": mobileCardMinHeight,
          "--horizontal-sticky-top": stickyTop,
          "--horizontal-bottom-margin": bottomMargin,
          "--horizontal-primary-color": primaryColor,
          "--horizontal-hover-color": hexToRgba(
            primaryColor,
            hoverBorderOpacity,
          ),
          height: isEnabled
            ? travel > 0
              ? `calc(100svh + ${travel}px)`
              : "100svh"
            : undefined,
        } as HorizontalGroupStyle
      }
    >
      {isEnabled
        ? snapOffsets.map((offset, index) => (
            <span
              key={cards[index]?.id ?? index}
              aria-hidden="true"
              data-horizontal-scroll-snap={index}
              className="pointer-events-none absolute left-0 h-px w-px"
              style={{ top: offset, scrollSnapAlign: "start" }}
            />
          ))
        : null}
      <div
        className={`flex flex-col md:sticky md:top-[var(--horizontal-sticky-top)] ${fillAvailableHeight ? "md:h-[calc(100svh-var(--horizontal-sticky-top)-var(--horizontal-bottom-margin))]" : ""}`}
      >
        {body !== undefined && body !== null ? (
          <div
            className={`relative z-10 mb-4 ${fillAvailableHeight ? "md:flex-none" : ""} ${bodyClassName}`}
          >
            {body}
          </div>
        ) : null}
        <div
          className={`relative h-auto w-full [container-type:inline-size] ${fillAvailableHeight ? "md:mb-0 md:min-h-0 md:flex-1" : "md:h-[var(--horizontal-card-height)]"}`}
        >
          <div className="h-auto w-full overflow-visible md:absolute md:left-1/2 md:top-0 md:h-full md:w-screen md:-translate-x-1/2 md:overflow-x-clip md:overflow-y-visible">
            <div
              ref={viewportRef}
              className="h-auto w-full md:relative md:left-1/2 md:h-full md:w-[100cqw] md:-translate-x-1/2 md:[touch-action:pan-y_pinch-zoom]"
            >
              <motion.div
                ref={trackRef}
                style={{ x }}
                className="flex h-auto w-full flex-col gap-6 md:absolute md:left-0 md:top-0 md:h-full md:w-max md:flex-row md:gap-4 md:will-change-transform"
              >
                {cards.map((card, index) => (
                  <div
                    key={card.id ?? index}
                    onClick={handleCardClick}
                    className={`flex min-h-[var(--horizontal-mobile-card-min-height)] w-full shrink-0 flex-col overflow-auto border border-white bg-zinc-50 p-8 shadow dark:border-white/25 dark:bg-zinc-800 md:h-full md:min-h-0 md:cursor-pointer md:transition-[border-color,filter] md:duration-300 md:hover:border-[var(--horizontal-hover-color)] md:hover:brightness-105 motion-reduce:md:transition-none ${cardAspectRatio ? "md:aspect-[var(--horizontal-card-aspect-ratio)] md:w-auto" : "md:w-[var(--horizontal-card-width)]"} ${cardClassName} ${card.className ?? ""}`}
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
