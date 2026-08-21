"use client";

import { useTheme } from "next-themes";
import { motion, MotionValue, useTransform } from "framer-motion";
import {
  BrainIcon,
  CheckCircleIcon,
  AtomIcon,
  PresentationChartIcon,
  HourglassMediumIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  ScrollIcon,
  SealQuestionIcon,
  StackIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import HorizontalScrollGroup from "../HorizontalScrollGroup";
import LazyVideo from "../LazyVideo";
import SectionContainer from "../SectionContainer";
import SubSection from "../SubSection";
import VerticalScrollGroup from "../VerticalScrollGroup";

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
          animateHeadingReveal={false}
          title="The Product"
          icon={ScrollIcon}
          borderColor={borderColor}
          exitOnScroll
          revealOnScroll={false}
        >
          <SubSection number="1" heading="What it is">
            <p>
              Flux helps product teams validate prototypes with scaled
              quantitative evidence before implementation. Teams can configure
              experiments, recruit broad participant samples, run prototype
              tests, and get reports that reveal statistically significant
              behavioral trends, sentiment differences, and performance
              variation between design variants, all within hours.
            </p>
            <LazyVideo
              src="https://assets.haichaowang.com/promo-export-01.mp4"
              poster="/images/promo-export-01-poster.jpg"
              controls
              playsInline
              className="rounded-1 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4"
            />
          </SubSection>
          <HorizontalScrollGroup
            fillAvailableHeight
            bottomMargin="2rem"
            cardAspectRatio="16/9"
            primaryColor={theme.hex.primary}
            body={
              <SubSection number="2" heading="How it works">
                <p>
                  The focus of Flux is to make a complex and specialized
                  workflow into something anyone can easily use without feeling
                  uncertain.
                </p>
              </SubSection>
            }
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
          title="The Zero"
          icon={SealQuestionIcon}
          borderColor={borderColor}
        >
          <p>
            Flux started with a simple observation: AI has drastically lowered
            the cost of building, but not the cost of building the wrong thing.
            Naturally, research is the answer to this. But as agentic design and
            dev workflows continue to accelerate, it&rsquo;s becoming
            increasingly difficult to strike the right balance between speed and
            confidence.
          </p>
          <SubSection number="1" heading="Spotting the gap">
            <p>
              We took a look at existing research tools, and quickly noticed
              that they are overwhelmingly qualitative, which don&rsquo;t offer
              measurable confidence. Scaled testing remain largely out of reach
              for teams without existing infrastructure to support it. There
              seemed to be a gap where an easy-to-use quantitative testing tool
              for prototypes could exist.
            </p>
            <span
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] The gap: Product teams are prototyping with AI at a
              speed faster than ever before, but there is no way to validate
              ideas with statistical confidence that can match this speed.
            </span>
          </SubSection>
          <SubSection number="2" heading="Research and discovery">
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
          </SubSection>
          <SubSection>
            <VerticalScrollGroup
              highlightOnIntersect
              sideWidth="max(10rem,40%)"
              cardHeight="min(calc(100dvh - 5rem), 400px)"
              primaryColor={theme.hex.primary}
              sideContent={({ activeIndex: visibleCard }) => (
                <SubSection number="3" heading="Framing the problem">
                  <p>
                    {" "}
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
                </SubSection>
              )}
              cards={[
                {
                  id: "concepts",
                  className:
                    "flex h-auto min-h-72 flex-col justify-between p-6 md:h-full md:p-10",
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
                  className:
                    "flex h-auto min-h-72 flex-col justify-between p-6 md:h-full md:p-10",
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
                  className:
                    "flex h-auto min-h-72 flex-col justify-between p-6 md:h-full md:p-10",
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
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          title="The Messy Middle"
          icon={PuzzlePieceIcon}
          borderColor="rgba(0,0,0,0)"
        >
          <p>
            Once we established the problem space, we started sketching out what
            Flux needed to be. Along the way, we encountered many interesting
            design challenges. I will elaborate on 3 of them.
          </p>
          <SubSection number="1" heading="Balancing Rigor with Usability">
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
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              [Placeholder] The central tension: how do we design a product that
              deals with highly scientific research methods in a way that is
              easy to understand?
            </span>
          </SubSection>
          <HorizontalScrollGroup
            primaryColor={theme.hex.primary}
            body={
              <SubSection number="2" heading="Three recurring questions">
                <p>
                  Practitioner conversations and design reviews kept returning
                  to the same questions across the product.
                </p>
              </SubSection>
            }
            cards={[
              [
                "01",
                "Valid without a stats lesson",
                "How could teams run defensible studies without making setup feel like coursework?",
              ],
              [
                "02",
                "Guidance without restriction",
                "How could the default path protect newer users while preserving expert control?",
              ],
              [
                "03",
                "Trust before the outcome exists",
                "How could people understand what a study would produce before spending time and money to run it?",
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
          <SubSection>
            <p className={contentNoteClass}>
              Content note: Show the early sample-size table as a brief sanity
              check, whiteboard sketches exploring how much statistics to
              expose, and notes or screenshots from practitioner check-ins.
            </p>
          </SubSection>
          <SubSection
            number="3"
            heading="The product-level tension that is so tense and so irritating, i'm honestly kind of intimidated. i mean what the hell. how is this even part of the discussion in any way whatsoever?"
          >
            <p
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              Designing Flux was not about removing statistical complexity. It
              was about deciding which complexity belonged in the product, then
              shaping it so people could act with confidence.
            </p>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          title="The One"
          icon={RocketLaunchIcon}
          borderColor="rgba(0,0,0,0)"
        >
          <p>
            Numerous iterations led us to Verion 1 of Flux which we launched to
            the public in April of 2026.
          </p>
          <SubSection
            number="1"
            heading="Participant sizing: guide without locking in"
          >
            <p>
              Participant sizing made the beginner–expert tension concrete. Most
              users did not want to perform a power analysis, while experienced
              researchers still needed control over the assumptions. I designed
              a heavily modified slider with four defensible sample-size ranges
              for the guided path. An adjacent numeric input let experts move
              outside those ranges when their own calculations called for it.
              The guardrail was soft: opinionated enough to guide, but not rigid
              enough to erase expertise.
            </p>
            <p className={contentNoteClass}>
              Content note: Briefly show the early table that we sanity-checked
              and moved past, then use an annotated close-up of the final slider
              and adjacent numeric override. Do not manufacture a dramatic
              pivot.
            </p>
          </SubSection>
          <SubSection
            number="2"
            heading="Report preview: show value before commitment"
          >
            <p>
              Study setup created a different kind of uncertainty. Teams
              selected report components and wrote questions long before any
              data existed, yet a study could require recruiting hundreds of
              participants. I introduced a live sample report populated with
              fictitious data. As the study changed, the preview reflected those
              choices, letting teams see the shape of the outcome before
              launching.
            </p>
            <p className={contentNoteClass}>
              Content note: Show setup and the sample report side by side, plus
              a short clip of report components appearing as they are enabled.
            </p>
          </SubSection>
          <SubSection number="3" heading="One pattern, two decisions">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                [
                  "Guide without oversimplifying",
                  "Build good research practice into the interface instead of relying on documentation or hand-holding.",
                ],
                [
                  "Make outcomes visible",
                  "Reduce uncertainty before users commit time, participants, and budget.",
                ],
                [
                  "Respect expertise",
                  "Keep the entry point approachable without hiding assumptions or removing expert control.",
                ],
              ].map(([title, copy]) => (
                <div key={title}>
                  <h4 className={theme.textColorClass}>{title}</h4>
                  <p className="mt-2">{copy}</p>
                </div>
              ))}
            </div>
            <p className={contentNoteClass}>
              Content note: Add one small visual tying both examples back to the
              principle “guide, but do not restrict.”
            </p>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-5" className="scroll-mt-24">
        <SectionContainer
          title="Outcome"
          icon={PresentationChartIcon}
          borderColor={borderColor}
        >
          <p>
            Flux matured into an end-to-end platform for quantitative prototype
            testing. Teams can configure a study, recruit participants, run
            tests, and review decision-ready results in one product. It is fully
            functional and publicly available, and my role has expanded into
            customer development, sales, and product strategy.
          </p>
          <span
            className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
            style={{ backgroundColor: theme.hex.soft }}
          >
            [Placeholder] “Great for more ambiguous testing where we want to get
            a quant pulse on key changes without building extensively.” Product
            Manager - Consumer App
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
            identifying a promising direction, this can be a way to elevate the
            confidence of the insights with more tangible evidence.” UX
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
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h4 className={theme.textColorClass}>
                For experienced researchers
              </h4>
              <p className="mt-3">
                Demo feedback suggested that transparent assumptions and expert
                overrides helped the methodology feel credible rather than
                opaque or oversimplified.
              </p>
            </div>
            <div>
              <h4 className={theme.textColorClass}>For newer researchers</h4>
              <p className="mt-3">
                Guided setup and plain-language explanations helped people
                follow the core concepts without prior statistical training.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t pt-5 dark:border-dark-foreground/20">
            <CheckCircleIcon
              size={24}
              weight="fill"
              className={`shrink-0 ${theme.textColorClass}`}
            />
            <p>
              Across dozens of product demos, the clearest response was to the
              combination of guided setup and preserved expert control.
            </p>
          </div>
          <p className={contentNoteClass}>
            Content note: Show a minimal set of final product screens and one or
            two representative feedback quotes, if the original wording is
            available.
          </p>
        </SectionContainer>
      </section>

      <section id="section-6" className="mb-12 scroll-mt-24">
        <SectionContainer
          title="Reflection"
          icon={BrainIcon}
          borderColor={borderColor}
        >
          <p>
            Flux gave me a more grounded view of simplification. It is not about
            removing complexity; it is about shaping complexity so people can
            use it with confidence. Building the product also reinforced that
            technically strong UX is only one part of building a viable company.
            Product design, distribution, and business strategy cannot be
            treated as separate systems.
          </p>
          <SubSection number="1" heading="Leveraging AI">
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
            <p>
              A calm experience can carry substantial rigor underneath when the
              product makes the right decisions visible. Good guardrails support
              the default path while leaving room for informed exceptions.
            </p>

            <p className={contentNoteClass}>
              Content note: End with one minimal visual of the finished product,
              keeping the emphasis on the design lesson rather than commercial
              success.
            </p>
          </SubSection>
          <SubSection number="2" heading="Designing for growth">
            <p>
              A calm experience can carry substantial rigor underneath when the
              product makes the right decisions visible. Good guardrails support
              the default path while leaving room for informed exceptions.
            </p>

            <p className={contentNoteClass}>
              Content note: End with one minimal visual of the finished product,
              keeping the emphasis on the design lesson rather than commercial
              success.
            </p>
          </SubSection>{" "}
          <SubSection number="3" heading="">
            <p>
              A calm experience can carry substantial rigor underneath when the
              product makes the right decisions visible. Good guardrails support
              the default path while leaving room for informed exceptions.
            </p>

            <p className={contentNoteClass}>
              Content note: End with one minimal visual of the finished product,
              keeping the emphasis on the design lesson rather than commercial
              success.
            </p>
          </SubSection>
        </SectionContainer>
        <SectionContainer
          showHeading={false}
          borderColor="rgb(0,0,0,0)"
          cardClassName="mt-12"
          bgColorClass=""
          contentClassName=""
        >
          <h3 className="flex items-start justify-center">Next Up</h3>
        </SectionContainer>
      </section>
    </article>
  );
}
