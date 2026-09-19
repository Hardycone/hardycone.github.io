"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import projects from "@/data/projects";

export type ViewMode = "home" | "case-study" | "not-found";

type CanonicalRouteState =
  | { viewMode: "home"; projectIndex: null }
  | { viewMode: "case-study"; projectIndex: number }
  | { viewMode: "not-found"; projectIndex: null };

type SiteNavigationContextValue = {
  viewMode: ViewMode;
  activeIndex: number;
  routeProjectIndex: number | null;
  previousIndex?: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  activeColor: string;
};

const STORAGE_KEY = "activeProjectIndex";

const SiteNavigationContext = createContext<SiteNavigationContextValue | null>(
  null,
);

export function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

function projectIndexFromPathname(pathname: string) {
  const slug = pathname.split("/")[1] || "";
  return projects.findIndex((project) => project.slug === slug);
}

function canonicalRouteState(pathname: string): CanonicalRouteState {
  if (pathname === "/") {
    return { viewMode: "home", projectIndex: null };
  }

  const projectIndex = projectIndexFromPathname(pathname);
  if (projectIndex >= 0) {
    return { viewMode: "case-study", projectIndex };
  }

  return { viewMode: "not-found", projectIndex: null };
}

function initialHomeIndex() {
  if (typeof window === "undefined") return 0;

  const routeIndex = projectIndexFromPathname(window.location.pathname);
  if (routeIndex >= 0) return routeIndex;

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    const parsed = Number.parseInt(stored, 10);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed < projects.length) {
      return parsed;
    }
  }

  return 0;
}

function usePreviousIndex(value: number) {
  const ref = useRef<number | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function SiteNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routeState = useMemo(() => canonicalRouteState(pathname), [pathname]);
  const [homeIndex, setHomeIndex] = useState(initialHomeIndex);

  // A case-study URL is authoritative. Home keeps its own selected preview
  // because `/` intentionally has no project slug.
  const activeIndex =
    routeState.viewMode === "case-study"
      ? routeState.projectIndex
      : homeIndex;
  const previousIndex = usePreviousIndex(activeIndex);

  const setActiveIndex = useCallback<Dispatch<SetStateAction<number>>>(
    (nextValue) => {
      setHomeIndex((currentIndex) => {
        const nextIndex =
          typeof nextValue === "function"
            ? nextValue(currentIndex)
            : nextValue;
        return wrapIndex(nextIndex, projects.length);
      });
    },
    [],
  );

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, homeIndex.toString());
  }, [homeIndex]);

  useEffect(() => {
    if (routeState.viewMode === "case-study") {
      setHomeIndex((currentIndex) =>
        currentIndex === routeState.projectIndex
          ? currentIndex
          : routeState.projectIndex,
      );
    }
  }, [routeState]);

  const value = useMemo<SiteNavigationContextValue>(
    () => ({
      viewMode: routeState.viewMode,
      activeIndex,
      routeProjectIndex: routeState.projectIndex,
      previousIndex,
      setActiveIndex,
      activeColor: projects[activeIndex]?.bgColor ?? "bg-default",
    }),
    [activeIndex, previousIndex, routeState, setActiveIndex],
  );

  return (
    <SiteNavigationContext.Provider value={value}>
      {children}
    </SiteNavigationContext.Provider>
  );
}

export function useSiteNavigation() {
  const context = useContext(SiteNavigationContext);
  if (!context) {
    throw new Error(
      "useSiteNavigation must be used within SiteNavigationProvider",
    );
  }

  return context;
}
