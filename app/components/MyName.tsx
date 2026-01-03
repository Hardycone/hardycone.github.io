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
    exit: (dir: "up" | "down") => ({ y: dir === "up" ? "-100%" : "100%" }),
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
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`z-999 superwide:hidden pointer-events-none absolute mt-4 flex h-full w-full flex-1 flex-col whitespace-nowrap leading-tight text-foreground dark:text-dark-foreground tall:mt-7`}
        >
          <motion.span
            //   style={{ textShadow: textShadow }}
            className="z-999 text-md"
          >
            Hi! I'm Haichao.
          </motion.span>

          {/* Flip Container */}
          <div className="z-999 flex text-sm">
            I design&nbsp;
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
              className={`${theme.textColorClass} `}
            >
              {role}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
