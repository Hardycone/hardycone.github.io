// app/components/ProjectSummary.tsx
"use client";

import { useActiveProject } from "../context/ActiveProjectContext";
import projects from "../../data/projects";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectSummary() {
  const { activeIndex, previousIndex } = useActiveProject();
  const project = projects[activeIndex];
  const router = useRouter();

  const handleClick = () => {
    router.push(`/case-studies/${project.slug}`);
  };

  if (!project) return null;

  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  const variants = {
    initial: (direction: "up" | "down") => ({
      y: direction === "up" ? 500 : -500,
      opacity: 0,
      position: "absolute" as const,
    }),
    animate: {
      y: 0,
      opacity: 1,
      position: "relative" as const,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: (direction: "up" | "down") => ({
      y: direction === "up" ? -500 : 500,
      opacity: 0,
      position: "absolute" as const,
      transition: { duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <div className="overflow-hidden h-full absolute left-1/4 w-1/2 flex justify-center items-center bg-white p-6 rounded-2xl shadow-xl text-center z-50">
      <AnimatePresence initial={true} custom={direction}>
        <motion.div
          key={project.id}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute w-full"
        >
          <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            View Case Study
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
