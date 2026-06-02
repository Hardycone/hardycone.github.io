"use client";

import { motion, AnimatePresence, MotionStyle } from "framer-motion";
import { CircleNotchIcon, ArrowCircleRightIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";

interface SpinButtonProps {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
  style?: MotionStyle;
}

export default function SpinButton({
  isLoading,
  children,
  className = "",
  style,
}: SpinButtonProps) {
  return (
    <motion.button
      type="button"
      className={`transition-scale hover:scale-[0.97] active:scale-95 active:text-opacity-20 ${className}`}
      style={style}
    >
      {/* Fixed width container to prevent layout shifts when icon swaps */}
      <div className="relative flex h-6 w-6 items-center justify-center">
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
              <ArrowCircleRightIcon size={24} weight="bold" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span>{children}</span>
    </motion.button>
  );
}
