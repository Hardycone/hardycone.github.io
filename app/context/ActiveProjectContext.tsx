"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import projects from "@/data/projects";

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
  const pathname = usePathname();

  // 🔁 Sync index with current URL slug
  useEffect(() => {
    if (!pathname) return;

    const slug = pathname.split("/")[1]; // because it's /[slug]
    const newIndex = projects.findIndex((project) => project.slug === slug);

    if (newIndex !== -1 && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [pathname, activeIndex]);

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
  if (!context) {
    throw new Error(
      "useActiveProject must be used within ActiveProjectProvider"
    );
  }
  return context;
}

export { wrapIndex };
