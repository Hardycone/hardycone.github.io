"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CircleNotchIcon, ArrowElbowDownLeftIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";

interface SpinButtonProps {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}

export default function SpinButton({
  isLoading,
  children,
  className = "",
}: SpinButtonProps) {
  return (
    <div
      // We use a div here because the Parent (ProjectSummary) handles the click.
      // This button is purely visual decoration inside the clickable card.
      className={`relative flex items-center gap-2 rounded-full pl-5 pr-3 text-lg font-semibold transition-all hover:scale-[0.97] active:scale-95 active:text-opacity-20 ${className}`}
    >
      <span>{children}</span>

      {/* Fixed width container to prevent layout shifts when icon swaps */}
      <div className="relative flex h-5 w-5 items-center justify-center">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  duration: 0.8,
                  ease: "linear",
                },
              }}
            >
              <CircleNotchIcon size={24} weight="bold" />
            </motion.div>
          ) : (
            <motion.div
              key="arrow"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowElbowDownLeftIcon size={20} weight="bold" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
