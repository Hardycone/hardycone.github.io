/// <reference types="react" />

"use client";

import { AnimatePresence, motion } from "framer-motion";
import SpecialButton from "./SpecialButton";

type Project = {
  id: string;
  title: string;
  description: string;
};

type ProjectSummaryProps = {
  project: Project;
  scrollDir: "up" | "down";
  onViewCaseStudy: () => void;
  viewMode: "home" | "case-study";
};

export default function ProjectSummary({
  project,
  scrollDir,
  onViewCaseStudy,
  viewMode,
}: ProjectSummaryProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        y: viewMode === "home" ? -75 : 0, // move up by 75px in home view
        top: viewMode === "home" ? "50%" : 80,
      }}
      transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
      className="absolute left-1/4 text-left w-1/2"
    >
      <motion.div
        key={project.id}
        onClick={onViewCaseStudy}
        initial={{ y: scrollDir === "up" ? -400 : 400, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="cursor-pointer"
      >
        <h1 className="text-5xl font-bold mb-6">{project.title}</h1>
        <p className="text-xl text-gray-700 max-w-xl">{project.description}</p>
        <AnimatePresence>
          {viewMode === "home" && (
            <motion.div
              exit={{ y: 200, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <SpecialButton />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
