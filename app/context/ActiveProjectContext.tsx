"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";

function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

interface ActiveProjectContextType {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  previousIndex?: number;
}

const ActiveProjectContext = createContext<ActiveProjectContextType | null>(
  null
);

function usePreviousIndex<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function ActiveProjectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const previousIndex = usePreviousIndex(activeIndex);
  return (
    <ActiveProjectContext.Provider
      value={{ activeIndex, setActiveIndex, previousIndex }}
    >
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
