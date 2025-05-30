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
  transitioningToNext: boolean;
  setTransitioningToNext: (value: boolean) => void;
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

const STORAGE_KEY = "activeProjectIndex";

export function ActiveProjectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize activeIndex from localStorage if available & valid, else 0
  const [activeIndex, setActiveIndex] = useState(() => {
    if (typeof window === "undefined") return 0; // SSR guard

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < projects.length) {
        return parsed;
      }
    }
    return 0;
  });

  const previousIndex = usePreviousIndex(activeIndex);
  const pathname = usePathname();

  const [transitioningToNext, setTransitioningToNext] = useState(false);
  useEffect(() => {
    console.log("transitioningToNext changed:", transitioningToNext);
  }, [transitioningToNext]);
  // Sync activeIndex with current URL slug on case-study pages
  useEffect(() => {
    if (!pathname) return;

    const slug = pathname.split("/")[1]; // because it's /[slug]

    const newIndex = projects.findIndex((project) => project.slug === slug);

    // If we're on a case-study page (slug found), update activeIndex
    if (newIndex !== -1 && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
    // If on home "/" path, do NOT reset activeIndex — keep last selected index
  }, [pathname, activeIndex]);

  // Persist activeIndex changes to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, activeIndex.toString());
  }, [activeIndex]);

  return (
    <ActiveProjectContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        previousIndex,
        transitioningToNext,
        setTransitioningToNext,
      }}
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
