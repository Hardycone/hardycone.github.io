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
import { hexToRgba } from "../../lib/palette";

export interface HorizontalCard {
  id?: string;
  content: ReactNode;
  className?: string;
}

export type HorizontalCardAlignment = "aligned" | "centered";

interface HorizontalCardGroupBaseProps {
  cards: HorizontalCard[];
  alignment?: HorizontalCardAlignment;
  groupClassName?: string;
  cardClassName?: string;
  cardHeightClassNameOnSmall?: string;
  stickyTopOnLarge?: string;
  bottomMarginOnLarge?: string;
  highlightBorderColor: string;
  hoverBorderOpacity?: number;
}

type HorizontalCardGroupBodyProps =
  | {
      showBody: true;
      body: ReactNode;
      bodyClassName?: string;
    }
  | {
      showBody?: false;
      body?: never;
      bodyClassName?: never;
    };

type HorizontalCardGroupSizingProps =
  | {
      setCardAspectRatioOnLarge: true;
      cardAspectRatioOnLarge: string;
      maxCardWidthClassNameOnLarge?: string;
      cardWidthClassNameOnLarge?: never;
    }
  | {
      setCardAspectRatioOnLarge?: false;
      cardAspectRatioOnLarge?: never;
      maxCardWidthClassNameOnLarge?: never;
      cardWidthClassNameOnLarge?: string;
    };

export type HorizontalCardGroupProps = HorizontalCardGroupBaseProps &
  HorizontalCardGroupBodyProps &
  HorizontalCardGroupSizingProps;

interface HorizontalCardGroupStyle extends CSSProperties {
  "--horizontal-card-aspect-ratio"?: string;
  "--horizontal-card-group-sticky-top": string;
  "--horizontal-card-group-bottom-margin": string;
  "--horizontal-card-hover-border-color": string;
}

interface HorizontalCardGestureState {
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

export default function HorizontalCardGroup(props: HorizontalCardGroupProps) {
  const {
    cards,
    alignment = "aligned",
    groupClassName = "gap-6 md:gap-4",
    cardClassName = "rounded-1 md:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:md:rounded-4",
    cardHeightClassNameOnSmall = "min-h-80",
    stickyTopOnLarge = "2rem",
    bottomMarginOnLarge = "6rem",
    highlightBorderColor,
    hoverBorderOpacity = 0.6,
  } = props;
  const groupRef = useRef<HTMLDivElement>(null);
  const cardViewportRef = useRef<HTMLDivElement>(null);
  const cardTrackRef = useRef<HTMLDivElement>(null);
  const cardGestureRef = useRef<HorizontalCardGestureState | null>(null);
  const suppressCardClickRef = useRef(false);
  const suppressCardClickTimeoutRef = useRef<number | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const [cardTrackStartX, setCardTrackStartX] = useState(0);
  const [horizontalTravel, setHorizontalTravel] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: groupRef,
    offset: ["start start", "end end"],
  });
  const cardTrackEndX = cardTrackStartX - horizontalTravel;
  const cardTrackX = useTransform(
    scrollYProgress,
    [0, 1],
    isEnabled ? [cardTrackStartX, cardTrackEndX] : [0, 0],
  );

  const updateActiveCard = useCallback(
    (currentX: number) => {
      const viewport = cardViewportRef.current;
      const track = cardTrackRef.current;
      if (!isEnabled || !viewport || !track || cards.length === 0) {
        setActiveCardIndex(null);
        return;
      }

      const currentTravel = Math.min(
        horizontalTravel,
        Math.max(0, cardTrackStartX - currentX),
      );
      if (currentTravel <= 1 || horizontalTravel <= 0) {
        setActiveCardIndex(0);
        return;
      }
      if (currentTravel >= horizontalTravel - 1) {
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
    [cards.length, isEnabled, cardTrackStartX, horizontalTravel],
  );

  useMotionValueEvent(cardTrackX, "change", updateActiveCard);

  useEffect(() => {
    updateActiveCard(cardTrackX.get());
  }, [cardTrackX, updateActiveCard]);

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
    const viewport = cardViewportRef.current;
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
        cardGestureRef.current = null;
        return;
      }

      const interactiveTarget = (event.target as HTMLElement).closest(
        "a, button, input, select, textarea, [role='button']",
      );
      if (interactiveTarget) return;

      const touch = event.touches[0];
      cardGestureRef.current = {
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
      const gesture = cardGestureRef.current;
      if (!gesture || event.touches.length !== 1) {
        cardGestureRef.current = null;
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
          cardGestureRef.current = null;
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
      const gesture = cardGestureRef.current;
      if (!gesture || !findTouch(event.changedTouches, gesture.touchId)) return;

      const didDrag = gesture.axis === "horizontal";
      const releaseDelay = Math.max(0, event.timeStamp - gesture.lastTime);
      const releaseVelocity =
        gesture.velocity * Math.exp(-releaseDelay / INERTIA_RELEASE_DECAY_MS);
      cardGestureRef.current = null;

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
    const viewport = cardViewportRef.current;
    if (!isEnabled || horizontalTravel <= 0 || !viewport) return;

    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        event.deltaX === 0 ||
        Math.abs(event.deltaX) <= Math.abs(event.deltaY)
      ) {
        return;
      }

      const target = groupRef.current;
      if (!target) return;

      const groupStartY = getDocumentOffsetTop(target);
      const groupEndY = groupStartY + horizontalTravel;
      const currentScrollY = window.scrollY;
      const isMovingForward = event.deltaX > 0;
      const canMove = isMovingForward
        ? currentScrollY < groupEndY - 1
        : currentScrollY > groupStartY + 1;

      if (!canMove) return;

      event.preventDefault();
      stopHorizontalInertia();

      const nextScrollY = isMovingForward
        ? Math.min(groupEndY, currentScrollY + event.deltaX)
        : Math.max(groupStartY, currentScrollY + event.deltaX);
      window.scrollTo({ top: nextScrollY, behavior: "auto" });
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [isEnabled, stopHorizontalInertia, horizontalTravel]);

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

      if (!isEnabled || horizontalTravel <= 0) return;

      const interactiveTarget = (event.target as HTMLElement).closest(
        "a, button, input, select, textarea, [role='button']",
      );
      const selection = window.getSelection();
      if (interactiveTarget || (selection && !selection.isCollapsed)) return;

      const target = groupRef.current;
      const viewport = cardViewportRef.current;
      if (!target || !viewport) return;

      const card = event.currentTarget;
      const groupStartY = getDocumentOffsetTop(target);
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const centeredCardX = viewport.clientWidth / 2 - cardCenter;
      const targetX = Math.min(
        cardTrackStartX,
        Math.max(cardTrackEndX, centeredCardX),
      );
      // Center the selected card when possible while respecting the selected
      // alignment mode's measured first- and last-card endpoints.
      const targetTravel = cardTrackStartX - targetX;
      const targetScrollY = groupStartY + targetTravel;
      const boundedTargetScrollY =
        targetTravel <= 0
          ? Math.floor(targetScrollY)
          : targetTravel >= horizontalTravel
            ? Math.ceil(targetScrollY)
            : targetScrollY;

      window.scrollTo({
        top: boundedTargetScrollY,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
    [isEnabled, cardTrackEndX, cardTrackStartX, horizontalTravel],
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
      setCardTrackStartX(0);
      setHorizontalTravel(0);
      return;
    }

    const viewport = cardViewportRef.current;
    const track = cardTrackRef.current;
    if (!viewport || !track) return;

    const updateCardGeometry = () => {
      const viewportWidth = viewport.clientWidth;
      const cardElements = Array.from(track.children) as HTMLElement[];
      const firstCard = cardElements[0];
      const lastCard = cardElements.at(-1);

      if (!firstCard || !lastCard) {
        setCardTrackStartX(0);
        setHorizontalTravel(0);
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
      setCardTrackStartX(nextStartX);
      setHorizontalTravel(Math.max(0, nextStartX - nextEndX));
    };

    updateCardGeometry();

    const resizeObserver = new ResizeObserver(updateCardGeometry);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
    window.addEventListener("resize", updateCardGeometry);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCardGeometry);
    };
  }, [alignment, cards.length, isEnabled]);

  const cardSizingClassName = props.setCardAspectRatioOnLarge
    ? `md:aspect-[var(--horizontal-card-aspect-ratio)] md:w-auto ${props.maxCardWidthClassNameOnLarge ?? ""}`
    : (props.cardWidthClassNameOnLarge ?? "md:w-[min(42vw,30rem)]");

  return (
    <div
      ref={groupRef}
      className="relative"
      style={
        {
          "--horizontal-card-aspect-ratio": props.setCardAspectRatioOnLarge
            ? props.cardAspectRatioOnLarge
            : undefined,
          "--horizontal-card-group-sticky-top": stickyTopOnLarge,
          "--horizontal-card-group-bottom-margin": bottomMarginOnLarge,
          "--horizontal-card-hover-border-color": hexToRgba(
            highlightBorderColor,
            hoverBorderOpacity,
          ),
          height: isEnabled
            ? horizontalTravel > 0
              ? `calc(100svh + ${horizontalTravel}px)`
              : "100svh"
            : undefined,
        } as HorizontalCardGroupStyle
      }
    >
      <div className="flex flex-col md:sticky md:top-[var(--horizontal-card-group-sticky-top)] md:h-[calc(100svh-var(--horizontal-card-group-sticky-top)-var(--horizontal-card-group-bottom-margin))]">
        {props.showBody ? (
          <div
            className={`relative z-10 mb-4 md:flex-none ${props.bodyClassName ?? ""}`}
          >
            {props.body}
          </div>
        ) : null}
        <div className="relative h-auto w-full [container-type:inline-size] md:mb-0 md:min-h-0 md:flex-1">
          <div className="h-auto w-full overflow-visible md:absolute md:left-1/2 md:top-0 md:h-full md:w-screen md:-translate-x-1/2 md:overflow-x-clip md:overflow-y-visible">
            <div
              ref={cardViewportRef}
              className="h-auto w-full md:relative md:left-1/2 md:h-full md:w-[100cqw] md:-translate-x-1/2 md:[touch-action:pan-y_pinch-zoom]"
            >
              <motion.div
                ref={cardTrackRef}
                style={{ x: cardTrackX }}
                className={`flex h-auto w-full flex-col md:absolute md:left-0 md:top-0 md:h-full md:w-max md:flex-row md:will-change-transform ${groupClassName}`}
              >
                {cards.map((card, index) => (
                  <div
                    key={card.id ?? index}
                    onClick={handleCardClick}
                    className={`flex ${cardHeightClassNameOnSmall} w-full shrink-0 flex-col overflow-auto border border-white bg-zinc-50 p-8 shadow dark:border-white/25 dark:bg-zinc-800 md:h-full md:min-h-0 md:cursor-pointer md:transition-[border-color,filter] md:duration-300 md:hover:border-[var(--horizontal-card-hover-border-color)] md:hover:brightness-105 motion-reduce:md:transition-none ${cardSizingClassName} ${cardClassName} ${card.className ?? ""}`}
                    style={{
                      borderColor:
                        isEnabled && activeCardIndex === index
                          ? highlightBorderColor
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
