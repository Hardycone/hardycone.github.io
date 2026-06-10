"use client";
import { useAnimate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface FlourishNameProps {
  name: string;
  settleColor: string;
  isActive: boolean;
  onToggle: () => void;
  onFlourish?: () => void;
}

export default function FlourishName({
  name,
  settleColor,
  isActive,
  onToggle,
  onFlourish,
}: FlourishNameProps) {
  const [scope, animate] = useAnimate();
  const hasTriggered = useRef(false);
  const isInView = useInView(scope, {
    once: true,
    margin: "0px 0px -50% 0px",
  });

  useEffect(() => {
    if (!hasTriggered.current && isInView) {
      hasTriggered.current = true;
      onFlourish?.();

      const el = scope.current;
      if (!el) return;
      const basePx = parseFloat(getComputedStyle(el).fontSize);
      const growPx = Math.round(basePx * 1.2);

      const doFlourish = async () => {
        await animate(
          el,
          { fontSize: `${growPx}px` },
          { duration: 0.3, ease: "easeOut" },
        );
        const rainbow = [
          "#ff0000",
          "#ff8800",
          "#ffff00",
          "#00cc00",
          "#0088ff",
          "#8800ff",
        ];
        for (const c of rainbow) {
          await animate(el, { color: c }, { duration: 0.35 });
        }
        await animate(
          el,
          { fontSize: `${basePx}px`, color: settleColor },
          { duration: 0.6, ease: "easeInOut" },
        );
      };
      doFlourish();
    }
  }, [isInView, animate, scope, settleColor, onFlourish]);

  return (
    <span
      ref={scope}
      onClick={onToggle}
      className="cursor-pointer font-semibold decoration-dotted underline-offset-2 hover:underline"
      style={{ color: isActive ? settleColor : undefined }}
    >
      {name}
    </span>
  );
}
