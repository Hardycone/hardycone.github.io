"use client";

import {
  useMemo,
  useCallback,
  useEffect,
  useState,
  useRef,
  type RefObject,
} from "react";
import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import projects from "@/data/projects";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import {
  HEADER_PANE_NAV_CONTENT_FADE_MS,
  HEADER_PANE_NAV_DESTINATION_FADE_MS,
} from "@/lib/caseStudyTransitions";

import {
  ScrollIcon,
  PuzzlePieceIcon,
  TargetIcon,
  PersonSimpleRunIcon,
  PresentationChartIcon,
  BrainIcon,
  SealQuestionIcon,
  MagnifyingGlassIcon,
  LightbulbFilamentIcon,
  RocketLaunchIcon,
  PathIcon,
  CertificateIcon,
  CameraIcon,
  GraphIcon,
  CompassRoseIcon,
  PersonSimpleCircleIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react";

import Home from "../icons/Home";
import Greetings from "../icons/Greetings";
import LinkedIn from "../icons/LinkedIn";
import ThemeToggle from "./ThemeToggle";
import KeyboardHint from "./KeyboardHint";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useKeyboardHints } from "../context/KeyboardHintsContext";
import { isTextEntryKeyboardTarget } from "@/lib/keyboard";

interface TopBarProps {
  centerNavRef: RefObject<HTMLDivElement | null>;
  showCenterNav: boolean;
  retractCenterNav: boolean;
  sectionHighlightEnabled: boolean;
  onInstantHomeNavigationStart?: () => void;
}

export default function TopBar({
  centerNavRef,
  showCenterNav,
  retractCenterNav,
  sectionHighlightEnabled,
  onInstantHomeNavigationStart,
}: TopBarProps) {
  const { viewMode, setViewMode } = useViewMode();
  const { activeIndex, setActiveIndex } = useActiveProject();
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { showKeyboardHints, flashShortcutHint } = useKeyboardHints();
  const { resolvedTheme } = useTheme();

  const theme = useProjectTheme(projects[activeIndex].id);

  const { barLightShadow, barDarkShadow } = useMouseShadow();

  const barShadow = resolvedTheme === "dark" ? barDarkShadow : barLightShadow;

  const activeProject = projects[activeIndex];

  const sections = useMemo(
    () => projects[activeIndex]?.sections || [],
    [activeIndex],
  );

  const [isNavigatingHome, setIsNavigatingHome] = useState(false);
  const [isGreetingHovered, setIsGreetingHovered] = useState(false);
  const scrollTimeout = useRef<number | null>(null);
  const themeToggleButtonRef = useRef<HTMLButtonElement>(null);
  const isCenterNavVisible = showCenterNav;

  const handleHomeClick = useCallback(() => {
    if (isNavigatingHome) return; // prevent double triggers
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsNavigatingHome(true);

    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobileDevice) {
      // 🚀 MOBILE: Instant navigation (skip scroll animation)
      onInstantHomeNavigationStart?.();
      router.push("/");
      setIsNavigatingHome(false);
      return;
    }

    const preventScroll = (e: Event) => e.preventDefault();
    const keydownHandler = (e: KeyboardEvent) => {
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];
      if (keys.includes(e.key)) e.preventDefault();
    };

    let onScroll: () => void;

    const cleanup = () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", keydownHandler);
      if (onScroll) window.removeEventListener("scroll", onScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = null;
      }
      setIsNavigatingHome(false);
    };

    if (window.scrollY >= 20) {
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
      window.addEventListener("keydown", keydownHandler, { passive: false });

      onScroll = () => {
        if (window.scrollY < 20) {
          cleanup();
          router.push("/");
        }
      };

      window.addEventListener("scroll", onScroll);
      window.scrollTo({ top: 0, behavior: "smooth" });

      scrollTimeout.current = window.setTimeout(() => {
        cleanup();
        // The following line makes it so that the timeout is purely for unlocking control, without forcing router push.
        // if (window.scrollY < 5)
        router.push("/");
      }, 2000);
    } else {
      router.push("/");
      setIsNavigatingHome(false);
    }
  }, [isNavigatingHome, onInstantHomeNavigationStart, router]);

  const handleAboutClick = useCallback(() => {
    if (pathname === "/about-me") {
      if (window.scrollY > 30) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollBy({ top: 120, behavior: "smooth" });
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1000);
      }
    } else {
      flushSync(() => {
        setActiveIndex(0);
        setViewMode("home");
      });
      requestAnimationFrame(() => {
        router.push("/about-me");
      });
    }
  }, [pathname, router, setActiveIndex, setViewMode]);

  const handleLinkedInClick = useCallback(() => {
    window.open(
      "https://www.linkedin.com/in/haichao-wang-984a914a",
      "_blank",
      "noopener,noreferrer",
    );
  }, []);

  const handleScrollToSummary = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleScrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (viewMode === "home") return;

    const handleHomeKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        document.getElementById("message-me-form")
      ) {
        return;
      }

      if (
        event.repeat ||
        event.defaultPrevented ||
        isTextEntryKeyboardTarget(event.target) ||
        (event.key !== "Backspace" && event.key !== "Escape")
      ) {
        return;
      }

      event.preventDefault();
      flashShortcutHint("home");
      handleHomeClick();
    };

    window.addEventListener("keydown", handleHomeKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleHomeKeyDown, {
        capture: true,
      });
    };
  }, [flashShortcutHint, handleHomeClick, viewMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isTextEntryKeyboardTarget(event.target)
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "8") {
        event.preventDefault();
        flashShortcutHint("about");
        handleAboutClick();
        return;
      }

      if (key === "9") {
        event.preventDefault();
        flashShortcutHint("linkedin");
        handleLinkedInClick();
        return;
      }

      if (key === "0") {
        event.preventDefault();
        flashShortcutHint("theme");
        themeToggleButtonRef.current?.click();
        return;
      }

      const sectionShortcut = Number.parseInt(key, 10);

      if (
        viewMode === "case-study" &&
        Number.isInteger(sectionShortcut) &&
        sectionShortcut >= 1
      ) {
        event.preventDefault();

        if (sectionShortcut === 1) {
          flashShortcutHint("1");
          handleScrollToSummary();
          return;
        }

        const section = sections[sectionShortcut - 2];
        if (section) {
          flashShortcutHint(String(sectionShortcut));
          handleScrollToSection(section.id);
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleAboutClick,
    flashShortcutHint,
    handleLinkedInClick,
    handleScrollToSection,
    handleScrollToSummary,
    sections,
    viewMode,
  ]);

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver;
    const sectionElements: HTMLElement[] = [];

    if (!sectionHighlightEnabled) {
      setActiveSection(null);
      return;
    }

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
          rootMargin: "-10% 0px -85% 0px",
          threshold: 0,
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
  }, [sectionHighlightEnabled, sections, pathname]);

  return (
    <div className="fixed inset-x-0 top-0 z-50 m-auto flex w-full max-w-[2650px] p-3.5 md:p-[1.625rem]">
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
          <motion.button
            type="button"
            tabIndex={viewMode === "home" ? -1 : 0}
            aria-hidden={viewMode === "home"}
            title="Home"
            style={{ boxShadow: barShadow }}
            transition={{ duration: 0.1 }}
            whileHover={{ scale: 1.1 }}
            className="relative h-9 w-9 rounded-full bg-background p-2 text-foreground transition-colors hover:scale-110 dark:bg-dark-background dark:text-dark-foreground md:h-11 md:w-11"
            onClick={() => {
              flashShortcutHint("home");
              handleHomeClick();
            }}
          >
            <Home />
            {showKeyboardHints && (
              <KeyboardHint
                shortcut="home"
                className="absolute left-1/2 top-[calc(100%-0.25rem)] -translate-x-1/2"
              >
                Esc
              </KeyboardHint>
            )}
          </motion.button>

          {/* Center: page navigation */}
          {viewMode === "case-study" && activeProject && (
            <div className="absolute left-[3.625rem] md:left-[5.375rem] lg:left-1/2 lg:-translate-x-1/2">
              <motion.div
                ref={centerNavRef}
                key={`title-${activeIndex}`}
                initial={false}
                aria-hidden={!isCenterNavVisible}
                style={{ boxShadow: barShadow }}
                animate={{
                  y: retractCenterNav ? -60 : 0,
                  opacity: isCenterNavVisible ? 1 : 0,
                }}
                transition={{
                  duration: retractCenterNav
                    ? 0.14
                    : isCenterNavVisible
                      ? HEADER_PANE_NAV_DESTINATION_FADE_MS / 1000
                      : HEADER_PANE_NAV_CONTENT_FADE_MS / 1000,
                  ease: retractCenterNav ? "easeIn" : "easeOut",
                }}
                whileHover={{ scale: 1.02 }}
                className={`flex max-w-[calc(100vw-12.75rem)] select-none justify-center gap-2 rounded-full bg-background px-3 text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground sm:max-w-none sm:px-4 lg:gap-4 ${
                  isCenterNavVisible
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                }`}
              >
                <button
                  type="button"
                  tabIndex={isCenterNavVisible ? 0 : -1}
                  title="Summary"
                  onClick={() => {
                    flashShortcutHint("1");
                    handleScrollToSummary();
                  }}
                  className={`relative flex h-9 min-w-0 max-w-full items-center rounded-full font-sans text-sm font-semibold opacity-60 transition-transform hover:opacity-100 sm:h-auto md:text-lg lg:px-4 ${theme.textColorClass}`}
                >
                  <span className="truncate">{activeProject.title}</span>
                  {showKeyboardHints && (
                    <KeyboardHint
                      shortcut="1"
                      className="absolute left-1/2 top-[calc(100%-0.25rem)] -translate-x-1/2"
                    >
                      1
                    </KeyboardHint>
                  )}
                </button>
                <div className="hidden gap-2 sm:flex lg:gap-4">
                  {sections.map((section, index) => {
                    const Icons = {
                      ScrollIcon,
                      PuzzlePieceIcon,
                      TargetIcon,
                      PersonSimpleRunIcon,
                      PresentationChartIcon,
                      BrainIcon,
                      SealQuestionIcon,
                      MagnifyingGlassIcon,
                      LightbulbFilamentIcon,
                      RocketLaunchIcon,
                      PathIcon,
                      CertificateIcon,
                      CameraIcon,
                      GraphIcon,
                      CompassRoseIcon,
                      PersonSimpleCircleIcon,
                      PaperPlaneTiltIcon,
                    };
                    type IconName = keyof typeof Icons;
                    const Icon = Icons[section.icon as IconName];
                    return (
                      <button
                        type="button"
                        tabIndex={isCenterNavVisible ? 0 : -1}
                        key={section.id}
                        title={section.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          flashShortcutHint(String(index + 2));
                          handleScrollToSection(section.id);
                        }}
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full p-2 md:h-11 md:w-11 ${
                          activeSection === section.id
                            ? `${theme.textColorClass}`
                            : "text-foreground opacity-40 hover:opacity-100 dark:text-dark-foreground"
                        }`}
                      >
                        <Icon
                          size={20}
                          weight={`${activeSection === section.id ? "duotone" : "regular"}`}
                        />
                        {showKeyboardHints && (
                          <KeyboardHint
                            shortcut={String(index + 2)}
                            className="absolute left-1/2 top-[calc(100%-0.25rem)] -translate-x-1/2"
                          >
                            {String(index + 2)}
                          </KeyboardHint>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Right group */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="ml-auto flex gap-2 rounded-full md:gap-4"
      >
        {/*Resume button*/}
        <motion.button
          type="button"
          tabIndex={0}
          title="About Me"
          style={{ boxShadow: barShadow }}
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.1 }}
          onHoverStart={() => setIsGreetingHovered(true)}
          onHoverEnd={() => setIsGreetingHovered(false)}
          className="relative h-9 w-9 rounded-full bg-background p-2 text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground md:h-11 md:w-11"
          onClick={() => {
            flashShortcutHint("about");
            handleAboutClick();
          }}
        >
          <motion.span
            className="block h-full w-full"
            style={{ transformOrigin: "bottom right" }}
            animate={
              isGreetingHovered
                ? {
                    rotate: [0, 5, 5, -10, 10, -10, 0],
                    scale: [1, 1.05, 1.05, 1.05, 1.05, 1.05, 1],
                  }
                : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Greetings />
          </motion.span>
          {showKeyboardHints && (
            <KeyboardHint
              shortcut="about"
              className="absolute left-1/2 top-[calc(100%-0.25rem)] -translate-x-1/2"
            >
              8
            </KeyboardHint>
          )}
        </motion.button>

        {/* LinkedIn */}
        <motion.button
          type="button"
          tabIndex={0}
          title="Find Me on LinkedIn"
          style={{ boxShadow: barShadow }}
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.1 }}
          className="relative h-9 w-9 rounded-full bg-background p-2 text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground md:h-11 md:w-11"
          onClick={() => {
            flashShortcutHint("linkedin");
            handleLinkedInClick();
          }}
        >
          <LinkedIn />
          {showKeyboardHints && (
            <KeyboardHint
              shortcut="linkedin"
              className="absolute left-1/2 top-[calc(100%-0.25rem)] -translate-x-1/2"
            >
              9
            </KeyboardHint>
          )}
        </motion.button>

        <motion.div
          style={{ boxShadow: barShadow }}
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.1 }}
          className="relative z-50 flex h-9 w-9 rounded-full bg-background text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground md:h-11 md:w-11"
          onClick={() => flashShortcutHint("theme")}
        >
          <ThemeToggle buttonRef={themeToggleButtonRef} />
          {showKeyboardHints && (
            <KeyboardHint
              shortcut="theme"
              className="absolute left-1/2 top-[calc(100%-0.25rem)] -translate-x-1/2"
            >
              0
            </KeyboardHint>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
