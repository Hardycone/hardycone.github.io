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

interface HorizontalFilmstripBaseProps {
  body: ReactNode;
  cards: HorizontalFilmstripCard[];
  className?: string;
  bodyClassName?: string;
  cardClassName?: string;
  cardWidth?: string;
  cardHeight?: string;
  mobileCardMinHeight?: string;
  fillAvailableHeight?: boolean;
  bottomMargin?: string;
  primaryColor: string;
  hoverBorderOpacity?: number;
}

export type HorizontalFilmstripProps = HorizontalFilmstripBaseProps &
  (
    | {
        heading: string;
        number?: string;
      }
    | {
        heading?: never;
        number?: never;
      }
  );

interface HorizontalFilmstripStyle extends CSSProperties {
  "--filmstrip-card-width": string;
  "--filmstrip-card-height": string;
  "--filmstrip-mobile-card-min-height": string;
  "--filmstrip-bottom-margin": string;
  "--filmstrip-primary-color": string;
  "--filmstrip-hover-color": string;
}

export default function HorizontalFilmstrip({
  body,
  heading,
  number,
  cards,
  className = "",
  bodyClassName = "",
  cardClassName = "",
  cardWidth = "min(42vw, 30rem)",
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

  const handleCardClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
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
      const targetRect = target.getBoundingClientRect();
      const sectionStartY = window.scrollY + targetRect.top;
      const centeredCardOffset =
        card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2;
      const targetTravel = Math.min(travel, Math.max(0, centeredCardOffset));
      const targetScrollY = sectionStartY + targetTravel;

      window.scrollTo({
        top: targetTravel === travel ? Math.ceil(targetScrollY) : targetScrollY,
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
        className={`flex flex-col md:sticky md:top-24 ${fillAvailableHeight ? "md:h-[calc(100svh-6rem-var(--filmstrip-bottom-margin))]" : ""}`}
      >
        <div
          className={`relative z-10 mb-8 ${fillAvailableHeight ? "md:flex-none" : ""} ${bodyClassName}`}
        >
          <div className="flex flex-col gap-4">
            {heading ? (
              <h4 className="flex w-fit items-center gap-2 dark:bg-opacity-20">
                {number ? (
                  <div className="flex size-5 items-center justify-center rounded-full bg-foreground dark:bg-dark-foreground md:size-6">
                    <span className="font-sans text-sm font-bold text-background dark:text-dark-background md:text-base">
                      {number}
                    </span>
                  </div>
                ) : null}
                {heading}
              </h4>
            ) : null}
            {body}
          </div>
        </div>
        <div
          className={`relative mb-24 h-auto w-full [container-type:inline-size] ${fillAvailableHeight ? "md:mb-0 md:min-h-0 md:flex-1" : "md:h-[var(--filmstrip-card-height)]"}`}
        >
          <div className="h-auto w-full overflow-visible md:absolute md:left-1/2 md:top-0 md:h-full md:w-screen md:-translate-x-1/2 md:overflow-x-clip md:overflow-y-visible">
            <div
              ref={viewportRef}
              className="h-auto w-full md:relative md:left-1/2 md:h-full md:w-[100cqw] md:-translate-x-1/2"
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
                    className={`flex min-h-[var(--filmstrip-mobile-card-min-height)] w-full shrink-0 flex-col overflow-auto rounded-1 border border-white bg-zinc-50 p-8 shadow supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:border-white/25 dark:bg-zinc-800 md:h-full md:min-h-0 md:w-[var(--filmstrip-card-width)] md:cursor-pointer md:rounded-2 md:transition-[border-color,filter] md:duration-300 md:hover:border-[var(--filmstrip-hover-color)] md:hover:brightness-105 supports-[corner-shape:squircle]:md:rounded-4 motion-reduce:md:transition-none ${cardClassName} ${card.className ?? ""}`}
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
