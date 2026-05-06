/* eslint-disable react/no-unescaped-entities */
"use client";

import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import {
  ScrollIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  PresentationChartIcon,
  SealQuestionIcon,
  LightbulbFilamentIcon,
} from "@phosphor-icons/react";
import { MotionValue, useTransform, motion } from "framer-motion";
import Image from "next/image";
import HorizontalFilmstrip from "../HorizontalScrollGroup";
import LazyVideo from "../LazyVideo";
import SectionContainer from "../SectionContainer";
import SubSectionHeading from "../SubSectionHeading";
import VerticalScrollCards from "../VerticalScrollGroup";
import { useProjectTheme } from "@/hooks/useProjectTheme";

interface CaseStudyTwoProps {
  scrollY: MotionValue<number>;
}

export default function CaseStudyTwo({ scrollY }: CaseStudyTwoProps) {
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
    (o) => `rgba(255,255,255,${o})`,
  );

  return (
    <article>
      {/*Section 1*/}
      <section id="section-1" className="scroll-mt-24">
        <SectionContainer
          title="Quick Take"
          icon={ScrollIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={borderColor}
          revealOnScroll={false}
        >
          <p className="mb-10 px-2 text-lg leading-normal">
            Quantitative UX insights can be game-changing, but often out of
            reach. Rigorous A/B testing is prohibitively expensive and time
            consuming, a luxury reserved for mature organizations. With Flux,
            small teams can now unlock new opportunities, while large teams can
            test up to{" "}
            <span className={`font-bold ${theme.textColorClass}`}>
              15x cheaper
            </span>{" "}
            and{" "}
            <span className={`font-bold ${theme.textColorClass}`}>
              10x faster
            </span>
            .
          </p>
          <LazyVideo
            src="https://assets.haichaowang.com/promo-export-01.mp4"
            poster="/images/promo-export-01-poster.jpg"
            controls
            playsInline
            className="rounded-[20px]"
          />
        </SectionContainer>
      </section>
      {/*Section 2*/}
      <section id="section-2" className="scroll-mt-24">
        <SectionContainer
          title={`The "Zero"`}
          icon={SealQuestionIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={borderColor}
        >
          <SubSectionHeading number="1" heading="Spotting the gap" />
          <p className="mb-10 px-2 text-lg leading-normal">
            We started Flux with a simple observation: UX practices are heavily
            skewed toward qualitative methods. While designers and researchers
            are comfortable with user interviews, surprisingly few leverage
            quantitative methods like A/B testing.
          </p>
          <p
            className={`${theme.bgColorClass} mb-16 rounded-[20px] border border-white bg-zinc-100 p-12 text-2xl leading-normal dark:bg-opacity-5`}
          >
            Even though quantitative UX research has the potential to deliver
            clearer insights with higher confidence, it is only done by large
            and mature organizations. Smaller teams seem to shy away.{" "}
            <span className={`font-bold ${theme.textColorClass} `}>Why?</span>
          </p>
          <SubSectionHeading number="2" heading="The UX research landscape" />
          <p className="mb-10 px-2 text-lg leading-normal">
            We had a hunch: people don't do it because they don't know how.
            Quantitative research is inherently scientific. While the core
            concept isn't necessarily difficult to grasp, doing it well requires
            specialized training in statistics.
          </p>
          <div
            className={`relative mb-16 h-screen max-h-[600px] w-full rounded-[20px] border border-white bg-gradient-to-br from-emerald-500/5 to-rose-500/5 dark:border-white/25 dark:bg-opacity-5`}
          >
            <div className="absolute flex h-full w-full flex-col items-center gap-1 text-xs font-bold">
              <span className="mt-4 bg-emerald-400 p-2 font-bold text-white">
                High Confidence
              </span>
              <div className="from- w-1 flex-1 bg-gradient-to-b from-emerald-400 to-rose-400 dark:bg-white/20" />
              <span className="mb-4 bg-rose-400 p-2 font-bold text-white">
                Low Confidence
              </span>
            </div>
            <div className="absolute flex h-full w-full items-center gap-1 text-xs font-bold">
              <span className="ml-4 bg-emerald-400 p-2 font-bold text-white">
                Low Cost
              </span>
              <div className="h-1 flex-1 bg-gradient-to-r from-emerald-400 to-rose-400 dark:bg-white/20" />
              <span className="mr-4 bg-rose-400 p-2 font-bold text-white">
                High Cost
              </span>
            </div>
            <div
              className={`group-hover:z-100 group absolute bottom-8 left-8 z-0 flex w-64 cursor-default flex-col items-center gap-2 rounded-xl border border-white bg-background/60 p-4 text-center shadow backdrop-blur-sm hover:shadow-lg dark:border-opacity-25 dark:bg-dark-background/60 dark:text-dark-foreground`}
            >
              <span className={`font-sans text-lg font-semibold`}>
                No UX research
              </span>
              <span className={`hidden text-sm group-hover:flex`}>
                Rely on intuition and hope for the best
              </span>
            </div>
            <div
              className={`group-hover:z-100 group absolute right-8 top-8 z-0 flex w-64 cursor-default flex-col items-center gap-2 rounded-xl border border-white bg-background/60 p-4 text-center shadow backdrop-blur-sm hover:shadow-lg dark:border-opacity-25 dark:bg-dark-background/60 dark:text-dark-foreground`}
            >
              <span className={`font-sans text-lg font-semibold`}>
                In-product A/B testing
              </span>
              <span className={`hidden text-sm group-hover:flex`}>
                Accurate but costly but it's okay because we can afford it.
              </span>
            </div>
            <div
              className={`group-hover:z-100 group absolute left-[50%] top-[50%] z-0 flex w-64 -translate-x-1/2 -translate-y-1/2 cursor-default flex-col items-center gap-2 rounded-xl border border-white bg-background/60 p-4 text-center shadow backdrop-blur-sm hover:shadow-lg dark:border-opacity-25 dark:bg-dark-background/60 dark:text-dark-foreground`}
            >
              <span className={`font-sans text-lg font-semibold`}>
                Qualitative UX research
              </span>
              <span className={`hidden text-sm group-hover:flex`}>
                Interviews, usability tests, focus groups, etc.
              </span>
            </div>

            <div
              className={`group absolute left-1/2 top-[28%] flex w-3/4 -translate-x-1/2 -translate-y-1/2 items-center gap-2`}
            >
              <div
                className={`bg-fluxBackground flex w-64 cursor-default flex-col items-center gap-2 rounded-xl border border-flux/40 bg-opacity-10 p-4 text-center text-flux shadow-xl backdrop-blur-sm group-hover:shadow-2xl dark:border-opacity-25 dark:bg-dark-background/60 dark:text-dark-foreground`}
              >
                <span className={`font-sans text-lg font-semibold`}>
                  Quantitative UX research
                </span>
                <span className={`hidden text-sm group-hover:flex`}>
                  Prototype testing, heatmaps, button clicks, etc.
                </span>
              </div>
              <div className="flex min-w-12 flex-1 items-center gap-[2%]">
                <div
                  className={`bg-fluxBackground flex h-4 w-full transition-all duration-200 ease-in-out [clip-path:polygon(0%_50%,100%_100%,100%_0%)] group-hover:h-8`}
                />
                <div
                  className={`bg-fluxBackground flex h-2 w-full bg-opacity-80 transition-all duration-200 ease-in-out group-hover:h-4`}
                />
                <div
                  className={`bg-fluxBackground flex h-2 w-full bg-opacity-70 transition-all duration-200 ease-in-out group-hover:h-4`}
                />
                <div
                  className={`bg-fluxBackground flex h-2 w-full bg-opacity-70 transition-all duration-200 ease-in-out group-hover:h-4`}
                />
                <div
                  className={`bg-fluxBackground flex h-2 w-full bg-opacity-50 transition-all duration-200 ease-in-out group-hover:h-4`}
                />
                <div
                  className={`bg-fluxBackground flex h-2 w-full bg-opacity-40 transition-all duration-200 ease-in-out group-hover:h-4 group-hover:w-[150%]`}
                />
                <div
                  className={`bg-fluxBackground flex h-2 w-full bg-opacity-30 transition-all duration-200 ease-in-out group-hover:h-4 group-hover:w-[200%]`}
                />
              </div>
              <div
                className={`bg-fluxBackground flex w-64 cursor-default flex-col items-center gap-2 rounded-xl border border-dashed border-flux/40 bg-opacity-10 p-4 text-center text-flux opacity-40 shadow backdrop-blur-sm dark:border-opacity-25 dark:bg-dark-background/60 dark:text-dark-foreground`}
              >
                <span className={`font-sans text-lg font-semibold`}>
                  Quantitative UX research
                </span>
                <span className={`hidden text-sm group-hover:flex`}>
                  Prototype testing, heatmaps, button clicks, etc.
                </span>
              </div>
            </div>
          </div>
          <VerticalScrollCards
            highlightOnIntersect
            sideContent={({ activeIndex }) => (
              <>
                <SubSectionHeading
                  number="3"
                  heading="Initial problem statement"
                />
                <p className="pb-2 pl-2 text-2xl leading-normal">
                  Quantitative UX research is
                </p>
                <p className="pb-2 pl-2 text-2xl">
                  <motion.span
                    animate={{
                      color:
                        activeIndex === 0
                          ? theme.hex.primary
                          : theme.hex.foreground,
                      fontSize: activeIndex === 0 ? "30px" : "24px",
                      fontWeight: activeIndex === 0 ? "700" : "400",
                    }}
                  >
                    intimidating
                  </motion.span>
                  ,
                </p>{" "}
                <p className="pb-2 pl-2 text-2xl">
                  <motion.span
                    animate={{
                      color:
                        activeIndex === 1
                          ? theme.hex.primary
                          : theme.hex.foreground,
                      fontSize: activeIndex === 1 ? "30px" : "24px",
                      fontWeight: activeIndex === 1 ? "700" : "400",
                    }}
                  >
                    time-consuming
                  </motion.span>
                  ,
                </p>
                <p className="pb-2 pl-2 text-2xl">and involves a</p>
                <p className="pl-2 text-2xl">
                  <motion.span
                    animate={{
                      color:
                        activeIndex === 2
                          ? theme.hex.primary
                          : theme.hex.foreground,
                      fontSize: activeIndex === 2 ? "30px" : "24px",
                      fontWeight: activeIndex === 2 ? "700" : "400",
                    }}
                  >
                    fragmented workflow
                  </motion.span>
                  .
                </p>
              </>
            )}
            cards={[
              {
                id: "intimidating",
                className:
                  "flex h-auto flex-col items-end justify-between gap-6 p-6 md:h-full md:gap-0 md:p-[15%]",
                content: (
                  <>
                    <div
                      className={`relative aspect-square w-full max-w-80 self-center overflow-hidden md:max-w-none md:self-auto`}
                    >
                      <Image
                        src="/images/Avalon-3D-Shapes-1_10.png"
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="ml-[0%]">
                      Quantitative UX research is inherently scientific. It's a
                      practical application of statistics. Doing it well
                      requires an expertise in math.
                    </p>
                  </>
                ),
              },
              {
                id: "time-consuming",
                className:
                  "flex h-auto items-start justify-center p-6 md:h-full md:items-end md:p-12 md:pl-36",
                content:
                  "To detect meaningful difference, researchers often need to design a rigorous experiment and recruit hundreds of participants. A study could take weeks to finish.",
              },
              {
                id: "fragmented-workflow",
                className:
                  "flex h-auto items-start justify-center p-6 md:h-full md:items-end md:p-12 md:pl-36",
                content:
                  "The existing workflow for quantitative research involves integrating design prototypes with survey platforms. The data then need to be further analyzed and synthesized into a report. This process involves multiple tools.",
              },
            ]}
          />
        </SectionContainer>
      </section>
      {/*Section 3*/}
      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          title="Research & Discovery"
          icon={MagnifyingGlassIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={"rgba(0,0,0,0)"}
          cardClass="w-full min-w-0"
        >
          <SubSectionHeading number="1" heading="Research method" />
          <p className="mb-10 p-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>

          <HorizontalFilmstrip
            body={
              <>
                <SubSectionHeading number="2" heading="Insights" />
                <p className="mb-6 px-2 text-lg leading-normal">
                  To further understand our problem space, we reached out to our
                  network of colleagues in the tech industry.
                </p>
              </>
            }
            cards={[
              {
                id: "quant-research-resistance",
                content: (
                  <>
                    <span className="text-6xl">1</span>
                    <div className="flex h-full items-center justify-center">
                      <h3 className="text-2xl font-bold">
                        Nobody wants to do quantitative research. Come on. Who
                        are you kidding?
                      </h3>
                    </div>
                  </>
                ),
              },
              {
                id: "gap",
                content: (
                  <>
                    <span className="text-6xl">2</span>
                    <h3 className="mt-4 text-2xl font-bold">The Gap</h3>
                  </>
                ),
              },
              {
                id: "solution",
                content: (
                  <>
                    <span className="text-6xl">3</span>
                    <h3 className="mt-4 text-2xl font-bold">The Solution</h3>
                  </>
                ),
              },
            ]}
          />
          <SubSectionHeading number="3" heading="New problem statement" />
          <p className="mb-24 px-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>
          <SubSectionHeading number="4" heading="The pivot" />
          <p className="mb-6 px-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>
        </SectionContainer>
      </section>
      {/*Section 4*/}
      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          title="Ideation & Exploration"
          icon={LightbulbFilamentIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={"rgba(0,0,0,0)"}
          cardClass=""
        >
          <SubSectionHeading number="1" heading="Ideation" />
          <p className="mb-6 p-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>
          <SubSectionHeading number="2" heading="Exploration" />
        </SectionContainer>
      </section>
      {/*Section 5*/}
      <section id="section-5" className="scroll-mt-24">
        <SectionContainer
          title={`The "One"`}
          icon={RocketLaunchIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={"rgba(0,0,0,0)"}
          cardClass=""
        >
          <SubSectionHeading number="1" heading="User journey " />
          <p className="mb-10 px-2 text-lg leading-normal">
            We launched a closed beta with 12 teams and saw strong engagement.
            Teams used the tool to test landing page flows, signup friction, and
            feature comprehension. Feedback praised its speed and clarity. The
            product is now in early access with growing adoption. It’s helping
            teams make design decisions with evidence, not guesswork—and
            reshaping what quantitative UX looks like in practice.
          </p>
          <SubSectionHeading number="2" heading="User interface" />
          <p className="mb-10 px-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>
        </SectionContainer>
      </section>
      {/*Section 6*/}
      <section id="section-6" className="scroll-mt-24">
        <SectionContainer
          title={`Impact & Reflection`}
          icon={PresentationChartIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={borderColor}
          cardClass=""
        >
          <SubSectionHeading number="1" heading="Launch" />
          <p className="mb-10 px-2 text-lg leading-normal">
            We launched a closed beta with 12 teams and saw strong engagement.
            Teams used the tool to test landing page flows, signup friction, and
            feature comprehension. Feedback praised its speed and clarity. The
            product is now in early access with growing adoption. It’s helping
            teams make design decisions with evidence, not guesswork—and
            reshaping what quantitative UX looks like in practice.
          </p>
          <SubSectionHeading number="2" heading="Feedback" />
          <p className="mb-10 px-2 text-lg leading-normal">
            We launched a closed beta with 12 teams and saw strong engagement.
            Teams used the tool to test landing page flows, signup friction, and
            feature comprehension. Feedback praised its speed and clarity. The
            product is now in early access with growing adoption. It’s helping
            teams make design decisions with evidence, not guesswork—and
            reshaping what quantitative UX looks like in practice.
          </p>
          <SubSectionHeading number="3" heading="Lessons learned" />
          <p className="mb-10 px-2 text-lg leading-normal">
            We launched a closed beta with 12 teams and saw strong engagement.
            Teams used the tool to test landing page flows, signup friction, and
            feature comprehension. Feedback praised its speed and clarity. The
            product is now in early access with growing adoption. It’s helping
            teams make design decisions with evidence, not guesswork—and
            reshaping what quantitative UX looks like in practice.
          </p>
        </SectionContainer>
      </section>
    </article>
  );
}
