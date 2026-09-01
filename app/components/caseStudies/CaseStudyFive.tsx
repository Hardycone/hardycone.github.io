/* eslint-disable @next/next/no-img-element */
"use client";

import { useTheme } from "next-themes";
import { MotionValue, useTransform } from "framer-motion";
import {
  BrainIcon,
  BuildingsIcon,
  PackageIcon,
  CheckCircleIcon,
  CompassRoseIcon,
  MagnifyingGlassIcon,
  PathIcon,
  PresentationChartIcon,
  ScrollIcon,
  SealQuestionIcon,
  TreeIcon,
  UsersThreeIcon,
  WavesIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import CaseStudyFigure from "../CaseStudyFigure";
import HorizontalCardGroup from "../HorizontalCardGroup";
import HighlightCard from "../HighlightCard";
import SectionContainer from "../SectionContainer";
import SubHeading from "../SubHeading";
import SubSectionContainer from "../SubSectionContainer";

interface CaseStudyFiveProps {
  scrollY: MotionValue<number>;
}

export default function CaseStudyFive({ scrollY }: CaseStudyFiveProps) {
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
          showHeadingSweep={false}
          heading="The Product"
          headingIcon={PackageIcon}
          borderColor={borderColor}
          exitOnScroll
          entryOnScroll={false}
        >
          <p>
            This project saw the redesign of a Wolcott&rsquo;s urban core{" "}
            <span className="font-bold text-wolcott dark:text-dark-wolcott">
              mixed reality interface for a simulated Extravehicular Activity
              (EVA) mission
            </span>{" "}
            on the lunar surface. The system guided an astronaut from suit
            disconnect through field science and a safe return route.{" "}
          </p>
        </SectionContainer>
      </section>
      <section>
        <HorizontalCardGroup
          alignment="centered"
          bottomMarginOnLarge="2rem"
          setCardAspectRatioOnLarge
          cardAspectRatioOnLarge="16/9"
          stickyTopOnLarge="5rem"
          cards={[
            [
              "Import",
              "Import design prototypes",
              "Researchers can bring in interactive prototypes created in Figma, or live hosted prototypes.",
            ],
            [
              "Configure",
              "Configure the experiment",
              "Researchers can then configure their experiment in a few simple clicks. They can set up button tracking, turn on click heatmapping, add a AI-moderated qualitative think-aloud session, and add follow-up questions for participants to answer after they go through the prototype.",
            ],
            [
              "Recruit",
              "Set a recruit goal and choose participant source",
              "Researchers can then set a goal for their experiment. Flux gives guidelines on how to set a sample size according to statistical best practices. Researchers also have the option to either generate a link to share with their own panel, or recreate with Flux by a click of a button.",
            ],
            [
              "Test",
              "Once the experiment is launched, participant results immediately start being recorded",
              "There is not much to do other than wait",
            ],
            [
              "Report",
              "Get report within hours",
              "Researchers usually get results back within a few hours, complete with statistical tests and confidence intervals, turning a rigorous process that traditionally takes weeks into something done over lunch",
            ],
          ].map(([number, title, copy]) => (
            <HighlightCard
              key={title}
              className="flex h-full min-h-[inherit] flex-col"
              contentClassName="flex min-h-0 flex-1 flex-col overflow-auto p-8"
            >
              <span className={`text-sm font-bold ${theme.textColorClass}`}>
                {number}
              </span>
              <h4 className="mt-auto pt-8">{title}</h4>
              <p className="mt-3">{copy}</p>
            </HighlightCard>
          ))}
        />
        <SectionContainer
          showHeadingSweep={false}
          heading="Quick Take"
          headingIcon={ScrollIcon}
          headingBaseColorClassName="text-foreground dark:text-dark-foreground"
          borderColor={borderColor}
          exitOnScroll
          entryOnScroll={false}
        >
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
            <CaseStudyFigure caption="The prototype was evaluated outdoors at night with NASA engineers.">
              <img
                src="/images/hero-astrohuskies.jpg"
                alt="Astrohuskies mixed-reality lunar EVA prototype"
                className="h-full max-h-[34rem] w-full rounded-1 object-cover supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4"
              />
            </CaseStudyFigure>
          </SubSectionContainer>
        </SectionContainer>
      </section>
      <section id="section-1" className="scroll-mt-24">
        <SectionContainer
          showHeadingSweep={false}
          heading="Quick Take"
          headingIcon={ScrollIcon}
          headingBaseColorClassName="text-foreground dark:text-dark-foreground"
          borderColor={borderColor}
          exitOnScroll
          entryOnScroll={false}
        >
          <SubSectionContainer>
            <p>
              Wolcott Falls was a NOAA-funded effort to turn a valued but
              underused natural landmark into a catalyst for the village center.
              As project manager, I led a five-workshop co-design process from
              community listening through an actionable design packet.
            </p>
            <div className="grid gap-px overflow-hidden rounded-1 bg-foreground/10 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-foreground/15 md:grid-cols-3 md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4">
              {[
                ["Role", "Project manager · Community design lead"],
                ["Process", "Five public co-design workshops"],
                ["Legacy", "Continued funding · Groundbreaking in 2026"],
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
            <CaseStudyFigure caption="Wolcott Falls became the organizing landmark for a broader village-center strategy.">
              <img
                src="/images/hero-wolcott.jpg"
                alt="Wolcott Falls and the surrounding village landscape"
                className="h-full max-h-[34rem] w-full rounded-1 object-cover supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4"
              />
            </CaseStudyFigure>
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-2" className="scroll-mt-24">
        <SectionContainer
          heading="Context"
          headingIcon={SealQuestionIcon}
          headingBaseColorClassName="text-foreground dark:text-dark-foreground"
          borderColor={borderColor}
        >
          <SubSectionContainer>
            <SubHeading showNumber number="1">
              More than a beautification project
            </SubHeading>
            <p>
              The falls sat close to Main Street but felt disconnected from
              daily village life. Access, visibility, gathering space, and
              watershed health were intertwined—and residents had seen plans
              arrive before without a clear path to implementation.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Place",
                  copy: "Reveal the falls and connect them to the village core.",
                  icon: BuildingsIcon,
                },
                {
                  title: "Community",
                  copy: "Create spaces residents would recognize as their own.",
                  icon: UsersThreeIcon,
                },
                {
                  title: "Watershed",
                  copy: "Pair public access with erosion and runoff improvements.",
                  icon: WavesIcon,
                },
              ].map(({ title, copy, icon: Icon }) => (
                <div
                  key={title}
                  className="border-l-2 pl-4"
                  style={{ borderColor: theme.hex.primary }}
                >
                  <Icon
                    size={28}
                    weight="duotone"
                    className={theme.textColorClass}
                  />
                  <h4 className="mt-4">{title}</h4>
                  <p className="mt-2">{copy}</p>
                </div>
              ))}
            </div>
            <p
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              The real design question was how to turn local pride into a
              shared, fundable sequence of projects.
            </p>
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          heading="Co-Design"
          headingIcon={MagnifyingGlassIcon}
          headingBaseColorClassName="text-foreground dark:text-dark-foreground"
          borderColor={borderColor}
        >
          <SubSectionContainer>
            <SubHeading showNumber number="1">
              Five workshops, one continuous conversation
            </SubHeading>
            <p>
              Each workshop returned something tangible to residents. That made
              participation cumulative: stories became priorities, priorities
              became alternatives, and alternatives became commitments.
            </p>
          </SubSectionContainer>
          <SubSectionContainer className="gap-0">
            <HorizontalCardGroup
              showBody
              body={
                <SubSectionContainer>
                  <SubHeading showNumber number="2">
                    The co-design sequence
                  </SubHeading>
                  <p>
                    We used familiar language, maps, photographs, and trade-off
                    exercises rather than asking residents to react to a
                    finished plan.
                  </p>
                </SubSectionContainer>
              }
              cards={[
                [
                  "01",
                  "Listen",
                  "Collect memories, concerns, and definitions of success.",
                ],
                [
                  "02",
                  "Map",
                  "Locate valued places, barriers, and overlooked connections.",
                ],
                [
                  "03",
                  "Prioritize",
                  "Turn many ideas into shared design principles.",
                ],
                [
                  "04",
                  "Compare",
                  "Discuss alternatives and make trade-offs visible.",
                ],
                [
                  "05",
                  "Commit",
                  "Confirm the preferred direction, owners, and next steps.",
                ],
              ].map(([number, title, copy]) => (
                <HighlightCard
                  key={title.toLowerCase()}
                  className="flex h-full min-h-[inherit] flex-col"
                  contentClassName="flex min-h-0 flex-1 flex-col overflow-auto p-8"
                >
                  <span className={`text-sm font-bold ${theme.textColorClass}`}>
                    {number}
                  </span>
                  <h4 className="mt-auto pt-8">{title}</h4>
                  <p className="mt-3">{copy}</p>
                </HighlightCard>
              ))}
            />
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          heading="Design Framework"
          headingIcon={CompassRoseIcon}
          headingBaseColorClassName="text-foreground dark:text-dark-foreground"
          borderColor={borderColor}
        >
          <SubSectionContainer>
            <SubHeading showNumber number="1">
              A framework that could be phased
            </SubHeading>
            <p>
              The preferred concept was organized as a connected family of
              projects rather than one expensive intervention. That let the
              village pursue funding and construction in practical increments.
            </p>
            <CaseStudyFigure caption="The design packet connected public life, access, and watershed work into one phased framework.">
              <div className="grid w-full max-w-4xl gap-3 md:grid-cols-4">
                {[
                  { label: "Main Street", icon: BuildingsIcon },
                  { label: "Accessible route", icon: PathIcon },
                  { label: "Gathering spaces", icon: UsersThreeIcon },
                  { label: "Falls + watershed", icon: TreeIcon },
                ].map(({ label, icon: Icon }, index) => (
                  <div
                    key={label}
                    className="relative flex min-h-32 flex-col items-center justify-center gap-3 rounded-1 bg-background p-4 text-center shadow-sm dark:bg-dark-background md:rounded-2"
                  >
                    <span
                      className={`absolute left-3 top-3 text-xs font-bold ${theme.textColorClass}`}
                    >
                      0{index + 1}
                    </span>
                    <Icon
                      size={34}
                      weight="duotone"
                      className={theme.textColorClass}
                    />
                    <span className="font-sans text-sm font-semibold">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </CaseStudyFigure>
          </SubSectionContainer>
          <SubSectionContainer>
            <SubHeading showNumber number="2">
              Design packet to action plan
            </SubHeading>
            <p>
              The final package paired spatial concepts with priorities,
              responsibilities, funding logic, and concrete next steps—giving
              the community something it could continue using after our
              engagement ended.
            </p>
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-5" className="scroll-mt-24">
        <SectionContainer
          heading="Implementation"
          headingIcon={PresentationChartIcon}
          headingBaseColorClassName="text-foreground dark:text-dark-foreground"
          borderColor={borderColor}
        >
          <SubSectionContainer>
            <SubHeading showNumber number="1">
              A plan that kept moving
            </SubHeading>
            <p>
              The process produced a community-backed design packet and an
              implementable set of next steps. The same grant source continued
              funding the work, and construction broke ground in 2026 after I
              had left the organization.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Community direction documented",
                "Continued funding secured",
                "Construction underway",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-t pt-4 dark:border-dark-foreground/20"
                >
                  <CheckCircleIcon
                    size={24}
                    weight="fill"
                    className={theme.textColorClass}
                  />
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-6" className="scroll-mt-24">
        <SectionContainer
          heading="Reflection"
          headingIcon={BrainIcon}
          headingBaseColorClassName="text-foreground dark:text-dark-foreground"
          borderColor={borderColor}
        >
          <SubSectionContainer>
            <SubHeading showNumber number="1">
              Designing for ownership
            </SubHeading>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                [
                  "Participation needs consequence",
                  "People stay engaged when each session visibly changes the work.",
                ],
                [
                  "Plans need an operating model",
                  "A compelling vision matters less if nobody knows what happens next.",
                ],
                [
                  "Success can outlast the designer",
                  "The strongest result was a process the village could keep carrying forward.",
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
