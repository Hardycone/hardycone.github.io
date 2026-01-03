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
        <span className="text-gray-400">W:</span>
        <span>{size.w}px</span>
        <span className="mx-1 text-gray-500">|</span>
        <span className="text-gray-400">H:</span>
        <span>{size.h}px</span>
      </div>
    </div>
  );
}
