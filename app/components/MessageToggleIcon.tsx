"use client";

import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "@phosphor-icons/react";

const planePath =
  "M236.2,218.31A15.88,15.88,0,0,1,224,224a16.22,16.22,0,0,1-5.37-.92l-79.95-27a4,4,0,0,1-2.72-3.79V120a8,8,0,0,0-8.53-8,8.19,8.19,0,0,0-7.47,8.26v72a4,4,0,0,1-2.72,3.79l-79.95,27a16,16,0,0,1-19.26-22.92L114,32.13a16,16,0,0,1,27.89,0L237.9,200.1A15.89,15.89,0,0,1,236.2,218.31Z";

interface MessageToggleIconProps {
  isOpen: boolean;
  isHovered: boolean;
}

export default function MessageToggleIcon({
  isOpen,
  isHovered,
}: MessageToggleIconProps) {
  return (
    <span className="relative block h-full w-full">
      <AnimatePresence initial={false} mode="wait">
        {isOpen ? (
          <motion.span
            key="close"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <XIcon className="h-full w-full" weight="bold" />
          </motion.span>
        ) : (
          <motion.svg
            key="plane"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 h-full w-full overflow-visible fill-current"
            viewBox="0 0 256 256"
            aria-hidden="true"
            initial={{ x: -20, y: 20, scale: 0.8 }}
            animate={{ x: 2, y: -2, scale: 1 }}
            exit={{
              x: 20,
              y: -20,

              scale: 0.8,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <g transform="rotate(45 128 128)">
              <motion.path
                d={planePath}
                animate={
                  isHovered
                    ? {
                        y: [0, 18, 18, 18, 0],
                        scaleX: [1, 0.8, 1.05, 0.9, 1],
                      }
                    : { x: 0, scaleX: 1 }
                }
                transition={{
                  duration: 0.5,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "easeInOut",
                }}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                }}
              />
            </g>
          </motion.svg>
        )}
      </AnimatePresence>
    </span>
  );
}
