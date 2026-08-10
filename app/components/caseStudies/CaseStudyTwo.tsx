"use client";

import { useTheme } from "next-themes";
import { motion, MotionValue, useTransform } from "framer-motion";
import {
  ArrowRightIcon,
  BrainIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CursorClickIcon,
  PresentationChartIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  ScrollIcon,
  SealQuestionIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import CaseStudyFigure from "../CaseStudyFigure";
import HorizontalFilmstrip from "../HorizontalScrollGroup";
import LazyVideo from "../LazyVideo";
import SectionContainer from "../SectionContainer";
import SubSectionHeading from "../SubSectionHeading";
import VerticalScrollCards from "../VerticalScrollGroup";

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
    <article>
      <section id="section-1" className="scroll-mt-24">
        <SectionContainer
          title="The Product"
          icon={ScrollIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
          revealOnScroll={false}
        >
          <SubSectionHeading
            number="1"
            heading="Quantitative evidence before implementation"
          />
          <p>AI made it building cheaper, but not choosing the right thing.</p>
          <p className="mb-8 text-pretty">
            Flux helps teams validate prototypes with quantitative evidence
            before implementation. Teams configure studies, recruit
            participants, run prototype tests, and generate reports that reveal
            behavioral patterns and performance differences.
          </p>
          <div className="mb-8 grid gap-px overflow-hidden rounded-1 bg-foreground/10 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-foreground/15 md:grid-cols-3 md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4">
            {[
              ["Audience", "Designers · Mixed-methods researchers"],
              ["Role", "Co-founder · Product design lead"],
              ["Status", "Live · Fully functional product"],
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
          <p className={contentNoteClass}>
            Content note: Lead with a clean dashboard hero. Place the marketing
            video directly below as a “watch overview,” then show a simple
            full-width workflow: configure study → recruit participants → run
            prototype test → read report. Credit the video as work I created end
            to end: concept, storyboarding, 3D, animation, and editing.
          </p>
          <LazyVideo
            src="https://assets.haichaowang.com/promo-export-01.mp4"
            poster="/images/promo-export-01-poster.jpg"
            controls
            playsInline
            className="rounded-1 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4"
          />
          <p className="mb-12 mt-3 text-foreground/60 dark:text-dark-foreground/60">
            I created the product film end to end, from concept and
            storyboarding through 3D, animation, and editing.
          </p>
          <CaseStudyFigure caption="A simple orientation to the end-to-end Flux workflow.">
            <div className="grid w-full max-w-4xl gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
              {[
                ["Configure", "Prototype + study"],
                ["Recruit", "Target participants"],
                ["Test", "Behavior + feedback"],
                ["Report", "Evidence + uncertainty"],
              ].map(([title, copy], index, steps) => (
                <div key={title} className="contents">
                  <div className="flex min-h-28 flex-col justify-center rounded-1 bg-background p-4 text-center shadow-sm dark:bg-dark-background md:rounded-2">
                    <span
                      className={`font-sans text-sm font-bold ${theme.textColorClass}`}
                    >
                      {title}
                    </span>
                    <span className="mt-2 font-sans text-xs opacity-60">
                      {copy}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRightIcon
                      size={18}
                      className="mx-auto rotate-90 opacity-35 md:rotate-0"
                    />
                  )}
                </div>
              ))}
            </div>
          </CaseStudyFigure>
        </SectionContainer>
      </section>

      <section id="section-2" className="scroll-mt-24">
        <SectionContainer
          title="The 0"
          icon={SealQuestionIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSectionHeading
            number="1"
            heading="More ideas, same decision risk"
          />
          <p className="mb-12 text-pretty px-2">
            Prototyping tools let teams explore more directions than ever, but
            teams were still guessing which concepts would land. Flux focuses on
            quantitative prototype validation: testing designs with real
            participants before committing to heavy implementation.
          </p>
          <VerticalScrollCards
            highlightOnIntersect
            sideContent={({ activeIndex: visibleCard }) => (
              <div className="px-2">
                <SubSectionHeading number="2" heading="Where the gap appears" />
                <p className="mb-4">Teams need evidence</p>
                {[
                  "before implementation",
                  "without live-product traffic",
                  "without assembling a research stack",
                ].map((label, index) => (
                  <motion.p
                    key={label}
                    className="mb-3"
                    animate={{
                      color:
                        visibleCard === index
                          ? theme.hex.primary
                          : theme.hex.foreground,
                      fontWeight: visibleCard === index ? 700 : 400,
                    }}
                  >
                    {label}
                  </motion.p>
                ))}
              </div>
            )}
            cards={[
              {
                id: "concepts",
                className:
                  "flex h-auto min-h-72 flex-col justify-end p-6 md:h-full md:p-10",
                content: (
                  <>
                    <CursorClickIcon
                      size={42}
                      weight="duotone"
                      className={theme.textColorClass}
                    />
                    <h4 className="mt-8">Prototypes multiply quickly</h4>
                    <p className="mt-3">
                      Faster creation increased the number of plausible
                      directions without making the choice between them easier.
                    </p>
                  </>
                ),
              },
              {
                id: "traffic",
                className:
                  "flex h-auto min-h-72 flex-col justify-end p-6 md:h-full md:p-10",
                content: (
                  <>
                    <ChartBarIcon
                      size={42}
                      weight="duotone"
                      className={theme.textColorClass}
                    />
                    <h4 className="mt-8">In-product testing comes later</h4>
                    <p className="mt-3">
                      Conventional A/B testing needs a live product and traffic.
                      Flux helps teams evaluate designs before reaching that
                      stage.
                    </p>
                  </>
                ),
              },
              {
                id: "operation",
                className:
                  "flex h-auto min-h-72 flex-col justify-end p-6 md:h-full md:p-10",
                content: (
                  <>
                    <UsersThreeIcon
                      size={42}
                      weight="duotone"
                      className={theme.textColorClass}
                    />
                    <h4 className="mt-8">Rigor is operationally heavy</h4>
                    <p className="mt-3">
                      Study setup, recruitment, data collection, analysis, and
                      reporting often span multiple tools and skill sets.
                    </p>
                  </>
                ),
              },
            ]}
          />
          <p className={contentNoteClass}>
            Content note: Show a simple decision-point diagram—several vague
            ideas becoming a clearer fork, then a committed implementation path.
            Keep it conceptual rather than UI-heavy.
          </p>
        </SectionContainer>
      </section>

      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          title="The Messy Middle"
          icon={PuzzlePieceIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor="rgba(0,0,0,0)"
          cardClass="w-full min-w-0"
        >
          <SubSectionHeading
            number="1"
            heading="Complexity surfaced at commitment points"
          />
          <p className="mb-10 text-pretty px-2">
            Two moments repeatedly exposed the design tension. Teams had to
            choose a defensible participant count without necessarily
            understanding power analysis, and they had to configure an expensive
            study before seeing the report it would produce. In both cases,
            users needed guidance without losing visibility or control.
          </p>
          <HorizontalFilmstrip
            body={
              <>
                <SubSectionHeading
                  number="2"
                  heading="Three recurring questions"
                />
                <p className="text-pretty px-2">
                  Practitioner conversations and design reviews kept returning
                  to the same questions across the product.
                </p>
              </>
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
          <p className={contentNoteClass}>
            Content note: Show the early sample-size table as a brief sanity
            check, whiteboard sketches exploring how much statistics to expose,
            and notes or screenshots from practitioner check-ins.
          </p>
          <SubSectionHeading number="3" heading="The product-level tension" />
          <p
            className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
            style={{ backgroundColor: theme.hex.soft }}
          >
            Designing Flux was not about removing statistical complexity. It was
            about deciding which complexity belonged in the product, then
            shaping it so people could act with confidence.
          </p>
        </SectionContainer>
      </section>

      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          title="The 1"
          icon={RocketLaunchIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor="rgba(0,0,0,0)"
        >
          <SubSectionHeading
            number="1"
            heading="Participant sizing: guide without locking in"
          />
          <p className="mb-8 text-pretty px-2">
            Participant sizing made the beginner–expert tension concrete. Most
            users did not want to perform a power analysis, while experienced
            researchers still needed control over the assumptions. I designed a
            heavily modified slider with four defensible sample-size ranges for
            the guided path. An adjacent numeric input let experts move outside
            those ranges when their own calculations called for it. The
            guardrail was soft: opinionated enough to guide, but not rigid
            enough to erase expertise.
          </p>
          <p className={contentNoteClass}>
            Content note: Briefly show the early table that we sanity-checked
            and moved past, then use an annotated close-up of the final slider
            and adjacent numeric override. Do not manufacture a dramatic pivot.
          </p>

          <SubSectionHeading
            number="2"
            heading="Report preview: show value before commitment"
          />
          <p className="mb-8 text-pretty px-2">
            Study setup created a different kind of uncertainty. Teams selected
            report components and wrote questions long before any data existed,
            yet a study could require recruiting hundreds of participants. I
            introduced a live sample report populated with fictitious data. As
            the study changed, the preview reflected those choices, letting
            teams see the shape of the outcome before launching.
          </p>
          <p className={contentNoteClass}>
            Content note: Show setup and the sample report side by side, plus a
            short clip of report components appearing as they are enabled.
          </p>

          <SubSectionHeading number="3" heading="One pattern, two decisions" />
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
                <p className="mt-2 text-pretty">{copy}</p>
              </div>
            ))}
          </div>
          <p className={`${contentNoteClass} mt-8`}>
            Content note: Add one small visual tying both examples back to the
            principle “guide, but do not restrict.”
          </p>
        </SectionContainer>
      </section>

      <section id="section-5" className="scroll-mt-24">
        <SectionContainer
          title="Outcome"
          icon={PresentationChartIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor="rgba(0,0,0,0)"
        >
          <SubSectionHeading number="1" heading="A complete, live product" />
          <p className="mb-8 text-pretty px-2">
            Flux matured into a full platform for quantitative prototype
            testing. Teams can configure a study, recruit participants, run
            tests, and review decision-ready results in one product. It is fully
            functional and publicly available, and my role has expanded into
            customer development, sales, and product strategy.
          </p>
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div>
              <h4 className={theme.textColorClass}>
                For experienced researchers
              </h4>
              <p className="mt-3 text-pretty">
                Demo feedback suggested that transparent assumptions and expert
                overrides helped the methodology feel credible rather than
                opaque or oversimplified.
              </p>
            </div>
            <div>
              <h4 className={theme.textColorClass}>For newer researchers</h4>
              <p className="mt-3 text-pretty">
                Guided setup and plain-language explanations helped people
                follow the core concepts without prior statistical training.
              </p>
            </div>
          </div>
          <a
            href="https://testwithflux.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 font-sans font-semibold transition-transform hover:scale-[0.98] ${theme.borderColorClass} ${theme.textColorClass}`}
          >
            Visit testwithflux.com
            <ArrowRightIcon size={18} />
          </a>
          <div className="mt-12 flex items-start gap-3 border-t pt-5 dark:border-dark-foreground/20">
            <CheckCircleIcon
              size={24}
              weight="fill"
              className={`shrink-0 ${theme.textColorClass}`}
            />
            <p className="text-pretty">
              Across dozens of product demos, the clearest response was to the
              combination of guided setup and preserved expert control.
            </p>
          </div>
          <p className={`${contentNoteClass} mt-8`}>
            Content note: Show a minimal set of final product screens and one or
            two representative feedback quotes, if the original wording is
            available.
          </p>
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
          <SubSectionHeading number="1" heading="What I carry forward" />
          <p className="mb-10 text-pretty">
            Flux gave me a more grounded view of simplification. It is not about
            removing complexity; it is about shaping complexity so people can
            use it with confidence. Building the product also reinforced that
            technically strong UX is only one part of building a viable company.
            Product design, distribution, and business strategy cannot be
            treated as separate systems.
          </p>
          <div className="mb-8 grid gap-8 md:grid-cols-3">
            {[
              [
                "Ease is engineered",
                "A calm experience can carry substantial rigor underneath when the product makes the right decisions visible.",
              ],
              [
                "Expertise deserves an exit ramp",
                "Good guardrails support the default path while leaving room for informed exceptions.",
              ],
              [
                "The product is more than the interface",
                "A strong experience has to operate within a viable strategy for access, distribution, and growth.",
              ],
            ].map(([title, copy]) => (
              <div key={title}>
                <h4>{title}</h4>
                <p className="mt-2 text-pretty">{copy}</p>
              </div>
            ))}
          </div>
          <p className={contentNoteClass}>
            Content note: End with one minimal visual of the finished product,
            keeping the emphasis on the design lesson rather than commercial
            success.
          </p>
        </SectionContainer>
      </section>
    </article>
  );
}
