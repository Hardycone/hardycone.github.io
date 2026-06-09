"use client";

import { AnimatePresence, motion } from "framer-motion";

const trayPath =
  "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V168H76.69L96,187.32A15.89,15.89,0,0,0,107.31,192h41.38A15.86,15.86,0,0,0,160,187.31L179.31,168H208v40Z";

const upArrowPath =
  "M90.34,98.34l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32L136,91.31V152a8,8,0,0,1-16,0V91.31l-18.34,18.35A8,8,0,0,1,90.34,98.34Z";

const downArrowPath =
  "M90.34,114.34a8,8,0,0,1,11.32,0L120,132.69V72a8,8,0,0,1,16,0v60.69l18.34-18.35a8,8,0,0,1,11.32,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32A8,8,0,0,1,90.34,114.34Z";

const arrowTravel = {
  initial: (direction: number) => ({
    y: direction * 72,
    opacity: 0,
  }),
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      y: { duration: 0.18, ease: [0, 0, 0.2, 1] as const },
      opacity: { duration: 0.12, ease: "easeOut" as const },
    },
  },
  exit: (direction: number) => ({
    y: direction * 72,
    opacity: 0,
    transition: {
      y: { duration: 0.16, ease: [0.4, 0, 1, 1] as const },
      opacity: { duration: 0.1, ease: "easeIn" as const },
    },
  }),
};

interface FabToggleProps {
  isOpen: boolean;
  isHovered: boolean;
}

export default function FabToggle({ isOpen, isHovered }: FabToggleProps) {
  const hoverOffset = isOpen ? 18 : -18;
  const hoverSettle = isOpen ? 9 : -9;
  const travelDirection = isOpen ? -1 : 1;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full fill-current"
      viewBox="0 0 256 256"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path d={trayPath} />

      <AnimatePresence initial={false} mode="wait" custom={travelDirection}>
        <motion.g
          key={isOpen ? "down" : "up"}
          custom={travelDirection}
          variants={arrowTravel}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.path
            d={isOpen ? downArrowPath : upArrowPath}
            className="fill-background dark:fill-dark-background"
            animate={
              isHovered ? { y: [0, hoverOffset, 0, hoverSettle, 0] } : { y: 0 }
            }
            transition={{
              duration: 0.46,
              times: [0, 0.28, 0.56, 0.78, 1],
              ease: "easeInOut",
            }}
          />
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
