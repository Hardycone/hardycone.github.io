"use client";

/* eslint-disable @next/next/no-img-element */

import { useActiveProject } from "../context/ActiveProjectContext";
import {
  motion,
  AnimatePresence,
  MotionValue,
  useTransform,
} from "framer-motion";
import projects from "@/data/projects";
import {
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
} from "react";
import { useTheme } from "next-themes";
import {
  CaretDownIcon,
  type IconProps,
  PackageIcon,
  PathIcon,
} from "@phosphor-icons/react";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import { hexToRgba } from "@/lib/palette";
import {
  HEADER_CONTENT_START_SVH,
  HEADER_IMAGE_FADE_START_PROGRESS,
} from "@/lib/caseStudyTransitions";

import CaseStudyOne from "./caseStudies/CaseStudyOne";
import CaseStudyTwo from "./caseStudies/CaseStudyTwo";
import CaseStudyThree from "./caseStudies/CaseStudyThree";
import CaseStudyFour from "./caseStudies/CaseStudyFour";
import CaseStudyFive from "./caseStudies/CaseStudyFive";
interface CaseStudyContentProps {
  bottomRevealAnchorRef: RefObject<HTMLDivElement | null>;
  bottomRevealSpacerRef: RefObject<HTMLDivElement | null>;
  scrollY: MotionValue<number>;
  headerIntroProgress: MotionValue<number>;
  isVisible?: boolean;
  exitDirection?: "up" | "down";
  onExitComplete?: () => void;
}

type CaseStudyComponentProps = Pick<CaseStudyContentProps, "scrollY">;

type ProjectSlug = "about-me" | "flux" | "fantail" | "nasa-suits" | "wolcott";

const caseStudyComponents: Record<
  ProjectSlug,
  React.FC<CaseStudyComponentProps>
> = {
  "about-me": CaseStudyOne,
  flux: CaseStudyTwo,
  fantail: CaseStudyThree,
  "nasa-suits": CaseStudyFour,
  wolcott: CaseStudyFive,
};

interface PeekVariant {
  body: ReactNode;
  icon: ComponentType<IconProps>;
  title: string;
}

function getPeekVariant({
  bioFlourishBackground,
  slug,
}: {
  bioFlourishBackground: string;
  slug: ProjectSlug;
}): PeekVariant {
  switch (slug) {
    case "about-me":
      return {
        title: "My Work",
        icon: PathIcon,
        body: (
          <p className="line-clamp-4">
            I’m currently working on{" "}
            <span
              className="-my-[0.5rem] inline-flex translate-y-[0.275em] items-center gap-[0.125em] rounded-[0.125em] p-[0.125em] font-bold"
              style={{ backgroundColor: bioFlourishBackground }}
            >
              <img
                src="/logos/logo-flux.png"
                alt=""
                className="inline-block h-[1.25em] w-[1.25em] max-w-none flex-none object-contain"
              />
              Flux
              <span className="flex h-[1.25em] w-[1.25em] rotate-180 items-center justify-center">
                <CaretDownIcon size="0.75em" weight="fill" />
              </span>
            </span>
            , a quantitative UX research tool that helps teams test designs and
            prototypes with real users quickly and rigorously. The idea came
            from a simple observation my co-founder and I had: AI is making it
            much easier to explore product directions through design and
            prototyping, but teams still need a reliable way to decide which one
            works best. My work focuses on turning a traditionally intimidating
            research process into something approachable, guided, and
            decision-ready. Flux launched publicly in April 2026, and my role
            has since expanded into sales, marketing, and customer development.
          </p>
        ),
      };
    case "flux":
      return {
        title: "The Product",
        icon: PackageIcon,
        body: (
          <p>
            <span className="font-bold text-flux dark:text-dark-flux">
              Flux helps product teams run rigorous experiments on their
              prototypes with ease.
            </span>{" "}
            Users can configure experiments, recruit large participant samples,
            run tests, and get reports within hours. They can learn behavioral
            trends, sentiment differences, and performance variation between
            their prototypes, all without any expertise in quantitative methods.
          </p>
        ),
      };
    case "fantail":
      return {
        title: "The Product",
        icon: PackageIcon,
        body: (
          <p>
            <span className="font-bold text-fantail dark:text-dark-fantail">
              Fantail offered filmmakers focused on the messy early phase where
              a film idea is still a mood, an image, or a fragment of dialogue.
            </span>{" "}
            Our aim was to support that moment without forcing a rigid process.
            Our aim was to support that moment without forcing a rigid process.
            Our aim was to support that moment without forcing a rigid process.
            Our aim was to support that moment without forcing a rigid process.
          </p>
        ),
      };
    case "nasa-suits":
      return {
        title: "The Product",
        icon: PackageIcon,
        body: (
          <p>
            We built a{" "}
            <span className="font-bold text-suits dark:text-dark-suits">
              mixed reality interface for a simulated Extravehicular Activity
              (EVA) mission
            </span>{" "}
            on the lunar surface. The system guided an astronaut from suit
            disconnect through field science and a safe return route. on the
            lunar surface. The system guided an astronaut from suit disconnect
            through field science and a safe return route. on the lunar surface.
            The system guided an astronaut from suit disconnect through field
            science and a safe return route.
          </p>
        ),
      };
    case "wolcott":
      return {
        title: "The Product",
        icon: PackageIcon,
        body: (
          <p>
            This project saw the redesign of a Wolcott&rsquo;s urban core{" "}
            <span className="font-bold text-wolcott dark:text-dark-wolcott">
              mixed reality interface for a simulated Extravehicular Activity
              (EVA) mission
            </span>{" "}
            on the lunar surface. The system guided an astronaut from suit
            disconnect through field science and a safe return route.{" "}
          </p>
        ),
      };
  }
}

const contentVariants = {
  initial: { y: 200, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: (direction: "up" | "down") => ({
    y: direction === "up" ? -500 : 500,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  }),
};

export default function CaseStudyContent({
  bottomRevealAnchorRef,
  bottomRevealSpacerRef,
  scrollY,
  headerIntroProgress,
  isVisible = true,
  exitDirection = "down",
  onExitComplete,
}: CaseStudyContentProps) {
  const { activeIndex } = useActiveProject();
  const { resolvedTheme } = useTheme();
  const fluxTheme = useProjectTheme("flux");

  const project = projects[activeIndex];
  const slug = project.slug as ProjectSlug;
  const CaseStudyComponent = caseStudyComponents[slug];
  const peekOpacity = useTransform(headerIntroProgress, (progress) =>
    progress < HEADER_IMAGE_FADE_START_PROGRESS ? 1 : 0,
  );
  const contentOpacity = useTransform(headerIntroProgress, (progress) =>
    progress < HEADER_IMAGE_FADE_START_PROGRESS ? 0 : 1,
  );
  const peekBorderOpacity = useTransform(
    scrollY,
    [
      0,
      window.innerHeight * 2,
      document.body.scrollHeight - window.innerHeight * 2,
      document.body.scrollHeight - window.innerHeight * 1.2,
      document.body.scrollHeight - window.innerHeight,
    ],
    resolvedTheme === "dark" ? [0.25, 0, 0, 0.25, 0] : [1, 0, 0, 1, 0],
  );
  const peekBorderColor = useTransform(
    peekBorderOpacity,
    (opacity) => `rgba(255,255,255,${opacity})`,
  );
  const peekVariant = getPeekVariant({
    slug,
    bioFlourishBackground: hexToRgba(fluxTheme.hex.primary, 0.03),
  });
  const PeekIcon = peekVariant.icon;

  // Dispatch event after animation completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("case-study-loaded"));
    }, 600);

    return () => clearTimeout(timeout);
  }, [project.id]);

  return (
    <div className="flex w-full min-w-0 flex-col">
      {isVisible && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-[calc(100svh-3.5rem)] z-40 mx-auto h-16 w-[calc(100vw-1rem)] max-w-6xl md:top-[calc(100svh-5rem)] md:h-24 md:w-[calc(100vw-2rem)]"
          style={{ opacity: peekOpacity }}
        >
          <motion.div
            key={`peek-${project.id}`}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            className="flex w-full flex-col rounded-6 border bg-background/90 p-2 text-foreground supports-[corner-shape:squircle]:rounded-12 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-background/90 dark:text-dark-foreground md:rounded-8 md:p-6 supports-[corner-shape:squircle]:md:rounded-16"
            style={{ borderColor: peekBorderColor }}
          >
            <div className="mb-2 flex w-fit max-w-full items-start gap-1">
              <span className="inline-flex h-[2.34375rem] w-[1.875rem] shrink-0 items-center justify-center md:h-[2.8125rem] md:w-[2.25rem]">
                <PeekIcon
                  weight="fill"
                  className="size-[1.875rem] md:size-[2.25rem]"
                />
              </span>
              <h3>{peekVariant.title}</h3>
            </div>
            <div className="invisible h-0.5 w-full rounded-full" />
            <div className="flex flex-col gap-8 p-2 md:p-6">
              {peekVariant.body}
            </div>
          </motion.div>
        </motion.div>
      )}
      <div
        className="h-[calc(var(--header-content-start)-3.5rem)] md:h-[calc(var(--header-content-start)-5rem)]"
        style={
          {
            "--header-content-start": `${HEADER_CONTENT_START_SVH}svh`,
          } as CSSProperties
        }
      />
      <motion.div
        className="relative left-1/2 z-40 w-[calc(100vw-1rem)] min-w-0 max-w-6xl -translate-x-1/2 md:w-[calc(100vw-2rem)]"
        style={{ opacity: contentOpacity }}
      >
        <AnimatePresence
          mode="wait"
          custom={exitDirection}
          onExitComplete={onExitComplete}
        >
          {isVisible && (
            <motion.div
              key={project.id}
              custom={exitDirection}
              variants={contentVariants}
              initial={false}
              animate="animate"
              exit="exit"
              className="relative z-40 flex w-full min-w-0 flex-col"
            >
              <CaseStudyComponent scrollY={scrollY} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div
        ref={bottomRevealAnchorRef}
        data-bottom-reveal-anchor
        aria-hidden="true"
        className="h-0 w-full"
      />
      <div
        ref={bottomRevealSpacerRef}
        data-bottom-reveal-spacer
        aria-hidden="true"
        className="h-[max(60lvh,300px)] w-full"
      />
    </div>
  );
}
