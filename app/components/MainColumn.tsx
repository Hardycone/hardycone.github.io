"use client";
import { ReactNode } from "react";
export default function MainColumn({ children }: { children: ReactNode }) {
  return (
    <div className={`flex-col flex w-1/2 max-w-7xl bg-green-200}`}>
      {children}
    </div>
  );
}
