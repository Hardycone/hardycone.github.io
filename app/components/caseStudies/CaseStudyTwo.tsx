// case-studies/project-two.tsx

"use client";

import { useLighting } from "../../context/LightingContext";
import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import {
  ScrollIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  NumberCircleThreeIcon,
  PresentationChartIcon,
  SealQuestionIcon,
  NumberCircleTwoIcon,
  LightbulbFilamentIcon,
  NumberCircleOneIcon,
  NumberCircleFourIcon,
} from "@phosphor-icons/react";
import {
  MotionValue,
  useTransform,
  motion,
  useScroll,
  useSpring,
  useInView,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import ContentCard from "../ContentCard";
import SubSectionHeading from "../SubSectionHeading";

interface CaseStudyTwoProps {
  scrollY: MotionValue<number>;
}

export default function CaseStudyTwo({ scrollY }: CaseStudyTwoProps) {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useActiveProject();
  const targetRef = useRef<HTMLDivElement>(null);

  const triggerOneRef = useRef<HTMLDivElement>(null);
  const triggerTwoRef = useRef<HTMLDivElement>(null);
  const triggerThreeRef = useRef<HTMLDivElement>(null);

  const isOneInView = useInView(triggerOneRef, { amount: 0.6 });
  const isTwoInView = useInView(triggerTwoRef, { amount: 0.6 });
  const isThreeInView = useInView(triggerThreeRef, { amount: 0.6 });

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // const smoothScrollYProgress = useSpring(scrollYProgress, {
  //   stiffness: 120,
  //   damping: 20,
  //   mass: 0.2,
  // });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-63dvw"]);

  const { getTextColorClass, getBgColorClass } = useLighting();

  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );

  const bgColorClass = getBgColorClass(
    resolvedTheme || "light",
    projects[activeIndex].bgColor,
  );

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
        <ContentCard
          title="Quick Take"
          icon={ScrollIcon}
          textColorClass={textColorClass}
          bgColorClass={bgColorClass}
          borderColor={borderColor}
          cardClass="mb-12"
        >
          <p className="mb-6 text-lg leading-normal">
            Quantitative UX insights can be game-changing, but often out of
            reach. Rigorous A/B testing is prohibitively expensive and time
            consuming, a luxury reserved for mature organizations. With Flux,
            small teams can now unlock new opportunities, while large teams can
            test up to{" "}
            <span className={`font-bold ${textColorClass}`}>15x cheaper</span>{" "}
            and{" "}
            <span className={`font-bold ${textColorClass}`}>10x faster</span>.
          </p>
          <div
            className={`relative aspect-[16/9] w-full overflow-hidden rounded-[20px]`}
          >
            <Image
              src="/images/project-1.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </ContentCard>
      </section>
      {/*Section 2*/}
      <section id="section-2" className="scroll-mt-24">
        <ContentCard
          title={`The "Zero"`}
          icon={SealQuestionIcon}
          textColorClass={textColorClass}
          bgColorClass={bgColorClass}
          borderColor={borderColor}
        >
          <SubSectionHeading
            iconNumber={1}
            headingText="Spotting the gap"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-2 rounded-3xl p-2 text-lg leading-normal">
            We started Flux with a simple observation: UX practices are heavily
            skewed toward qualitative methods. While designers and researchers
            are comfortable with user interviews, surprisingly few leverage
            quantitative methods like A/B testing.
          </p>
          <p
            className={`${bgColorClass} mb-8 rounded-[20px] bg-opacity-5 p-12 text-2xl leading-normal dark:bg-opacity-5`}
          >
            Even though quantitative UX research has the potential to deliver
            clearer insights with higher confidence, it is only done by large
            and mature organizations. Smaller teams seem to shy away.{" "}
            <span className={`font-bold ${textColorClass} `}>Why?</span>
          </p>
          <SubSectionHeading
            iconNumber={2}
            headingText="The UX research landscape"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-8 rounded-3xl p-2 text-lg leading-normal">
            We had a hunch: people don't do it because they don't know how.
            Quantitative research is inherently scientific. While the core
            concept isn't necessarily difficult to grasp, doing it well requires
            specialized training in statistics.
          </p>
          <div
            className={`relative mb-24 h-screen max-h-[600px] w-full rounded-[20px] bg-gradient-to-br from-emerald-500/10 to-rose-500/10 dark:bg-opacity-5`}
          >
            <div className="absolute flex h-full w-full flex-col items-center gap-1 text-xs font-bold">
              <span className="mt-6 bg-emerald-400 p-2 font-bold text-white">
                High Confidence
              </span>
              <div className="from- w-1 flex-1 bg-gradient-to-b from-emerald-400 to-rose-400 dark:bg-white/20" />
              <span className="mb-6 bg-rose-400 p-2 font-bold text-white">
                Low Confidence
              </span>
            </div>
            <div className="absolute flex h-full w-full items-center gap-1 text-xs font-bold">
              <span className="ml-6 bg-emerald-400 p-2 font-bold text-white">
                Low Cost
              </span>
              <div className="h-1 flex-1 bg-gradient-to-r from-emerald-400 to-rose-400 dark:bg-white/20" />
              <span className="mr-6 bg-rose-400 p-2 font-bold text-white">
                High Cost
              </span>
            </div>
            <div
              className={`group-hover:z-100 group absolute bottom-6 left-6 z-0 flex w-64 cursor-default flex-col items-center gap-2 rounded-xl border border-white bg-background/60 p-4 text-center shadow backdrop-blur-sm hover:shadow-lg dark:border-opacity-25 dark:bg-dark-background/60 dark:text-dark-foreground`}
            >
              <span className={`font-sans text-lg font-semibold`}>
                No UX research
              </span>
              <span className={`hidden text-sm group-hover:flex`}>
                Rely on intuition and hope for the best
              </span>
            </div>
            <div
              className={`group-hover:z-100 group absolute right-6 top-6 z-0 flex w-64 cursor-default flex-col items-center gap-2 rounded-xl border border-white bg-background/60 p-4 text-center shadow backdrop-blur-sm hover:shadow-lg dark:border-opacity-25 dark:bg-dark-background/60 dark:text-dark-foreground`}
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
                className={`flex w-64 cursor-default flex-col items-center gap-2 rounded-xl border border-flux/40 bg-fluxBackground bg-opacity-10 p-4 text-center text-flux shadow-xl backdrop-blur-sm group-hover:shadow-2xl dark:border-opacity-25 dark:bg-dark-background/60 dark:text-dark-foreground`}
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
                  className={`flex h-4 w-full bg-fluxBackground transition-all duration-200 ease-in-out [clip-path:polygon(0%_50%,100%_100%,100%_0%)] group-hover:h-8`}
                />
                <div
                  className={`flex h-2 w-full bg-fluxBackground bg-opacity-80 transition-all duration-200 ease-in-out group-hover:h-4`}
                />
                <div
                  className={`flex h-2 w-full bg-fluxBackground bg-opacity-70 transition-all duration-200 ease-in-out group-hover:h-4`}
                />
                <div
                  className={`flex h-2 w-full bg-fluxBackground bg-opacity-70 transition-all duration-200 ease-in-out group-hover:h-4`}
                />
                <div
                  className={`flex h-2 w-full bg-fluxBackground bg-opacity-50 transition-all duration-200 ease-in-out group-hover:h-4`}
                />
                <div
                  className={`flex h-2 w-full bg-fluxBackground bg-opacity-40 transition-all duration-200 ease-in-out group-hover:h-4 group-hover:w-[150%]`}
                />
                <div
                  className={`flex h-2 w-full bg-fluxBackground bg-opacity-30 transition-all duration-200 ease-in-out group-hover:h-4 group-hover:w-[200%]`}
                />
              </div>
              <div
                className={`flex w-64 cursor-default flex-col items-center gap-2 rounded-xl border border-dashed border-flux/40 bg-fluxBackground bg-opacity-10 p-4 text-center text-flux opacity-40 shadow backdrop-blur-sm dark:border-opacity-25 dark:bg-dark-background/60 dark:text-dark-foreground`}
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
          <div className="relative flex">
            <div className="w-96 flex-none">
              <div className="sticky top-24 h-[calc(100dvh_-_6rem)] max-h-[800px]">
                <SubSectionHeading
                  iconNumber={3}
                  headingText="Initial problem statement"
                  textColorClass={textColorClass}
                  bgColorClass={bgColorClass}
                />
                <p className="py-1 pl-2 text-2xl leading-normal">
                  Quantitative UX research is
                </p>
                <p className="py-1 pl-2 text-2xl">
                  <motion.span
                    animate={{
                      color: isOneInView ? "#9333ea" : "#27272a",
                      fontSize: isOneInView ? "30px" : "24px",
                      fontWeight: isOneInView ? "700" : "400",
                    }}
                  >
                    intimidating
                  </motion.span>
                  ,
                </p>{" "}
                <p className="py-1 pl-2 text-2xl">
                  <motion.span
                    animate={{
                      color: isTwoInView ? "flux" : "#27272a",
                      fontSize: isTwoInView ? "30px" : "24px",
                      fontWeight: isTwoInView ? "700" : "400",
                    }}
                  >
                    time-consuming
                  </motion.span>
                  ,
                </p>
                <p className="py-1 pl-2 text-2xl">and involves a</p>
                <p className="py-1 pl-2 text-2xl">
                  <motion.span
                    animate={{
                      color: isThreeInView ? "#9333ea" : "#27272a",
                      fontSize: isThreeInView ? "30px" : "24px",
                      fontWeight: isThreeInView ? "700" : "400",
                    }}
                  >
                    fragmented workflow
                  </motion.span>
                  .
                </p>
              </div>
            </div>
            <div className="relative flex-1">
              <div
                ref={triggerOneRef}
                className="h-[calc(100dvh_-_6rem)] max-h-[800px] scroll-mt-[6rem] pb-12 text-lg"
              >
                <div className="flex h-full items-center justify-center overflow-clip rounded-[20px] border border-white p-12 shadow dark:border-white/25">
                  How do product teams know which design works best—really know,
                  with data? While qualitative methods dominate early design, we
                  noticed a gap in quant UX tooling, particularly for live
                  prototype testing. We wanted to bring statistical rigor to the
                  kinds of questions teams already ask in Figma: which variant
                  performs better? Where do users hesitate? How do product teams
                  know which design works best—really know, with data? While
                  qualitative methods dominate early design, we noticed a gap in
                  quant UX tooling, particularly for live prototype testing.
                </div>
              </div>
              <div
                ref={triggerTwoRef}
                className="h-[calc(100dvh_-_6rem)] max-h-[800px] scroll-mt-[6rem] pb-12 text-lg"
              >
                <div className="flex h-full items-center justify-center overflow-clip rounded-[20px] border border-white p-12 shadow dark:border-white/25">
                  How do product teams know which design works best—really know,
                  with data? While qualitative methods dominate early design, we
                  noticed a gap in quant UX tooling, particularly for live
                  prototype testing. We wanted to bring statistical rigor to the
                  kinds of questions teams already ask in Figma: which variant
                  performs better? Where do users hesitate? How do product teams
                  know which design works best—really know, with data? While
                  qualitative methods dominate early design, we noticed a gap in
                  quant UX tooling, particularly for live prototype testing.
                </div>
              </div>
              <div
                ref={triggerThreeRef}
                className="h-[calc(100dvh_-_6rem)] max-h-[800px] scroll-mt-[6rem] pb-12 text-lg"
              >
                <div className="flex h-full items-center justify-center overflow-clip rounded-[20px] border border-white p-12 shadow dark:border-white/25">
                  How do product teams know which design works best—really know,
                  with data? While qualitative methods dominate early design, we
                  noticed a gap in quant UX tooling, particularly for live
                  prototype testing. We wanted to bring statistical rigor to the
                  kinds of questions teams already ask in Figma: which variant
                  performs better? Where do users hesitate? How do product teams
                  know which design works best—really know, with data? While
                  qualitative methods dominate early design, we noticed a gap in
                  quant UX tooling, particularly for live prototype testing.
                </div>
              </div>
              <div className="absolute bottom-0 h-0 w-full"></div>
            </div>
          </div>
        </ContentCard>
      </section>
      {/*Section 3*/}
      <section id="section-3" className="scroll-mt-24">
        <ContentCard
          title="Research & Disovery"
          icon={MagnifyingGlassIcon}
          textColorClass={textColorClass}
          bgColorClass={bgColorClass}
          borderColor={"rgba(0,0,0,0)"}
          cardClass=""
        >
          <SubSectionHeading
            iconNumber={1}
            headingText="Research method"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-6 p-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>

          <div ref={targetRef} className="relative h-[300vh]">
            {/* THE TV SCREEN: Sticky, takes up full height, locks at top */}
            <div className="sticky top-24 flex flex-col">
              {/* --- PART A: THE STATIC HEADER --- */}
              {/* This stays centered and visible the whole time */}
              <div className="relative z-10 mb-8">
                <SubSectionHeading
                  iconNumber={2}
                  headingText="Insights"
                  textColorClass={textColorClass}
                  bgColorClass={bgColorClass}
                />
                <p className="mb-6 p-2 text-lg leading-normal">
                  To further understand our problem space, we reached out to our
                  network of colleagues in the tech industry.
                </p>
              </div>
              {/* --- PART B: THE MOVING FILMSTRIP --- */}
              {/* This moves horizontally while Part A stays put */}
              <div className="mb-24">
                <motion.div style={{ x }} className="flex gap-8">
                  {/* Card 1 */}
                  <div className="flex h-[60dvh] w-[40dvw] shrink-0 flex-col rounded-[20px] bg-white p-8 shadow">
                    <span className="text-6xl">01</span>
                    <div className="flex h-full items-center justify-center">
                      <h3 className="text-2xl font-bold">
                        Nobody wants to do quantitative research. Come on. Who
                        are you kidding?
                      </h3>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="h-[60dvh] w-[40dvw] shrink-0 rounded-[20px] bg-purple-100 p-8 shadow">
                    <span className="text-6xl">02</span>
                    <h3 className="mt-4 text-2xl font-bold">The Gap</h3>
                  </div>

                  {/* Card 3 */}
                  <div className="h-[60dvh] w-[40dvw] shrink-0 rounded-[20px] bg-blue-100 p-8 shadow">
                    <span className="text-6xl">03</span>
                    <h3 className="mt-4 text-2xl font-bold">The Solution</h3>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          <SubSectionHeading
            iconNumber={3}
            headingText="New problem statement"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-24 p-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>
          <SubSectionHeading
            iconNumber={4}
            headingText="The pivot"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-6 p-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>
        </ContentCard>
      </section>
      {/*Section 4*/}
      <section id="section-4" className="scroll-mt-24">
        <ContentCard
          title="Ideation & Exploration"
          icon={LightbulbFilamentIcon}
          textColorClass={textColorClass}
          bgColorClass={bgColorClass}
          borderColor={"rgba(0,0,0,0)"}
          cardClass=""
        >
          <SubSectionHeading
            iconNumber={1}
            headingText="Ideation"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-6 p-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>
          <SubSectionHeading
            iconNumber={2}
            headingText="Exploration"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
        </ContentCard>
      </section>
      {/*Section 5*/}
      <section id="section-5" className="scroll-mt-24">
        <ContentCard
          title={`The "One"`}
          icon={RocketLaunchIcon}
          textColorClass={textColorClass}
          bgColorClass={bgColorClass}
          borderColor={"rgba(0,0,0,0)"}
          cardClass=""
        >
          <SubSectionHeading
            iconNumber={1}
            headingText="User journey "
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-6 p-2 text-lg leading-normal">
            We launched a closed beta with 12 teams and saw strong engagement.
            Teams used the tool to test landing page flows, signup friction, and
            feature comprehension. Feedback praised its speed and clarity. The
            product is now in early access with growing adoption. It’s helping
            teams make design decisions with evidence, not guesswork—and
            reshaping what quantitative UX looks like in practice.
          </p>
          <SubSectionHeading
            iconNumber={2}
            headingText="User interface"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-6 p-2 text-lg leading-normal">
            To further understand our problem space, we reached out to our
            network of colleagues in the tech industry.
          </p>
        </ContentCard>
      </section>
      {/*Section 6*/}
      <section id="section-6" className="scroll-mt-24">
        <ContentCard
          title={`Impact & Reflection`}
          icon={PresentationChartIcon}
          textColorClass={textColorClass}
          bgColorClass={bgColorClass}
          borderColor={borderColor}
          cardClass=""
        >
          <SubSectionHeading
            iconNumber={1}
            headingText="Launch"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-6 p-2 text-lg leading-normal">
            We launched a closed beta with 12 teams and saw strong engagement.
            Teams used the tool to test landing page flows, signup friction, and
            feature comprehension. Feedback praised its speed and clarity. The
            product is now in early access with growing adoption. It’s helping
            teams make design decisions with evidence, not guesswork—and
            reshaping what quantitative UX looks like in practice.
          </p>
          <SubSectionHeading
            iconNumber={2}
            headingText="Feedback"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-6 p-2 text-lg leading-normal">
            We launched a closed beta with 12 teams and saw strong engagement.
            Teams used the tool to test landing page flows, signup friction, and
            feature comprehension. Feedback praised its speed and clarity. The
            product is now in early access with growing adoption. It’s helping
            teams make design decisions with evidence, not guesswork—and
            reshaping what quantitative UX looks like in practice.
          </p>
          <SubSectionHeading
            iconNumber={3}
            headingText="Lessons learned"
            textColorClass={textColorClass}
            bgColorClass={bgColorClass}
          />
          <p className="mb-6 p-2 text-lg leading-normal">
            We launched a closed beta with 12 teams and saw strong engagement.
            Teams used the tool to test landing page flows, signup friction, and
            feature comprehension. Feedback praised its speed and clarity. The
            product is now in early access with growing adoption. It’s helping
            teams make design decisions with evidence, not guesswork—and
            reshaping what quantitative UX looks like in practice.
          </p>
        </ContentCard>
      </section>
    </article>
  );
}
