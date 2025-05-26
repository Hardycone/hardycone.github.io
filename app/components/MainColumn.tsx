"use client";
import { useViewMode } from "../context/ViewModeContext";
import { ReactNode } from "react";
export default function MainColumn({ children }: { children: ReactNode }) {
  const { viewMode } = useViewMode();
  const isHome = viewMode === "home";

  return (
    <div
      className={`flex-col flex w-1/2 max-w-7xl bg-green-200 transition-all duration-300 ${
        isHome ? "justify-center items-left" : "items-left"
      }`}
    >
      {children}
    </div>
  );
}
