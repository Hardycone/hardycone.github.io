"use client";

// import { useTheme } from "next-themes";
import {
  MotionValue,
  // , useTransform
} from "framer-motion";
import {
  BrainIcon,
  PackageIcon,
  FileTextIcon,
  FilmStripIcon,
  ImageSquareIcon,
  // PresentationChartIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  SealQuestionIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import { useSiteNavigation } from "@/app/context/SiteNavigationContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
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

interface CaseStudyThreeProps {
  scrollY: MotionValue<number>;
  fadeInFirstSection?: boolean;
  firstSectionFadeReady?: boolean;
}

const contentNoteClass =
  "rounded-1 border border-dashed border-foreground/20 px-4 py-3 italic text-foreground/60 dark:border-dark-foreground/20 dark:text-dark-foreground/60 md:rounded-2";

export default function CaseStudyThree({
  // scrollY,
  fadeInFirstSection = false,
  firstSectionFadeReady = true,
}: CaseStudyThreeProps) {
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
                Fantail offered filmmakers focused on the messy early phase
                where a film idea is still a mood, an image, or a fragment of
                dialogue. Our aim was to support that moment without forcing a
                rigid process.
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
                        className={`min-w-0 flex-1 overflow-hidden border border-fantail bg-fantail tall:min-h-0 ${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
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
                        className={`min-w-0 flex-1 overflow-hidden border border-fantail bg-fantail tall:min-h-0 ${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
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
                        className={`min-w-0 flex-1 overflow-hidden border border-fantail bg-fantail tall:min-h-0 ${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
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
                  highlightCardClassName="flex h-full min-h-[inherit] flex-col border border-fantail/50 dark:border-dark-fantail/50"
                  contentClassName="flex min-h-0 flex-1 flex-col overflow-auto p-2 tall:overflow-hidden"
                >
                  {content}
                </HighlightCard>
              ))}
            />
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-2" className="scroll-mt-24">
        <SectionContainer
          heading="The Zero"
          headingIcon={SealQuestionIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>Starting with ambiguity</SubHeading>
            <p>
              We began with a wide problem space in indie filmmaking and,
              through twelve semi-structured interviews, narrowed to a clear
              gap: early story vision is hard to externalize and align around.
              The research did not produce one dramatic pivot; it steadily
              sharpened the opportunity.
            </p>
          </SubSectionContainer>
          <SubSectionContainer>
            <SubHeading>The problem</SubHeading>
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
          </SubSectionContainer>
        </SectionContainer>
      </section>
      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          heading="The Messy Middle"
          headingIcon={PuzzlePieceIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>Research refined the lens</SubHeading>
            <p>
              I ran hour-long, semi-structured interviews with twelve
              independent filmmakers. Each session paired an interviewer with a
              note-taker and followed a flexible guide grounded in our research
              question. We then clustered the notes through affinity mapping to
              find patterns across very different creative practices.
            </p>
          </SubSectionContainer>
          <SubSectionContainer subSectionContainerClassName="gap-4 md:gap-6">
            <SubSectionContainer>
              <SubHeading>Messy was the pattern</SubHeading>
              <p>
                The strongest finding was not a single preferred workflow. It
                was that the process was deeply personal, organic, and
                non-uniform.
              </p>
            </SubSectionContainer>
            <HorizontalCardGroup
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
          <SubSectionContainer>
            <SubHeading>The design principle</SubHeading>
            <p
              className="rounded-1 p-6 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] md:rounded-2 md:p-10 supports-[corner-shape:squircle]:md:rounded-4"
              style={{ backgroundColor: theme.hex.soft }}
            >
              Support messy inputs first. Structure them over time.
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
            <SubHeading>A script-agnostic start</SubHeading>
            <p>
              Fantail was designed around a simple bet. Instead of forcing
              filmmakers to begin with a rigid screenplay format, we let them
              start with any creative material they already had and gradually
              turn it into a structured story.
            </p>
            <p className={contentNoteClass}>
              Content note: Show a full screenshot of the workspace.
            </p>
          </SubSectionContainer>

          <SubSectionContainer>
            <SubHeading>Scenes without rigidity</SubHeading>
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
          </SubSectionContainer>

          <SubSectionContainer>
            <SubHeading>Three connected areas</SubHeading>
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
          </SubSectionContainer>

          <SubSectionContainer>
            <SubHeading>Start anywhere, build outward</SubHeading>
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
          </SubSectionContainer>

          <SubSectionContainer>
            <SubHeading>Deliberate cuts</SubHeading>
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
          </SubSectionContainer>

          <SubSectionContainer>
            <SubHeading>Product signal, business reality</SubHeading>
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
          </SubSectionContainer>
        </SectionContainer>{" "}
      </section>

      <section id="section-5" className="mb-16 scroll-mt-24 md:mb-24">
        <SectionContainer
          heading="Reflection"
          headingIcon={BrainIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>What I carried forward</SubHeading>
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
          </SubSectionContainer>
        </SectionContainer>
      </section>
    </article>
  );
}
