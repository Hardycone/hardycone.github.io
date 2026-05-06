"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

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
  inViewAmount?: number;
  className?: string;
  sideClassName?: string;
  cardFrameClassName?: string;
  cardClassName?: string;
}

interface ObservedCardProps {
  index: number;
  amount: number;
  disabled: boolean;
  className: string;
  children: ReactNode;
  onActiveChange: (index: number) => void;
}

function ObservedCard({
  index,
  amount,
  disabled,
  className,
  children,
  onActiveChange,
}: ObservedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount });

  useEffect(() => {
    if (!disabled && isInView) {
      onActiveChange(index);
    }
  }, [disabled, index, isInView, onActiveChange]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default function VerticalScrollCards({
  sideContent,
  cards,
  highlightOnIntersect = false,
  inViewAmount = 0.6,
  className = "",
  sideClassName = "",
  cardFrameClassName = "",
  cardClassName = "",
}: VerticalScrollCardsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const renderedSideContent =
    typeof sideContent === "function"
      ? sideContent({
          activeIndex: highlightOnIntersect ? activeIndex : null,
        })
      : sideContent;

  return (
    <div className={`relative block md:flex ${className}`}>
      <div
        className={`mb-8 w-full md:mb-0 md:w-96 md:flex-none ${sideClassName}`}
      >
        <div className="h-auto max-h-none md:sticky md:top-24 md:h-[calc(100dvh_-_6rem)] md:max-h-[800px]">
          {renderedSideContent}
        </div>
      </div>
      <div className="relative flex-1">
        {cards.map((card, index) => (
          <ObservedCard
            key={card.id ?? index}
            index={index}
            amount={inViewAmount}
            disabled={!highlightOnIntersect}
            onActiveChange={setActiveIndex}
            className={`h-auto max-h-none scroll-mt-[6rem] pb-6 text-lg md:h-[calc(100dvh_-_6rem)] md:max-h-[800px] md:pb-8 ${cardFrameClassName}`}
          >
            <div
              className={`overflow-clip rounded-[20px] border border-white shadow dark:border-white/25 ${cardClassName} ${card.className ?? ""}`}
            >
              {card.content}
            </div>
          </ObservedCard>
        ))}
        <div className="absolute bottom-0 h-0 w-full" />
      </div>
    </div>
  );
}
