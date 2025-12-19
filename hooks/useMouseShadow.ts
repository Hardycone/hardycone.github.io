import { useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";

export function useMouseShadow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth physics (Spring) prevents jittering and feels premium
  const smoothX = useSpring(x, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Calculate raw values based on screen center
      const rawX = (e.clientX - window.innerWidth / 2) / 50;
      const rawY = (e.clientY - window.innerHeight / 2) / 50;

      // 2. Clamp between -6 and 6 (Prevents shadow from flying off too far)
      const clampedX = Math.max(-6, Math.min(6, rawX));
      const clampedY = Math.max(-6, Math.min(6, rawY));

      // 3. Update MotionValues (Does NOT trigger React re-render)
      x.set(clampedX);
      y.set(clampedY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  // --- Create Shadow Strings ---
  // These update automatically when smoothX/smoothY change.

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
      ${-latestX * 1.5}px ${-latestY * 1.5}px 16px 0px rgba(0, 0, 0, 0.2)
    `,
  );

  const barDarkShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      ${-latestX * 1.5}px ${-latestY * 1.5}px 16px 0px rgba(0, 0, 0, 1), 
      inset ${-latestX / 4}px ${-latestY / 4}px 2px 0px rgba(255,255,255,0.4)
    `,
  );

  const glyphLightShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      ${latestX / 3}px ${latestY / 3}px 4px 0px rgba(255,255,255,0.7),
      ${latestX / 2}px ${latestY / 2}px 2px 0px rgba(255,255,255,1),
      ${-latestX / 2}px ${-latestY / 2}px 2px 0px rgba(0, 0, 0, 0.1)
    `,
  );

  const glyphDarkShadow = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => `
      ${-latestX / 2}px ${-latestY / 2}px 4px 0px rgba(0, 0, 0, 1),
      inset ${-latestX / 4}px ${-latestY / 4}px 1px 0px rgba(255,255,255,0.1)
    `,
  );

  return {
    cardLightShadow,
    cardDarkShadow,
    cardHoverLightShadow,
    cardHoverDarkShadow,
    barLightShadow,
    barDarkShadow,
    glyphLightShadow,
    glyphDarkShadow,
  };
}
