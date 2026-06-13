"use client";
import { useAnimate, useInView } from "framer-motion";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

let activeFlourishOwner: symbol | null = null;
let arbitrationFrame: number | null = null;
let allowHandoffOnRelease = false;

const flourishPriority = [
  "Flux",
  "Fantail",
  "ASLF, Inc.",
  "Master's in HCI at UW",
  "Master's in Landscape Architecture at SUNY-ESF",
];

interface FlourishCandidate {
  owner: symbol;
  name: string;
  canStart: () => boolean;
  start: () => boolean;
}

const flourishCandidates = new Map<symbol, FlourishCandidate>();

function candidatePriority(candidate: FlourishCandidate) {
  const index = flourishPriority.indexOf(candidate.name);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function runArbitration(isHandoff: boolean) {
  arbitrationFrame = null;
  if (activeFlourishOwner !== null) return;

  const candidates = Array.from(flourishCandidates.values()).sort(
    (a, b) => candidatePriority(a) - candidatePriority(b),
  );

  for (const candidate of candidates) {
    if (!candidate.canStart()) {
      flourishCandidates.delete(candidate.owner);
      continue;
    }

    activeFlourishOwner = candidate.owner;
    flourishCandidates.delete(candidate.owner);

    if (candidate.start()) {
      allowHandoffOnRelease = !isHandoff;
      return;
    }

    activeFlourishOwner = null;
  }

  flourishCandidates.clear();
}

function scheduleArbitration(isHandoff = false) {
  if (arbitrationFrame !== null) return;

  arbitrationFrame = window.requestAnimationFrame(() => {
    runArbitration(isHandoff);
  });
}

function registerCandidate(candidate: FlourishCandidate) {
  flourishCandidates.set(candidate.owner, candidate);

  // A genuinely new intersection during an active flourish earns one fresh
  // handoff when that flourish finishes.
  if (activeFlourishOwner !== null) {
    allowHandoffOnRelease = true;
  }

  scheduleArbitration();
}

function unregisterCandidate(owner: symbol) {
  flourishCandidates.delete(owner);
}

function releaseFlourish(owner: symbol) {
  if (activeFlourishOwner !== owner) return;

  activeFlourishOwner = null;

  if (allowHandoffOnRelease) {
    allowHandoffOnRelease = false;
    scheduleArbitration(true);
  } else {
    flourishCandidates.clear();
  }
}

function isInFlourishZone(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.4 && rect.bottom > 0;
}

interface FlourishNameProps {
  name: string;
  bgColor: string;
  isActive: boolean;
  onToggle: () => void;
  onFlourish?: () => void;
  logoSrc?: string | { light: string; dark: string };
  gradientCenterColor?: string;
  gradientMiddleColor?: string;
}
function parseRgb(rgba: string) {
  const m = rgba.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  return null;
}
export default function FlourishName({
  name,
  bgColor,
  isActive,
  onToggle,
  onFlourish,
  logoSrc,
  gradientCenterColor = "#ef4444",
  gradientMiddleColor = "#a855f7",
}: FlourishNameProps) {
  const [scope, animate] = useAnimate();
  const hasTriggered = useRef(false);
  const attemptedThisIntersection = useRef(false);
  const flourishOwner = useRef(Symbol(name));
  const flourishConfig = useRef({
    onFlourish,
    gradientCenterColor,
    gradientMiddleColor,
  });
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(scope, {
    margin: "0px 0px -60% 0px",
  });

  const rgb = parseRgb(bgColor);
  const hoverBg = rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.30)` : bgColor;

  useEffect(() => {
    flourishConfig.current = {
      onFlourish,
      gradientCenterColor,
      gradientMiddleColor,
    };
  }, [onFlourish, gradientCenterColor, gradientMiddleColor]);

  useEffect(() => {
    const owner = flourishOwner.current;

    return () => {
      unregisterCandidate(owner);

      if (activeFlourishOwner === owner) {
        activeFlourishOwner = null;
        allowHandoffOnRelease = false;
        flourishCandidates.clear();
      }
    };
  }, []);

  useEffect(() => {
    const owner = flourishOwner.current;

    if (!isInView) {
      attemptedThisIntersection.current = false;
      unregisterCandidate(owner);
      return;
    }

    if (hasTriggered.current || attemptedThisIntersection.current) return;
    attemptedThisIntersection.current = true;

    const canStart = () => {
      const el2 = scope.current;
      return Boolean(el2 && !hasTriggered.current && isInFlourishZone(el2));
    };

    const startFlourish = () => {
      const el2 = scope.current;
      if (!el2 || !canStart()) return false;

      hasTriggered.current = true;

      const flourish = async () => {
        try {
          const config = flourishConfig.current;
          config.onFlourish?.();

          const basePx = parseFloat(getComputedStyle(el2).fontSize);
          const growPx = Math.round(basePx * 1.1);

          await animate(
            el2,
            { fontSize: `${growPx}px` },
            { duration: 0.3, ease: "easeOut" },
          );

          const buttonWidth = el2.offsetWidth;
          const gradSize = buttonWidth * 8;

          el2.style.backgroundImage = `radial-gradient(circle at center, ${config.gradientCenterColor} 0%, ${config.gradientMiddleColor} 15%, transparent 50%)`;
          el2.style.backgroundSize = `${gradSize}px ${gradSize}px`;
          el2.style.backgroundRepeat = "no-repeat";
          el2.style.backgroundPosition = `-${gradSize}px center`;

          await animate(
            el2,
            { backgroundPosition: `${buttonWidth}px center` },
            { duration: 1, ease: "easeOut" },
          );

          el2.style.backgroundImage = "";
          el2.style.backgroundSize = "";
          el2.style.backgroundRepeat = "";
          el2.style.backgroundPosition = "";

          await animate(
            el2,
            { fontSize: `${basePx}px` },
            { duration: 0.3, ease: "easeInOut" },
          );
          el2.style.fontSize = "";
        } finally {
          releaseFlourish(owner);
        }
      };

      void flourish();
      return true;
    };

    registerCandidate({
      owner,
      name,
      canStart,
      start: startFlourish,
    });

    return () => {
      unregisterCandidate(owner);
    };
  }, [isInView, animate, name, scope]);

  return (
    <button
      tabIndex={0}
      ref={scope}
      onClick={onToggle}
      type="button"
      className="inline-flex translate-y-[0.4em] cursor-pointer items-center gap-[0.15em] rounded-[0.25em] px-[0.15em] py-[0.15em] font-bold transition-colors duration-150"
      style={{ backgroundColor: isHovered ? hoverBg : bgColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {logoSrc &&
        (typeof logoSrc === "string" ? (
          <img
            src={logoSrc}
            alt=""
            className="inline-block h-[1.5em] w-[1.5em] shrink-0 object-cover"
          />
        ) : (
          <>
            <img
              src={logoSrc.light}
              alt=""
              className="block h-[1.5em] w-[1.5em] shrink-0 object-cover dark:hidden"
            />
            <img
              src={logoSrc.dark}
              alt=""
              className="hidden h-[1.5em] w-[1.5em] shrink-0 object-cover dark:block"
            />
          </>
        ))}
      {name}
      <span
        className="flex h-[1.5em] w-[1.5em] items-center justify-center"
        style={{
          transition: "transform 0.2s",
          transform: `rotate(${isActive ? 180 : 0}deg)`,
        }}
      >
        <CaretDownIcon size="0.8em" weight="fill" />
      </span>
    </button>
  );
}
