/* eslint-disable @next/next/no-img-element */
"use client";

import { useTheme } from "next-themes";
import { MotionValue, useTransform } from "framer-motion";
import {
  ArrowRightIcon,
  BrainIcon,
  FootprintsIcon,
  HeartbeatIcon,
  MapPinIcon,
  PersonSimpleCircleIcon,
  PersonSimpleRunIcon,
  PlugIcon,
  PuzzlePieceIcon,
  ScrollIcon,
  TargetIcon,
  TestTubeIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import CaseStudyFigure from "../CaseStudyFigure";
import HorizontalFilmstrip from "../HorizontalScrollGroup";
import SectionContainer from "../SectionContainer";
import SubSection from "../SubSection";

interface CaseStudyFourProps {
  scrollY: MotionValue<number>;
}

export default function CaseStudyFour({ scrollY }: CaseStudyFourProps) {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useActiveProject();
  const theme = useProjectTheme(projects[activeIndex].id);

  const borderOpacity = useTransform(
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

  const borderColor = useTransform(
    borderOpacity,
    (opacity) => `rgba(255,255,255,${opacity})`,
  );

  return (
    <article className="flex flex-col gap-12">
      <section id="section-1" className="scroll-mt-24">
        <SectionContainer
          animateHeadingReveal={false}
          title="Quick Take"
          icon={ScrollIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
          revealOnScroll={false}
        >
          <SubSection>
            <p className="px-2">
              For NASA&apos;s SUITS challenge, our multidisciplinary team
              designed and built an augmented-reality interface for a simulated
              lunar EVA. The system guided an astronaut from suit disconnect
              through field science and a safe return route.
            </p>
            <div className="grid gap-px overflow-hidden rounded-1 bg-foreground/10 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-foreground/15 md:grid-cols-3 md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4">
              {[
                ["Scope", "End-to-end EVA task experience"],
                ["Platform", "Mixed reality prototype"],
                ["Validation", "Night test at NASA's Rock Yard"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-background p-5 dark:bg-dark-background"
                >
                  <p className={`mb-1 font-semibold ${theme.textColorClass}`}>
                    {label}
                  </p>
                  <p>{value}</p>
                </div>
              ))}
            </div>
            <CaseStudyFigure caption="The prototype was evaluated outdoors at night with NASA engineers.">
              <img
                src="/images/hero-astrohuskies.jpg"
                alt="Astrohuskies mixed-reality lunar EVA prototype"
                className="h-full max-h-[34rem] w-full rounded-1 object-cover supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4"
              />
            </CaseStudyFigure>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-2" className="scroll-mt-24">
        <SectionContainer
          title="Mission"
          icon={TargetIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSection
            number="1"
            heading="Designing the whole EVA, not isolated screens"
          >
            <p className="px-2">
              NASA supplied a task list rather than a conventional product
              brief. We translated it into a continuous journey, including
              failure-prone handoffs between navigation, communication,
              telemetry, and science.
            </p>
          </SubSection>
          <SubSection spacing="none">
            <HorizontalFilmstrip
              fillAvailableHeight
              bottomMargin="2rem"
              heading="The simulated mission"
              number="2"
              primaryColor={theme.hex.primary}
              body={
                <p>
                  Each phase had different information needs, but the interface
                  still had to feel like one dependable system.
                </p>
              }
              cards={[
                {
                  id: "egress",
                  content: (
                    <>
                      <PlugIcon
                        size={32}
                        weight="duotone"
                        className={theme.textColorClass}
                      />
                      <h4 className="mt-auto pt-8">01 · Egress</h4>
                      <p className="mt-3">
                        Confirm suit readiness and disconnect from the umbilical
                        interface.
                      </p>
                    </>
                  ),
                },
                {
                  id: "traverse",
                  content: (
                    <>
                      <MapPinIcon
                        size={32}
                        weight="duotone"
                        className={theme.textColorClass}
                      />
                      <h4 className="mt-auto pt-8">02 · Traverse</h4>
                      <p className="mt-3">
                        Navigate, drop waypoints, and communicate with a rover.
                      </p>
                    </>
                  ),
                },
                {
                  id: "science",
                  content: (
                    <>
                      <TestTubeIcon
                        size={32}
                        weight="duotone"
                        className={theme.textColorClass}
                      />
                      <h4 className="mt-auto pt-8">03 · Field science</h4>
                      <p className="mt-3">
                        Monitor telemetry, collect a geological sample, and scan
                        it.
                      </p>
                    </>
                  ),
                },
                {
                  id: "return",
                  content: (
                    <>
                      <FootprintsIcon
                        size={32}
                        weight="duotone"
                        className={theme.textColorClass}
                      />
                      <h4 className="mt-auto pt-8">04 · Return</h4>
                      <p className="mt-3">
                        Use recorded waypoints to retrace the route and close
                        the EVA.
                      </p>
                    </>
                  ),
                },
              ]}
            />
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          title="System Design"
          icon={PuzzlePieceIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSection
            number="1"
            heading="Make the right information glanceable"
          >
            <p className="px-2">
              A headset can display almost anything; that made restraint the
              core design problem. Persistent information was limited to mission
              state, safety, and orientation. Everything else appeared when the
              task required it.
            </p>
            <CaseStudyFigure caption="A task-aware HUD kept mission state persistent while contextual tools entered only when needed.">
              <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-1 bg-zinc-950 text-white md:rounded-2">
                <div className="absolute inset-x-5 top-5 flex items-center justify-between font-sans text-xs text-white/70">
                  <span>EVA 01:42:18</span>
                  <span>O₂ 97% · COMMS ONLINE</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-24 rounded-full border border-white/25" />
                  <MapPinIcon
                    size={28}
                    className="absolute text-blue-300"
                    weight="fill"
                  />
                </div>
                <div className="absolute bottom-5 left-5 flex items-center gap-2 font-sans text-xs">
                  <HeartbeatIcon size={18} className="text-blue-300" />
                  TELEMETRY NOMINAL
                </div>
                <div className="absolute bottom-5 right-5 flex items-center gap-2 font-sans text-xs">
                  NEXT: SAMPLE SITE A · 46 M
                  <ArrowRightIcon size={16} />
                </div>
              </div>
            </CaseStudyFigure>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                [
                  "Task-aware",
                  "The interface changed with the mission phase instead of exposing every tool.",
                ],
                [
                  "Redundant",
                  "Critical states used position, language, and visual cues rather than color alone.",
                ],
                [
                  "Hands-light",
                  "Interactions accounted for gloves, limited dexterity, and divided attention.",
                ],
              ].map(([title, copy]) => (
                <div key={title}>
                  <h4 className={theme.textColorClass}>{title}</h4>
                  <p className="mt-2">{copy}</p>
                </div>
              ))}
            </div>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          title="Testing"
          icon={PersonSimpleCircleIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSection
            number="1"
            heading="Testing behavior, not screen preference"
          >
            <p className="px-2">
              We rehearsed the mission as a sequence of physical actions. Tests
              focused on whether participants noticed alerts, recovered their
              orientation, completed tasks, and understood what the system would
              do next.
            </p>
            <div className="grid gap-px overflow-hidden rounded-1 bg-foreground/10 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-foreground/15 md:grid-cols-3 md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4">
              {[
                [
                  "Walkthroughs",
                  "Validated task order and missing states before implementation.",
                ],
                [
                  "Field rehearsals",
                  "Exposed visibility, navigation, and attention problems outdoors.",
                ],
                [
                  "Integrated runs",
                  "Tested the complete EVA with hardware, software, and team comms.",
                ],
              ].map(([title, copy], index) => (
                <div
                  key={title}
                  className="bg-background p-6 dark:bg-dark-background"
                >
                  <span className={`text-sm font-bold ${theme.textColorClass}`}>
                    0{index + 1}
                  </span>
                  <h4 className="mt-6">{title}</h4>
                  <p className="mt-2">{copy}</p>
                </div>
              ))}
            </div>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-5" className="scroll-mt-24">
        <SectionContainer
          title="Field Test"
          icon={PersonSimpleRunIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSection number="1" heading="NASA Rock Yard, after dark">
            <p className="px-2">
              As a SUITS finalist, the team brought the prototype to Johnson
              Space Center. NASA engineers ran the simulated EVA in the Rock
              Yard at night, giving us a realistic test of navigation,
              legibility, task flow, and system coordination.
            </p>
            <p
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              The most meaningful outcome was not a polished demo. It was
              watching a complete mission workflow survive contact with the
              environment it was designed for.
            </p>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-6" className="scroll-mt-24">
        <SectionContainer
          title="Reflection"
          icon={BrainIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSection
            number="1"
            heading="Designing for consequential attention"
          >
            <div className="grid gap-8 md:grid-cols-3">
              {[
                [
                  "Sequence is the interface",
                  "Reliability came from understanding the mission before drawing the HUD.",
                ],
                [
                  "Context earns its place",
                  "Information should appear because the astronaut needs it now.",
                ],
                [
                  "Reality finds the gaps",
                  "Physical testing revealed problems that a headset demo never could.",
                ],
              ].map(([title, copy]) => (
                <div key={title}>
                  <h4>{title}</h4>
                  <p className="mt-2">{copy}</p>
                </div>
              ))}
            </div>
          </SubSection>
        </SectionContainer>
      </section>
    </article>
  );
}
