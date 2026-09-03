"use client";

import {
  Fragment,
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { XIcon } from "@phosphor-icons/react";
import HighlightCard from "./HighlightCard";

export interface ResearchQuote {
  id: string;
  before: string;
  highlight: string;
  after: string;
  compactPosition?: CompactStickyPosition;
}

export interface CompactStickyPosition {
  origin?: "center" | "top-left";
  x?: number | string;
  y?: number | string;
}

export interface ResearchTheme {
  id: string;
  label: string;
  quotes: ResearchQuote[];
}

interface ResearchThemeCanvasProps {
  themes: ResearchTheme[];
}

interface CardBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

type CardPosition = "absolute" | "fixed";

type CardPhase =
  | "positioning"
  | "opening"
  | "open"
  | "closing-content"
  | "closing";

interface ActiveCard {
  quoteId: string;
  position: CardPosition;
  origin: CardBox;
  target: CardBox;
  phraseTarget: {
    left: number;
    top: number;
  };
  compactFontSize: number;
  compactLineHeight: number;
  expandedFontSize: number;
  expandedLineHeight: number;
  notePadding: number;
  phase: CardPhase;
}

const themeTones = [
  {
    label: "text-foreground-ultralight dark:text-dark-foreground-ultralight",
    note: "bg-red-200 dark:bg-red-900 text-foreground dark:text-dark-foreground",
  },
  {
    label: "text-foreground-ultralight dark:text-dark-foreground-ultralight",
    note: "bg-indigo-200 dark:bg-indigo-900 text-foreground dark:text-dark-foreground",
  },
  {
    label: "text-foreground-ultralight dark:text-dark-foreground-ultralight",
    note: "bg-lime-200 dark:bg-lime-900 text-foreground dark:text-dark-foreground",
  },
  {
    label: "text-foreground-ultralight dark:text-dark-foreground-ultralight",
    note: "bg-amber-200 dark:bg-amber-900 text-foreground dark:text-dark-foreground",
  },
] as const;

const themeOffsets = [
  "translate-x-0",
  "translate-x-0",
  "translate-x-0",
  "translate-x-0",
] as const;

const ANIMATION_SLOWDOWN = 1;
const slow = (seconds: number) => seconds * ANIMATION_SLOWDOWN;
const geometryTransition = {
  type: "spring" as const,
  stiffness: 420 / ANIMATION_SLOWDOWN ** 2,
  damping: 36 / ANIMATION_SLOWDOWN,
};
const openingGeometryTransition = {
  ...geometryTransition,
  restDelta: 0.5,
  restSpeed: 10,
};

function measureBox(element: HTMLDivElement): CardBox {
  const bounds = element.getBoundingClientRect();

  return {
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
  };
}

function getBoxRelativeToParent(box: CardBox, parent: HTMLElement): CardBox {
  const parentBounds = parent.getBoundingClientRect();

  return {
    left: box.left - parentBounds.left - parent.clientLeft,
    top: box.top - parentBounds.top - parent.clientTop,
    width: box.width,
    height: box.height,
  };
}

function getCanvasBoxRelativeToParent(
  box: CardBox,
  canvas: HTMLDivElement,
  parent: HTMLElement,
): CardBox {
  const canvasBounds = canvas.getBoundingClientRect();
  const parentBounds = parent.getBoundingClientRect();

  return {
    left:
      canvasBounds.left +
      canvas.clientLeft +
      box.left -
      parentBounds.left -
      parent.clientLeft,
    top:
      canvasBounds.top +
      canvas.clientTop +
      box.top -
      parentBounds.top -
      parent.clientTop,
    width: box.width,
    height: box.height,
  };
}

function getExpandedFontSize() {
  return window.matchMedia("(min-width: 768px)").matches ? 20 : 16;
}

function getNotePadding() {
  if (window.matchMedia("(min-width: 768px)").matches) return 40;
  return 24;
}

function getCardPosition(): CardPosition {
  return window.matchMedia("(min-width: 768px)").matches ? "absolute" : "fixed";
}

function asCssLength(value: number | string | undefined) {
  if (typeof value === "number") return `${value}px`;
  return value ?? "0px";
}

function getCompactPositionStyle(
  position: CompactStickyPosition | undefined,
): CSSProperties | undefined {
  if (!position) return undefined;

  const x = asCssLength(position.x);
  const y = asCssLength(position.y);

  if ((position.origin ?? "center") === "top-left") {
    return {
      position: "absolute",
      left: x,
      top: y,
      translate: "none",
    };
  }

  return {
    position: "absolute",
    left: `calc(50% + ${x})`,
    top: `calc(50% + ${y})`,
    translate: "-50% -50%",
  };
}

export default function ResearchThemeCanvas({
  themes,
}: ResearchThemeCanvasProps) {
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);
  const [cardVersions, setCardVersions] = useState<Record<string, number>>({});
  const canvasRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLDivElement>());
  const placeholderRefs = useRef(new Map<string, HTMLDivElement>());
  const phraseRefs = useRef(new Map<string, HTMLSpanElement>());
  const phraseTargetRef = useRef<HTMLSpanElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(false);
  const mobileFocusQuoteRef = useRef<string | null>(null);

  const activeQuoteId = activeCard?.quoteId ?? null;
  const activeMobileQuote =
    activeCard?.position === "fixed"
      ? themes
          .flatMap((theme, themeIndex) =>
            theme.quotes.map((quote) => ({ quote, theme, themeIndex })),
          )
          .find(({ quote }) => quote.id === activeCard.quoteId)
      : undefined;

  const getTargetBox = useCallback((position: CardPosition): CardBox => {
    const visualViewport = window.visualViewport;
    const viewportWidth = visualViewport?.width ?? window.innerWidth;
    const viewportHeight = visualViewport?.height ?? window.innerHeight;
    const viewportLeft = visualViewport?.offsetLeft ?? 0;
    const viewportTop = visualViewport?.offsetTop ?? 0;
    const canvas = canvasRef.current;
    const bounds =
      position === "absolute" && canvas
        ? {
            left: 0,
            top: 0,
            width: canvas.clientWidth,
            height: canvas.clientHeight,
          }
        : {
            left: viewportLeft,
            top: viewportTop,
            width: viewportWidth,
            height: viewportHeight,
          };
    const inset = position === "absolute" ? 32 : 16;
    const size = Math.max(
      0,
      Math.min(
        512,
        viewportHeight * 0.8,
        bounds.width - inset * 2,
        bounds.height - inset * 2,
      ),
    );

    return {
      left: bounds.left + (bounds.width - size) / 2,
      top: bounds.top + (bounds.height - size) / 2,
      width: size,
      height: size,
    };
  }, []);

  const openQuote = useCallback(
    (quoteId: string, element: HTMLDivElement) => {
      if (activeCard) return;

      element.blur();

      const phrase = phraseRefs.current.get(quoteId);
      const compactFontSize = phrase
        ? Number.parseFloat(window.getComputedStyle(phrase).fontSize)
        : 14;
      const compactLineHeight = phrase
        ? Number.parseFloat(window.getComputedStyle(phrase).lineHeight)
        : compactFontSize * 1.25;
      const expandedFontSize = getExpandedFontSize();
      const position = getCardPosition();
      const measuredOrigin = measureBox(element);
      const canvas = canvasRef.current;
      const positioningParent =
        position === "absolute" && element.offsetParent instanceof HTMLElement
          ? element.offsetParent
          : null;
      const origin =
        position === "absolute" && positioningParent
          ? getBoxRelativeToParent(measuredOrigin, positioningParent)
          : measuredOrigin;
      const canvasTarget = getTargetBox(position);
      const target =
        position === "absolute" && canvas && positioningParent
          ? getCanvasBoxRelativeToParent(
              canvasTarget,
              canvas,
              positioningParent,
            )
          : canvasTarget;

      setActiveCard({
        quoteId,
        position,
        origin,
        target,
        phraseTarget: { left: 12, top: 8 },
        compactFontSize,
        compactLineHeight,
        expandedFontSize,
        expandedLineHeight: expandedFontSize * 1.375,
        notePadding: getNotePadding(),
        phase: position === "fixed" ? "open" : "positioning",
      });
    },
    [activeCard, getTargetBox],
  );

  const closeQuote = useCallback((restoreFocus = false) => {
    restoreFocusRef.current = restoreFocus;

    setActiveCard((current) => {
      if (
        !current ||
        current.phase === "closing-content" ||
        current.phase === "closing"
      ) {
        return current;
      }

      if (current.position === "fixed") {
        mobileFocusQuoteRef.current = restoreFocus ? current.quoteId : null;
        restoreFocusRef.current = false;
        return null;
      }

      return {
        ...current,
        phase: current.phase === "open" ? "closing-content" : "closing",
      };
    });
  }, []);

  useLayoutEffect(() => {
    if (!activeCard || activeCard.position === "fixed") return;

    const card = triggerRefs.current.get(activeCard.quoteId);
    const target = phraseTargetRef.current;
    if (!card || !target) return;

    const cardBounds = card.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();
    const phraseTarget = {
      left: targetBounds.left - cardBounds.left,
      top: targetBounds.top - cardBounds.top,
    };

    setActiveCard((current) => {
      if (!current) return current;

      const hasMoved =
        Math.abs(current.phraseTarget.left - phraseTarget.left) > 0.25 ||
        Math.abs(current.phraseTarget.top - phraseTarget.top) > 0.25;
      const beginsOpening = current.phase === "positioning";

      if (!hasMoved && !beginsOpening) return current;

      return {
        ...current,
        phraseTarget,
        phase: beginsOpening ? "opening" : current.phase,
      };
    });
  }, [activeCard]);

  useLayoutEffect(() => {
    if (activeCard?.position !== "fixed") return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootStyles = {
      overflow: root.style.overflow,
      overscrollBehavior: root.style.overscrollBehavior,
    };
    const previousBodyStyles = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      paddingRight: body.style.paddingRight,
    };
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const preventBackgroundScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && mobileModalRef.current?.contains(target)) {
        return;
      }

      event.preventDefault();
    };

    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    document.addEventListener("touchmove", preventBackgroundScroll, {
      passive: false,
    });
    document.addEventListener("wheel", preventBackgroundScroll, {
      passive: false,
    });

    return () => {
      root.style.overflow = previousRootStyles.overflow;
      root.style.overscrollBehavior = previousRootStyles.overscrollBehavior;
      body.style.overflow = previousBodyStyles.overflow;
      body.style.overscrollBehavior = previousBodyStyles.overscrollBehavior;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      document.removeEventListener("touchmove", preventBackgroundScroll);
      document.removeEventListener("wheel", preventBackgroundScroll);
    };
  }, [activeCard?.position]);

  useEffect(() => {
    if (activeCard || !mobileFocusQuoteRef.current) return;

    const quoteId = mobileFocusQuoteRef.current;
    mobileFocusQuoteRef.current = null;
    const frame = window.requestAnimationFrame(() =>
      triggerRefs.current.get(quoteId)?.focus({ preventScroll: true }),
    );

    return () => window.cancelAnimationFrame(frame);
  }, [activeCard]);

  useEffect(() => {
    if (!activeQuoteId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeQuote(true);
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeQuoteId, closeQuote]);

  useEffect(() => {
    if (activeCard?.phase === "open") {
      closeButtonRef.current?.focus({ preventScroll: true });
    }
  }, [activeCard?.phase]);

  useEffect(() => {
    if (!activeQuoteId) return;

    const updateGeometry = (scrollOnly = false) => {
      setActiveCard((current) => {
        if (!current) return current;

        if (scrollOnly && current.position === "absolute") return current;

        const placeholder = placeholderRefs.current.get(current.quoteId);
        const placeholderBounds = placeholder?.getBoundingClientRect();
        const position = getCardPosition();
        const canvas = canvasRef.current;
        const positioningParent =
          position === "absolute" &&
          placeholder?.offsetParent instanceof HTMLElement
            ? placeholder.offsetParent
            : null;
        const origin = placeholderBounds
          ? position === "absolute" && positioningParent
            ? getBoxRelativeToParent(
                {
                  left: placeholderBounds.left,
                  top: placeholderBounds.top,
                  width: placeholderBounds.width,
                  height: placeholderBounds.height,
                },
                positioningParent,
              )
            : {
                left: placeholderBounds.left,
                top: placeholderBounds.top,
                width: placeholderBounds.width,
                height: placeholderBounds.height,
              }
          : current.origin;
        const canvasTarget = getTargetBox(position);
        const target =
          position === "absolute" && canvas && positioningParent
            ? getCanvasBoxRelativeToParent(
                canvasTarget,
                canvas,
                positioningParent,
              )
            : canvasTarget;

        const expandedFontSize = getExpandedFontSize();

        return {
          ...current,
          position,
          origin,
          target,
          expandedFontSize,
          expandedLineHeight: expandedFontSize * 1.375,
          notePadding: getNotePadding(),
        };
      });
    };

    const updateForResize = () => updateGeometry();
    const updateForScroll = () => updateGeometry(true);

    window.addEventListener("resize", updateForResize);
    window.addEventListener("scroll", updateForScroll, { passive: true });
    visualViewport?.addEventListener("resize", updateForResize);

    return () => {
      window.removeEventListener("resize", updateForResize);
      window.removeEventListener("scroll", updateForScroll);
      visualViewport?.removeEventListener("resize", updateForResize);
    };
  }, [activeQuoteId, getTargetBox]);

  return (
    <>
      <HighlightCard className="overflow-hidden" highlightOnHover={false}>
        <div
          ref={canvasRef}
          className="relative isolate overflow-hidden p-3 md:p-8"
        >
          <div className="grid auto-rows-[16rem] grid-cols-1 md:auto-rows-[19rem] md:grid-cols-2">
            {themes.map((theme, themeIndex) => {
              const tone = themeTones[themeIndex % themeTones.length];
              const splitIndex = Math.ceil(theme.quotes.length / 2);
              const topQuotes = theme.quotes.slice(0, splitIndex);
              const bottomQuotes = theme.quotes.slice(splitIndex);

              const renderQuoteTrigger = (quote: ResearchQuote) => {
                const compactPositionStyle = getCompactPositionStyle(
                  quote.compactPosition,
                );
                const isActive = activeCard?.quoteId === quote.id;
                const usesMobileModal =
                  isActive && activeCard.position === "fixed";
                const showsSupportingText =
                  isActive && activeCard.phase === "open";
                const usesExpandedGeometry =
                  isActive &&
                  (activeCard.phase === "opening" ||
                    activeCard.phase === "open" ||
                    activeCard.phase === "closing-content");
                const geometry =
                  isActive && usesExpandedGeometry
                    ? activeCard.target
                    : activeCard?.origin;
                const phraseGeometry =
                  isActive && usesExpandedGeometry
                    ? activeCard.phraseTarget
                    : { left: 12, top: 8 };
                const activeGeometryTransition =
                  isActive &&
                  (activeCard.phase === "positioning" ||
                    activeCard.phase === "opening")
                    ? openingGeometryTransition
                    : geometryTransition;

                return (
                  <Fragment key={quote.id}>
                    {isActive ? (
                      <div
                        key="placeholder"
                        ref={(element) => {
                          if (element) {
                            placeholderRefs.current.set(quote.id, element);
                          } else {
                            placeholderRefs.current.delete(quote.id);
                          }
                        }}
                        aria-hidden="true"
                        className="pointer-events-none shrink-0"
                        style={{
                          ...compactPositionStyle,
                          width: activeCard.origin.width,
                          height: activeCard.origin.height,
                        }}
                      />
                    ) : null}

                    {!usesMobileModal ? (
                      <motion.div
                        key={`card-${cardVersions[quote.id] ?? 0}`}
                        ref={(element) => {
                          if (element) {
                            triggerRefs.current.set(quote.id, element);
                          } else {
                            triggerRefs.current.delete(quote.id);
                          }
                        }}
                        role={isActive ? "dialog" : "button"}
                        aria-modal={isActive ? true : undefined}
                        aria-expanded={!isActive ? false : undefined}
                        aria-label={
                          isActive
                            ? `“${quote.before}${quote.highlight}${quote.after}” — ${theme.label}`
                            : `Read the full quote containing “${quote.highlight}”`
                        }
                        tabIndex={isActive ? -1 : 0}
                        onClick={(event) => {
                          if (isActive) {
                            closeQuote();
                          } else {
                            openQuote(quote.id, event.currentTarget);
                          }
                        }}
                        onKeyDown={(event) => {
                          if (
                            !isActive &&
                            (event.key === "Enter" || event.key === " ")
                          ) {
                            event.preventDefault();
                            openQuote(quote.id, event.currentTarget);
                          }
                        }}
                        className={`${isActive ? "z-30 max-w-none cursor-pointer overflow-hidden" : `${compactPositionStyle ? "z-10" : "relative"} max-w-[48%] cursor-pointer hover:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-dark-background`} ${tone.note} rounded-none text-left font-serif text-xs font-semibold leading-tight outline-none transition-[filter] md:text-sm`}
                        style={
                          isActive
                            ? {
                                position: activeCard.position,
                                left: activeCard.origin.left,
                                top: activeCard.origin.top,
                                width: activeCard.origin.width,
                                height: activeCard.origin.height,
                                maxWidth: "none",
                                padding: 0,
                              }
                            : {
                                ...compactPositionStyle,
                                position:
                                  compactPositionStyle?.position ?? "relative",
                                left: compactPositionStyle?.left ?? "auto",
                                top: compactPositionStyle?.top ?? "auto",
                                width: "auto",
                                height: "auto",
                                maxWidth: "48%",
                                padding: "8px 12px",
                                translate:
                                  compactPositionStyle?.translate ?? "none",
                              }
                        }
                        animate={
                          isActive && geometry
                            ? {
                                left: geometry.left,
                                top: geometry.top,
                                width: geometry.width,
                                height: geometry.height,
                              }
                            : undefined
                        }
                        transition={
                          isActive ? activeGeometryTransition : undefined
                        }
                        onAnimationComplete={() => {
                          if (!isActive) return;

                          if (activeCard.phase === "opening") {
                            setActiveCard((current) =>
                              current?.quoteId === quote.id &&
                              current.phase === "opening"
                                ? { ...current, phase: "open" }
                                : current,
                            );
                          }

                          if (activeCard.phase === "closing") {
                            setCardVersions((current) => ({
                              ...current,
                              [quote.id]: (current[quote.id] ?? 0) + 1,
                            }));
                            setActiveCard(null);
                            if (restoreFocusRef.current) {
                              window.requestAnimationFrame(() =>
                                triggerRefs.current
                                  .get(quote.id)
                                  ?.focus({ preventScroll: true }),
                              );
                            }
                            restoreFocusRef.current = false;
                          }
                        }}
                      >
                        <motion.span
                          key="phrase"
                          ref={(element) => {
                            if (element) {
                              phraseRefs.current.set(quote.id, element);
                            } else {
                              phraseRefs.current.delete(quote.id);
                            }
                          }}
                          aria-hidden={isActive ? true : undefined}
                          className={`${isActive ? "absolute" : "relative"} z-20 inline-block whitespace-nowrap font-semibold`}
                          style={
                            isActive
                              ? {
                                  left: 12,
                                  top: 8,
                                  fontSize: `${activeCard.compactFontSize}px`,
                                  lineHeight: `${activeCard.compactLineHeight}px`,
                                }
                              : {
                                  left: "auto",
                                  top: "auto",
                                  fontSize: "inherit",
                                  lineHeight: "inherit",
                                }
                          }
                          animate={
                            isActive
                              ? {
                                  left: phraseGeometry.left,
                                  top: phraseGeometry.top,
                                  fontSize: `${
                                    usesExpandedGeometry
                                      ? activeCard.expandedFontSize
                                      : activeCard.compactFontSize
                                  }px`,
                                  lineHeight: `${
                                    usesExpandedGeometry
                                      ? activeCard.expandedLineHeight
                                      : activeCard.compactLineHeight
                                  }px`,
                                }
                              : undefined
                          }
                          transition={
                            isActive ? activeGeometryTransition : undefined
                          }
                        >
                          {quote.highlight}
                        </motion.span>

                        {isActive ? (
                          <div
                            key="expanded-content"
                            aria-hidden={!showsSupportingText}
                            className="absolute left-0 top-0 z-10 flex flex-col justify-start overflow-y-auto text-zinc-800"
                            style={{
                              width: activeCard.target.width,
                              height: activeCard.target.height,
                              padding: activeCard.notePadding,
                            }}
                          >
                            <blockquote
                              className="text-pretty font-serif font-normal text-foreground-light dark:text-dark-foreground-light"
                              style={{
                                fontSize: activeCard.expandedFontSize,
                                lineHeight: `${activeCard.expandedLineHeight}px`,
                              }}
                            >
                              <motion.span
                                className="inline"
                                initial={{ opacity: 0 }}
                                animate={{
                                  opacity: showsSupportingText ? 1 : 0,
                                }}
                                transition={{
                                  duration: slow(0.22),
                                  ease: "easeOut",
                                }}
                                onAnimationComplete={() => {
                                  if (activeCard.phase === "closing-content") {
                                    setActiveCard((current) =>
                                      current?.quoteId === quote.id &&
                                      current.phase === "closing-content"
                                        ? { ...current, phase: "closing" }
                                        : current,
                                    );
                                  }
                                }}
                              >
                                “{quote.before}
                              </motion.span>
                              <span
                                ref={phraseTargetRef}
                                aria-hidden="true"
                                className="invisible inline-block whitespace-nowrap font-semibold"
                              >
                                {quote.highlight}
                              </span>
                              <motion.span
                                className="inline"
                                initial={{ opacity: 0 }}
                                animate={{
                                  opacity: showsSupportingText ? 1 : 0,
                                }}
                                transition={{
                                  duration: slow(0.22),
                                  ease: "easeOut",
                                }}
                              >
                                {quote.after}”
                              </motion.span>
                            </blockquote>
                          </div>
                        ) : null}

                        {isActive ? (
                          <motion.button
                            ref={closeButtonRef}
                            type="button"
                            aria-label="Close quote"
                            onClick={(event) => {
                              event.stopPropagation();
                              closeQuote(event.detail === 0);
                            }}
                            className={`${showsSupportingText ? "pointer-events-auto" : "pointer-events-none"} absolute right-3 top-3 z-30 flex size-9 items-center justify-center transition-transform hover:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current`}
                            initial={false}
                            animate={{
                              opacity: showsSupportingText ? 1 : 0,
                              scale: showsSupportingText ? 1 : 0.8,
                            }}
                            transition={{
                              duration: slow(0.18),
                              ease: "easeOut",
                            }}
                          >
                            <XIcon size={18} weight="bold" />
                          </motion.button>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </Fragment>
                );
              };

              return (
                <section
                  key={theme.id}
                  aria-label={`${theme.label} theme`}
                  className="relative flex min-h-0 flex-col justify-between gap-3 p-2 md:p-3"
                >
                  <div className="flex min-h-12 items-start justify-between gap-2">
                    {topQuotes.map((quote) => renderQuoteTrigger(quote))}
                  </div>

                  <div
                    className={`pointer-events-none mx-auto max-w-[14ch] text-balance text-center font-serif text-[1.75rem] font-extrabold leading-[0.95] md:text-[2.25rem] ${tone.label} ${themeOffsets[themeIndex % themeOffsets.length]}`}
                  >
                    {theme.label}
                  </div>

                  <div className="flex min-h-12 items-end justify-around gap-2">
                    {bottomQuotes.map((quote) => renderQuoteTrigger(quote))}
                  </div>
                </section>
              );
            })}
          </div>

          {activeCard?.position === "absolute" ? (
            <motion.button
              type="button"
              aria-label="Close quote"
              onClick={() => closeQuote()}
              className="absolute inset-0 z-20 cursor-default bg-zinc-950/45 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  activeCard.phase === "closing-content" ||
                  activeCard.phase === "closing"
                    ? 0
                    : 1,
              }}
              transition={{ duration: slow(0.18), ease: "easeOut" }}
            />
          ) : null}
        </div>
      </HighlightCard>

      {activeMobileQuote && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="Close quote"
                onClick={() => closeQuote()}
                className="absolute inset-0 cursor-default bg-zinc-950/55 backdrop-blur-[1px]"
              />

              <div
                ref={mobileModalRef}
                role="dialog"
                aria-modal="true"
                aria-label={`“${activeMobileQuote.quote.before}${activeMobileQuote.quote.highlight}${activeMobileQuote.quote.after}” — ${activeMobileQuote.theme.label}`}
                onClick={() => closeQuote()}
                className={`${themeTones[activeMobileQuote.themeIndex % themeTones.length].note} relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-lg cursor-pointer flex-col justify-start overflow-y-auto overscroll-contain p-12 font-serif text-base leading-[1.375]`}
                style={{
                  width: "min(calc(100vw - 2rem), calc(100dvh - 2rem), 32rem)",
                  height: "min(calc(100vw - 2rem), calc(100dvh - 2rem), 32rem)",
                }}
              >
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close quote"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeQuote(event.detail === 0);
                  }}
                  className="absolute right-3 top-3 flex size-9 items-center justify-center transition-transform hover:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                >
                  <XIcon size={18} weight="bold" />
                </button>

                <blockquote className="text-pretty font-serif font-normal text-foreground-light dark:text-dark-foreground-light">
                  “{activeMobileQuote.quote.before}
                  <span className="font-semibold">
                    {activeMobileQuote.quote.highlight}
                  </span>
                  {activeMobileQuote.quote.after}”
                </blockquote>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
