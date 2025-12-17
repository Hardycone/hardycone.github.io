"use client";

import { createContext, useContext, useEffect, useState } from "react";

//Define shadow styles based on cursor position
//Define text and background color classes based on active project and theme

//Define light color based on active project and theme, unused at the moment

interface LightingContextValue {
  a: number;
  b: number;
}

const LightingContext = createContext<LightingContextValue>({
  a: -6,
  b: -6,
});

export const LightingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [a, setA] = useState(-6);
  const [b, setB] = useState(-6);

  useEffect(() => {
    const clamp = (val: number, min: number, max: number) =>
      Math.max(min, Math.min(max, val));

    let lastCall = 0;
    const throttleDelay = 100; //100ms per update = 10fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastCall < throttleDelay) return;
      lastCall = now;

      const xFromCenter = e.clientX - window.innerWidth / 2;
      const yFromCenter = e.clientY - window.innerHeight / 2;

      const newA = clamp(xFromCenter / 50, -6, 6);
      const newB = clamp(yFromCenter / 50, -6, 6);

      setA(newA);
      setB(newB);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <LightingContext.Provider
        value={{
          a: -6,
          b: -6,
        }}
      >
        {children}
      </LightingContext.Provider>
    );
  }

  return (
    <LightingContext.Provider value={{ a, b }}>
      {children}
    </LightingContext.Provider>
  );
};

export const useLighting = () => useContext(LightingContext);

export function getShadows(a: number, b: number, theme: "light" | "dark") {
  if (theme === "light") {
    return {
      topBar: `${-a * 1.5}px ${-b * 1.5}px 16px 0px rgba(0, 0, 0, 0.2)`,
      glyph: `${a / 3}px ${b / 3}px 4px 0px rgba(255,255,255,0.7),
              ${a / 2}px ${b / 2}px 2px 0px rgba(255,255,255,1),
              ${-a / 2}px ${-b / 2}px 2px 0px rgba(0, 0, 0, 0.1)`,
      baseCard: `${a}px ${b}px 4px 0px rgba(255,255,255,1),
                 ${-a}px ${-b}px 8px 0px rgba(0, 0, 0, 0.2)`,
      hoverCard: `${a}px ${b}px 4px 0px rgba(255,255,255,1),
                  ${-1.5 * a}px ${-1.5 * b}px 8px 0px rgba(0, 0, 0, 0.2),
                  inset ${2 * a}px ${2 * b}px 8px 0px rgba(255,255,255,1)`,
      baseButton: `inset ${-a}px ${-b}px 4px rgba(0, 0, 0, 0.1), 
                   inset ${a}px ${b}px 4px rgba(255,255,255,1)`,
      hoverButton: `inset ${-2 * a}px ${-2 * b}px 4px rgba(0, 0, 0, 0.1), 
                    inset ${2 * a}px ${2 * b}px 4px rgba(255,255,255,1)`,
      content: `${-a / 4}px ${-b / 4}px 4px 0px rgba(0, 0, 0, 0.3)`,
    };
  } else {
    return {
      topBar: `${-a * 1.5}px ${-b * 1.5}px 16px 0px rgba(0, 0, 0, 1),
              inset ${-a / 4}px ${-b / 4}px 2px 0px rgba(255,255,255,0.4)`,
      glyph: `${-a / 2}px ${-b / 2}px 4px 0px rgba(0, 0, 0, 1),
              inset ${-a / 4}px ${-b / 4}px 1px 0px rgba(255,255,255,0.4)`,
      baseCard: `${-a}px ${-b}px 8px 0px rgba(0, 0, 0, 1), 
                 inset ${-a / 2}px ${-b / 2}px 4px 0px rgba(255,255,255,0.2)`,
      hoverCard: `${-a}px ${-b}px 8px 0px rgba(0, 0, 0, 1), 
                  inset ${-a / 2}px ${-b / 2}px 4px 0px rgba(255,255,255,0.4)`,
      baseButton: `inset ${-a / 2}px ${-b / 2}px 4px rgba(0, 0, 0, 1), 
                   inset ${a / 2}px ${b / 2}px 4px rgba(255,255,255,0.4)`,
      hoverButton: `inset ${-a}px ${-b}px 4px rgba(0, 0, 0, 1), 
                    inset ${a}px ${b}px 4px rgba(255,255,255,0.4)`,
      content: `${-a / 4}px ${-b / 4}px 4px 0px rgba(0, 0, 0, 1),
              inset ${-a / 4}px ${-b / 4}px 2px 0px rgba(255,255,255,0.4)`,
    };
  }
}
