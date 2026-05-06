"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
}

export default function HorizontalFilmstrip({
  body,
  cards,
  className = "",
  bodyClassName = "",
  cardClassName = "",
}: HorizontalFilmstripProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, isEnabled ? -travel : 0]);

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
      const viewportWidth = viewport.getBoundingClientRect().width;
      const trackWidth = track.scrollWidth;
      setTravel(Math.max(0, Math.ceil(trackWidth - viewportWidth)));
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
      style={{
        height: isEnabled
          ? travel > 0
            ? `calc(100svh + ${travel}px)`
            : "100svh"
          : undefined,
      }}
    >
      <div className="flex flex-col md:sticky md:top-24">
        <div className={`relative z-10 mb-8 ${bodyClassName}`}>{body}</div>
        <div className="relative mb-24 w-full md:h-[min(60svh,36rem)]">
          <div className="h-auto w-full overflow-visible md:absolute md:left-1/2 md:top-0 md:h-full md:w-[100vw] md:-translate-x-1/2 md:overflow-x-clip md:overflow-y-visible">
            <div className="h-auto w-full md:mx-auto md:h-full md:max-w-5xl md:px-6">
              <div
                ref={viewportRef}
                className="h-auto w-full md:relative md:h-full"
              >
                <motion.div
                  ref={trackRef}
                  style={{ x }}
                  className="flex h-auto w-full flex-col gap-6 md:absolute md:left-0 md:top-0 md:h-full md:w-max md:flex-row md:gap-8 md:will-change-transform"
                >
                  {cards.map((card, index) => (
                    <div
                      key={card.id ?? index}
                      className={`flex min-h-80 w-full shrink-0 flex-col rounded-[20px] border border-white bg-zinc-50 p-8 shadow dark:border-white/25 dark:bg-zinc-800 md:h-full md:min-h-0 md:w-[min(42vw,30rem)] ${cardClassName} ${card.className ?? ""}`}
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
    </div>
  );
}
