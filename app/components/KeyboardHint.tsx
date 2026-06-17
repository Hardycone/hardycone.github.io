"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useKeyboardHints } from "../context/KeyboardHintsContext";

interface KeyboardHintProps {
  children: ReactNode;
  shortcut: string;
  className?: string;
  style?: CSSProperties;
}

export default function KeyboardHint({
  children,
  shortcut,
  className = "",
  style,
}: KeyboardHintProps) {
  const { pressedShortcut } = useKeyboardHints();

  return (
    <span
      className={`pointer-events-none whitespace-nowrap ${className}`}
      style={style}
    >
      <motion.span
        animate={{ scale: pressedShortcut === shortcut ? 0.9 : 1 }}
        transition={{ duration: 0.08, ease: "easeOut" }}
        className="flex h-6 w-auto min-w-6 items-center justify-center rounded-1.5 bg-sky-600 px-1.5 font-sans text-xs font-semibold text-background supports-[corner-shape:squircle]:rounded-3 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-sky-400 dark:text-dark-background"
      >
        {children}
      </motion.span>
    </span>
  );
}
