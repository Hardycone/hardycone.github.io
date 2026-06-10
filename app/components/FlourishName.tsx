"use client";
import { useAnimate, useInView } from "framer-motion";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

interface FlourishNameProps {
  name: string;
  bgColor: string;
  isActive: boolean;
  onToggle: () => void;
  onFlourish?: () => void;
  logoSrc?: string;
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
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(scope, {
    once: true,
    margin: "0px 0px -50% 0px",
  });

  const rgb = parseRgb(bgColor);
  const hoverBg = rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.20)` : bgColor;

  useEffect(() => {
    if (!hasTriggered.current && isInView) {
      hasTriggered.current = true;
      onFlourish?.();

      const el = scope.current;
      if (!el) return;
      const basePx = parseFloat(getComputedStyle(el).fontSize);
      const growPx = Math.round(basePx * 1.25);

      const doFlourish = async () => {
        await animate(
          el,
          { fontSize: `${growPx}px` },
          { duration: 0.3, ease: "easeOut" },
        );

        const buttonWidth = el.offsetWidth;
        const gradSize = Math.max(buttonWidth * 4, 200);
        const halfGrad = gradSize;

        el.style.backgroundImage = `radial-gradient(circle at center, ${gradientCenterColor} 0%, ${gradientMiddleColor} 40%, transparent 75%)`;
        el.style.backgroundSize = `${gradSize}px ${gradSize}px`;
        el.style.backgroundRepeat = "no-repeat";
        el.style.backgroundPosition = `-${halfGrad}px center`;

        await animate(
          el,
          { backgroundPosition: `${buttonWidth + halfGrad}px center` },
          { duration: 1.5, ease: "easeInOut" },
        );

        el.style.backgroundImage = "";
        el.style.backgroundSize = "";
        el.style.backgroundRepeat = "";
        el.style.backgroundPosition = "";

        await animate(
          el,
          { fontSize: `${basePx}px` },
          { duration: 0.6, ease: "easeInOut" },
        );
        el.style.fontSize = "";
      };
      doFlourish();
    }
  }, [
    isInView,
    animate,
    scope,
    bgColor,
    onFlourish,
    gradientCenterColor,
    gradientMiddleColor,
  ]);

  return (
    <button
      ref={scope}
      onClick={onToggle}
      type="button"
      className="inline-flex translate-y-[0.4em] cursor-pointer items-center gap-[0.15em] rounded-[0.25em] px-[0.15em] py-[0.15em] font-bold transition-colors duration-150"
      style={{ backgroundColor: isHovered ? hoverBg : bgColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {logoSrc && (
        <img
          src={logoSrc}
          alt=""
          className="inline-block h-[1.5em] w-[1.5em] shrink-0 object-cover"
        />
      )}
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
