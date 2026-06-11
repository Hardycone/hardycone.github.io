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

function isEditableKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

function KeyboardHint({
  children,
  isPressed = false,
  anchorX,
}: {
  children: string;
  isPressed?: boolean;
  anchorX: number;
}) {
  return (
    <span
      className="pointer-events-none absolute bottom-[calc(100%-0.25rem)] z-10 -translate-x-1/2 whitespace-nowrap"
      style={{ left: anchorX }}
    >
      <motion.span
        animate={{ scale: isPressed ? 0.9 : 1 }}
        transition={{ duration: 0.08, ease: "easeOut" }}
        className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 font-sans text-xs font-semibold text-background dark:bg-sky-400 dark:text-dark-background"
      >
        {children}
      </motion.span>
    </span>
  );
}

type LinkItemProps = {
  icon: string;
  label: string;
  url: string;
  index: number;
  barShadow: MotionValue<string>;
  onFollow: () => void;
  shortcut: string;
  showKeyboardHints: boolean;
  isShortcutPressed: boolean;
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
  isShortcutPressed,
}: LinkItemProps) {
  const IconComponent = linkIconRegistry[icon];
  const offset = (index + 1) * 60 + 4;
  return (
    <motion.a
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
        <KeyboardHint anchorX={18} isPressed={isShortcutPressed}>
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
  const { barLightShadow, barDarkShadow } = useMouseShadow();
  const barShadow = resolvedTheme === "dark" ? barDarkShadow : barLightShadow;

  const [isOpen, setIsOpen] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [pressedShortcut, setPressedShortcut] = useState<string | null>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const pressedShortcutTimeout = useRef<number | null>(null);

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

  const flashShortcutHint = useCallback((shortcut: string) => {
    setPressedShortcut(shortcut);
    if (pressedShortcutTimeout.current) {
      window.clearTimeout(pressedShortcutTimeout.current);
    }
    pressedShortcutTimeout.current = window.setTimeout(() => {
      setPressedShortcut(null);
      pressedShortcutTimeout.current = null;
    }, 120);
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
        isEditableKeyboardTarget(event.target)
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Shift") {
        setShowKeyboardHints(false);
        return;
      }

      if (event.repeat || isEditableKeyboardTarget(event.target)) return;
      setShowKeyboardHints(true);
    };

    const hideKeyboardHints = () => setShowKeyboardHints(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", hideKeyboardHints);
    window.addEventListener("pointermove", hideKeyboardHints);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", hideKeyboardHints);
      window.removeEventListener("pointermove", hideKeyboardHints);
      if (pressedShortcutTimeout.current) {
        window.clearTimeout(pressedShortcutTimeout.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="case-study-fab"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="pointer-events-none fixed inset-x-0 bottom-4 z-50 m-auto w-full max-w-[1440px] px-1.5 md:px-4"
        >
          <div ref={fabRef} className="pointer-events-auto relative">
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
                      isShortcutPressed={
                        pressedShortcut === linkShortcuts[index]
                      }
                    />
                  ))}
              </AnimatePresence>
            </div>

            {/* FAB toggle button */}
            <motion.button
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
                <KeyboardHint anchorX={22} isPressed={pressedShortcut === "z"}>
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
