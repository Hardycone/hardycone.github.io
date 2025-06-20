"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import projects from "@/data/projects";
import Home from "../icons/Home";
import Resume from "../icons/Resume";
import LinkedIn from "../icons/LinkedIn";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import { useLighting, getShadows } from "../context/LightingContext";

export default function TopBar() {
  const { viewMode } = useViewMode();
  const { activeIndex } = useActiveProject();
  const router = useRouter();
  const pathname = usePathname();
  const [showTitle, setShowTitle] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { a, b, getTextColorClass, getBgColorClass, getLightColor } =
    useLighting();
  const { resolvedTheme } = useTheme();

  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    projects[activeIndex].textColor
  );

  const bgColorClass = getBgColorClass(
    resolvedTheme || "light",
    projects[activeIndex].bgColor
  );

  const lightColor = getLightColor(
    resolvedTheme || "light",
    projects[activeIndex].textColor
  );

  const themeShadows = getShadows(
    a,
    b,
    lightColor,
    resolvedTheme === "dark" ? "dark" : "light"
  );

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
      setShowTitle(window.scrollY > 80);
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

  return (
    //TopBar container
    <div className="fixed flex w-full max-w-7xl inset-x-0 m-auto top-0 p-2 md:p-4 z-50">
      {/*case-study view portion*/}
      <AnimatePresence>
        <motion.div
          key="topbar"
          initial={{ y: -60, opacity: 0 }}
          animate={{
            y: viewMode === "home" ? -60 : 0,
            opacity: viewMode === "home" ? 0 : 1,
          }}
          exit={{ y: -60, opacity: 0 }}
          className="w-full flex justify-between z-50"
        >
          {/*Left: Home*/}
          <motion.button
            title="Home"
            animate={{ boxShadow: themeShadows.topBar }}
            className={`p-2 h-10 w-10 rounded-full hover:scale-110 transition ${textColorClass} ${bgColorClass}`}
            onClick={() => router.push("/")}
          >
            <Home />
          </motion.button>
          {/*Center: Page navigation*/}
          <AnimatePresence mode="wait">
            {viewMode === "case-study" && showTitle && activeProject && (
              <motion.div
                key={`title-${activeIndex}`}
                initial={{ x: "-50%", y: -60, opacity: 0 }}
                animate={{
                  boxShadow: themeShadows.topBar,
                  x: "-50%",
                  y: 0,
                  opacity: 1,
                }}
                exit={{ x: "-50%", y: -60, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                className={`absolute hidden sm:flex left-1/2 px-4 transition ${textColorClass} ${bgColorClass} rounded-full select-none justify-center gap-2 lg:gap-4`}
              >
                {/*Title*/}
                <button
                  title="Summary"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="whitespace-nowrap hidden lg:flex items-center font-sans px-4 rounded-full text-lg font-semibold opacity-60 hover:opacity-100 transition-transform "
                >
                  {activeProject.title}
                </button>
                {/*Sections*/}
                <div className="flex gap-2 lg:gap-4 ">
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
                        className={`p-2 w-10 h-10 rounded-full ${
                          activeSection === section.id
                            ? "scale-105 opacity-100"
                            : "opacity-40 hover:opacity-100"
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

          {/*Right: Socials*/}
        </motion.div>
      </AnimatePresence>
      {/*Right group*/}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="ml-auto flex gap-2 md:gap-4 rounded-full"
      >
        {/*Resume*/}

        <motion.button
          title="About Me"
          animate={{ boxShadow: themeShadows.topBar }}
          className={`p-2 h-10 w-10 rounded-full transition  hover:scale-110 ${textColorClass} ${bgColorClass}`}
          onClick={() => {
            if (pathname === "/case-study-one") {
              if (window.scrollY > 30) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                // Scroll down a bit, then bounce back up
                window.scrollBy({ top: 80, behavior: "instant" });
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 200); // Adjust delay to match scroll duration
              }
            } else {
              router.push("/case-study-one");
            }
          }}
        >
          <Resume />
        </motion.button>
        {/*LinkedIn*/}
        <motion.button
          title="Find Me on LinkedIn"
          animate={{ boxShadow: themeShadows.topBar }}
          className={`p-2 h-10 w-10 rounded-full transition hover:scale-110 ${textColorClass} ${bgColorClass}`}
          onClick={() =>
            window.open(
              "https://www.google.com",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <LinkedIn />
        </motion.button>
        <motion.div
          animate={{ boxShadow: themeShadows.topBar }}
          className={`flex w-10 h-10 z-50 rounded-full ${textColorClass} ${bgColorClass} transition hover:scale-110`}
        >
          <ThemeToggle />
        </motion.div>
      </motion.div>
    </div>
  );
}
