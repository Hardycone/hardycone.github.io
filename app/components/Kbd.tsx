// components/Kbd.tsx
import React from "react";

export default function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 bg-gray-200 font-sans font-medium text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
      {children}
    </kbd>
  );
}
