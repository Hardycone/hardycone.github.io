// case-studies/project-two.tsx

"use client";

import { useLighting } from "../../context/LightingContext";
import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import {
  ScrollIcon,
  PuzzlePieceIcon,
  TargetIcon,
  PersonSimpleRunIcon,
  PresentationChartIcon,
} from "@phosphor-icons/react";
import {
  MotionValue,
  useTransform,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface CaseStudyTwoProps {
  scrollY: MotionValue<number>;
}

export default function CaseStudyTwo({ scrollY }: CaseStudyTwoProps) {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useActiveProject();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });
  const x = useTransform(smoothScrollYProgress, [0, 1], ["0vw", "-200vw"]);

  const { getTextColorClass } = useLighting();
  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
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
        <motion.div
          className="mb-24 flex flex-col rounded-[44px] border bg-background/20 p-6 text-foreground backdrop-blur-xl dark:bg-dark-background/10 dark:text-dark-foreground"
          style={{ borderColor }}
        >
          <div className="mb-6 flex items-center gap-2">
            <ScrollIcon
              size={32}
              weight="duotone"
              className={`${textColorClass}`}
            />
            <h2
              className={`font-sans text-4xl font-semibold ${textColorClass}`}
            >
              Quick Take
            </h2>
          </div>
          <div className="mb-6 h-[1px] w-full rounded-full bg-flux/50 dark:bg-dark-flux/50" />
          <p className="mb-6 text-lg">
            Our team set out to solve a common but underexplored problem: how do
            product teams know which design works best—really know, with data?
            While qualitative methods dominate early design, we noticed a gap in
            quant UX tooling, particularly for live prototype testing. We wanted
            to bring statistical rigor to the kinds of questions teams already
            ask in Figma: which variant performs better? Where do users
            hesitate?
          </p>
          <div
            className={`relative aspect-[16/9] w-full overflow-hidden rounded-xl`}
          >
            <Image
              src="/images/project-1.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </section>
      {/*Section 2*/}
      <section id="section-2" className="scroll-mt-24">
        <div className="relative flex gap-8 px-6">
          <div className="w-72 flex-none">
            <div className="sticky top-24 h-[100vh]">
              <div className="mb-6 flex items-center gap-2">
                <PuzzlePieceIcon
                  size={32}
                  weight="duotone"
                  className={`${textColorClass}`}
                />
                <h2
                  className={`font-sans text-4xl font-semibold ${textColorClass}`}
                >
                  The Problem
                </h2>
              </div>
              <div className="mb-6 h-[1px] w-full rounded-full bg-white dark:bg-white/25" />
              <p className="text-lg">
                How do product teams know which design works best—really know,
                with data? While qualitative methods dominate early design, we
                noticed a gap in quant UX tooling, particularly for live
                prototype testing. We wanted to bring statistical rigor to the
                kinds of questions teams already ask in Figma: which variant
                performs better? Where do users hesitate?
              </p>
            </div>
          </div>

          <div className="relative flex-1">
            <div className="h-[300vh] p-4">
              <div className="h-[100vh]">
                How do product teams know which design works best—really know,
                with data? While qualitative methods dominate early design, we
                noticed a gap in quant UX tooling, particularly for live
                prototype testing. We wanted to bring statistical rigor to the
                kinds of questions teams already ask in Figma: which variant
                performs better? Where do users hesitate? How do product teams
                know which design works best—really know, with data? While
                qualitative methods dominate early design, we noticed a gap in
                quant UX tooling, particularly for live prototype testing. We
                wanted to bring statistical rigor to the kinds of questions
                teams already ask in Figma: which variant performs better? Where
                do users hesitate? How do product teams know which design works
                best—really know, with data? While qualitative methods dominate
                early design, we noticed a gap in quant UX tooling, particularly
                for live prototype testing. We wanted to bring statistical rigor
                to the kinds of questions teams already ask in Figma: which
                variant performs better? Where do users hesitate? How do product
                teams know which design works best—really know, with data? While
                qualitative methods dominate early design, we noticed a gap in
                quant UX tooling, particularly for live prototype testing. We
                wanted to bring statistical rigor to the kinds of questions
                teams already ask in Figma: which variant performs better? Where
                do users hesitate? How do product teams know which design works
                best—really know, with data? While qualitative methods dominate
                early design, we noticed a gap in quant UX tooling, particularly
                for live prototype testing. We wanted to bring statistical rigor
                to the kinds of questions teams already ask in Figma: which
                variant performs better? Where do users hesitate?
              </div>{" "}
              <div className="h-[100vh]">
                How do product teams know which design works best—really know,
                with data? While qualitative methods dominate early design, we
                noticed a gap in quant UX tooling, particularly for live
                prototype testing. We wanted to bring statistical rigor to the
                kinds of questions teams already ask in Figma: which variant
                performs better? Where do users hesitate? How do product teams
                know which design works best—really know, with data? While
                qualitative methods dominate early design, we noticed a gap in
                quant UX tooling, particularly for live prototype testing. We
                wanted to bring statistical rigor to the kinds of questions
                teams already ask in Figma: which variant performs better? Where
                do users hesitate? How do product teams know which design works
                best—really know, with data? While qualitative methods dominate
                early design, we noticed a gap in quant UX tooling, particularly
                for live prototype testing. We wanted to bring statistical rigor
                to the kinds of questions teams already ask in Figma: which
                variant performs better? Where do users hesitate? How do product
                teams know which design works best—really know, with data? While
                qualitative methods dominate early design, we noticed a gap in
                quant UX tooling, particularly for live prototype testing. We
                wanted to bring statistical rigor to the kinds of questions
                teams already ask in Figma: which variant performs better? Where
                do users hesitate? How do product teams know which design works
                best—really know, with data? While qualitative methods dominate
                early design, we noticed a gap in quant UX tooling, particularly
                for live prototype testing. We wanted to bring statistical rigor
                to the kinds of questions teams already ask in Figma: which
                variant performs better? Where do users hesitate?
              </div>{" "}
              <div className="h-[100vh]">
                How do product teams know which design works best—really know,
                with data? While qualitative methods dominate early design, we
                noticed a gap in quant UX tooling, particularly for live
                prototype testing. We wanted to bring statistical rigor to the
                kinds of questions teams already ask in Figma: which variant
                performs better? Where do users hesitate? How do product teams
                know which design works best—really know, with data? While
                qualitative methods dominate early design, we noticed a gap in
                quant UX tooling, particularly for live prototype testing. We
                wanted to bring statistical rigor to the kinds of questions
                teams already ask in Figma: which variant performs better? Where
                do users hesitate? How do product teams know which design works
                best—really know, with data? While qualitative methods dominate
                early design, we noticed a gap in quant UX tooling, particularly
                for live prototype testing. We wanted to bring statistical rigor
                to the kinds of questions teams already ask in Figma: which
                variant performs better? Where do users hesitate? How do product
                teams know which design works best—really know, with data? While
                qualitative methods dominate early design, we noticed a gap in
                quant UX tooling, particularly for live prototype testing. We
                wanted to bring statistical rigor to the kinds of questions
                teams already ask in Figma: which variant performs better? Where
                do users hesitate? How do product teams know which design works
                best—really know, with data? While qualitative methods dominate
                early design, we noticed a gap in quant UX tooling, particularly
                for live prototype testing. We wanted to bring statistical rigor
                to the kinds of questions teams already ask in Figma: which
                variant performs better? Where do users hesitate?
              </div>
            </div>

            <div className="absolute bottom-0 h-0 w-full"></div>
          </div>
        </div>
      </section>
      {/*Section 3*/}
      <section id="section-3" className="scroll-mt-24">
        <div className="mb-6 flex items-center gap-2">
          <TargetIcon
            size={32}
            weight="duotone"
            className={`${textColorClass}`}
          />
          <h2 className={`font-sans text-4xl font-semibold ${textColorClass}`}>
            Goal
          </h2>
        </div>
        <div ref={targetRef} className="relative h-[200vh]">
          {/* The "Sticky" Element */}
          <div className="sticky top-[10vh] ml-[calc(50%_-_50vw)] h-[90vh] w-[100vw] overflow-hidden">
            {/* The "Filmstrip" */}
            <motion.div style={{ x }} className="flex">
              <div className="flex h-screen w-[300vw] items-center justify-center">
                <div className="m-[5vw] flex h-full w-[90vw] items-center rounded-3xl">
                  <div className="flex-1" />
                  <div className="w-full max-w-5xl text-left text-black dark:text-white">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                      Section 1: The Problem
                    </h2>
                    <p className="text-lg md:text-xl">
                      ere is some dummy text for the first section. We would
                      describe the user's pain points and the initial challenge.
                      As the user scrolls down, the content will begin to move
                      horizontally, revealing the next part of the story.
                    </p>
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="flex w-[100vw]">
                  <div className="flex-1" />
                  <div className="flex w-full max-w-5xl flex-col text-left text-black dark:text-white">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                      Section 1: The Problem
                    </h2>
                    <p className="text-lg md:text-xl">
                      ere is some dummy text for the first section. We would
                      describe the user's pain points and the initial challenge.
                      As the user scrolls down, the content will begin to move
                      horizontally, revealing the next part of the story.
                    </p>
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="flex w-[100vw]">
                  <div className="flex-1 bg-green-50" />
                  <div className="w-full max-w-5xl bg-red-200 text-left text-black dark:text-white">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                      Section 1: The Problem
                    </h2>
                    <p className="text-lg md:text-xl">
                      ere is some dummy text for the first section. We would
                      describe the user's pain points and the initial challenge.
                      As the user scrolls down, the content will begin to move
                      horizontally, revealing the next part of the story.
                    </p>
                  </div>
                  <div className="flex-1" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section id="section-4" className="scroll-mt-24">
        <div className="mb-6 flex items-center gap-2">
          <PersonSimpleRunIcon
            size={32}
            weight="duotone"
            className={`${textColorClass}`}
          />
          <h2 className={`font-sans text-4xl font-semibold ${textColorClass}`}>
            Action
          </h2>
        </div>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
        <p>
          We launched a closed beta with 12 teams and saw strong engagement.
          Teams used the tool to test landing page flows, signup friction, and
          feature comprehension. Feedback praised its speed and clarity. The
          product is now in early access with growing adoption. It’s helping
          teams make design decisions with evidence, not guesswork—and reshaping
          what quantitative UX looks like in practice.
        </p>
      </section>
      <section id="section-5" className="scroll-mt-24">
        <motion.div
          className="mb-6 flex flex-col rounded-[44px] border bg-background/20 p-6 text-foreground backdrop-blur-xl dark:bg-dark-background/10 dark:text-dark-foreground"
          style={{ borderColor }}
        >
          <div className="mb-6 flex items-center gap-2">
            <PresentationChartIcon
              size={32}
              weight="duotone"
              className={`${textColorClass}`}
            />
            <h2
              className={`font-sans text-4xl font-semibold ${textColorClass}`}
            >
              Results
            </h2>
          </div>{" "}
          <p>
            We launched a closed beta with 12 teams and saw strong engagement.
            Teams used the tool to test landing page flows, signup friction, and
            feature comprehension. Feedback praised its speed and clarity. The
            product is now in early access with growing adoption. It’s helping
            teams make design decisions with evidence, not guesswork—and
            reshaping what quantitative UX looks like in practice.
          </p>
        </motion.div>
      </section>
    </article>
  );
}
