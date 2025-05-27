// app/context/ViewModeContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import projects from "@/data/projects";

type ViewMode = "home" | "case-study" | "not-found";

const ViewModeContext = createContext<{
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
} | null>(null);

function isValidSlug(slug: string): boolean {
  return projects.some((p) => p.slug === slug);
}

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("home");

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      <>
        <ViewModeSyncer setViewMode={setViewMode} />
        {children}
      </>
    </ViewModeContext.Provider>
  );
}

function ViewModeSyncer({
  setViewMode,
}: {
  setViewMode: (mode: ViewMode) => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setViewMode("home");
      return;
    }

    const slug = pathname.split("/")[1] || "";
    if (isValidSlug(slug)) {
      setViewMode("case-study");
    } else {
      setViewMode("not-found");
    }
  }, [pathname, setViewMode]);

  return null;
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
