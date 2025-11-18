"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface LightingContextValue {
  a: number;
  b: number;
  getTextColorClass: (theme: string, colorKey: string) => string;
  getBgColorClass: (theme: string, colorKey: string) => string;
  getLightColor: (theme: string, colorKey: string) => string;
}

const LightingContext = createContext<LightingContextValue>({
  a: -6,
  b: -6,
  getTextColorClass: () => "",
  getBgColorClass: () => "",
  getLightColor: () => "",
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

  const getTextColorClass = (theme: string, colorKey: string) => {
    const map: Record<string, Record<string, string>> = {
      light: {
        intro: "text-intro",
        flux: "text-flux",
        fantail: "text-fantail",
        suits: "text-suits",
        wolcott: "text-wolcott",
        chinatown: "text-chinatown",
      },
      dark: {
        intro: "dark:text-dark-intro",
        flux: "dark:text-dark-flux",
        fantail: "dark:text-dark-fantail",
        suits: "dark:text-dark-suits",
        wolcott: "dark:text-dark-wolcott",
        chinatown: "dark:text-dark-chinatown",
      },
    };

    return map[theme === "dark" ? "dark" : "light"][colorKey] || "";
  };

  const getBgColorClass = (theme: string, colorKey: string) => {
    const map: Record<string, Record<string, string>> = {
      light: {
        introBackground: "bg-introBackground",
        fluxBackground: "bg-fluxBackground",
        fantailBackground: "bg-fantailBackground",
        suitsBackground: "bg-suitsBackground",
        wolcottBackground: "bg-wolcottBackground",
        chinatownBackground: "bg-chinatownBackground",
      },
      dark: {
        introBackground: "dark:bg-dark-introBackground",
        fluxBackground: "dark:bg-dark-fluxBackground",
        fantailBackground: "dark:bg-dark-fantailBackground",
        suitsBackground: "dark:bg-dark-suitsBackground",
        wolcottBackground: "dark:bg-dark-wolcottBackground",
        chinatownBackground: "dark:bg-dark-chinatownBackground",
      },
    };

    return map[theme === "dark" ? "dark" : "light"][colorKey] || "";
  };

  const getLightColor = (theme: string, colorKey: string): string => {
    const map: Record<string, Record<string, string>> = {
      light: {
        intro: "rgba(255, 255, 255, 1)",
        flux: "rgba(255, 255, 255, 1)",
        fantail: "rgba(255, 255, 255, 1)",
        suits: "rgba(255, 255, 255, 1)",
        wolcott: "rgba(255, 255, 255, 1)",
        chinatown: "rgba(255, 255, 255, 1)",
      },
      dark: {
        intro: "rgba(255, 255, 255, 0.4)",
        flux: "rgba(255, 255, 255, 0.1)",
        fantail: "rgba(255, 255, 255, 0.1)",
        suits: "rgba(255, 255, 255, 0.1)",
        wolcott: "rgba(255, 255, 255, 0.1)",
        chinatown: "rgba(255, 255, 255, 0.1)",
      },
    };

    return (
      map[theme === "dark" ? "dark" : "light"][colorKey] || "rgba(0,0,0,0.1)"
    );
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <LightingContext.Provider
        value={{
          a: -6,
          b: -6,
          getTextColorClass,
          getBgColorClass,
          getLightColor,
        }}
      >
        {children}
      </LightingContext.Provider>
    );
  }

  return (
    <LightingContext.Provider
      value={{ a, b, getTextColorClass, getBgColorClass, getLightColor }}
    >
      {children}
    </LightingContext.Provider>
  );
};

export const useLighting = () => useContext(LightingContext);

export function getShadows(
  a: number,
  b: number,
  lightColor: string,
  theme: "light" | "dark",
) {
  if (theme === "light") {
    return {
      topBar: `${-a * 2}px ${-b * 2}px 16px 0px rgba(0, 0, 0, 0.3)`,
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
      topBar: `${-a * 2}px ${-b * 2}px 16px 0px rgba(0, 0, 0, 1),
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
