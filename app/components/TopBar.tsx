"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import projects from "@/data/projects";
import PersonalLogo from "../icons/PersonalLogo";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const { viewMode } = useViewMode();
  const { activeIndex } = useActiveProject();
  const router = useRouter();
  const pathname = usePathname();
  const [showTitle, setShowTitle] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const activeProject = projects[activeIndex];
  const sections = useMemo(
    () => projects[activeIndex]?.sections || [],
    [activeIndex]
  );
  useEffect(() => {
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
          requestAnimationFrame(tryObserve);
        }
      };

      tryObserve();
    };

    // ✅ Run immediately on mount or when sections/pathname changes
    handleRefresh();

    window.addEventListener("case-study-loaded", handleRefresh);

    return () => {
      sectionElements.forEach((el) => observer?.unobserve(el));
      observer?.disconnect();
      window.removeEventListener("case-study-loaded", handleRefresh);
    };
  }, [sections, pathname]);

  // Handle scroll to top visibility
  useEffect(() => {
    function onScroll() {
      setShowTitle(window.scrollY > 30);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (viewMode === "home") return null;

  return (
    <div className="bg-inherit w-full max-w-7xl inset-x-0 m-auto top-0 fixed p-2 z-50">
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
          className="bg-inherit flex w-full justify-between items-center h-12 pl-0 pr-2 xl:pl-2 xl:pr-4 rounded-xl z-50"
        >
          {/* Left: Logo */}
          <button
            className="p-2 h-12 w-12 rounded-full hover:scale-95 hover:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1),inset_-2px_-2px_2px_white]"
            onClick={() => router.push("/")}
          >
            <PersonalLogo />
          </button>

          {/* Center: Title and Sections */}
          <AnimatePresence mode="wait">
            {viewMode === "case-study" && showTitle && activeProject && (
              <motion.div
                key={`title-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="absolute mt-0 hidden xl:flex left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 text-lg select-none justify-start gap-4"
              >
                <button className=" px-4 h-10 rounded-full hover:scale-95 hover:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1),inset_-2px_-2px_2px_white]">
                  {activeProject.title}
                </button>
                <div className="flex gap-4 ">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        title={section.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScrollToSection(section.id);
                        }}
                        className={`text-foreground p-2 w-8 h-8 xl:w-10  xl:h-10 rounded-full ${
                          activeSection === section.id
                            ? "shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1),inset_-2px_-2px_2px_white]"
                            : "hover:scale-95 hover:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1),inset_-2px_-2px_2px_white]"
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
          <button
            className="p-2 h-12 w-12 rounded-full hover:scale-95 hover:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1),inset_-2px_-2px_2px_white]"
            onClick={() => router.push("/case-study-one#")}
          >
            <PersonalLogo />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
