"use client";

import { motion } from "framer-motion";

function AnimatedFabIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full fill-current"
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      {/* Link chain — left ring */}
      <motion.circle
        cx={8}
        cy={12}
        r={3.5}
        variants={{
          closed: { opacity: 1, scale: 1 },
          open: { opacity: 0, scale: 0.3 },
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {/* Link chain — right ring */}
      <motion.circle
        cx={16}
        cy={12}
        r={3.5}
        variants={{
          closed: { opacity: 1, scale: 1 },
          open: { opacity: 0, scale: 0.3 },
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {/* Link chain — left connector */}
      <motion.line
        x1={4.5}
        y1={12}
        x2={7}
        y2={12}
        variants={{
          closed: { opacity: 1, pathLength: 1 },
          open: { opacity: 0, pathLength: 0 },
        }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {/* Link chain — right connector */}
      <motion.line
        x1={17}
        y1={12}
        x2={19.5}
        y2={12}
        variants={{
          closed: { opacity: 1, pathLength: 1 },
          open: { opacity: 0, pathLength: 0 },
        }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {/* X — first stroke */}
      <motion.line
        x1={7}
        y1={7}
        x2={17}
        y2={17}
        variants={{
          closed: { opacity: 0, pathLength: 0 },
          open: { opacity: 1, pathLength: 1 },
        }}
        transition={{ duration: 0.2, delay: 0.1, ease: "easeInOut" }}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* X — second stroke */}
      <motion.line
        x1={17}
        y1={7}
        x2={7}
        y2={17}
        variants={{
          closed: { opacity: 0, pathLength: 0 },
          open: { opacity: 1, pathLength: 1 },
        }}
        transition={{ duration: 0.2, delay: 0.1, ease: "easeInOut" }}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

interface FabToggleProps {
  isOpen: boolean;
}

export default function FabToggle({ isOpen }: FabToggleProps) {
  return <AnimatedFabIcon isOpen={isOpen} />;
}
