"use client";

import { motion, AnimatePresence } from "framer-motion";
import projects from "@/data/projects";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useViewMode } from "../context/ViewModeContext";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import { useTheme } from "next-themes";

export default function MyName() {
  const { viewMode } = useViewMode();
  const { resolvedTheme } = useTheme();

  // Use your existing hook to get the project-specific color theme
  const { activeIndex, previousIndex } = useActiveProject();
  const project = projects[activeIndex];
  const theme = useProjectTheme(project.id);
  const direction =
    previousIndex !== undefined && activeIndex < previousIndex ? "down" : "up";

  const { barLightShadow, barDarkShadow } = useMouseShadow();
  const textShadow = resolvedTheme === "dark" ? barDarkShadow : barLightShadow;

  const motionVariants = {
    initial: (dir: "up" | "down") => ({ y: dir === "up" ? "100%" : "-100%" }),
    animate: { y: 0 },
    exist: (dir: "up" | "down") => ({ y: dir === "up" ? "-100%" : "100%" }),
  };

  // Fallback if your project data doesn't have a 'role' field yet
  // You should add `role: "UI Designer"` etc to your projects.ts
  const role = project.role;

  return (
    <AnimatePresence>
      {viewMode === "home" && (
        <motion.div
          // Slide down and fade out when leaving Home
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="pointer-events-none absolute left-0 top-12 flex max-w-5xl flex-col text-7xl text-foreground dark:text-dark-foreground"
        >
          <motion.span
            //   style={{ textShadow: textShadow }}
            className="z-10 mb-8"
          >
            I'm Haichao, a&nbsp;
          </motion.span>

          {/* Flip Container */}
          <motion.span
            key={activeIndex}
            custom={direction}
            variants={motionVariants}
            // style={{ textShadow: textShadow }}
            // The "Slot Machine" Flip Effect
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 20,
              mass: 0.5,
            }}
            className={`flex ${theme.textColorClass}`}
          >
            {role}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
