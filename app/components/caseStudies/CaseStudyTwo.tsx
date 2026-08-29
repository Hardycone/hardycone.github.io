"use client";

import { useTheme } from "next-themes";
import { motion, MotionValue, useTransform } from "framer-motion";
import {
  BrainIcon,
  AtomIcon,
  HourglassMediumIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  PackageIcon,
  SealQuestionIcon,
  StackIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import HorizontalCardGroup from "../HorizontalCardGroup";
import LazyVideo from "../LazyVideo";
import SectionContainer from "../SectionContainer";
import SubHeading from "../SubHeading";
import SubSectionContainer from "../SubSectionContainer";
import VerticalCardGroup from "../VerticalCardGroup";

interface CaseStudyTwoProps {
  scrollY: MotionValue<number>;
}

const contentNoteClass =
  "rounded-1 border border-dashed border-foreground/20 px-4 py-3 italic text-foreground/60 dark:border-dark-foreground/20 dark:text-dark-foreground/60 md:rounded-2";

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
    (opacity) => `rgba(255,255,255,${opacity})`,
  );

  return (
    <article className="flex flex-col gap-8">
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
            <span className="font-bold text-flux dark:text-dark-flux">
              Flux helps product teams run rigorous experiments on their
              prototypes with ease.
            </span>{" "}
            Users can configure experiments, recruit large participant samples,
            run tests, and get reports within hours. They can learn behavioral
            trends, sentiment differences, and performance variation between
            their prototypes, all without any expertise in quantitative methods.
          </p>
        </SectionContainer>
        <SectionContainer
          showHeading={false}
          showBorder={false}
          containerClassName="mt-4"
          contentClassName=""
        >
          <HorizontalCardGroup
            alignment="centered"
            bottomMarginOnLarge="2rem"
            setCardAspectRatioOnLarge
            cardAspectRatioOnLarge="16/9"
            highlightBorderColor={theme.hex.primary}
            stickyTopOnLarge="5rem"
            cardClassName="rounded-6 md:rounded-8 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:rounded-12 supports-[corner-shape:squircle]:md:rounded-16"
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
            ].map(([number, title, copy]) => ({
              id: title,
              content: (
                <>
                  <span className={`text-sm font-bold ${theme.textColorClass}`}>
                    {number}
                  </span>
                  <h4 className="mt-auto pt-8">{title}</h4>
                  <p className="mt-3">{copy}</p>
                </>
              ),
            }))}
          />
        </SectionContainer>
      </section>
      <section id="section-2" className="scroll-mt-24">
        <SectionContainer
          heading="The Zero"
          headingIcon={SealQuestionIcon}
          borderColor={borderColor}
        >
          <p>
            Flux started with a simple observation:{" "}
            <span className="font-bold text-flux dark:text-dark-flux">
              AI has drastically lowered the cost of building, but not the cost
              of building the wrong thing.
            </span>{" "}
            Naturally, research is the answer to this. But as agentic design and
            dev workflows continue to accelerate, it&rsquo;s becoming
            increasingly difficult to strike the right balance between speed and
            confidence.
          </p>
          <SubSectionContainer>
            <SubHeading>Spotting the gap</SubHeading>
            <p>
              We took a look at existing research tools, and quickly noticed
              that they are overwhelmingly qualitative, which can be very useful
              in understanding the &lsquo;why&rsquo; behind behaviorial trends,
              but can&rsquo;t offer measurable confidence. Scaled testing remain
              largely out of reach for teams without existing infrastructure to
              support it. There seemed to be a gap where an easy-to-use
              quantitative testing tool for prototypes could exist.
            </p>
            <span
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] The gap: Product teams are prototyping with AI at a
              speed faster than ever before, but there is no way to validate
              ideas with statistical confidence that can match this speed.
            </span>
          </SubSectionContainer>
          <SubSectionContainer>
            <SubHeading>Research and discovery</SubHeading>
            <p>
              My cofounder and I started with conversations with people in our
              network. We reached out to a mix of reseearchers, product
              managers, and designers to learn about their existing workflows
              and their thoughts on a potential new solution that offers speed
              and rigor at the same time. This research process took the shape
              of casual and quick conversations and as well as more intentional
              and structured interviews. Once we sat down to compare notes, the
              emerging insights are illuminating.
            </p>
            <span
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] Research summary: Imagining a word cloud, with each
              word clickable to reveal full quotes. Might be too complicated
              though. Maybe some simple cards will suffice.
            </span>
          </SubSectionContainer>
          <SubSectionContainer>
            <VerticalCardGroup
              bodyWidthClassNameOnLarge="md:w-[max(10rem,40%)]"
              cardHeightOnLarge="min(calc(100dvh - 5rem), 400px)"
              cardHeightClassNameOnSmall="min-h-72"
              cardClassName="rounded-6 supports-[corner-shape:squircle]:rounded-12 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-8 supports-[corner-shape:squircle]:md:rounded-16"
              highlightBorderColor={theme.hex.primary}
              body={({ activeIndex: visibleCard }) => (
                <SubSectionContainer>
                  <SubHeading>Framing the problem</SubHeading>
                  <p>
                    Our research insights led us directly to a clear problem
                    space:
                  </p>
                  <p>
                    Existing quantitativ UX research workflows are{" "}
                    {[
                      { label: "intimidating", after: ", " },
                      { label: "time-consuming", after: ", and " },
                      {
                        label: "fragmented",
                        after: " across different tools.",
                      },
                    ].map(({ label, after }, index) => (
                      <span key={label}>
                        <motion.span
                          animate={{
                            color:
                              visibleCard === index
                                ? theme.hex.primary
                                : theme.hex.foregroundUltralight,
                            fontWeight: visibleCard === index ? 700 : 400,
                            fontSize: visibleCard === index ? "1.25em" : "1em",
                          }}
                        >
                          {label}
                        </motion.span>
                        {after}
                      </span>
                    ))}
                  </p>
                </SubSectionContainer>
              )}
              cards={[
                {
                  id: "concepts",
                  className: "flex flex-col justify-between p-6 md:p-10",
                  content: (
                    <>
                      <AtomIcon
                        size={48}
                        weight="duotone"
                        className={theme.textColorClass}
                      />
                      <div>
                        <h5 className="text-pretty font-sans text-3xl">
                          Statistics is inherently scientific.
                        </h5>
                        <p className="mt-3">
                          To get results that are statistically sound, expertise
                          is required.
                        </p>
                      </div>
                    </>
                  ),
                },
                {
                  id: "traffic",
                  className: "flex flex-col justify-between p-6 md:p-10",
                  content: (
                    <>
                      <HourglassMediumIcon
                        size={48}
                        weight="duotone"
                        className={theme.textColorClass}
                      />
                      <div>
                        <h5 className="text-pretty font-sans text-3xl">
                          Quantitative research takes time.
                        </h5>
                        <p className="mt-3">
                          Experiment design, sourcing, and reporting all take
                          time. It is not uncommon for an end-to-end process to
                          takes weeks.
                        </p>
                      </div>
                    </>
                  ),
                },
                {
                  id: "operation",
                  className: "flex flex-col justify-between p-6 md:p-10",
                  content: (
                    <>
                      <StackIcon
                        size={42}
                        weight="duotone"
                        className={theme.textColorClass}
                      />
                      <div>
                        <h5 className="text-pretty font-sans text-3xl">
                          Rigor is operationally heavy.
                        </h5>
                        <p className="mt-3">
                          Experiment design, recruitment, data collection,
                          analysis, and reporting often span multiple tools and
                          skillsets.
                        </p>
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          heading="The Messy Middle"
          headingIcon={PuzzlePieceIcon}
          showBorder={false}
        >
          <p>
            Once we established the problem space, we started sketching out what
            Flux needed to be. Along the way, we encountered many interesting
            design challenges. I will elaborate on 3 of them.
          </p>
          <HorizontalCardGroup
            showBody
            body={
              <SubSectionContainer>
                <SubHeading>Balancing rigor and usability</SubHeading>
              </SubSectionContainer>
            }
            alignment="aligned"
            stickyTopOnLarge="5rem"
            setCardAspectRatioOnLarge
            cardAspectRatioOnLarge="16/9"
            bottomMarginOnLarge="2rem"
            highlightBorderColor={theme.hex.primary}
            cardClassName="rounded-6 md:rounded-8 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:rounded-12 supports-[corner-shape:squircle]:md:rounded-16"
            cards={[
              {
                id: "tension",
                content: (
                  <div className="flex h-full flex-col">
                    <span
                      className={`text-sm font-bold ${theme.textColorClass}`}
                    >
                      Tension
                    </span>
                    <h4 className="mt-auto pt-8">Tension</h4>
                    <p className="mt-3">
                      [Placeholder] The central tension: how do we design a
                      productthat deals with highly scientific research methods
                      in a way that is easy to understand? An overarching theme
                      is finding the balance between a product that inspires
                      confidence in the results it delivers and a product that
                      is easy and intuitive to use. Two moments repeatedly
                      exposed the design tension. Teams had to choose a
                      defensible participant count without necessarily
                      understanding power analysis, and they had to configure an
                      expensive study before seeing the report it would produce.
                      In both cases, users needed guidance without losing
                      visibility or control. Valid without a stat lesson How
                      could teams run defensible studies without making setup
                      feel like coursework? Guidance without restriction How
                      could the default path protect newer users while
                      preserving expert control?
                    </p>
                  </div>
                ),
              },
              {
                id: "iterations",
                content: (
                  <div className="flex h-full flex-col">
                    <span
                      className={`text-sm font-bold ${theme.textColorClass}`}
                    >
                      Iterations
                    </span>
                    <h4 className="mt-auto pt-8">Iterations</h4>
                    <p className="mt-3">
                      On example of this is power analysis. When comparing two
                      variants, statisticians do a calculation called power
                      analysis to determine what sample size they need to find
                      potential statistical signifiance. In other words, how
                      many people to recruit in order to know the results are
                      real. This is a simple yet specialized matter. The
                      confidence provided by doing quantitative analysis is what
                      sets Flux apart. So we obviously want to make sure studies
                      are legit. At the same time, we didn&rsquo;t want to res
                    </p>
                  </div>
                ),
              },
              {
                id: "solution",
                content: (
                  <div className="flex h-full flex-col">
                    <span
                      className={`text-sm font-bold ${theme.textColorClass}`}
                    >
                      My Solution
                    </span>
                    <h4 className="mt-auto pt-8">I solved it</h4>
                    <p className="mt-3">
                      Researchers can then set a goal for their experiment. Flux
                      gives guidelines on how to set a sample size according to
                      statistical best practices. Researchers also have the
                      option to either generate a link to share with their own
                      panel, or recreate with Flux by a click of a button.
                    </p>
                  </div>
                ),
              },
            ]}
          />{" "}
          <HorizontalCardGroup
            showBody
            body={
              <SubSectionContainer>
                <SubHeading>
                  Building for trust in underlying methodology
                </SubHeading>
              </SubSectionContainer>
            }
            alignment="aligned"
            stickyTopOnLarge="5rem"
            setCardAspectRatioOnLarge
            cardAspectRatioOnLarge="16/9"
            bottomMarginOnLarge="2rem"
            highlightBorderColor={theme.hex.primary}
            cardClassName="rounded-6 md:rounded-8 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:rounded-12 supports-[corner-shape:squircle]:md:rounded-16"
            cards={[
              [
                "Import",
                "Import design prototypes",
                "[Placeholder] The central tension: how do we design a productthat deals with highly scientific research methods in a way that is easy to understand? An overarching theme is finding the balance between a product that inspires confidence in the results it delivers and a product that is easy and intuitive to use. Two moments                  repeatedly exposed the design tension. Teams had to choose a defensible participant count without necessarily understanding power analysis, and they had to configure an expensive study before seeing the report it would produce. In both cases, users needed guidance without losing visibility or control. Valid without a stat lesson How could teams run defensible studies without making setup feel like coursework? Guidance without restriction How could the default path protect newer users while preserving expert control?",
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
            ].map(([number, title, copy]) => ({
              id: title,
              content: (
                <>
                  <span className={`text-sm font-bold ${theme.textColorClass}`}>
                    {number}
                  </span>
                  <h4 className="mt-auto pt-8">{title}</h4>
                  <p className="mt-3">{copy}</p>
                </>
              ),
            }))}
          />
          <SubSectionContainer>
            <SubHeading>Eliminating uncertainty before commitment</SubHeading>
            <p>
              An overarching theme is finding the balance between a product that
              inspires confidence in the results it delivers and a product that
              is easy and intuitive to use. Two moments repeatedly exposed the
              design tension. Teams had to choose a defensible participant count
              without necessarily understanding power analysis, and they had to
              configure an expensive study before seeing the report it would
              produce. In both cases, users needed guidance without losing
              visibility or control.
            </p>
            <span
              className="rounded-1 p-6 transition-[background-color] supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] The central tension: how do we clearly signel to the
              user what a study would produce before committing time and money
              to run it?
            </span>
          </SubSectionContainer>
          <SubSectionContainer>
            <p className={contentNoteClass}>
              Content note: Show the early sample-size table as a brief sanity
              check, whiteboard sketches exploring how much statistics to
              expose, and notes or screenshots from practitioner check-ins.
            </p>
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          heading="The One"
          headingIcon={RocketLaunchIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>Launch</SubHeading>
            <p>
              Numerous iterations led us to Verion 1 of Flux which we launched
              to the public in April of 2026. Study setup created a different
              kind of uncertainty. Teams selected report components and wrote
              questions long before any data existed, yet a study could require
              recruiting hundreds of participants. I introduced a live sample
              report populated with fictitious data. As the study changed, the
              preview reflected those choices, letting teams see the shape of
              the outcome before launching.
            </p>
            <p className={contentNoteClass}>
              Content note: Show setup and the sample report side by side, plus
              a short clip of report components appearing as they are enabled.
            </p>{" "}
            <LazyVideo
              src="https://assets.haichaowang.com/promo-export-01.mp4"
              poster="/images/promo-export-01-poster.jpg"
              controls
              playsInline
              className="rounded-1 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4"
            />
          </SubSectionContainer>
          <SubSectionContainer>
            <SubHeading>Reception</SubHeading>
            <p>
              Flux matured into an end-to-end platform for quantitative
              prototype testing. Teams can configure a study, recruit
              participants, run tests, and review decision-ready results in one
              product. It is fully functional and publicly available, and my
              role has expanded into customer development, sales, and product
              strategy.
            </p>
            <span
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] “Great for more ambiguous testing where we want to
              get a quant pulse on key changes without building extensively.”
              Product Manager - Consumer App
            </span>
            <span
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] “Good tool for designers in a team that wants to
              democratize sound research.” UX Researcher - Consumer App
            </span>
            <span
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] “Flux helps when we have prototypes but no bandwidth
              to fully build something to test with confidence.” UX Research
              Manager - Consumer App
            </span>
            <span
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] “After doing interviews with a dozen users and
              identifying a promising direction, this can be a way to elevate
              the confidence of the insights with more tangible evidence.” UX
              Researcher - Big Tech
            </span>
            <span
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] “Being able to reduce the number of design variants
              before developing them further is a great advantage. It&rsquo;s a
              way of doing no-code A/B testing.” Engineering Manager - Consumer
              App
            </span>
            <span
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] “I really like how it looks. It&rsquo;s very easy to
              follow.” UX Manager - Big Tech
            </span>
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-5" className="mb-12 scroll-mt-24">
        <SectionContainer
          heading="Reflections"
          headingIcon={BrainIcon}
          borderColor={borderColor}
        >
          <SubSectionContainer>
            <SubHeading>Leveraging AI</SubHeading>
            <p>
              It has been an exciting learning experience to incorporate AI into
              my workflow. Everything is still new, but I experimented heavily
              and found my own way of using AI. Of course, everything is still
              subject to change as things evolve rapidly. 1. AI is allowing me
              to design much closer to the code. 2. Efficiency comes with a
              basic understanding of the code. 3. AI design has its pitfalls.
              The almost instantaneous code generation is a superpower. It helps
              visualize ideas much more easily. But at the same time, it can be
              a lot of slop. The designer&rsquo;s judgment is all the more
              important.
            </p>
          </SubSectionContainer>
          <SubSectionContainer>
            <SubHeading>Navigating Ambiguity</SubHeading>
            <p>
              My favorite part of this experience. It&rsquo;s a unique challenge
              that doesn&rsquo;t come along all the time. No matter how closely
              we follow a certain design process or methodology, at the end of
              the day we&rsquo;re creating something that doesn&rsquo;t exist
              yet. Research can only get you so far. The rest comes down to
              intuition, vision, and ability to execute.
            </p>
          </SubSectionContainer>
        </SectionContainer>
      </section>
    </article>
  );
}
