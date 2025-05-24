"use client";

import { createContext, useContext, useState } from "react";

function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

const ActiveProjectContext = createContext<{
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);

export function ActiveProjectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <ActiveProjectContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </ActiveProjectContext.Provider>
  );
}

export function useActiveProject() {
  const context = useContext(ActiveProjectContext);
  if (!context)
    throw new Error(
      "useActiveProject must be used within ActiveProjectProvider"
    );
  return context;
}

export { wrapIndex };
