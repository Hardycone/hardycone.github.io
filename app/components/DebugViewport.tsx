"use client";

import { useState, useEffect } from "react";

export default function DebugViewport() {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    };

    // Set initial size
    updateSize();

    // Listen for resize
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Avoid hydration mismatch by waiting for mount
  if (size.w === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] font-mono text-xs font-bold text-white">
      <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/80 px-3 py-2 shadow-lg backdrop-blur-md">
        <span className="z-50 tall:hidden wide:hidden">Normal</span>
        <span className="z-50 hidden wide:block superwide:hidden">Wide</span>
        <span className="extremelywide:hidden z-50 hidden superwide:block">
          Super Wide
        </span>
        <span className="extremelywide:block z-50 hidden">Extremely Wide</span>
        <span className="z-50 hidden tall:block supertall:hidden">Tall</span>
        <span className="z-50 hidden supertall:block">Super Tall</span>
        <span className="top-6 sm:hidden">Normal</span>
        <span className="top-6 hidden sm:block md:hidden">sm</span>
        <span className="top-6 hidden md:block lg:hidden">md</span>
        <span className="top-6 hidden lg:block xl:hidden">lg</span>
        <span className="top-6 hidden xl:block 2xl:hidden">xl</span>
        <span className="top-6 hidden 2xl:block">2xl</span>{" "}
        <span className="text-gray-400">W:</span>
        <span>{size.w}px</span>
        <span className="mx-1 text-gray-500">|</span>
        <span className="text-gray-400">H:</span>
        <span>{size.h}px</span>
      </div>
    </div>
  );
}
