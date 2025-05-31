"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import projects from "@/data/projects";

export default function TopBar() {
  const { viewMode } = useViewMode();
  const { activeIndex } = useActiveProject();
  const router = useRouter();

  const [showTitle, setShowTitle] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const activeProject = projects[activeIndex];
  const sections = useMemo(
    () => projects[activeIndex]?.sections || [],
    [activeIndex]
  );
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let observer: IntersectionObserver;
    const sectionElements: HTMLElement[] = [];

    const handleRefresh = () => {
      if (observer) {
        sectionElements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      }

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) =>
                Math.abs(b.boundingClientRect.top) -
                Math.abs(a.boundingClientRect.top)
            );

          if (visible.length > 0) {
            const id = visible[0].target.id;
            setActiveSection(id);
          }
        },
        {
          root: null,
          rootMargin: "-25% 0px -25% 0px",
          threshold: 0.01,
        }
      );

      const tryObserve = () => {
        const readyElements = sections
          .map((s) => document.getElementById(s.id))
          .filter(Boolean) as HTMLElement[];

        if (readyElements.length === sections.length) {
          readyElements.forEach((el) => observer.observe(el));
          sectionElements.push(...readyElements);
        } else {
          timeout = setTimeout(tryObserve, 250);
        }
      };

      tryObserve();
    };

    window.addEventListener("case-study-loaded", handleRefresh);

    return () => {
      clearTimeout(timeout);
      sectionElements.forEach((el) => observer?.unobserve(el));
      observer?.disconnect();
      window.removeEventListener("case-study-loaded", handleRefresh);
    };
  }, [sections]);

  // Handle scroll to top visibility
  useEffect(() => {
    function onScroll() {
      setShowTitle(window.scrollY > 30);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(b.boundingClientRect.top) -
              Math.abs(a.boundingClientRect.top)
          );

        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActiveSection(id);
        }
      },
      {
        root: null,
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0.01,
      }
    );

    let sectionElements: HTMLElement[] = [];

    const handleCaseStudyLoaded = () => {
      const readyElements = sections
        .map((s) => document.getElementById(s.id))
        .filter(Boolean) as HTMLElement[];

      if (readyElements.length === sections.length) {
        readyElements.forEach((el) => observer.observe(el));
        sectionElements = readyElements;
      }
    };

    window.addEventListener("case-study-loaded", handleCaseStudyLoaded);

    return () => {
      window.removeEventListener("case-study-loaded", handleCaseStudyLoaded);
      sectionElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [sections]);

  const handleScrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (viewMode === "home") return null;

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
          className="flex w-full justify-between items-center h-16 px-4 rounded-xl shadow-sm z-50"
        >
          {/* Left: Logo */}
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

          {/* Center: Title and Sections */}
          <AnimatePresence>
            {showTitle && activeProject && (
              <motion.div
                key={`title-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="absolute left-0 right-0 mx-auto max-w-4xl p-6 w-1/2 top-1/2 -translate-y-1/2 font-semibold text-lg select-none cursor-pointer flex items-center gap-6"
              >
                <span>{activeProject.title}</span>
                <div className="flex gap-4 ">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScrollToSection(section.id);
                        }}
                        className={`p-2 w-12  h-12 rounded-full ${
                          activeSection === section.id
                            ? "shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1),inset_-2px_-2px_2px_white]"
                            : "hover:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1),inset_-2px_-2px_2px_white]"
                        }`}
                      >
                        <Icon />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right: Social Links */}
          <div className="flex gap-4 items-center">
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
