"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface LightingContextType {
  a: number;
  b: number;
}

const LightingContext = createContext<LightingContextType>({
  a: 0,
  b: 0,
});

export const LightingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [a, setA] = useState(-4);
  const [b, setB] = useState(-4);
  useEffect(() => {
    const clamp = (val: number, min: number, max: number) =>
      Math.max(min, Math.min(max, val));

    let lastCall = 0;
    const throttleDelay = 100; // in ms, so 10fps = 100ms per update

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastCall < throttleDelay) return;
      lastCall = now;

      const xFromCenter = e.clientX - window.innerWidth / 2;
      const yFromCenter = e.clientY - window.innerHeight / 2;

      const newA = clamp(xFromCenter / 100, -4, 4);
      const newB = clamp(yFromCenter / 50, -4, 4);

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
      <LightingContext.Provider value={{ a: -4, b: -4 }}>
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
