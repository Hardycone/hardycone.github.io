"use client";

// import { useTheme } from "next-themes";
import {
  MotionValue,
  // , useTransform
} from "framer-motion";
import {
  ArrowRightIcon,
  PackageIcon,
  BrainIcon,
  FootprintsIcon,
  HeartbeatIcon,
  MapPinIcon,
  PersonSimpleCircleIcon,
  PersonSimpleRunIcon,
  PlugIcon,
  PuzzlePieceIcon,
  TargetIcon,
  TestTubeIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import { useSiteNavigation } from "@/app/context/SiteNavigationContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import CaseStudyFigure from "../CaseStudyFigure";
import HorizontalCardGroup from "../HorizontalCardGroup";
import HighlightCard from "../HighlightCard";
import SectionContainer from "../SectionContainer";
import SubHeading from "../SubHeading";
import SubSectionContainer from "../SubSectionContainer";
import ZoomableImage from "../ZoomableImage";
import {
  ROUNDED_SQUIRCLE_01,
  ROUNDED_SQUIRCLE_03,
  ROUNDED_SQUIRCLE_03_MD,
  ROUNDED_SQUIRCLE_05_MD,
} from "@/lib/styleTokens";

interface CaseStudyFourProps {
  scrollY: MotionValue<number>;
  fadeInFirstSection?: boolean;
  firstSectionFadeReady?: boolean;
}

export default function CaseStudyFour({
  // scrollY,
  fadeInFirstSection = false,
  firstSectionFadeReady = true,
}: CaseStudyFourProps) {
  // const { resolvedTheme } = useTheme();
  const { activeIndex } = useSiteNavigation();
  const theme = useProjectTheme(projects[activeIndex].id);

  // const borderOpacity = useTransform(
  //   scrollY,
  //   [
  //     0,
  //     window.innerHeight * 2,
  //     document.body.scrollHeight - window.innerHeight * 2,
  //     document.body.scrollHeight - window.innerHeight * 1.2,
  //     document.body.scrollHeight - window.innerHeight,
  //   ],
  //   resolvedTheme === "dark" ? [0.25, 0, 0, 0.25, 0] : [1, 0, 0, 1, 0],
  // );

  // const borderColor = useTransform(
  //   borderOpacity,
  //   (opacity) => `rgba(255,255,255,${opacity})`,
  // );

  return (
    <article className="flex flex-col gap-16 md:gap-24">
      <section id="section-1" className="mt-6 scroll-mt-24">
        <SectionContainer
          heading="The Product"
          fadeInOnMount={fadeInFirstSection}
          fadeInReady={firstSectionFadeReady}
          headingIcon={PackageIcon}
          headingSweepAt={100}
          showBorder={false}
          entryOnScroll={false}
        >
          <SubSectionContainer subSectionContainerClassName="gap-4 md:gap-6">
            <SubSectionContainer>
              <p>
                We built a mixed reality interface for a simulated
                Extravehicular Activity (EVA) mission on the lunar surface. The
                system guided an astronaut from suit disconnect through field
                science and a safe return route. on the lunar surface. The
                system guided an astronaut from suit disconnect through field
                science and a safe return route. on the lunar surface. The
                system guided an astronaut from suit disconnect through field
                science and a safe return route.
              </p>
            </SubSectionContainer>
            <HorizontalCardGroup
              alignment="aligned"
              cardSlotClassName="tall:!h-[100svh]"
              bottomMarginOnLarge="1rem"
              cardWidthClassNameOnLarge="md:w-screen"
              maxCardWidthClassNameOnLarge="md:max-w-[177.7778cqh]"
              stickyTopOnLarge="5rem"
              cards={[
                {
                  id: "import",
                  content: (
                    <div className="flex h-full w-full tall:min-h-0 tall:flex-col">
                      <div
                        className={`min-w-0 flex-1 overflow-hidden border border-suits bg-suits tall:min-h-0 ${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
                      >
                        <ZoomableImage
                          src="/images/flux-01.png"
                          alt="Flux prototype import interface"
                          className="[--zoom-preview-padding:1rem] md:[--zoom-preview-padding:2rem]"
                          imageRoundedClassName={`${ROUNDED_SQUIRCLE_01} ${ROUNDED_SQUIRCLE_03_MD}`}
                          unzoomedPadding="var(--zoom-preview-padding)"
                        />
                      </div>
                      <div className="w-[30%] p-6 tall:h-[40svh] tall:w-full tall:shrink-0 tall:overflow-y-auto">
                        <h5 className="font-serif text-[1.5rem] font-bold">
                          Import
                        </h5>
                        <p className="mt-3 !font-serif">
                          Researchers can import their prototypes from Figma or
                          live prototypes hosted anywhere into Flux. For Figma
                          prototypes, Flux can parse the nodes in each flow and
                          render a flow map matching the interactions that exist
                          in the Figma file.
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "configure",
                  content: (
                    <div className="flex h-full w-full tall:min-h-0 tall:flex-col">
                      <div
                        className={`min-w-0 flex-1 overflow-hidden border border-suits bg-suits tall:min-h-0 ${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
                      >
                        <ZoomableImage
                          src="/images/flux-01.png"
                          alt="Flux prototype import interface"
                          className="[--zoom-preview-padding:1rem] md:[--zoom-preview-padding:2rem]"
                          imageRoundedClassName={`${ROUNDED_SQUIRCLE_01} ${ROUNDED_SQUIRCLE_03_MD}`}
                          unzoomedPadding="var(--zoom-preview-padding)"
                        />
                      </div>
                      <div className="w-[30%] p-6 tall:h-[40svh] tall:w-full tall:shrink-0 tall:overflow-y-auto">
                        <h5 className="font-serif text-[1.5rem] font-bold">
                          Configure
                        </h5>
                        <p className="mt-3 !font-serif">
                          Configuring an experiment in Flux is designed to be
                          approachable. Researchers can follow a guided wizard
                          style process to define the hotspots to track,
                          followup questions, and a recruiting plan.
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "report",
                  content: (
                    <div className="flex h-full w-full tall:min-h-0 tall:flex-col">
                      <div
                        className={`min-w-0 flex-1 overflow-hidden border border-suits bg-suits tall:min-h-0 ${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
                      >
                        <ZoomableImage
                          src="/images/flux-01.png"
                          alt="Flux prototype import interface"
                          className="[--zoom-preview-padding:1rem] md:[--zoom-preview-padding:2rem]"
                          imageRoundedClassName={`${ROUNDED_SQUIRCLE_01} ${ROUNDED_SQUIRCLE_03_MD}`}
                          unzoomedPadding="var(--zoom-preview-padding)"
                        />
                      </div>
                      <div className="w-[30%] p-6 tall:h-[40svh] tall:w-full tall:shrink-0 tall:overflow-y-auto">
                        <h5 className="font-serif text-[1.5rem] font-bold">
                          Report
                        </h5>
                        <p className="mt-3 !font-serif">
                          The comprehensive research report offers quantitative
                          insights into user behavior and sentiment, as well as
                          qualitative data to compliment the quantitative
                          analysis. The statistically tested results offer
                          measurable confidence that guides product decisions.
                        </p>
                      </div>
                    </div>
                  ),
                },
              ].map(({ id, content }) => (
                <HighlightCard
                  key={id}
                  highlightCardClassName="flex h-full min-h-[inherit] flex-col border border-suits/50 dark:border-dark-suits/50"
                  contentClassName="flex min-h-0 flex-1 flex-col overflow-auto p-2 tall:overflow-hidden"
                >
                  {content}
                </HighlightCard>
              ))}
            />{" "}
          </SubSectionContainer>

          <SubSectionContainer>
            <p>
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
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-2" className="scroll-mt-24">
        <SectionContainer
          heading="Mission"
          headingIcon={TargetIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>
              Designing the whole EVA, not isolated screens
            </SubHeading>
            <p>
              NASA supplied a task list rather than a conventional product
              brief. We translated it into a continuous journey, including
              failure-prone handoffs between navigation, communication,
              telemetry, and science.
            </p>
          </SubSectionContainer>
          <SubSectionContainer subSectionContainerClassName="gap-0">
            <HorizontalCardGroup
              showBody
              bottomMarginOnLarge="2rem"
              cardWidthClassNameOnLarge="md:w-[80rem]"
              body={
                <SubSectionContainer>
                  <SubHeading>The simulated mission</SubHeading>
                  <p>
                    Each phase had different information needs, but the
                    interface still had to feel like one dependable system. Each
                    phase had different information needs, but the interface
                    still had to feel like one dependable system.
                  </p>
                </SubSectionContainer>
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
              ].map(({ id, content }) => (
                <HighlightCard
                  key={id}
                  highlightCardClassName="flex h-full min-h-[inherit] flex-col"
                  contentClassName="flex min-h-0 flex-1 flex-col overflow-auto p-8"
                >
                  {content}
                </HighlightCard>
              ))}
            />
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          heading="System Design"
          headingIcon={PuzzlePieceIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>Make the right information glanceable</SubHeading>
            <p>
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
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          heading="Human-In-The-Loop Evaluations"
          headingIcon={PersonSimpleCircleIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>Testing behavior, not screen preference</SubHeading>
            <p>
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
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-5" className="scroll-mt-24">
        <SectionContainer
          heading="Field Test"
          headingIcon={PersonSimpleRunIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>NASA Rock Yard, after dark</SubHeading>
            <p>
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
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-6" className="mb-16 scroll-mt-24 md:mb-24">
        <SectionContainer
          heading="Reflection"
          headingIcon={BrainIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>Designing for consequential attention</SubHeading>
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
          </SubSectionContainer>
        </SectionContainer>
      </section>
    </article>
  );
}
