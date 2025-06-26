"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import projects from "@/data/projects";

// Assuming projects is like:
// const projects = [
//   { slug: "flux", bgColor: "bg-flux" },
//   { slug: "suits", bgColor: "bg-suits" },
//   ...
// ];

function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

interface ActiveProjectContextType {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  previousIndex?: number;
  transitioningToNext: boolean;
  setTransitioningToNext: (value: boolean) => void;
  activeColor: string; // Added: current project's color class
}

const ActiveProjectContext = createContext<ActiveProjectContextType | null>(
  null,
);

function usePreviousIndex<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const STORAGE_KEY = "activeProjectIndex";

export function ActiveProjectProvider({ children }: { children: ReactNode }) {
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

  // Sync activeIndex with current URL slug on case-study pages
  useEffect(() => {
    if (!pathname) return;

    const slug = pathname.split("/")[1]; // because it's /[slug]

    const newIndex = projects.findIndex((project) => project.slug === slug);

    if (newIndex !== -1 && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [pathname, activeIndex]);

  // Persist activeIndex changes to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, activeIndex.toString());
  }, [activeIndex]);

  // Derive activeColor from current project
  // fallback to a default color class if missing
  const activeColor = projects[activeIndex]?.bgColor ?? "bg-default";

  return (
    <ActiveProjectContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        previousIndex,
        transitioningToNext,
        setTransitioningToNext,
        activeColor, // expose the color class here
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
      "useActiveProject must be used within ActiveProjectProvider",
    );
  }
  return context;
}

export { wrapIndex };
