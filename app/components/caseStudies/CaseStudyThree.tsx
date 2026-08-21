"use client";

import { useTheme } from "next-themes";
import { MotionValue, useTransform } from "framer-motion";
import {
  BrainIcon,
  FileTextIcon,
  FilmStripIcon,
  ImageSquareIcon,
  PresentationChartIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  ScrollIcon,
  SealQuestionIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import HorizontalScrollGroup from "../HorizontalScrollGroup";
import SectionContainer from "../SectionContainer";
import SubSection from "../SubSection";

interface CaseStudyThreeProps {
  scrollY: MotionValue<number>;
}

const contentNoteClass =
  "rounded-1 border border-dashed border-foreground/20 px-4 py-3 italic text-foreground/60 dark:border-dark-foreground/20 dark:text-dark-foreground/60 md:rounded-2";

export default function CaseStudyThree({ scrollY }: CaseStudyThreeProps) {
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
          exitOnScroll
          revealOnScroll={false}
        >
          <SubSection>
            <p>
              Fantail was an AI-assisted story development startup I co-founded
              with two teammates while completing my MHCID at the University of
              Washington. We focused on the messy early phase where a film idea
              is still a mood, an image, or a fragment of dialogue. Our aim was
              to support that moment without forcing a rigid, script-first
              process.
            </p>
            <p>
              Over six months, we moved from discovery research to a functional
              MVP that let indie filmmakers start with any creative input and
              shape it into a structured story. We heard encouraging early
              reactions, especially to the flexible, scene-based approach, but
              we did not secure funding and chose not to continue bootstrapping.
            </p>
            <div className="grid gap-px overflow-hidden rounded-1 bg-foreground/10 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-foreground/15 md:grid-cols-3 md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4">
              {[
                ["Role", "Co-founder · Product design"],
                ["Research", "12 in-depth filmmaker interviews"],
                ["Outcome", "Functional MVP · Early positive feedback"],
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
              Content note: Show a hero image of the main workspace.
            </p>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-2" className="scroll-mt-24">
        <SectionContainer
          title="The Zero"
          icon={SealQuestionIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSection number="1" heading="Starting with ambiguity">
            <p>
              We began with a wide problem space in indie filmmaking and,
              through twelve semi-structured interviews, narrowed to a clear
              gap: early story vision is hard to externalize and align around.
              The research did not produce one dramatic pivot; it steadily
              sharpened the opportunity.
            </p>
          </SubSection>
          <SubSection number="2" heading="The problem">
            <p
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              Filmmakers carry a vivid story in their heads, but struggle to
              translate it into a clear, shareable artifact that collaborators
              can align on.
            </p>
            <p className={contentNoteClass}>
              Content note: Show one compact research artifact or
              problem-framing visual. Keep this section lean.
            </p>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          title="The Messy Middle"
          icon={PuzzlePieceIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSection number="1" heading="Research refined the lens">
            <p>
              I ran hour-long, semi-structured interviews with twelve
              independent filmmakers. Each session paired an interviewer with a
              note-taker and followed a flexible guide grounded in our research
              question. We then clustered the notes through affinity mapping to
              find patterns across very different creative practices.
            </p>
          </SubSection>
          <SubSection spacing="none">
            <HorizontalScrollGroup
              primaryColor={theme.hex.primary}
              body={
                <SubSection number="2" heading="Messy was the pattern">
                  <p>
                    The strongest finding was not a single preferred workflow.
                    It was that the process was deeply personal, organic, and
                    non-uniform.
                  </p>
                </SubSection>
              }
              cards={[
                {
                  id: "inputs",
                  content: (
                    <>
                      <span
                        className={`text-sm font-bold ${theme.textColorClass}`}
                      >
                        01
                      </span>
                      <h4 className="mt-auto pt-8">Ideas began anywhere</h4>
                      <p className="mt-3">
                        A story might begin as a photo, a mood board, a voice
                        note, a line of dialogue, or an unstructured note.
                      </p>
                    </>
                  ),
                },
                {
                  id: "collaboration",
                  content: (
                    <>
                      <span
                        className={`text-sm font-bold ${theme.textColorClass}`}
                      >
                        02
                      </span>
                      <h4 className="mt-auto pt-8">Alignment could be tacit</h4>
                      <p className="mt-3">
                        Experienced collaborators sometimes relied on trust and
                        shared context instead of formal artifacts.
                      </p>
                    </>
                  ),
                },
                {
                  id: "scope",
                  content: (
                    <>
                      <span
                        className={`text-sm font-bold ${theme.textColorClass}`}
                      >
                        03
                      </span>
                      <h4 className="mt-auto pt-8">Our lens was specific</h4>
                      <p className="mt-3">
                        We focused on independent filmmakers, whose processes
                        may differ from larger, more standardized productions.
                      </p>
                    </>
                  ),
                },
              ]}
            />
          </SubSection>
          <SubSection>
            <p className={contentNoteClass}>
              Content note: Show a small affinity map or cluster of interview
              notes. The artifact should support the decision, not dominate the
              section.
            </p>
          </SubSection>
          <SubSection number="3" heading="The design principle">
            <p
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              Support messy inputs first. Structure them over time.
            </p>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          title="The One"
          icon={RocketLaunchIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSection number="1" heading="A script-agnostic start">
            <p>
              Fantail was designed around a simple bet. Instead of forcing
              filmmakers to begin with a rigid screenplay format, we let them
              start with any creative material they already had and gradually
              turn it into a structured story.
            </p>
            <p className={contentNoteClass}>
              Content note: Show a full screenshot of the workspace.
            </p>
          </SubSection>

          <SubSection number="2" heading="Scenes without rigidity">
            <p>
              The core organizing unit was the scene. Our research showed that
              filmmaking processes vary widely, but all films are built out of
              scenes. That gave us a shared structure without dictating how a
              filmmaker had to begin.
            </p>
            <p className={contentNoteClass}>
              Content note: Show the add-scene interaction, an empty scene row,
              or the reorder view.
            </p>
          </SubSection>

          <SubSection number="3" heading="Three connected areas">
            <p>
              Each scene was divided into references, script, and storyboard.
              Together, the three areas connected raw inspiration to the written
              layer and then to visual frames.
            </p>
            <div className="grid gap-px overflow-hidden rounded-1 bg-foreground/10 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-foreground/15 sm:grid-cols-3 md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4">
              {[
                {
                  title: "References",
                  copy: "Images, mood boards, audio, notes, and other raw inspiration.",
                  icon: ImageSquareIcon,
                },
                {
                  title: "Script",
                  copy: "The written layer, with structure added as the story developed.",
                  icon: FileTextIcon,
                },
                {
                  title: "Storyboard",
                  copy: "Frames that translated text into composition, style, and sequence.",
                  icon: FilmStripIcon,
                },
              ].map(({ title, copy, icon: Icon }) => (
                <div
                  key={title}
                  className="bg-background p-6 dark:bg-dark-background"
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
            <p className={contentNoteClass}>
              Content note: Show an annotated screenshot of the three-column
              scene workspace.
            </p>
          </SubSection>

          <SubSection number="4" heading="Start anywhere, build outward">
            <p>
              A scene could start with a photo, a line of dialogue, a character
              note, or another fragment. From there, users could add context,
              highlight text, generate storyboard frames, and refine composition
              and style. The product added structure as the story became
              clearer, rather than demanding it up front.
            </p>
            <p className={contentNoteClass}>
              Content note: Show a step-by-step flow from reference to text to
              storyboard.
            </p>
          </SubSection>

          <SubSection number="5" heading="Deliberate cuts">
            <p>
              We explored AI table reads and permission-based collaboration, but
              held both back. Voice quality was not consistent enough, and
              collaboration expanded the scope before the core loop had been
              proven. The MVP stayed focused on one experience: helping
              filmmakers move from scattered creative inputs to a structured,
              scene-by-scene story.
            </p>
            <p className={contentNoteClass}>
              Content note: Optionally show a small “explored, not shipped”
              callout, followed by a polished MVP screen or a before-and-after
              flow.
            </p>
          </SubSection>
        </SectionContainer>
      </section>

      <section id="section-5" className="scroll-mt-24">
        <SectionContainer
          title="Outcome"
          icon={PresentationChartIcon}
          textColorClass="text-foreground dark:text-dark-foreground"
          bgColorClass="bg-foreground dark:bg-dark-foreground"
          borderColor={borderColor}
        >
          <SubSection number="1" heading="Product signal, business reality">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h4 className={theme.textColorClass}>What we reached</h4>
                <p className="mt-3">
                  We built a functional MVP and heard positive early feedback,
                  especially about the flexible, scene-based approach. The
                  product signal was encouraging, but we never ran a full
                  adoption push.
                </p>
              </div>
              <div>
                <h4 className={theme.textColorClass}>Where it stopped</h4>
                <p className="mt-3">
                  We pursued venture funding but did not secure it, and chose
                  not to continue bootstrapping. That made the outcome a funding
                  and go-to-market constraint, not evidence that adoption had
                  failed.
                </p>
              </div>
            </div>
            <p>
              The process also exposed a founder-market-fit gap. We were
              passionate about the opportunity, but lacked deep industry access
              and distribution channels. Investor conversations repeatedly
              surfaced the same risks: the market&apos;s venture-scale potential
              and our limited network in Hollywood and Los Angeles.
            </p>
            <p className={contentNoteClass}>
              Content note: Show final MVP screens and one short feedback quote,
              if a representative quote is available.
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
          <SubSection number="1" heading="What I carried forward">
            <p>
              Fantail taught me how to turn a messy creative process into a
              structured product system. It also taught me that a strong concept
              and thoughtful UX are not enough without distribution and
              founder-market fit. If I tackled the problem again, I would test
              access, channels, and business risk much earlier—alongside the
              product experience, not after it.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                [
                  "Structure can emerge",
                  "A product can respect personal workflows while helping people build toward a shared artifact.",
                ],
                [
                  "Founder-market fit matters",
                  "Industry access, trust, and distribution are product risks, not just business concerns.",
                ],
                [
                  "Test the business sooner",
                  "Product signal, adoption, fundraising, and venture fit are different questions.",
                ],
              ].map(([title, copy]) => (
                <div key={title}>
                  <h4>{title}</h4>
                  <p className="mt-2">{copy}</p>
                </div>
              ))}
            </div>
            <p className={contentNoteClass}>
              Content note: Show a simple closing reflection visual.
            </p>
          </SubSection>
        </SectionContainer>
      </section>
    </article>
  );
}
