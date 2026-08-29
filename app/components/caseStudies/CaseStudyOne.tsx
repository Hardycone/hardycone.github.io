/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
// import projects from "@/data/projects";
// import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useTransform, MotionValue } from "framer-motion";
import {
  CertificateIcon,
  PathIcon,
  CameraIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react";
import { hexToRgba } from "@/lib/palette";
// import { useProjectTheme } from "@/hooks/useProjectTheme";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import SectionContainer from "../SectionContainer";
import SubSectionContainer from "../SubSectionContainer";
import FlourishName from "../FlourishName";
import NarrativeAccordion from "../NarrativeAccordion";
import BioContactForm from "../BioContactForm";

interface CaseStudyOneProps {
  scrollY: MotionValue<number>;
}

export default function CaseStudyOne({ scrollY }: CaseStudyOneProps) {
  const { resolvedTheme } = useTheme();
  const [isFluxOpen, setIsFluxOpen] = useState(true);
  const [isFantailOpen, setIsFantailOpen] = useState(true);
  const [isAslfOpen, setIsAslfOpen] = useState(true);
  const [isUwOpen, setIsUwOpen] = useState(true);
  const [isSyracuseOpen, setIsSyracuseOpen] = useState(true);
  const [isAwardsOpen, setIsAwardsOpen] = useState(true);
  const [isBnuOpen, setIsBnuOpen] = useState(true);

  const introTheme = useProjectTheme("intro");
  const fluxTheme = useProjectTheme("flux");
  const fantailTheme = useProjectTheme("fantail");
  const wolcottTheme = useProjectTheme("wolcott");

  // const theme = useProjectTheme(projects[activeIndex].id);
  // const targetRef = useRef<HTMLDivElement>(null);

  // const { scrollYProgress } = useScroll({
  //   target: targetRef,
  //   offset: ["start start", "end end"],
  // });

  // const smoothScrollYProgress = useSpring(scrollYProgress, {
  //   stiffness: 120,
  //   damping: 20,
  //   mass: 0.2,
  // });

  // // --- 1. USE 'vw' for 'useTransform' ---
  // // We are moving the "filmstrip" by full viewport widths
  // const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-200vw"]);
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
    <article className="mx-auto w-full min-w-0 max-w-6xl">
      {/*Section 1: Resume*/}
      <section id="section-1" className="mb-8 w-full min-w-0 scroll-mt-24">
        {/*Section Header Block*/}
        <SectionContainer
          showHeadingSweep={false}
          heading="My Work"
          headingIcon={PathIcon}
          headingBaseColorClassName={
            "text-foreground dark:text-dark-foreground"
          }
          borderColor={borderColor}
          exitOnScroll
          entryOnScroll={false}
        >
          <SubSectionContainer className="gap-0">
            <p>
              I’m currently working on{" "}
              <FlourishName
                name="Flux"
                bgColor={hexToRgba(fluxTheme.hex.primary, 0.03)}
                gradientCenterColor={hexToRgba(fluxTheme.hex.soft, 1)}
                gradientMiddleColor={hexToRgba(fluxTheme.hex.soft, 1)}
                isActive={isFluxOpen}
                onToggle={() => setIsFluxOpen((prev) => !prev)}
                onFlourish={() => setIsFluxOpen(true)}
                logoSrc="/logos/logo-flux.png"
              />
              , a quantitative UX research tool that helps teams test designs
              and prototypes with real users quickly and rigorously. The idea
              came from a simple observation my co-founder and I had: AI is
              making it much easier to explore product directions through design
              and prototyping, but teams still need a reliable way to decide
              which one works best. My work focuses on turning a traditionally
              intimidating research process into something approachable, guided,
              and decision-ready. Flux launched publicly in April 2026, and my
              role has since expanded into sales, marketing, and customer
              development.
            </p>
            <NarrativeAccordion isOpen={isFluxOpen}>
              <div className="my-4 flex gap-2 rounded-1 bg-flux/5 p-8 font-serif supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:bg-dark-flux/5 md:gap-4 md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4">
                <div className="w-12 flex-shrink-0">
                  <img
                    src="/logos/logo-flux.png"
                    alt="Flux logo"
                    className="block size-12 object-cover"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <div className="flex justify-between text-xl">
                    <div className="flex flex-col">
                      <p className="font-semibold">Co-founder</p>
                      <p>Flux</p>
                    </div>
                    <p>2023 - Present</p>
                  </div>
                  <div className="mt-2">
                    <ul className="ml-4 mt-2 list-disc text-pretty font-sans">
                      <li>
                        Led Flux from concept to public launch, shaping the
                        product strategy, core workflows, interaction patterns,
                        visual system, and brand identity
                      </li>
                      <li>
                        Translated statistical research methods into guided
                        study setup flows that are approachable without
                        compromising rigor
                      </li>
                      <li>
                        Designed data-heavy reporting experiences that turned
                        prototype behavior, confidence intervals, and user
                        feedback into decision-ready insights
                      </li>
                      <li>
                        Led discovery interviews and live demos with designers,
                        PMs, and researchers, using feedback to refine product
                        decisions, positioning, and go-to-market direction
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </NarrativeAccordion>
            <p className="mt-8">
              In 2023, I launched{" "}
              <FlourishName
                name="Fantail"
                bgColor={hexToRgba(fantailTheme.hex.primary, 0.03)}
                gradientCenterColor={hexToRgba(fantailTheme.hex.soft, 1)}
                gradientMiddleColor={hexToRgba(fantailTheme.hex.soft, 1)}
                isActive={isFantailOpen}
                onToggle={() => setIsFantailOpen((prev) => !prev)}
                onFlourish={() => setIsFantailOpen(true)}
                logoSrc="/logos/logo-fantail.svg"
              />{" "}
              with two co-founders. Fantail brought AI into the early stages of
              filmmaking, from writing and referencing to storyboarding and
              dialogue exploration. We grounded the product in discovery
              research with dozens of working filmmakers, which revealed a clear
              tension: they saw AI’s creative potential, but existing tools gave
              them too little control over the process. Over six months, we
              turned that insight into an MVP and pursued funding. I led much of
              the product and design work, translating filmmaker needs into an
              end-to-end creative workflow. Ultimately, we shut the company
              down. The biggest lesson was founder-market fit: we had identified
              a real problem and designed a thoughtful solution, but lacked the
              industry access, funding network, and insider knowledge needed to
              build credibility.
            </p>
            <NarrativeAccordion isOpen={isFantailOpen}>
              <div className="mb-4 mt-4 flex gap-2 rounded-1 bg-fantail bg-opacity-[3%] p-8 dark:bg-dark-fantail/5 md:gap-4 md:rounded-2">
                <div className="w-12 flex-shrink-0">
                  <img
                    src="/logos/logo-fantail.svg"
                    alt="Fantail logo"
                    className="block size-12"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <div className="flex justify-between font-sans text-xl">
                    <div className="flex flex-col">
                      <p className="font-semibold">Co-founder</p>
                      <p>Fantail</p>
                    </div>
                    <p>2023</p>
                  </div>
                  <div className="mt-2 flex flex-col">
                    <ul className="ml-4 mt-2 list-disc text-pretty font-sans">
                      <li>
                        Co-founded Fantail and led much of the product design,
                        taking an AI-assisted filmmaking concept through
                        discovery, product definition, and an early MVP
                      </li>
                      <li>
                        Conducted and synthesized research with dozens of
                        working filmmakers, identifying lack of creative control
                        as a key barrier to adopting existing AI tools
                      </li>
                      <li>
                        Translated that insight into a scene-by-scene product
                        architecture where scripts connected moodboards, visual
                        references, editable storyboards, generated imagery,
                        dialogue, and animatics
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </NarrativeAccordion>
            <p className="mt-8">
              From 2016 to 2021, I worked at{" "}
              <FlourishName
                name="ASLF"
                bgColor={hexToRgba(wolcottTheme.hex.primary, 0.05)}
                gradientCenterColor={hexToRgba(wolcottTheme.hex.soft, 1)}
                gradientMiddleColor={hexToRgba(wolcottTheme.hex.soft, 1)}
                isActive={isAslfOpen}
                onToggle={() => setIsAslfOpen((prev) => !prev)}
                onFlourish={() => setIsAslfOpen(true)}
                logoSrc={{
                  light: "/logos/logo-aslf.png",
                  dark: "/logos/logo-aslf-inverted.png",
                }}
              />
              , a leading nonprofit with a long history of shaping US
              environmental policy through strategic litigation and
              community-driven projects. I progressed from staff landscape
              designer to Design Director, leading work at the intersection of
              environmental justice, community engagement, and the built
              environment. I led dozens of projects across the country, from
              community gardens and parks to green infrastructure and urban
              public spaces, often in historically underserved communities. Each
              project was a lesson in listening: to the community, to the land,
              and to the policy constraints that shape what gets built.
            </p>
            <NarrativeAccordion isOpen={isAslfOpen}>
              <div className="mb-4 mt-4 flex gap-2 rounded-1 bg-wolcott/5 p-8 dark:bg-dark-wolcott/5 md:gap-4 md:rounded-2">
                <div className="w-12 flex-shrink-0">
                  <img
                    src="/logos/logo-aslf.png"
                    alt="ASLF logo"
                    className="block size-12 dark:invert"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <div className="flex justify-between font-sans text-xl">
                    <div className="flex flex-col">
                      <p className="font-semibold">Design Director</p>
                      <p>ASLF, Inc.</p>
                    </div>
                    <p>2015 - 2022</p>
                  </div>
                  <div className="mt-2 flex flex-col">
                    <ul className="ml-4 mt-2 list-outside list-disc font-sans">
                      <li>
                        Led dozens of public-space, green-infrastructure, and
                        community-revitalization projects across the U.S.,
                        coordinating work across communities, public agencies,
                        technical partners, and funders
                      </li>
                      <li>
                        Led research and participatory design with residents and
                        local organizations, translating community priorities
                        and environmental constraints into actionable plans
                      </li>
                      <li>
                        Directed projects from early research and planning
                        through funding, design, technical coordination, and
                        implementation
                      </li>
                      <li>
                        Co-wrote successful grant proposals that secured $3.6M+
                        in public funding, including awards from EPA, NOAA,
                        USDA, New York State, and local governments
                      </li>
                      <li>Designer</li>
                      <li>
                        Designed public-space and green-infrastructure projects
                        from site and systems analysis through concept
                        development, documentation, and implementation support
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-4">
                    <span className="font-sans text-base">
                      Funding partners:
                    </span>
                    <div className="relative size-8 flex-shrink-0 overflow-hidden">
                      <img
                        src="/logos/logo-epa.png"
                        alt="logo"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[10]"
                      />
                    </div>
                    <div className="relative size-8 flex-shrink-0 overflow-hidden">
                      <img
                        src="/logos/logo-noaa.svg"
                        alt="logo"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[10]"
                      />
                    </div>
                    <div className="relative size-8 flex-shrink-0 overflow-hidden">
                      <img
                        src="/logos/logo-usda.png"
                        alt="logo"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[10]"
                      />
                    </div>
                    <div className="relative size-8 flex-shrink-0 overflow-hidden">
                      <img
                        src="/logos/logo-nys.png"
                        alt="logo"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[10]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </NarrativeAccordion>

            {/*Subsection 1: Experience*/}
          </SubSectionContainer>
        </SectionContainer>
      </section>

      {/*Section 2: Qualifications*/}
      <section id="section-2" className="mb-8 w-full min-w-0 scroll-mt-24">
        <SectionContainer
          heading="My Qualifications"
          headingIcon={CertificateIcon}
          headingBaseColorClassName={
            "text-foreground dark:text-dark-foreground"
          }
          borderColor={borderColor}
        >
          <SubSectionContainer className="gap-0">
            <p>
              I’ve work on projects{" "}
              <FlourishName
                name="recognized and funded"
                bgColor={hexToRgba(introTheme.hex.primary, 0.05)}
                gradientCenterColor={hexToRgba(introTheme.hex.soft, 1)}
                gradientMiddleColor={hexToRgba(introTheme.hex.soft, 1)}
                isActive={isAwardsOpen}
                onToggle={() => setIsAwardsOpen((prev) => !prev)}
                onFlourish={() => setIsAwardsOpen(true)}
                logoSrc="/logos/logo-awards.png"
              />{" "}
              by organizations like NASA, EPA, NOAA, USDA, NPS (National Park
              Service), New York State, and local governments. That work has
              included a NASA SUITS finalist project, a published cultural
              landscape report for Muir Woods, and successful public funding for
              environmental and community projects across the country.
            </p>
            <NarrativeAccordion isOpen={isAwardsOpen}>
              <div className="mb-4 mt-4 flex gap-4 rounded-1 bg-intro/5 p-8 dark:bg-dark-suits/5 md:rounded-2">
                <div className="flex w-full flex-col gap-4">
                  <div className="flex justify-between font-sans text-xl">
                    <div className="flex flex-col">
                      <p>
                        <span className="font-semibold">Finalist · </span>NASA
                        SUITS Competition{" "}
                      </p>
                    </div>
                    <p className="ml-4 text-nowrap">2023</p>
                  </div>
                  <div className="flex justify-between font-sans text-xl">
                    <div className="flex flex-col">
                      <p>
                        <span className="font-semibold">Publication · </span>
                        Auwaerter, John Eric., Wang, Haichao.{" "}
                        <span className="italic">
                          Cultural Landscape Report for Muir Woods National
                          Monument.
                        </span>{" "}
                        National Park Service, 2021.
                      </p>
                    </div>
                    <p className="ml-4 text-nowrap">2021</p>
                  </div>
                  <div className="flex justify-between font-sans text-xl">
                    <div className="flex flex-col">
                      <p>
                        <span className="font-semibold">Grants · </span>EPA
                        Environmental Justice ($65K) | NOAA Sea Grant ($25K) |
                        USDA GLRI ($287K) | New York State GIGP ($1.1M) |
                        Onondaga County ($2.15M)
                      </p>
                    </div>
                    <p className="ml-4 text-nowrap">2016 - 2021</p>
                  </div>
                </div>
              </div>
            </NarrativeAccordion>
            <p className="mt-8">
              In 2023, I graduated from{" "}
              <FlourishName
                name="University of Washington"
                bgColor={hexToRgba(introTheme.hex.primary, 0.05)}
                gradientCenterColor={hexToRgba(introTheme.hex.soft, 1)}
                gradientMiddleColor={hexToRgba(introTheme.hex.soft, 1)}
                isActive={isUwOpen}
                onToggle={() => setIsUwOpen((prev) => !prev)}
                onFlourish={() => setIsUwOpen(true)}
                logoSrc={{
                  light: "/logos/logo-uw.png",
                  dark: "/logos/logo-uw-gold.png",
                }}
              />{" "}
              with a Master's degree in Human-Computer Interaction and Design. ,
              where I dove headfirst into human-computer interaction research.
              My focus was on making data-driven design tools accessible to
              non-statisticians — a thread that eventually led me to co-found
              Flux. At UW, I studied research methods, statistical analysis, and
              prototyping, and applied them to projects ranging from NASA
              spacesuit interfaces to quantitative UX testing tools.
            </p>
            <NarrativeAccordion isOpen={isUwOpen}>
              <div className="mb-4 mt-4 flex gap-4 rounded-1 bg-intro/5 p-8 dark:bg-dark-suits/5 md:rounded-2">
                <div className="w-12 flex-shrink-0">
                  <img
                    src="/logos/logo-uw.png"
                    alt="UW logo"
                    className="block size-12 dark:hidden"
                  />
                  <img
                    src="/logos/logo-uw-gold.png"
                    alt="UW logo"
                    className="hidden size-12 dark:block"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <div className="flex justify-between font-sans text-xl">
                    <div className="flex flex-col">
                      <p className="font-semibold">
                        Master of Human-Computer Interaction and Design
                      </p>
                      <p>University of Washington, Seattle, WA</p>
                    </div>
                  </div>
                </div>
              </div>
            </NarrativeAccordion>
            <p className="mt-8">
              I also hold a Master of Landscape Architecture from{" "}
              <FlourishName
                name="SUNY ESF"
                bgColor={hexToRgba(introTheme.hex.primary, 0.05)}
                gradientCenterColor={hexToRgba(introTheme.hex.soft, 1)}
                gradientMiddleColor={hexToRgba(introTheme.hex.soft, 1)}
                isActive={isSyracuseOpen}
                onToggle={() => setIsSyracuseOpen((prev) => !prev)}
                onFlourish={() => setIsSyracuseOpen(true)}
                logoSrc={{
                  light: "/logos/logo-esf.png",
                  dark: "/logos/logo-esf-light.png",
                }}
              />
              in Syracuse. This is where I first encountered environmental
              justice as a design practice. I studied how landscape architecture
              could repair — not just decorate — communities that had been
              systematically underserved. My work included community-based
              design studios, ecological restoration planning, and a thesis on
              equitable access to green space. The throughline from Syracuse to
              Flux is surprisingly direct: design is a tool for empowerment,
              whether the medium is a park or a prototype.
            </p>
            <NarrativeAccordion isOpen={isSyracuseOpen}>
              <div className="mb-4 mt-4 flex gap-4 rounded-1 bg-intro/5 p-8 dark:bg-dark-chinatown/5 md:rounded-2">
                <div className="w-12 flex-shrink-0">
                  <img
                    src="/logos/logo-esf.png"
                    alt="SUNY-ESF logo"
                    className="block size-12 dark:hidden"
                  />
                  <img
                    src="/logos/logo-esf-light.png"
                    alt="SUNY-ESF logo"
                    className="hidden size-12 dark:block"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <div className="flex justify-between font-sans text-xl">
                    <div className="flex flex-col">
                      <p className="font-semibold">
                        Master of Landscape Architecture
                      </p>
                      <p>State University of New York, Syracuse, NY</p>
                    </div>
                  </div>
                </div>
              </div>
            </NarrativeAccordion>{" "}
            <p className="mt-8">
              My undergraduate training in Environmental Science at{" "}
              <FlourishName
                name="Beijing Normal University"
                bgColor={hexToRgba(introTheme.hex.primary, 0.05)}
                gradientCenterColor={hexToRgba(introTheme.hex.soft, 1)}
                gradientMiddleColor={hexToRgba(introTheme.hex.soft, 1)}
                isActive={isBnuOpen}
                onToggle={() => setIsBnuOpen((prev) => !prev)}
                onFlourish={() => setIsBnuOpen(true)}
                logoSrc="/logos/logo-bnu.png"
                logoClassName="dark:brightness-[50] dark:saturate-0"
              />{" "}
              gave me a foundation in ecological systems and the relationship
              between environmental conditions and human communities. That
              perspective eventually led me toward landscape architecture,
              environmental justice, and human-centered technology. Across each
              transition, I’ve remained interested in the same underlying
              question: how can complex systems become more understandable,
              participatory, and responsive to the people they affect? This has
              been the driving force of my career ever since.
            </p>
            <NarrativeAccordion isOpen={isBnuOpen}>
              {" "}
              <div className="mb-4 mt-4 flex gap-4 rounded-1 bg-intro/5 p-8 dark:bg-dark-chinatown/5 md:rounded-2">
                <div className="w-12 flex-shrink-0">
                  <img
                    src="/logos/logo-bnu.png"
                    alt="Beijing Normal University logo"
                    className="block size-12 dark:brightness-[50] dark:saturate-0"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <div className="flex justify-between font-sans text-xl">
                    <div className="flex flex-col">
                      <p className="font-semibold">
                        Bachelor of Science in Environmental Science
                      </p>
                      <p>Beijing Normal University, Beijing, China</p>
                    </div>
                  </div>
                </div>
              </div>
            </NarrativeAccordion>
            {/*Subsection 4: Skills*/}
          </SubSectionContainer>
        </SectionContainer>
      </section>

      {/*Section 3: My Skills*/}
      <section id="section-3" className="w-full min-w-0 scroll-mt-24">
        <SectionContainer
          heading="My Skills"
          headingIcon={PaperPlaneTiltIcon}
          headingBaseColorClassName={
            "text-foreground dark:text-dark-foreground"
          }
          borderColor={borderColor}
        >
          <SubSectionContainer>
            <div className="mb-8">
              {/*Skills List*/}
              <ul className="text-xl">
                {/*1*/}
                <li>
                  <p className="mb-2">
                    AI-Enabled Design Engineering:{" "}
                    <span className="italic">Agentic workflows</span>
                  </p>
                </li>{" "}
                {/*1*/}
                <li>
                  <p className="mb-2">
                    Design and Animation:{" "}
                    <span className="italic">
                      Figma, Illustrator, Photoshop, After Effect, LottieFiles,
                      Framer Motion
                    </span>
                  </p>
                </li>
                {/*2*/}
                <li>
                  <p className="mb-2">
                    Research and Analyses:{" "}
                    <span className="fitalic">
                      User Interview, User Surveying, Statistical Methods
                      (T-test, ANOVA, Linear Regression)
                    </span>
                  </p>
                </li>
                {/*3*/}
                <li>
                  <p className="mb-2">
                    Front-End:{" "}
                    <span className="italic">
                      Typescript, React, Next.js, Tailwind CSS
                    </span>
                  </p>
                </li>
                {/*4*/}
                <li>
                  <p className="mb-2">
                    Data Visualization:{" "}
                    <span className="italic">D3.js, Tableau</span>
                  </p>
                </li>
                {/*5*/}
                <li>
                  <p className="mb-2">
                    Physical Prototyping:{" "}
                    <span className="italic">
                      Microcontrollers, 3D Modeling (Blender, Fusion 360,
                      SolidWorks), Digital Fabrication (3D Printing, Laser
                      Cutting, CNC Milling)
                    </span>
                  </p>
                </li>
              </ul>
            </div>
          </SubSectionContainer>
        </SectionContainer>
      </section>

      {/*Section 4: Interests*/}
      <section id="section-4" className="w-full min-w-0 scroll-mt-24">
        <SectionContainer
          heading="My Interests"
          headingIcon={CameraIcon}
          headingBaseColorClassName={
            "text-foreground dark:text-dark-foreground"
          }
          borderColor={borderColor}
        >
          <SubSectionContainer className="gap-0">
            <p>
              Outside of work, I enjoy hiking in the mountains, taking pictures
              with my faithful Sony a7iii, practicing barre chords on my
              acoustic guitar, and tinkering with gadgets and digital
              prototypes. I’ve always been drawn to making things—whether it’s
              capturing a landscape through a camera lens, learning a new song
              one chord at a time, or taking apart and rebuilding technology
              just to understand how it works. When I’m not designing, you’ll
              probably find me exploring new trails, experimenting with a small
              hardware project, or chasing a new creative rabbit hole.
            </p>
          </SubSectionContainer>
        </SectionContainer>
        <div className="relative left-1/2 mb-8 w-[calc(100svw-2rem)] max-w-[1440px] -translate-x-1/2">
          {/*Image Grid*/}
          <div className="grid grid-cols-4 grid-rows-4 gap-2">
            {/* Image 1 - 4 cells horizontally */}
            <div className="relative col-span-4 row-span-1">
              <img
                src="/images/20230624-HWP00734-Edit.jpg"
                alt="Dummy Image 1"
                className="absolute inset-0 h-full w-full rounded-1 object-cover supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:md:rounded-4"
              />
            </div>
            {/* Image 2 - 2x2 square */}
            <div className="relative col-span-2 row-span-2 aspect-[1/1]">
              <img
                src="/images/20230828-HWP01792.jpg"
                alt="Dummy Image 2"
                className="absolute inset-0 h-full w-full rounded-1 object-cover supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:md:rounded-4"
              />
            </div>
            {/* Image 3 - 2 cells vertically adjacent */}
            <div className="relative col-span-1 row-span-2">
              <img
                src="/images/20200701-DSC00551_01.jpg"
                alt="Dummy Image 3"
                className="absolute inset-0 h-full w-full rounded-1 object-cover supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:md:rounded-4"
              />
            </div>
            {/* Remaining cells */}
            <div className="relative">
              <img
                src="/images/20230314-HWP09309.jpg"
                alt="Dummy Image 4"
                className="absolute inset-0 h-full w-full rounded-1 object-cover supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:md:rounded-4"
              />
            </div>
            <div className="relative">
              <img
                src="/images/20230314-HWP09323.jpg"
                alt="Dummy Image 5"
                className="absolute inset-0 h-full w-full rounded-1 object-cover supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:md:rounded-4"
              />
            </div>
            <div className="relative">
              <img
                src="/images/IMG_2354.JPG"
                alt="Dummy Image 7"
                className="absolute inset-0 h-full w-full rounded-1 object-cover supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:md:rounded-4"
              />
            </div>
            <div className="relative col-span-3 row-span-1">
              <img
                src="/images/20240704-HWP03580-Edit.jpg"
                alt="Dummy Image 6"
                className="absolute inset-0 h-full w-full rounded-1 object-cover object-top supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:md:rounded-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/*Section 5: Let's Chat!*/}
      <section id="section-5" className="w-full min-w-0 scroll-mt-24">
        <SectionContainer
          heading="Let's Chat!"
          headingIcon={PaperPlaneTiltIcon}
          headingBaseColorClassName={
            "text-foreground dark:text-dark-foreground"
          }
          borderColor={borderColor}
        >
          <SubSectionContainer className="gap-0">
            <BioContactForm />
          </SubSectionContainer>
        </SectionContainer>
      </section>
    </article>
  );
}
