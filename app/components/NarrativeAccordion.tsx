"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface NarrativeAccordionProps {
  isOpen: boolean;
  children: ReactNode;
}

export default function NarrativeAccordion({
  isOpen,
  children,
}: NarrativeAccordionProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ maxHeight: 0, opacity: 0 }}
          animate={{ maxHeight: 600, opacity: 1 }}
          exit={{ maxHeight: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
