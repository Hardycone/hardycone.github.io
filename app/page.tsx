"use client";

import { useEffect } from "react";
import { useViewMode } from "./context/ViewModeContext";
import { useActiveProject } from "./context/ActiveProjectContext";

export default function HomePage() {
  const { setViewMode } = useViewMode();
  const { setActiveIndex } = useActiveProject();

  useEffect(() => {
    setViewMode("home");
    setActiveIndex(0); // Set this to whatever your default project is
  }, [setViewMode, setActiveIndex]);

  return null;
}
