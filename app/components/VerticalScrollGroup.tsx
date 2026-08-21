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
import { useIsMdUp } from "@/hooks/useIsMdUp";
import { hexToRgba } from "@/lib/palette";

export interface VerticalScrollCard {
  id?: string;
  content: ReactNode;
  className?: string;
}

export interface VerticalScrollCardsProps {
  sideContent:
    | ReactNode
    | ((state: { activeIndex: number | null }) => ReactNode);
  cards: VerticalScrollCard[];
  highlightOnIntersect?: boolean;
  className?: string;
  sideClassName?: string;
  cardFrameClassName?: string;
  cardClassName?: string;
  sideWidth?: string;
  cardHeight?: string;
  primaryColor: string;
  hoverBorderOpacity?: number;
  activeRangeStart?: number;
  activeRangeEnd?: number;
}

interface VerticalScrollCardsStyle extends CSSProperties {
  "--vertical-scroll-side-width": string;
  "--vertical-scroll-card-height": string;
  "--vertical-scroll-primary-color": string;
  "--vertical-scroll-hover-color": string;
}

export default function VerticalScrollCards({
  sideContent,
  cards,
  highlightOnIntersect = false,
  className = "",
  sideClassName = "",
  cardFrameClassName = "",
  cardClassName = "",
  sideWidth = "24rem",
  cardHeight = "min(calc(100dvh - 5rem), 800px)",
  primaryColor,
  hoverBorderOpacity = 0.6,
  activeRangeStart = 80,
  activeRangeEnd = 240,
}: VerticalScrollCardsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cardFrameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isMdUp = useIsMdUp();
  const isHighlightEnabled = highlightOnIntersect && isMdUp;

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
        const card = cardFrameRefs.current[index];
        if (!card) return;

        const distance = Math.abs(
          card.getBoundingClientRect().top - activeRangeStart,
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

      const rangeEnd = Math.min(activeRangeEnd, window.innerHeight);
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
          rootMargin: `-${activeRangeStart}px 0px -${bottomMargin}px 0px`,
          threshold: 0,
        },
      );

      cardFrameRefs.current.forEach((card) => {
        if (card) observer?.observe(card);
      });
    };

    observe();
    window.addEventListener("resize", observe);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, [activeRangeEnd, activeRangeStart, cards.length, isMdUp]);

  const handleCardClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!isMdUp) return;

      const interactiveTarget = (event.target as HTMLElement).closest(
        "a, button, input, select, textarea, [role='button']",
      );
      const selection = window.getSelection();
      if (interactiveTarget || (selection && !selection.isCollapsed)) return;

      const cardFrame = event.currentTarget;
      let cardTop = 0;
      let offsetElement: HTMLElement | null = cardFrame;

      while (offsetElement) {
        cardTop += offsetElement.offsetTop;
        offsetElement = offsetElement.offsetParent as HTMLElement | null;
      }

      window.scrollTo({
        top: cardTop - 80,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
    [isMdUp],
  );
  const renderedSideContent =
    typeof sideContent === "function"
      ? sideContent({
          activeIndex: isHighlightEnabled ? activeIndex : null,
        })
      : sideContent;

  return (
    <div
      className={`relative block gap-4 md:flex ${className}`}
      style={
        {
          "--vertical-scroll-side-width": sideWidth,
          "--vertical-scroll-card-height": cardHeight,
          "--vertical-scroll-primary-color": primaryColor,
          "--vertical-scroll-hover-color": hexToRgba(
            primaryColor,
            hoverBorderOpacity,
          ),
        } as VerticalScrollCardsStyle
      }
    >
      <div
        className={`mb-8 w-full md:mb-0 md:w-[var(--vertical-scroll-side-width)] md:flex-none ${sideClassName}`}
      >
        <div className="h-auto md:sticky md:top-20 md:h-[var(--vertical-scroll-card-height)]">
          {renderedSideContent}
        </div>
      </div>
      <div className="relative flex min-w-0 flex-col gap-4 md:flex-1">
        {cards.map((card, index) => (
          <div
            key={card.id ?? index}
            ref={(node) => {
              cardFrameRefs.current[index] = node;
            }}
            data-card-index={index}
            onClick={handleCardClick}
            className={`h-auto scroll-mt-20 text-lg md:h-[var(--vertical-scroll-card-height)] md:cursor-pointer ${cardFrameClassName}`}
          >
            <div
              className={`overflow-clip rounded-1 border border-white shadow supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:border-white/25 md:rounded-2 md:transition-[border-color,filter] md:duration-300 md:hover:border-[var(--vertical-scroll-hover-color)] md:hover:brightness-105 supports-[corner-shape:squircle]:md:rounded-4 motion-reduce:md:transition-none ${cardClassName} ${card.className ?? ""}`}
              style={{
                borderColor:
                  isMdUp && activeIndex === index ? primaryColor : undefined,
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
