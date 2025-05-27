"use client";

import { useEffect } from "react";
import { useViewMode } from "./context/ViewModeContext";

export default function HomePage() {
  const { setViewMode } = useViewMode();

  useEffect(() => {
    setViewMode("home");
  }, [setViewMode]);

  return null;
}
