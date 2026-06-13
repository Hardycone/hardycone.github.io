"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useKeyboardHints } from "../context/KeyboardHintsContext";

interface KeyboardHintProps {
  children: ReactNode;
  shortcut: string;
  className?: string;
  keycapClassName?: string;
  style?: CSSProperties;
}

export default function KeyboardHint({
  children,
  shortcut,
  className = "",
  keycapClassName = "",
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
        className={`flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 font-sans text-xs font-semibold text-background dark:bg-sky-400 dark:text-dark-background ${keycapClassName}`}
      >
        {children}
      </motion.span>
    </span>
  );
}
