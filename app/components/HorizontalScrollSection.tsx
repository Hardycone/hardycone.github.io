"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// --- The Content for Each Panel ---
const panels = [
  {
    title: "Section 1: The Problem",
    text: "Here is some dummy text for the first section. We would describe the user's pain points and the initial challenge. As the user scrolls down, the content will begin to move horizontally, revealing the next part of the story.",
    className: "bg-red-200 dark:bg-red-900",
  },
  {
    title: "Section 2: The Process",
    text: "This section would showcase the messy middle. User flows, wireframes, and iteration. We're scrolling horizontally to see this journey. The height of the 'track' element determines how 'fast' this scroll feels.",
    className: "bg-green-200 dark:bg-green-900",
  },
  {
    title: "Section 3: The Solution",
    text: "Finally, the polished high-fidelity designs and the outcome. After this panel, the scroll will resume vertically, transitioning back to the rest of the case study. This creates a focused, cinematic moment.",
    className: "bg-blue-200 dark:bg-blue-900",
  },
];

const NUM_SECTIONS = panels.length;

// --- The Main Component ---

export function HorizontalScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });

  // --- 1. USE 'vw' for 'useTransform' ---
  // We are moving the "filmstrip" by full viewport widths
  const x = useTransform(
    smoothScrollYProgress,
    [0, 1],
    ["0vw", `-${(NUM_SECTIONS - 1) * 100}vw`],
  );

  return (
    // The "Track"
    // --- 2. ADD NEGATIVE MARGINS ---
    // This makes the section "break out" of its parent's padding
    // (Assuming parent has p-2 md:p-6)
    <section
      ref={targetRef}
      className="relative -mx-2 h-[300vh] bg-neutral-100 dark:bg-neutral-900"
    >
      {/* The "Sticky" Element */}
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        {/* The "Filmstrip" */}
        <motion.div style={{ x }} className="flex">
          {panels.map((panel, index) => (
            <Panel
              key={index}
              title={panel.title}
              text={panel.text}
              className={panel.className}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- A Helper Component for the Panel ---

interface PanelProps {
  title: string;
  text: string;
  className: string;
}

const Panel = ({ title, text, className }: PanelProps) => {
  return (
    // --- 3. PANEL IS 'w-screen' ---
    // The panel background fills the whole screen
    // and centers its content (justify-center)
    <div
      className={`flex h-screen w-screen items-center justify-center p-8 md:p-12 ${className}`}
    >
      {/* --- 4. CONTENT IS 'max-w-5xl' --- */}
      {/* This 'div' constrains the content to match your
          MainContent's max-width. 'w-full' ensures it
          fills that container. */}
      <div className="w-full max-w-5xl text-left text-black dark:text-white">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
        <p className="text-lg md:text-xl">{text}</p>
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
