/* eslint-disable @next/next/no-img-element */
"use client";

import {
  type CSSProperties,
  type MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownIcon } from "@phosphor-icons/react";
import HighlightCard from "./HighlightCard";

type Month = { year: number; month: number };

type Experience = {
  id: string;
  start: Month;
  end: Month | null;
  name: string;
  role: string;
  logo: string;
  darkLogo?: string;
  logoClassName?: string;
  summary?: string;
  highlights?: string[];
};

const INITIAL_PRESENT: Month = { year: 2026, month: 10 };
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const experiences: Experience[] = [
  {
    id: "flux",
    start: { year: 2024, month: 6 },
    end: null,
    name: "Product Designer / Co-founder",
    role: "Flux",
    logo: "/logos/logo-flux.png",
    summary:
      "A quantitative UX research platform that helps teams test designs and prototypes with real users.",
    highlights: [
      "Led Flux from concept to public launch, shaping product strategy, core workflows, interaction patterns, visual system, and brand identity",
      "Translated statistical research methods into guided study setup flows that are approachable without compromising rigor",
      "Designed data-heavy reporting experiences that turned prototype behavior, confidence intervals, and user feedback into decision-ready insights",
      "Led discovery interviews and live demos with designers, PMs, and researchers, using feedback to refine product decisions, positioning, and go-to-market direction",
    ],
  },
  {
    id: "fantail",
    start: { year: 2023, month: 9 },
    end: { year: 2024, month: 5 },
    name: "Product Designer / Co-founder",
    role: "Fantail",
    logo: "/logos/logo-fantail.svg",
    summary: "An AI-assisted story development platform for filmmakers.",
    highlights: [
      "Co-founded Fantail and led much of the product design, taking an AI-assisted filmmaking concept through discovery, product definition, and an early MVP",
      "Conducted and synthesized research with dozens of working filmmakers, identifying lack of creative control as a key barrier to adopting existing AI tools",
      "Translated that insight into a scene-by-scene product architecture where scripts connected moodboards, visual references, editable storyboards, generated imagery, dialogue, and animatics",
    ],
  },
  {
    id: "mhcid",
    start: { year: 2022, month: 9 },
    end: { year: 2023, month: 8 },
    name: "Master of Human-Computer Interaction and Design",
    role: "University of Washington, Seattle, WA",
    logo: "/logos/logo-uw.png",
    darkLogo: "/logos/logo-uw-gold.png",
  },
  {
    id: "aslf-director",
    start: { year: 2020, month: 1 },
    end: { year: 2022, month: 8 },
    name: "Design Director",
    role: "ASLF, Inc.",
    logo: "/logos/logo-aslf.png",
    darkLogo: "/logos/logo-aslf-inverted.png",
    summary:
      "Led environmental-justice and community-driven design work across the U.S., from parks and public spaces to green infrastructure and revitalization projects.",
    highlights: [
      "Led dozens of public-space, green-infrastructure, and community-revitalization projects across the U.S., coordinating work across communities, public agencies, technical partners, and funders",
      "Led research and participatory design with residents and local organizations, translating community priorities and environmental constraints into actionable plans",
      "Directed projects from early research and planning through funding, design, technical coordination, and implementation",
      "Co-wrote successful grant proposals that secured $3.6M+ in public funding, including awards from EPA, NOAA, USDA, New York State, and local governments",
    ],
  },
  {
    id: "aslf-landscape-designer",
    start: { year: 2015, month: 1 },
    end: { year: 2019, month: 12 },
    name: "Landscape Designer",
    role: "ASLF, Inc.",
    logo: "/logos/logo-aslf.png",
    darkLogo: "/logos/logo-aslf-inverted.png",
    summary:
      "Designed public spaces and green infrastructure, from site and systems analysis through implementation support.",
    highlights: [
      "Designed public-space and green-infrastructure projects from site and systems analysis through concept development, documentation, and implementation support",
    ],
  },
  {
    id: "esf",
    start: { year: 2011, month: 8 },
    end: { year: 2014, month: 12 },
    name: "Master of Landscape Architecture",
    role: "State University of New York, Syracuse, NY",
    logo: "/logos/logo-esf.png",
    darkLogo: "/logos/logo-esf-light.png",
  },
  {
    id: "bnu",
    start: { year: 2007, month: 9 },
    end: { year: 2011, month: 7 },
    name: "Beijing Normal University",
    role: "Bachelor of Science in Environmental Science",
    logo: "/logos/logo-bnu.png",
    logoClassName: "dark:brightness-[50] dark:saturate-0",
  },
];

function monthNumber(date: Month) {
  return date.year * 12 + date.month - 1;
}

function formatMonth(date: Month) {
  return `${MONTH_NAMES[date.month - 1]} ${date.year}`;
}

function monthPosition(months: number) {
  return `calc(${months} * var(--timeline-month-height))`;
}

function ExperienceContent({
  experience,
  expandedForMeasurement = false,
}: {
  experience: Experience;
  expandedForMeasurement?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const expanded = expandedForMeasurement || isExpanded;
  const highlightsId = `experience-${experience.id}-highlights${expandedForMeasurement ? "-measurement" : ""}`;
  const duration = shouldReduceMotion ? 0 : 0.3;
  const canExpand = !expandedForMeasurement && !!experience.highlights?.length;
  const handleCardClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest(
        "a, button, input, select, textarea, [role='button']",
      )
    ) {
      return;
    }

    const selection = window.getSelection();
    if (
      selection &&
      !selection.isCollapsed &&
      selection.containsNode(event.currentTarget, true)
    ) {
      return;
    }

    setIsExpanded((current) => !current);
  };

  return (
    <HighlightCard
      highlightOnHover
      highlightCardClassName={`border border-intro/50 dark:border-dark-intro/50 ${canExpand ? "cursor-pointer" : ""}`}
      contentClassName="min-w-0 p-4 md:p-6"
      onClick={canExpand ? handleCardClick : undefined}
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className="flex size-[43.25px] shrink-0 items-center justify-center md:size-[49px]">
          {experience.darkLogo ? (
            <>
              <img
                src={experience.logo}
                alt=""
                className={`size-full object-contain dark:hidden ${experience.logoClassName ?? ""}`}
              />
              <img
                src={experience.darkLogo}
                alt=""
                className={`hidden size-full object-contain dark:block ${experience.logoClassName ?? ""}`}
              />
            </>
          ) : (
            <img
              src={experience.logo}
              alt=""
              className={`size-full object-contain ${experience.logoClassName ?? ""}`}
            />
          )}
        </div>
        <div className="min-w-0">
          <h5 className="font-sans text-[1rem] md:text-[1.125rem]">
            {experience.name}
          </h5>
          <p>{experience.role}</p>
        </div>
      </div>
      {experience.summary ? (
        <div className="mt-6 flex items-start gap-3">
          <p className="min-w-0 flex-1">{experience.summary}</p>
          {experience.highlights ? (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={highlightsId}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${experience.name} highlights`}
              disabled={expandedForMeasurement}
              onClick={() => setIsExpanded((current) => !current)}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-dark-foreground"
            >
              <motion.span
                className="flex"
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
              >
                <ArrowDownIcon size={24} aria-hidden="true" />
              </motion.span>
            </button>
          ) : null}
        </div>
      ) : null}
      {experience.highlights ? (
        <motion.div
          id={highlightsId}
          aria-hidden={!expanded}
          inert={!expanded}
          initial={false}
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <ul className="list-disc space-y-2 pl-5 pt-4 font-sans text-sm font-light leading-snug text-foreground-ultralight dark:text-dark-foreground-ultralight md:text-base">
            {experience.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </HighlightCard>
  );
}

export default function ExperienceTimeline() {
  const [present, setPresent] = useState<Month>(INITIAL_PRESENT);
  const [monthHeight, setMonthHeight] = useState<number | null>(null);
  const measurementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const measurement = measurementRef.current;
    if (!measurement) return;

    const fantail = experiences.find(
      (experience) => experience.id === "fantail",
    )!;
    const durationMonths =
      monthNumber(fantail.end!) - monthNumber(fantail.start) + 1;
    const updateMonthHeight = () => {
      // Reserve the complete expanded description, 24px row padding, and 24px
      // breathing room within Fantail's nine months. All rows share this scale.
      const nextHeight = Math.max(
        48,
        Math.ceil((measurement.offsetHeight + 48) / durationMonths),
      );
      setMonthHeight((current) =>
        current === nextHeight ? current : nextHeight,
      );
    };

    updateMonthHeight();
    const observer = new ResizeObserver(updateMonthHeight);
    observer.observe(measurement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    setPresent((current) =>
      current.year === year && current.month === month
        ? current
        : { year, month },
    );
  }, []);

  const presentNumber = monthNumber(present);
  const timelineMonths =
    presentNumber - monthNumber(experiences[experiences.length - 1].start) + 1;
  const years = useMemo(
    () =>
      Array.from(
        {
          length:
            present.year - experiences[experiences.length - 1].start.year + 1,
        },
        (_, index) => {
          const year = present.year - index;
          const newestMonth = year === present.year ? present.month : 12;
          const oldestMonth =
            year === experiences[experiences.length - 1].start.year
              ? experiences[experiences.length - 1].start.month
              : 1;
          return {
            year,
            durationMonths: newestMonth - oldestMonth + 1,
          };
        },
      ),
    [present.year, present.month],
  );
  const months = useMemo(
    () =>
      Array.from({ length: timelineMonths }, (_, offset) => {
        const number = presentNumber - offset;
        return {
          year: Math.floor(number / 12),
          month: (number % 12) + 1,
        };
      }),
    [presentNumber, timelineMonths],
  );

  return (
    <div
      className="relative grid min-w-0 grid-cols-[2.25rem_4.5rem_minmax(0,1fr)] gap-2 [--timeline-month-height:64px] md:grid-cols-[4rem_7rem_minmax(0,1fr)] md:gap-3 md:[--timeline-month-height:48px]"
      style={
        {
          height: monthPosition(timelineMonths),
          ...(monthHeight === null
            ? {}
            : { "--timeline-month-height": `${monthHeight}px` }),
        } as CSSProperties
      }
      role="region"
      aria-label="Career timeline, newest to oldest"
    >
      <div className="relative min-w-0" aria-hidden="true">
        {years.map(({ year, durationMonths }) => (
          <div
            key={year}
            data-timeline-year={year}
            className="relative"
            style={{ height: monthPosition(durationMonths) }}
          >
            <div
              className="sticky top-24 flex items-center"
              style={{ height: monthPosition(1) }}
            >
              <span className="font-sans text-xs font-semibold text-foreground dark:text-dark-foreground md:text-sm">
                {year}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="relative min-w-0" aria-hidden="true">
        <ol>
          {months.map(({ year, month }) => (
            <li
              key={`${year}-${month}`}
              data-timeline-month={`${year}-${String(month).padStart(2, "0")}`}
              className="relative flex items-center justify-between py-3 font-sans text-[0.625rem] text-foreground-ultralight dark:text-dark-foreground-ultralight md:text-xs"
              style={{ height: monthPosition(1) }}
            >
              <span>{MONTH_NAMES[month - 1]}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="relative min-w-0">
        <div
          ref={measurementRef}
          aria-hidden="true"
          inert
          className="pointer-events-none invisible absolute inset-x-0 top-0"
        >
          <ExperienceContent
            experience={
              experiences.find((experience) => experience.id === "fantail")!
            }
            expandedForMeasurement
          />
        </div>
        <ol className="relative min-w-0">
          {experiences.map((experience) => {
            const durationMonths =
              (experience.end ? monthNumber(experience.end) : presentNumber) -
              monthNumber(experience.start) +
              1;
            return (
              <li
                key={experience.id}
                data-experience={experience.id}
                aria-label={`${experience.role}: ${formatMonth(experience.start)} to ${formatMonth(experience.end ?? present)}`}
                className="relative min-w-0 py-3"
                style={{ height: monthPosition(durationMonths) }}
              >
                <div className="sticky top-24 z-10">
                  <ExperienceContent experience={experience} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
