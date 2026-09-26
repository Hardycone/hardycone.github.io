"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, useMotionValue, useReducedMotion } from "framer-motion";

type PaperPhase =
  | "flattening"
  | "positioning"
  | "opening"
  | "open"
  | "closing-content"
  | "closing"
  | "recurling"
  | null;

interface StickyPaperSurfaceProps {
  id: string;
  faceClassName: string;
  undersideClassName: string;
  phase: PaperPhase;
  onFlattenComplete?: () => void;
  onRecurlComplete?: () => void;
}

const COMPACT_CURL_MULTIPLIER = 1.5;

function paperPaths(width: number, height: number, curlProgress: number) {
  // sticky-02.svg uses an 800px square. Scale its lower-left geometry uniformly
  // so both notes retain the same shape, with a more legible compact curl.
  const compactness = Math.max(0, Math.min(1, (128 - height) / 80));
  const compactCurlBoost =
    1 + compactness * (COMPACT_CURL_MULTIPLIER - 1);
  const scale =
    (Math.min(width, height) / 800) * compactCurlBoost * curlProgress;
  const x = (sourceX: number) => sourceX * scale;
  const y = (sourceY: number) => height - (800 - sourceY) * scale;
  const foldStart = `${x(18.05)} ${y(618.05)}`;
  const foldEnd = `${x(181.95)} ${y(781.95)}`;
  const tip = `${x(150.76)} ${y(649.24)}`;

  return {
    face: `M ${width} ${height} V 0 H 0 V ${y(534.47)}
      C 0 ${y(580.26)}, ${x(7.05)} ${y(607.05)}, ${foldStart}
      L ${foldEnd}
      C ${x(192.95)} ${y(792.95)}, ${x(219.74)} ${height}, ${x(265.53)} ${height}
      H ${width} Z`,
    underside: `M ${foldStart}
      C ${x(42.99)} ${y(642.99)}, ${tip}, ${tip}
      C ${tip}, ${x(157)} ${y(757.01)}, ${foldEnd}
      L ${foldStart} Z`,
  };
}

export default function StickyPaperSurface({
  id,
  faceClassName,
  undersideClassName,
  phase,
  onFlattenComplete,
  onRecurlComplete,
}: StickyPaperSurfaceProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const faceRef = useRef<SVGPathElement>(null);
  const sheenRef = useRef<SVGPathElement>(null);
  const undersideRef = useRef<SVGPathElement>(null);
  const curlHitSvgRef = useRef<SVGSVGElement>(null);
  const curlHitRef = useRef<SVGPathElement>(null);
  const onFlattenCompleteRef = useRef(onFlattenComplete);
  const onRecurlCompleteRef = useRef(onRecurlComplete);
  const curlProgress = useMotionValue(1);
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [curlHovered, setCurlHovered] = useState(false);

  onFlattenCompleteRef.current = onFlattenComplete;
  onRecurlCompleteRef.current = onRecurlComplete;

  useEffect(() => {
    const card = svgRef.current?.parentElement;
    if (!card) return;

    const enter = (event: PointerEvent) => {
      if (
        window.matchMedia("(min-width: 768px)").matches &&
        (event.pointerType === "mouse" || event.pointerType === "pen")
      ) {
        setHovered(true);
      }
    };
    const leave = () => setHovered(false);

    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
    };
  }, []);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const draw = () => {
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      if (!width || !height) return;

      const paths = paperPaths(width, height, curlProgress.get());
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      curlHitSvgRef.current?.setAttribute("viewBox", `0 0 ${width} ${height}`);
      faceRef.current?.setAttribute("d", paths.face);
      sheenRef.current?.setAttribute("d", paths.face);
      undersideRef.current?.setAttribute("d", paths.underside);
      // Keep the hover area at the fully curled shape so it doesn't move out
      // from under the pointer as the visible curl flattens.
      curlHitRef.current?.setAttribute(
        "d",
        paperPaths(width, height, 1).underside,
      );
    };

    const observer = new ResizeObserver(draw);
    observer.observe(svg);
    const unsubscribe = curlProgress.on("change", draw);
    draw();

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [curlProgress]);

  useEffect(() => {
    const recurling = phase === "recurling";
    const target =
      (phase === "open" && !curlHovered) || recurling || (!phase && !hovered)
        ? 1
        : 0;
    const flattening = phase === "flattening";

    if (reduceMotion || Math.abs(curlProgress.get() - target) < 0.001) {
      curlProgress.set(target);
      if (!flattening && !recurling) return;

      const frame = requestAnimationFrame(() => {
        if (flattening) onFlattenCompleteRef.current?.();
        if (recurling) onRecurlCompleteRef.current?.();
      });
      return () => cancelAnimationFrame(frame);
    }

    const animation = animate(curlProgress, target, {
      duration: reduceMotion ? 0 : target === 0 ? 0.2 : 0.28,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        if (flattening) onFlattenCompleteRef.current?.();
        if (recurling) onRecurlCompleteRef.current?.();
      },
    });
    return () => animation.stop();
  }, [phase, hovered, curlHovered, curlProgress, reduceMotion]);

  return (
    <>
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 block h-full w-full overflow-visible drop-shadow-sm"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`paper-sheen-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.12" />
            <stop offset="0.65" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="black" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path ref={faceRef} className={faceClassName} />
        <path ref={sheenRef} fill={`url(#paper-sheen-${id})`} />
        <path ref={undersideRef} className={undersideClassName} />
      </svg>
      <svg
        ref={curlHitSvgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 block h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <path
          ref={curlHitRef}
          fill="transparent"
          style={{ pointerEvents: phase === "open" ? "all" : "none" }}
          onPointerEnter={(event) => {
            if (
              (event.pointerType === "mouse" || event.pointerType === "pen") &&
              window.matchMedia("(min-width: 768px) and (hover: hover)").matches
            ) {
              setCurlHovered(true);
            }
          }}
          onPointerLeave={() => setCurlHovered(false)}
        />
      </svg>
    </>
  );
}
