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
import { useIsMdUp } from "../../hooks/useIsMdUp";
import { hexToRgba } from "../../lib/palette";

export interface VerticalCard {
  id?: string;
  content: ReactNode;
  className?: string;
}

export interface VerticalCardGroupProps {
  body: ReactNode | ((state: { activeIndex: number | null }) => ReactNode);
  cards: VerticalCard[];
  bodyClassName?: string;
  bodyWidthClassNameOnLarge?: string;
  groupClassName?: string;
  cardClassName?: string;
  cardHeightOnLarge?: string;
  cardHeightClassNameOnSmall?: string;
  stickyTopOnLarge?: string;
  highlightBorderColor: string;
  hoverBorderOpacity?: number;
  activeRangeStartOnLarge?: number;
  activeRangeEndOnLarge?: number;
}

interface VerticalCardGroupStyle extends CSSProperties {
  "--vertical-card-height-on-large": string;
  "--vertical-card-group-sticky-top": string;
  "--vertical-card-hover-border-color": string;
}

export default function VerticalCardGroup({
  body,
  cards,
  bodyClassName = "",
  bodyWidthClassNameOnLarge = "md:w-96",
  groupClassName = "gap-4",
  cardClassName = "rounded-1 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4",
  cardHeightOnLarge = "min(calc(100dvh - var(--vertical-card-group-sticky-top)), 800px)",
  cardHeightClassNameOnSmall = "h-auto",
  stickyTopOnLarge = "5rem",
  highlightBorderColor,
  hoverBorderOpacity = 0.6,
  activeRangeStartOnLarge = 80,
  activeRangeEndOnLarge = 240,
}: VerticalCardGroupProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const bodyStickyRef = useRef<HTMLDivElement>(null);
  const cardContainerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isMdUp = useIsMdUp();

  useEffect(() => {
    if (!isMdUp) {
      setActiveIndex(null);
      return;
    }

    let observer: IntersectionObserver | null = null;
    const intersectingCards = new Set<number>();

    const updateActiveCard = () => {
      let closestIndex: number | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      intersectingCards.forEach((index) => {
        const card = cardContainerRefs.current[index];
        if (!card) return;

        const distance = Math.abs(
          card.getBoundingClientRect().top - activeRangeStartOnLarge,
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    const observe = () => {
      observer?.disconnect();
      intersectingCards.clear();

      const rangeEnd = Math.min(activeRangeEndOnLarge, window.innerHeight);
      const bottomMargin = Math.max(0, window.innerHeight - rangeEnd);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = Number(
              (entry.target as HTMLElement).dataset.cardIndex,
            );
            if (entry.isIntersecting) intersectingCards.add(index);
            else intersectingCards.delete(index);
          });
          updateActiveCard();
        },
        {
          rootMargin: `-${activeRangeStartOnLarge}px 0px -${bottomMargin}px 0px`,
          threshold: 0,
        },
      );

      cardContainerRefs.current.forEach((card) => {
        if (card) observer?.observe(card);
      });
    };

    observe();
    window.addEventListener("resize", observe);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, [activeRangeEndOnLarge, activeRangeStartOnLarge, cards.length, isMdUp]);

  const handleCardClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!isMdUp) return;

      const interactiveTarget = (event.target as HTMLElement).closest(
        "a, button, input, select, textarea, [role='button']",
      );
      const selection = window.getSelection();
      if (interactiveTarget || (selection && !selection.isCollapsed)) return;

      const cardContainer = event.currentTarget;
      let cardTop = 0;
      let offsetElement: HTMLElement | null = cardContainer;

      while (offsetElement) {
        cardTop += offsetElement.offsetTop;
        offsetElement = offsetElement.offsetParent as HTMLElement | null;
      }

      const computedStickyTop = bodyStickyRef.current
        ? Number.parseFloat(getComputedStyle(bodyStickyRef.current).top)
        : Number.NaN;
      const scrollOffset = Number.isFinite(computedStickyTop)
        ? computedStickyTop
        : 80;

      window.scrollTo({
        top: cardTop - scrollOffset,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
    [isMdUp],
  );
  const renderedBody =
    typeof body === "function"
      ? body({
          activeIndex: isMdUp ? activeIndex : null,
        })
      : body;

  return (
    <div
      className="relative block gap-4 md:flex"
      style={
        {
          "--vertical-card-height-on-large": cardHeightOnLarge,
          "--vertical-card-group-sticky-top": stickyTopOnLarge,
          "--vertical-card-hover-border-color": hexToRgba(
            highlightBorderColor,
            hoverBorderOpacity,
          ),
        } as VerticalCardGroupStyle
      }
    >
      <div
        className={`mb-8 w-full md:mb-0 md:flex-none ${bodyWidthClassNameOnLarge} ${bodyClassName}`}
      >
        <div
          ref={bodyStickyRef}
          className="h-auto md:sticky md:top-[var(--vertical-card-group-sticky-top)] md:h-[var(--vertical-card-height-on-large)]"
        >
          {renderedBody}
        </div>
      </div>
      <div
        className={`relative flex min-w-0 flex-col md:flex-1 ${groupClassName}`}
      >
        {cards.map((card, index) => (
          <div
            key={card.id ?? index}
            ref={(node) => {
              cardContainerRefs.current[index] = node;
            }}
            data-card-index={index}
            onClick={handleCardClick}
            className="h-auto scroll-mt-[var(--vertical-card-group-sticky-top)] text-lg md:h-[var(--vertical-card-height-on-large)] md:cursor-pointer"
          >
            <div
              className={`overflow-clip border border-white shadow dark:border-white/25 md:h-full md:transition-[border-color,filter] md:duration-300 md:hover:border-[var(--vertical-card-hover-border-color)] md:hover:brightness-105 motion-reduce:md:transition-none ${cardHeightClassNameOnSmall} ${cardClassName} ${card.className ?? ""}`}
              style={{
                borderColor:
                  isMdUp && activeIndex === index
                    ? highlightBorderColor
                    : undefined,
              }}
            >
              {card.content}
            </div>
          </div>
        ))}
        <div className="absolute bottom-0 h-0 w-full" />
      </div>
    </div>
  );
}
