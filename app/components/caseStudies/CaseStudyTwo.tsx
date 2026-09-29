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
  LinkBreakIcon,
} from "@phosphor-icons/react";
import projects from "@/data/projects";
import { useSiteNavigation } from "@/app/context/SiteNavigationContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import HorizontalCardGroup from "../HorizontalCardGroup";
import HorizontalScrollStrip from "../HorizontalScrollStrip";
import LazyVideo from "../LazyVideo";
import SectionContainer from "../SectionContainer";
import SubHeading from "../SubHeading";
import SubSectionContainer from "../SubSectionContainer";
import VerticalCardGroup from "../VerticalCardGroup";
import HighlightCard from "../HighlightCard";
import TextCard, { TextCardEmphasis } from "../TextCard";
import ZoomableImage from "../ZoomableImage";
import ResearchThemeCanvas, {
  type ResearchTheme,
} from "../ResearchThemeCanvas";
import {
  ROUNDED_SQUIRCLE_01,
  ROUNDED_SQUIRCLE_03,
  ROUNDED_SQUIRCLE_03_MD,
  ROUNDED_SQUIRCLE_05_MD,
} from "@/lib/styleTokens";

interface CaseStudyTwoProps {
  scrollY: MotionValue<number>;
  fadeInFirstSection?: boolean;
  firstSectionFadeReady?: boolean;
}

const researchThemes: ResearchTheme[] = [
  {
    id: "research-time",
    label: "Research takes too long",
    quotes: [
      {
        id: "take-two-weeks",
        compactPosition: {
          x: "-25%",
          y: "-20%",
        },
        before:
          "Sometimes I have two conflicting design directions, and I just want to do a quick test to estimate how users would use and react to them with some level of confidence, but then I talk to a researcher, and I'm told that would ",
        highlight: "take 2 weeks",
        after: ".",
      },
      {
        id: "rapid-dev-cycles",
        compactPosition: {
          x: "15%",
          y: "-25%",
        },
        before: "Our org is constantly pushing for more ",
        highlight: "rapid dev cycles",
        after:
          ". A lot of times the concepts I want to explore could already be irrelevant by the time I figure out how to test.",
      },
      {
        id: "big-study",
        compactPosition: {
          x: "7%",
          y: "24%",
        },
        before:
          "Occasionally I have something like 10 variants I want to test and that's ",
        highlight: "a big study",
        after: " to set up.",
      },
    ],
  },
  {
    id: "research-democratization",
    label: "Everyone is doing research",
    quotes: [
      {
        id: "democratizing",
        compactPosition: {
          x: "-25%",
          y: "-31%",
        },
        before:
          "We have 20 designers on our team running research. There is this ",
        highlight: "democratizing",
        after: " that's happening.",
      },
      {
        id: "designer-led-research",
        compactPosition: {
          x: "28%",
          y: "-24%",
        },
        before: "Our company is experimenting with ",
        highlight: "designer-led research",
        after:
          ". Templatized tools are good. We usually have this report format we follow when we share out.",
      },
      {
        id: "bit-of-everything",
        compactPosition: {
          x: "-7%",
          y: "26%",
        },
        before:
          "Obviously AI tooling is a big thing and there is just so much going on. But one thing is that it's letting everyone be able to do ",
        highlight: "a bit of everything",
        after: ".",
      },
    ],
  },
  {
    id: "quant-value",
    label: "Quant research is in demand",
    quotes: [
      {
        id: "quant-stakeholders",
        compactPosition: {
          x: "-2%",
          y: "-22%",
        },
        before: "As a qual researcher, sometimes I feel it's difficult to ",
        highlight: "get buy-in",
        after:
          " from more quant focused stakeholders, and I'm not really specially trained in that area.",
      },
      {
        id: "heavy-quant",
        compactPosition: {
          x: "23%",
          y: "39%",
        },
        before:
          "I think it's always helpful to have a heavy quant portion and a light qual portion when testing more complex changes in order to ",
        highlight: "mitigate risk",
        after: ".",
      },
      {
        id: "value-add",
        compactPosition: {
          x: "-34%",
          y: "12%",
        },
        before:
          "We have a couple mixed method researchers but we're mostly qual. I can definitely see the ",
        highlight: "value add",
        after: " on the quant side.",
      },
      {
        id: "ab-test",
        compactPosition: {
          x: "-35%",
          y: "-33%",
        },
        before:
          "There are things we definitely want to validate with in-product with a/b testing. But that's not always the case. For earlier in the cycle, we don't really have a good tool to ",
        highlight: "a/b test prototypes",
        after: " quickly.",
      },
      {
        id: "ship-everything",
        compactPosition: {
          x: "16%",
          y: "-39%",
        },
        before: "Building is much fasters now, but you still ",
        highlight: "can't ship everything",
        after:
          ". Prototyping is still necessary. And that's much faster now too.",
      },
      {
        id: "too-much",
        compactPosition: {
          x: "-8%",
          y: "30%",
        },
        before:
          "There's a lot going on. Designers and PMs are all vibecoding. We're ",
        highlight: "building too much",
        after: " stuff too fast. Sometimes without any sort of validation.",
      },
    ],
  },
];

const problemCards = [
  {
    id: "concepts",
    icon: AtomIcon,
    iconSize: 48,
    heading: "Statistics is inherently scientific.",
    body: "To get results that are statistically sound, expertise is required.",
  },
  {
    id: "traffic",
    icon: HourglassMediumIcon,
    iconSize: 48,
    heading: "Quantitative research takes time.",
    body: "Experiment design, sourcing, and reporting all take time. It is not uncommon for an end-to-end process to takes weeks.",
  },
  {
    id: "operation",
    icon: StackIcon,
    iconSize: 42,
    heading: "Rigor is operationally heavy.",
    body: "Experiment design, recruitment, data collection, analysis, and reporting often span multiple tools and skillsets.",
  },
];

const testimonials = [
  {
    id: "quant-pulse",
    layoutClassName: "md:col-start-1 md:row-start-1",
    before: "“Great for more ambiguous testing where we want to get a ",
    emphasis: "quant pulse",
    after: " on key changes without building extensively.”",
    byline: "— Product manager, consumer app",
  },
  {
    id: "democratize-research",
    layoutClassName: "md:col-start-2 md:row-start-1",
    before: "“Good tool for designers in a team that wants to ",
    emphasis: "democratize sound research",
    after: ".”",
    byline: "— UX researcher, consumer app",
  },
  {
    id: "no-code-testing",
    layoutClassName: "md:col-span-2 md:row-start-2",
    before:
      "“Being able to reduce the number of design variants before developing them further is a great advantage. It’s a way of doing ",
    emphasis: "no-code A/B testing",
    after: ".”",
    byline: "— Engineering manager, consumer app",
  },
  {
    id: "tangible-evidence",
    layoutClassName: "md:col-span-2 md:col-start-3 md:row-start-1",
    before:
      "“After doing interviews with a dozen users and identifying a promising direction, this can be a way to elevate the confidence of the insights with ",
    emphasis: "more tangible evidence",
    after: ".”",
    byline: "— UX researcher, Big Tech",
  },
  {
    id: "confidence",
    layoutClassName: "md:col-start-3 md:row-start-2",
    before:
      "“Flux helps when we have prototypes but no bandwidth to fully build something to ",
    emphasis: "test with confidence",
    after: ".”",
    byline: "— UX research manager, consumer app",
  },
  {
    id: "easy-to-follow",
    layoutClassName: "md:col-start-4 md:row-start-2",
    before: "“I really like how it looks. It’s very ",
    emphasis: "easy to follow",
    after: ".”",
    byline: "— UX manager, Big Tech",
  },
];

export default function CaseStudyTwo({
  scrollY,
  fadeInFirstSection = false,
  firstSectionFadeReady = true,
}: CaseStudyTwoProps) {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useSiteNavigation();
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
    resolvedTheme === "dark" ? [0.4, 0, 0, 0.4, 0] : [1, 0, 0, 1, 0],
  );

  const borderColor = useTransform(
    borderOpacity,
    (opacity) => `rgba(255,255,255,${opacity})`,
  );

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
                <span className="font-semibold">
                  Flux helps product teams run rigorous experiments on their
                  prototypes with ease.
                </span>{" "}
                Researchers can configure experiments, recruit large participant
                samples, run tests, and get reports within hours. They can learn
                behavioral trends, sentiment differences, and performance
                variation between their prototypes, all without needing any
                expertise in quantitative methods.
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
                        className={`min-w-0 flex-1 overflow-hidden border border-flux bg-flux tall:min-h-0 ${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
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
                        className={`min-w-0 flex-1 overflow-hidden border border-flux bg-flux tall:min-h-0 ${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
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
                        className={`min-w-0 flex-1 overflow-hidden border border-flux bg-flux tall:min-h-0 ${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
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
                  highlightCardClassName="flex h-full min-h-[inherit] flex-col"
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
          borderColor={borderColor}
        >
          <SubSectionContainer>
            <p>
              Flux started with a simple observation:{" "}
              <span className="font-semibold">
                AI has drastically lowered the cost of building, but not the
                cost of building the wrong thing.
              </span>{" "}
              User research can mitigate this. But as agentic design and dev
              workflows continue to accelerate, it&rsquo;s becoming increasingly
              difficult to strike the balance between speed and confidence.
            </p>
          </SubSectionContainer>
          <SubSectionContainer subSectionContainerClassName="gap-4 md:gap-6">
            <SubSectionContainer>
              <SubHeading>Spotting the gap</SubHeading>
              <p>
                Existing user research tools are overwhelmingly qualitative,
                which can be very useful in understanding the &lsquo;why&rsquo;
                behind behaviorial trends, but can&rsquo;t offer measurable
                confidence. Scaled testing remain largely out of reach for teams
                without existing infrastructure to support it. There seemed to
                be a gap where an easy-to-use quantitative testing tool for
                prototypes could exist.
              </p>
            </SubSectionContainer>
            <HighlightCard
              borderBaseColor={theme.hex.primary}
              borderHighlightColor={`color-mix(in oklab, ${theme.hex.primary} 30%, white 70%)`}
              highlightOnHover={false}
            >
              <TextCard
                title={
                  <>
                    <LinkBreakIcon size={28} /> The Gap
                  </>
                }
                className="flex flex-col p-4 font-serif"
                titleClassName="flex items-center gap-2 font-serif text-[1.5rem] font-semibold text-flux dark:text-dark-flux"
                bodyClassName="px-4 pb-4 pt-24 indent-[4.5rem] font-serif text-[1.5rem] md:pb-10 md:pl-48 md:pr-10 md:pt-48 md:text-[2.25rem]"
              >
                Product teams are prototyping with AI faster than ever before,
                but there is no easy way to validate ideas with statistical
                confidence that can match this speed.
              </TextCard>
            </HighlightCard>
          </SubSectionContainer>
          <SubSectionContainer subSectionContainerClassName="gap-4 md:gap-6">
            <SubSectionContainer>
              <SubHeading>Research and discovery</SubHeading>
              <p>
                We spoke to a mix of researchers, product managers, and
                designers to learn about their workflows, pain points, and their
                thoughts on user research. This process took different shapes,
                ranging from casual 5-minute conversations to structured
                hour-long interviews. Once we sat down to synthesize our
                findings, we saw three themes emerging:{" "}
                <span className="font-bold">
                  research can no longer keep pace with development
                </span>
                ;{" "}
                <span className="font-bold">
                  research is being democraitized
                </span>
                ; and{" "}
                <span className="font-bold">
                  there is a demand for more quantitative research
                </span>
                .
              </p>
            </SubSectionContainer>
            <ResearchThemeCanvas themes={researchThemes} />
          </SubSectionContainer>
          <VerticalCardGroup
            bodyWidthClassNameOnLarge="md:w-[max(10rem,40%)]"
            cardHeightOnLarge="min(calc(100dvh - 5rem), 400px)"
            cardHeightClassNameOnSmall="min-h-72"
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
                    { label: "specialized", after: ", " },
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
                          fontWeight: visibleCard === index ? 700 : 300,
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
            cards={problemCards.map(
              ({ id, icon: Icon, iconSize, heading, body }) => (
                <HighlightCard
                  key={id}
                  highlightCardClassName="flex h-full min-h-[inherit] flex-col"
                  contentClassName="flex h-full flex-col justify-between overflow-auto p-6 md:p-10"
                >
                  <TextCard
                    title={
                      <Icon
                        size={iconSize}
                        weight="duotone"
                        className={theme.textColorClass}
                      />
                    }
                    titleAs="none"
                    heading={heading}
                    className="flex flex-1 flex-col justify-between font-serif"
                    bodyClassName="mt-3 !font-serif"
                  >
                    {body}
                  </TextCard>
                </HighlightCard>
              ),
            )}
          />
        </SectionContainer>
      </section>
      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          heading="The Messy Middle"
          headingIcon={PuzzlePieceIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <p>
              Once we established the problem space, we started sketching out
              what Flux needed to be. Along the way, we encountered many
              interesting design challenges. I will elaborate on 3 of them.
            </p>
          </SubSectionContainer>
          <HorizontalCardGroup
            showBody
            body={
              <SubSectionContainer subSectionContainerClassName="mb-4 md:mb-6 px-2 md:px-6">
                <SubHeading>Balancing rigor and usability</SubHeading>
              </SubSectionContainer>
            }
            alignment="aligned"
            stickyTopOnLarge="5rem"
            cardWidthClassNameOnLarge="md:w-[80rem]"
            maxCardWidthClassNameOnLarge="md:max-w-[177.7778cqh]"
            bottomMarginOnLarge="2rem"
            cards={[
              {
                id: "tension",
                content: (
                  <div className="flex h-full flex-col">
                    <span
                      className={`text-sm font-bold ${theme.textColorClass}`}
                    >
                      The tension
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
                      Exploration
                    </span>
                    <h4 className="mt-auto pt-8">Exploration</h4>
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
          <HorizontalCardGroup
            showBody
            body={
              <SubSectionContainer subSectionContainerClassName="mb-4 md:mb-6 px-2 md:px-6">
                <SubHeading>
                  Building for trust in underlying methodology
                </SubHeading>
              </SubSectionContainer>
            }
            alignment="aligned"
            stickyTopOnLarge="5rem"
            cardWidthClassNameOnLarge="md:w-[80rem]"
            maxCardWidthClassNameOnLarge="md:max-w-[177.7778cqh]"
            bottomMarginOnLarge="2rem"
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
                      Users, especially those who aren&rsquo;t well-versed in
                      quantitative methods, might start feeling lost as they go
                      through the preocess of setting up an experiment. The
                      whole point of quantitative research is to produce
                      measurable confidence in the results. But what if what
                      they are doing is not &lsquo;valid science?&rsquo;? Will
                      they be able to defend the findings in a meeting?
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
                      Exploration
                    </span>
                    <h4 className="mt-auto pt-8">Exploration</h4>
                    <p className="mt-3">
                      I tackled this from several different angles. First, I
                      explroed the idea of a &lsquo;statistics crush
                      course&rsquo;. I quicklly realized it
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
          <HorizontalCardGroup
            showBody
            body={
              <SubSectionContainer subSectionContainerClassName="mb-4 md:mb-6 px-2 md:px-6">
                <SubHeading>
                  Addressing uncertainty before commitment
                </SubHeading>
              </SubSectionContainer>
            }
            alignment="aligned"
            stickyTopOnLarge="5rem"
            cardWidthClassNameOnLarge="md:w-[80rem]"
            maxCardWidthClassNameOnLarge="md:max-w-[177.7778cqh]"
            bottomMarginOnLarge="2rem"
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
                      The central tension: how do we clearly signel to the user
                      what a study would produce before committing time and
                      money to run it?
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
                      Exploration
                    </span>
                    <h4 className="mt-auto pt-8">Exploration</h4>
                    <p className="mt-3">
                      Uncertainty comes from two distinct sources: 1.
                      Quantitative studies usually involves hundreds, sometimes
                      even thousands, of participants, which is expensive both
                      financially and operationally. 2. How do users know if
                      they are doing &lsquo;real&rsquo; science? They sometimes
                      feel uncertain about the validity of the results. We
                      addressed this from 2 different angles. for 1, we built a
                      feature that allows users to preview a mock report that
                      contains fictitious data. This report updates in real time
                      based on the experiment setup, and offers an one-to-one
                      look at the shape of the data they will receive at the end
                      of the study. Seeing this before launching reduces a great
                      deal of uncertainty. This also serves as an opportunity
                      for users to spot potential erros in their setup,
                      eliminating doubts around the process. For 2, our approach
                      is much subtler. I made sure to expose the science behind
                      the calculations as much as possible without being
                      intruisive. I also added many explainers throughout the
                      process to help users understand what they are doing. This
                      gives users a good idea of the methodology behind the
                      experiment. I also added a summary feature to help users
                      draw conclusions in the results, allowing them to have
                      confidence in presenting the results to stakeholders.
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
        </SectionContainer>
      </section>

      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          heading="The One"
          headingIcon={RocketLaunchIcon}
          showBorder={false}
        >
          <SubSectionContainer subSectionContainerClassName="gap-4 md:gap-6">
            <SubSectionContainer>
              <SubHeading>Launch</SubHeading>
              <p>
                We launched Version 1 of Flux in April of 2026. Flux has since
                matured into an end-to-end platform for quantitative prototype
                testing. Teams can configure a study, recruit participants, run
                tests, and review decision-ready results in one product.
              </p>
            </SubSectionContainer>
            <HighlightCard
              borderBaseColor={theme.hex.primary}
              borderHighlightColor={`color-mix(in oklab, ${theme.hex.primary} 30%, white 70%)`}
              highlightOnHover={false}
              highlightCardClassName="p-2"
            >
              <LazyVideo
                src="https://assets.haichaowang.com/promo-export-01.mp4"
                poster="/images/promo-export-01-poster.jpg"
                controls
                playsInline
                className={`${ROUNDED_SQUIRCLE_03} ${ROUNDED_SQUIRCLE_05_MD}`}
              />
            </HighlightCard>
          </SubSectionContainer>
          <SubSectionContainer subSectionContainerClassName="gap-4 md:gap-6">
            <HorizontalScrollStrip
              ariaLabel="Flux testimonials"
              knobBackgroundClassName="bg-white dark:bg-white/25"
              body={
                <SubSectionContainer subSectionContainerClassName="px-3 md:px-6 gap-4 md:gap-6 mb-4 md:mb-6">
                  <SubHeading>Reception</SubHeading>
                  <p>
                    We put Flux in front of dozens of UXers to use and the
                    feedback was overwhelming positive.
                  </p>
                </SubSectionContainer>
              }
              contentClassName="grid w-max grid-flow-col auto-cols-[min(85vw,24rem)] grid-rows-1 gap-2 md:w-[170vw] md:max-w-[160rem] md:grid-flow-row md:auto-cols-auto md:grid-cols-4 md:grid-rows-2"
            >
              {testimonials.map(
                ({ id, layoutClassName, before, emphasis, after, byline }) => (
                  <HighlightCard
                    key={id}
                    highlightOnHover={false}
                    highlightCardClassName={`flex min-w-0 flex-col justify-between gap-6 ${layoutClassName} p-6 md:p-8 font-serif leading-8 md:leading-10 text-foreground dark:text-dark-foreground`}
                  >
                    <TextCard
                      bodyAs="blockquote"
                      byline={byline}
                      className="flex flex-1 flex-col justify-between gap-6 font-serif"
                      bodyClassName="text-[1.25rem] md:text-[1.75rem]"
                      bylineClassName="text-pretty text-end text-[1rem] leading-tight md:text-[1.25rem]"
                    >
                      {before}
                      <TextCardEmphasis>{emphasis}</TextCardEmphasis>
                      {after}
                    </TextCard>
                  </HighlightCard>
                ),
              )}
            </HorizontalScrollStrip>
          </SubSectionContainer>
        </SectionContainer>
      </section>

      <section id="section-5" className="mb-12 scroll-mt-24">
        <SectionContainer
          heading="Reflections"
          headingIcon={BrainIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <SubHeading>Leveraging AI</SubHeading>
            <p>
              It has been an exciting learning experience to incorporate AI into
              my workflow. Everything is still new, but I experimented heavily
              with agentic workflows and found my own way of using AI. Of
              course, everything is still subject to change as things evolve
              rapidly. 1. AI is allowing me to design much closer to the code.
              2. Efficiency comes with a basic understanding of the code. I
              enjoy vibecoding tremendously, but I discovered that I worked a
              lot more efficiently when I could prompt with a higher level of
              specificity. And this cannot happen without a basic level of
              understanding of the code. So I dove into the frontend framework
              of Flux, specifically node.js. 3. AI design has its pitfalls. The
              almost instantaneous code generation is a superpower. It helps
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
