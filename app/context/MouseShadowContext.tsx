"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useMotionValue, useTransform } from "framer-motion";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import projects from "@/data/projects";
import { useProjectTheme } from "@/hooks/useProjectTheme";

function useCursorEffectValues() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cursorAngle = useMotionValue(135);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - window.innerWidth / 2;
      const deltaY = event.clientY - window.innerHeight / 2;
      const rawX = deltaX / 50;
      const rawY = deltaY / 50;

      x.set(Math.max(-6, Math.min(6, rawX)));
      y.set(Math.max(-6, Math.min(6, rawY)));

      // CSS conic-gradient angles start at 12 o'clock and increase clockwise.
      // At dead center there is no direction, so retain the latest valid angle.
      if (deltaX !== 0 || deltaY !== 0) {
        cursorAngle.set(Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorAngle, x, y]);

  const { activeIndex } = useActiveProject();
  const theme = useProjectTheme(projects[activeIndex].id);

  const cardLightShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      ${latestX}px ${latestY}px 4px 0px rgba(255,255,255,1),
      ${-latestX}px ${-latestY}px 8px 0px rgba(0, 0, 0, 0.2)
    `,
  );

  const cardDarkShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      ${-latestX}px ${-latestY}px 8px 0px rgba(0, 0, 0, 1),
      inset ${-latestX / 4}px ${-latestY / 4}px 4px 0px rgba(255,255,255,0.1)
    `,
  );

  const cardLightSmallShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
       inset ${latestX / 2}px ${latestY / 2}px 8px 0px rgba(0, 0, 0, 0.1),
       inset ${-latestX / 2}px ${-latestY / 2}px 4px 0px rgba(255, 255, 255, 1)

    `,
  );

  const cardDarkSmallShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      inset ${-latestX / 3}px ${-latestY / 3}px 4px 0px rgba(255, 255, 255, 0.2),
      inset ${latestX / 3}px ${latestY / 3}px 4px 0px rgba(0,0,0,1)
    `,
  );

  const cardHoverLightShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      inset ${latestX / 2}px ${latestY / 2}px 24px 8px ${theme.hex.primary}12
    `,
  );

  const cardHoverDarkShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      inset ${-latestX / 4}px ${-latestY / 4}px 16px 0px rgba(255,255,255,0.25)
    `,
  );

  const barLightShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      ${-latestX * 1.5}px ${-latestY * 1.5}px 16px rgba(0, 0, 0, 0.2)
    `,
  );

  const barDarkShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      ${-latestX * 1.5}px ${-latestY * 1.5}px 16px rgba(0, 0, 0, 1),
      inset ${-latestX / 4}px ${-latestY / 4}px 2px rgba(255,255,255,0.4)
    `,
  );

  const glyphLightShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      ${latestX / 3}px ${latestY / 3}px 4px 0px rgba(255,255,255,1),
      ${-latestX / 2}px ${-latestY / 2}px 4px 0px rgba(0, 0, 0, 0.2)
    `,
  );

  const glyphDarkShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      ${-latestX / 2}px ${-latestY / 2}px 4px 0px rgba(0, 0, 0, 1),
      inset ${-latestX / 4}px ${-latestY / 4}px 1px 0px rgba(255,255,255,0.1)
    `,
  );

  const buttonLightShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      inset ${latestX / 4}px ${latestY / 4}px 4px rgba(0,0,0,0.2),
      inset ${-latestX / 4}px ${-latestY / 4}px 4px rgba(255,255,255,1)
    `,
  );

  const buttonDarkShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      inset ${-latestX / 4}px ${-latestY / 4}px 2px rgba(255,255,255,0.4)
    `,
  );

  const frameLightShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      inset ${-latestX / 4}px ${-latestY / 4}px 2px rgba(255,255,255,0.6)
    `,
  );

  const frameDarkShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      inset ${-latestX / 4}px ${-latestY / 4}px 2px rgba(255,255,255,0.1)
    `,
  );

  return {
    cursorAngle,
    cardLightShadow,
    cardDarkShadow,
    cardLightSmallShadow,
    cardDarkSmallShadow,
    cardHoverLightShadow,
    cardHoverDarkShadow,
    barLightShadow,
    barDarkShadow,
    glyphLightShadow,
    glyphDarkShadow,
    buttonLightShadow,
    buttonDarkShadow,
    frameLightShadow,
    frameDarkShadow,
  };
}

type CursorEffectsContextValue = ReturnType<typeof useCursorEffectValues>;

const CursorEffectsContext = createContext<CursorEffectsContextValue | null>(
  null,
);

export function CursorEffectsProvider({ children }: { children: ReactNode }) {
  const cursorEffects = useCursorEffectValues();

  return (
    <CursorEffectsContext.Provider value={cursorEffects}>
      {children}
    </CursorEffectsContext.Provider>
  );
}

export function useCursorEffects() {
  const cursorEffects = useContext(CursorEffectsContext);

  if (!cursorEffects) {
    throw new Error(
      "useCursorEffects must be used within CursorEffectsProvider",
    );
  }

  return cursorEffects;
}

// Preserve the focused shadow API while existing consumers migrate to the
// broader cursor-effects terminology.
export const MouseShadowProvider = CursorEffectsProvider;
export const useMouseShadow = useCursorEffects;
