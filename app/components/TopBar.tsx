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
  const { a, b, getTextColorClass, getLightColor } = useLighting();
  const { resolvedTheme } = useTheme();

  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );

  const lightColor = getLightColor(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );

  const themeShadows = getShadows(
    a,
    b,
    lightColor,
    resolvedTheme === "dark" ? "dark" : "light",
  );

  const activeProject = projects[activeIndex];
  const sections = useMemo(
    () => projects[activeIndex]?.sections || [],
    [activeIndex],
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
                Math.abs(a.boundingClientRect.top),
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
        },
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
    <div className="fixed inset-x-0 top-0 z-50 m-auto flex w-full max-w-[1440px] p-2 md:p-4">
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
          className="z-50 flex w-full justify-between"
        >
          {/*Left: Home*/}
          <motion.button
            title="Home"
            animate={{ boxShadow: themeShadows.topBar }}
            transition={{ duration: 0.1 }}
            whileHover={{ scale: 1.1 }}
            className={`h-11 w-11 rounded-full bg-background p-2 text-foreground transition-colors hover:scale-110 dark:bg-dark-background dark:text-dark-foreground`}
            onClick={() => {
              const preventScroll = (e: Event) => {
                e.preventDefault();
              };

              const blockUserScroll = () => {
                window.addEventListener("wheel", preventScroll, {
                  passive: false,
                });
                window.addEventListener("touchmove", preventScroll, {
                  passive: false,
                });
                window.addEventListener("keydown", keydownHandler, {
                  passive: false,
                });
              };

              const unblockUserScroll = () => {
                window.removeEventListener("wheel", preventScroll);
                window.removeEventListener("touchmove", preventScroll);
                window.removeEventListener("keydown", keydownHandler);
              };

              const keydownHandler = (e: KeyboardEvent) => {
                // Block keys that cause scrolling
                const keys = [
                  "ArrowUp",
                  "ArrowDown",
                  "PageUp",
                  "PageDown",
                  "Home",
                  "End",
                  " ",
                ];
                if (keys.includes(e.key)) {
                  e.preventDefault();
                }
              };

              // In your button onClick:
              if (window.scrollY > 0) {
                blockUserScroll();

                const onScroll = () => {
                  if (window.scrollY === 0) {
                    window.removeEventListener("scroll", onScroll);
                    unblockUserScroll();
                    router.push("/");
                  }
                };

                window.addEventListener("scroll", onScroll);

                window.scrollTo({ top: 0, behavior: "smooth" });

                // Fallback timeout if scroll event never fires
                setTimeout(() => {
                  window.removeEventListener("scroll", onScroll);
                  unblockUserScroll();
                  if (window.scrollY === 0) router.push("/");
                }, 2000);
              } else {
                router.push("/");
              }
            }}
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
                transition={{ duration: 0.1 }}
                exit={{ x: "-50%", y: -60, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                className={`absolute left-1/2 hidden select-none justify-center gap-2 rounded-full bg-background px-4 text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground sm:flex lg:gap-4`}
              >
                {/*Title*/}
                <button
                  title="Summary"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className={`hidden items-center whitespace-nowrap rounded-full px-4 font-sans text-lg font-semibold opacity-60 transition-transform hover:opacity-100 lg:flex ${textColorClass}`}
                >
                  {activeProject.title}
                </button>
                {/*Sections*/}
                <div className="flex gap-2 lg:gap-4">
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
                        className={`h-11 w-11 rounded-full p-2 ${
                          activeSection === section.id
                            ? `${textColorClass}`
                            : "text-foreground opacity-40 hover:opacity-100 dark:text-dark-foreground"
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
        className="ml-auto flex gap-2 rounded-full md:gap-4"
      >
        {/*Resume*/}

        <motion.button
          title="About Me"
          animate={{ boxShadow: themeShadows.topBar }}
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.1 }}
          className={`h-11 w-11 rounded-full bg-background p-2 text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground`}
          onClick={() => {
            if (pathname === "/case-study-one") {
              if (window.scrollY > 30) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                // Scroll down a bit, then bounce back up
                window.scrollBy({ top: 120, behavior: "smooth" });
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 1000); // Adjust delay to match scroll duration
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
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.1 }}
          className={`h-11 w-11 rounded-full bg-background p-2 text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground`}
          onClick={() =>
            window.open(
              "https://www.google.com",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <LinkedIn />
        </motion.button>
        <motion.div
          animate={{ boxShadow: themeShadows.topBar }}
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.1 }}
          className={`z-50 flex h-11 w-11 rounded-full bg-background text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground`}
        >
          <ThemeToggle />
        </motion.div>
      </motion.div>
    </div>
  );
}
