"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import { useTheme } from "next-themes";

import projects from "@/data/projects";
import { useIsMdUp } from "@/hooks/useIsMdUp";
import { useMouseShadow } from "@/hooks/useMouseShadow";
import { useCanHover } from "@/hooks/useCanHover";
import { useSiteNavigation } from "../context/SiteNavigationContext";
import AnimatedGlyph from "./AnimatedGlyph";

interface CaseStudyGlyphMenuProps {
  isOpen: boolean;
  navigationLocked?: boolean;
  onClose: () => void;
  onHomeClick: () => void;
  onProjectNavigationStart: (index: number) => boolean;
}

const MENU_SEQUENCE_TIME_SCALE = 1;
const LABEL_SEQUENCE_SPEED = 2;
const LABEL_CHARACTER_STAGGER =
  (0.025 / LABEL_SEQUENCE_SPEED) * MENU_SEQUENCE_TIME_SCALE;
const BUTTON_STAGGER =
  (0.1 / LABEL_SEQUENCE_SPEED) * MENU_SEQUENCE_TIME_SCALE;
const BUTTON_MOTION_DURATION = 0.3 * MENU_SEQUENCE_TIME_SCALE;
const LABEL_ENTRY_ADVANCE = 0.2 * MENU_SEQUENCE_TIME_SCALE;
const LABEL_EASE = [0.22, 1, 0.36, 1] as const;

const getNaturalLabelExpansionDuration = (label: string) =>
  (0.18 / LABEL_SEQUENCE_SPEED) * MENU_SEQUENCE_TIME_SCALE +
  label.length * LABEL_CHARACTER_STAGGER;

const LABEL_ANIMATION_DURATION = Math.max(
  getNaturalLabelExpansionDuration("Home"),
  ...projects.map((project) =>
    getNaturalLabelExpansionDuration(project.title),
  ),
);

function MenuLabel({
  label,
  enterDelay = 0,
  exitDelay = 0,
  barShadow,
  canHover,
  disabled = false,
  onClick,
  className = "",
  style,
}: {
  label: string;
  enterDelay?: number;
  exitDelay?: number;
  barShadow: MotionValue<string>;
  canHover: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const expansionDuration = LABEL_ANIMATION_DURATION;
  const characterExitDuration = expansionDuration / (label.length + 2);

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`pointer-events-auto absolute -ml-4 py-2 pl-4 md:py-4 ${className}`}
    >
      <motion.button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={onClick}
        initial={{ x: -6 }}
        animate={{ x: 0 }}
        whileHover={canHover && !disabled ? { scale: 1.1 } : undefined}
        transition={{
          x: {
            delay: enterDelay,
            duration:
              (0.24 / LABEL_SEQUENCE_SPEED) * MENU_SEQUENCE_TIME_SCALE,
            ease: LABEL_EASE,
          },
          scale: { duration: 0.2 },
        }}
        className="relative cursor-pointer whitespace-nowrap font-sans text-sm text-foreground disabled:cursor-default dark:text-dark-foreground"
      >
        <motion.span
          data-cursor-shadow
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{
            scaleX: 0,
            transition: {
              delay: exitDelay,
              duration: expansionDuration,
              ease: "linear",
            },
          }}
          transition={{
            scaleX: {
              delay: enterDelay,
              duration: expansionDuration,
              ease: LABEL_EASE,
            },
            opacity: {
              delay: enterDelay,
              duration:
                (0.12 / LABEL_SEQUENCE_SPEED) * MENU_SEQUENCE_TIME_SCALE,
              ease: "easeOut",
            },
          }}
          style={{ boxShadow: barShadow }}
          className="absolute inset-0 origin-left rounded-md bg-background dark:bg-dark-background"
        />

        <span className="relative z-10 flex px-2 py-1">
          {Array.from(label).map((character, index) => (
            <motion.span
              // A character and its position together form a stable key for repeated letters.
              key={`${character}-${index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: -8,
                transition: {
                  delay:
                    exitDelay +
                    (label.length - index - 1) * characterExitDuration,
                  duration: characterExitDuration,
                  ease: "easeIn",
                },
              }}
              transition={{
                // Keep the expanding background ahead of each character.
                delay:
                  enterDelay +
                  expansionDuration * ((index + 2) / (label.length + 2)),
                duration:
                  (0.18 / LABEL_SEQUENCE_SPEED) * MENU_SEQUENCE_TIME_SCALE,
                ease: "easeOut",
              }}
            >
              {character === " " ? "\u00a0" : character}
            </motion.span>
          ))}
        </span>
      </motion.button>
    </div>
  );
}

export default function CaseStudyGlyphMenu({
  isOpen,
  navigationLocked = false,
  onClose,
  onHomeClick,
  onProjectNavigationStart,
}: CaseStudyGlyphMenuProps) {
  const { activeIndex, viewMode } = useSiteNavigation();
  const [pendingProjectIndex, setPendingProjectIndex] = useState<number | null>(
    null,
  );
  const { resolvedTheme } = useTheme();
  const { barLightShadow, barDarkShadow } = useMouseShadow();
  const isMdUp = useIsMdUp();
  const canHover = useCanHover();

  const barShadow = resolvedTheme === "dark" ? barDarkShadow : barLightShadow;
  const glyphSize = isMdUp ? 44 : 36;
  const glyphGap = isMdUp ? 16 : 8;
  const itemStride = glyphSize + glyphGap;
  const isInteractive =
    viewMode === "case-study" &&
    !navigationLocked &&
    pendingProjectIndex === null;

  useEffect(() => {
    if (pendingProjectIndex === null || activeIndex !== pendingProjectIndex) {
      return;
    }

    setPendingProjectIndex(null);
  }, [activeIndex, pendingProjectIndex]);

  useEffect(() => {
    if (pendingProjectIndex === null) return;

    const timeout = window.setTimeout(() => {
      setPendingProjectIndex(null);
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [pendingProjectIndex]);

  const handleProjectClick = (index: number) => {
    if (!isInteractive) return;

    if (index === activeIndex) {
      onClose();
      return;
    }

    if (!onProjectNavigationStart(index)) return;

    setPendingProjectIndex(index);
    onClose();
  };

  return (
    <AnimatePresence>
      {viewMode === "case-study" && isOpen && (
        <motion.nav
          key="case-study-glyph-menu"
          aria-label="Projects"
          className="pointer-events-auto absolute left-0 top-full flex flex-col items-center gap-2 pt-2 md:gap-4 md:pt-4"
        >
          <MenuLabel
            label="Home"
            barShadow={barShadow}
            canHover={canHover}
            onClick={onHomeClick}
            enterDelay={
              BUTTON_MOTION_DURATION - BUTTON_STAGGER - LABEL_ENTRY_ADVANCE
            }
            exitDelay={projects.length * BUTTON_STAGGER}
            className="left-[calc(100%+1rem)] -translate-y-1/2"
            style={{ top: -glyphSize / 2, zIndex: projects.length + 1 }}
          />

          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            const travelOffset = -(index + 1) * itemStride;
            const buttonEntryDelay = index * BUTTON_STAGGER;
            const labelEntryDelay =
              buttonEntryDelay +
              BUTTON_MOTION_DURATION -
              LABEL_ENTRY_ADVANCE;
            const reverseExitIndex = projects.length - index - 1;
            const labelExitDelay = reverseExitIndex * BUTTON_STAGGER;
            const buttonExitDelay =
              labelExitDelay + LABEL_ANIMATION_DURATION;

            return (
              <motion.div
                key={project.id}
                initial={{ y: travelOffset }}
                animate={{ y: 0 }}
                exit={{
                  y: travelOffset,
                  transition: {
                    type: "spring",
                    delay: buttonExitDelay,
                    duration: BUTTON_MOTION_DURATION,
                    ease: "easeOut",
                  },
                }}
                transition={{
                  type: "spring",
                  delay: buttonEntryDelay,
                  duration: BUTTON_MOTION_DURATION,
                  ease: "easeOut",
                }}
                style={{
                  zIndex: projects.length - index,
                }}
                className="relative h-9 w-9 shrink-0 rounded-full md:h-11 md:w-11"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{
                    scale: 0,
                    transition: {
                      type: "spring",
                      delay: buttonExitDelay,
                      duration: BUTTON_MOTION_DURATION,
                      ease: "easeOut",
                    },
                  }}
                  transition={{
                    type: "spring",
                    delay: buttonEntryDelay,
                    duration: BUTTON_MOTION_DURATION,
                    ease: "easeOut",
                  }}
                  className="h-full w-full rounded-full"
                >
                  <motion.button
                    data-cursor-shadow
                    type="button"
                    aria-label={project.title}
                    aria-current={isActive ? "page" : undefined}
                    disabled={!isInteractive}
                    whileHover={canHover ? { scale: 1.1 } : undefined}
                    transition={{ duration: 0.2 }}
                    style={{
                      boxShadow: barShadow,
                      transformOrigin: "center",
                    }}
                    className={`relative h-full w-full cursor-pointer touch-manipulation select-none overflow-hidden rounded-full bg-background p-0.5 dark:bg-dark-background md:p-0 ${index === 0 ? "glyph-one" : index === 2 ? "glyph-three" : ""}`}
                    onClick={() => handleProjectClick(index)}
                  >
                    <AnimatedGlyph
                      animationData={project.glyphAnimation}
                      isActive={isActive}
                      shouldAnimate={false}
                      colorPalette={index === 2 ? "glyph-three" : undefined}
                    />
                  </motion.button>
                </motion.div>

                <MenuLabel
                  label={project.title}
                  barShadow={barShadow}
                  canHover={canHover}
                  disabled={!isInteractive}
                  onClick={() => handleProjectClick(index)}
                  enterDelay={labelEntryDelay}
                  exitDelay={labelExitDelay}
                  className="left-[calc(100%+1rem)] top-1/2 -translate-y-1/2"
                />
              </motion.div>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
