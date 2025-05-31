"use client";

import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import projects from "@/data/projects";

export default function TopBar() {
  const { viewMode } = useViewMode();
  const { activeIndex } = useActiveProject();
  const router = useRouter();

  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTitle(window.scrollY > 100);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (viewMode === "home") return null;

  const activeProject = projects[activeIndex];

  return (
    <div className="bg-inherit inset-x-0 top-0 fixed p-4 z-50">
      <AnimatePresence>
        <motion.div
          key="topbar"
          initial={{ boxShadow: "none", opacity: 0 }}
          animate={{
            boxShadow:
              "4px 4px 4px rgba(0, 0, 0, 0.1),-4px -4px 4px rgba(255, 255, 255, 1),-4px 4px 4px rgba(255, 255, 255, 1),4px -4px 4px rgba(255, 255, 255, 1)",
            opacity: 1,
          }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex w-full justify-between items-center h-12 px-4 rounded-xl shadow-sm z-50"
        >
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground"
            >
              <path d="M12 2L2 12h10v10l10-10H12z" />
            </svg>
          </div>

          {/* Center title fades in/out */}
          <AnimatePresence>
            {showTitle && activeProject && (
              <motion.div
                key={`title-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-lg select-none cursor-pointer"
              >
                {activeProject.title}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4">
            <a href="#" className="text-sm hover:underline">
              LinkedIn
            </a>
            <a href="#" className="text-sm hover:underline">
              GitHub
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
