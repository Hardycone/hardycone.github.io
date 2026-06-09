"use client";
import { motion, AnimatePresence, MotionValue } from "framer-motion";

import { useEffect, useRef, useState, useCallback } from "react";
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

type LinkItemProps = {
  icon: string;
  label: string;
  url: string;
  index: number;
  barShadow: MotionValue<string>;
  onFollow: () => void;
};

function LinkItem({
  icon,
  label,
  url,
  index,
  barShadow,
  onFollow,
}: LinkItemProps) {
  const IconComponent = linkIconRegistry[icon];
  const offset = (index + 1) * 52 + 4;
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
      className="group flex items-center gap-1 rounded-lg bg-background p-2 text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground"
      title={label}
    >
      {IconComponent ? (
        <IconComponent size={20} className="shrink-0" />
      ) : (
        <GlobeIcon size={20} className="shrink-0" />
      )}
      <span className="text-sm">{label}</span>
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
  const fabRef = useRef<HTMLDivElement>(null);

  const project = projects[activeIndex];
  const links = project?.externalLinks ?? [];

  const isVisible = viewMode === "case-study";

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setIsOpen(false);
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
            <div className="absolute bottom-full mb-4 ml-1 flex flex-col-reverse items-start gap-4">
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
                    />
                  ))}
                {isOpen && (
                  <motion.div
                    key="relevant-links-title"
                    style={{
                      textShadow: barShadow,
                      transformOrigin: "18px 18px",
                    }}
                    initial={{ y: (links.length + 1) * 52 + 4, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: (links.length + 1) * 52 + 4, scale: 0 }}
                    transition={{
                      type: "spring",
                      delay: links.length * 0.06,
                      duration: 0.3,
                    }}
                    className="ml-1 text-base text-foreground dark:text-dark-foreground"
                  >
                    Relevant links
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAB toggle button */}
            <motion.button
              style={{ boxShadow: barShadow }}
              transition={{ duration: 0.1 }}
              whileHover={{ scale: 1.1 }}
              onClick={handleToggle}
              className="relative h-9 w-9 rounded-full bg-background p-2 text-foreground transition-colors dark:bg-dark-background dark:text-dark-foreground md:h-11 md:w-11"
              title={isOpen ? "Close links" : "Open links"}
            >
              <FabToggle isOpen={isOpen} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
