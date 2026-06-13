"use client";
import { motion, AnimatePresence, MotionValue } from "framer-motion";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { useViewMode } from "../context/ViewModeContext";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import {
  GithubLogoIcon,
  FigmaLogoIcon,
  GlobeIcon,
  FileTextIcon,
  LinkedinLogoIcon,
  PlayIcon,
  ArticleIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import FabToggle from "./FabToggle";
import KeyboardHint from "./KeyboardHint";
import { useKeyboardHints } from "../context/KeyboardHintsContext";
import { isTextEntryKeyboardTarget } from "@/lib/keyboard";

const linkIconRegistry: Record<string, React.ElementType> = {
  GithubLogoIcon,
  FigmaLogoIcon,
  GlobeIcon,
  FileTextIcon,
  LinkedinLogoIcon,
  PlayIcon,
  ArticleIcon,
};

const linkShortcuts = ["x", "c", "v", "b", "n"];

type LinkItemProps = {
  icon: string;
  label: string;
  url: string;
  index: number;
  barShadow: MotionValue<string>;
  onFollow: () => void;
  shortcut: string;
  showKeyboardHints: boolean;
};

function SplitStaggerText({
  text,
  isVisible,
}: {
  text: string;
  isVisible: boolean;
}) {
  return (
    <span className="inline-flex overflow-hidden font-sans text-sm font-semibold">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ x: -10, opacity: 0 }}
          animate={isVisible ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
          transition={{
            duration: 0.2,
            delay: isVisible ? i * 0.02 : (text.length - i) * 0.01,
            ease: "easeOut",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function LinkItem({
  icon,
  label,
  url,
  index,
  barShadow,
  onFollow,
  shortcut,
  showKeyboardHints,
}: LinkItemProps) {
  const IconComponent = linkIconRegistry[icon];
  const offset = (index + 1) * 60 + 4;
  return (
    <motion.a
      tabIndex={0}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ boxShadow: barShadow, transformOrigin: "18px 18px" }}
      initial={{ y: offset, scale: 0 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ y: offset, scale: 0 }}
      transition={{
        type: "spring",
        delay: index * 0.06,
        duration: 0.3,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      onClick={onFollow}
      className="group relative flex items-center gap-1 rounded-lg bg-background p-2 text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground"
      title={label}
    >
      {IconComponent ? (
        <IconComponent size={20} className="shrink-0" />
      ) : (
        <GlobeIcon size={20} className="shrink-0" />
      )}
      <span className="text-sm">{label}</span>
      {showKeyboardHints && (
        <KeyboardHint
          shortcut={shortcut}
          className="absolute bottom-[calc(100%-0.25rem)] z-10 -translate-x-1/2"
          style={{ left: 18 }}
        >
          {shortcut.toUpperCase()}
        </KeyboardHint>
      )}
    </motion.a>
  );
}

export default function CaseStudyFab() {
  const { viewMode } = useViewMode();
  const { activeIndex } = useActiveProject();
  const { resolvedTheme } = useTheme();
  const { showKeyboardHints, flashShortcutHint } = useKeyboardHints();
  const { barLightShadow, barDarkShadow } = useMouseShadow();
  const barShadow = resolvedTheme === "dark" ? barDarkShadow : barLightShadow;

  const [isOpen, setIsOpen] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  const project = projects[activeIndex];
  const links = useMemo(() => project?.externalLinks ?? [], [project]);

  const isVisible = viewMode === "case-study" && links.length > 0;

  const showLabel = isOpen || isToggleHovered;

  const handleToggle = useCallback(() => {
    setIsToggleHovered(false);
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setIsOpen(false);
      setIsToggleHovered(false);
    }
  }, [isVisible]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible) return;

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

      if (key === "z") {
        event.preventDefault();
        flashShortcutHint("z");
        handleToggle();
        return;
      }

      const shortcutIndex = linkShortcuts.indexOf(key);
      const link = links[shortcutIndex];
      if (!isOpen || shortcutIndex === -1 || !link) return;

      event.preventDefault();
      flashShortcutHint(key);
      window.open(link.url, "_blank", "noopener,noreferrer");
      handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flashShortcutHint, handleClose, handleToggle, isOpen, isVisible, links]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="case-study-fab"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="pointer-events-auto relative"
        >
          <div ref={fabRef} className="relative">
            {/* Link buttons — vertical stack above FAB */}
            <div className="absolute bottom-full mb-6 ml-0 flex flex-col-reverse items-start gap-6 font-serif md:ml-1">
              <AnimatePresence>
                {isOpen &&
                  links.map((link, index) => (
                    <LinkItem
                      key={`${link.label}-${index}`}
                      icon={link.icon}
                      label={link.label}
                      url={link.url}
                      index={index}
                      barShadow={barShadow}
                      onFollow={handleClose}
                      shortcut={linkShortcuts[index]}
                      showKeyboardHints={showKeyboardHints}
                    />
                  ))}
              </AnimatePresence>
            </div>

            {/* FAB toggle button */}
            <motion.button
              type="button"
              tabIndex={0}
              style={{ boxShadow: barShadow }}
              onHoverStart={() => setIsToggleHovered(true)}
              onHoverEnd={() => setIsToggleHovered(false)}
              onClick={handleToggle}
              className={`relative flex h-9 items-center rounded-full bg-background pl-2 text-foreground transition-all dark:bg-dark-background dark:text-dark-foreground md:h-11 ${
                showLabel ? "w-20 gap-2 md:w-24" : "w-9 md:w-11"
              }`}
              title={isOpen ? "Hide relevant links" : "Show relevant links"}
            >
              <div className="h-5 w-5 shrink-0 md:h-7 md:w-7">
                <FabToggle isOpen={isOpen} isHovered={isToggleHovered} />
              </div>
              <AnimatePresence>
                {showLabel && (
                  <motion.div
                    key="label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <SplitStaggerText text="Links" isVisible={showLabel} />
                  </motion.div>
                )}
              </AnimatePresence>
              {showKeyboardHints && (
                <KeyboardHint
                  shortcut="z"
                  className="absolute bottom-[calc(100%-0.25rem)] z-10 -translate-x-1/2"
                  style={{ left: 22 }}
                >
                  Z
                </KeyboardHint>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
