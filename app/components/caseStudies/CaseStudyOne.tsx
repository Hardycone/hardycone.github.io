/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

// import { useTheme } from "next-themes";
// import projects from "@/data/projects";
import {
  // useTransform,
  MotionValue,
} from "framer-motion";
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
import BioContactForm from "../BioContactForm";
import ExperienceTimeline from "../ExperienceTimeline";

interface CaseStudyOneProps {
  scrollY: MotionValue<number>;
  fadeInFirstSection?: boolean;
  firstSectionFadeReady?: boolean;
}

interface StaticNameProps {
  name: string;
  bgColor: string;
  logoSrc?: string | { light: string; dark: string };
  logoClassName?: string;
}

function StaticName({
  name,
  bgColor,
  logoSrc,
  logoClassName = "",
}: StaticNameProps) {
  return (
    <span
      className="-my-[0.5rem] inline-flex translate-y-[0.275em] items-center gap-[0.125em] rounded-[0.125em] py-[0.125em] pl-[0.125em] pr-[0.25em] font-bold"
      style={{ backgroundColor: bgColor }}
    >
      {logoSrc &&
        (typeof logoSrc === "string" ? (
          <img
            src={logoSrc}
            alt=""
            className={`inline-block h-[1.25em] w-[1.25em] max-w-none flex-none object-contain ${logoClassName}`}
          />
        ) : (
          <>
            <img
              src={logoSrc.light}
              alt=""
              className={`block h-[1.25em] w-[1.25em] max-w-none flex-none object-contain dark:hidden ${logoClassName}`}
            />
            <img
              src={logoSrc.dark}
              alt=""
              className={`hidden h-[1.25em] w-[1.25em] max-w-none flex-none object-contain dark:block ${logoClassName}`}
            />
          </>
        ))}
      {name}
    </span>
  );
}

export default function CaseStudyOne({
  // scrollY,
  fadeInFirstSection = false,
  firstSectionFadeReady = true,
}: CaseStudyOneProps) {
  // const { resolvedTheme } = useTheme();

  const introTheme = useProjectTheme("intro");

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
  //   (o) => `rgba(255,255,255,${o})`,
  // );

  return (
    <article className="flex flex-col gap-16 md:gap-24">
      {/*Section 1: Resume*/}
      <section id="section-1" className="mt-6 scroll-mt-24">
        {/*Section Header Block*/}
        <SectionContainer
          heading="My Work"
          fadeInOnMount={fadeInFirstSection}
          fadeInReady={firstSectionFadeReady}
          headingIcon={PathIcon}
          headingSweepAt={100}
          showBorder={false}
          entryOnScroll={false}
        >
          <SubSectionContainer>
            <ExperienceTimeline />
          </SubSectionContainer>
        </SectionContainer>
      </section>

      {/*Section 2: Qualifications*/}
      <section id="section-2" className="mb-8 w-full min-w-0 scroll-mt-24">
        <SectionContainer
          heading="My Qualifications"
          headingIcon={CertificateIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <p>
              I’ve work on projects{" "}
              <StaticName
                name="recognized and funded"
                bgColor={hexToRgba(introTheme.hex.primary, 0.05)}
                logoSrc="/logos/logo-awards.png"
              />{" "}
              by organizations like NASA, EPA, NOAA, USDA, NPS (National Park
              Service), New York State, and local governments. That work has
              included a NASA SUITS finalist project, a published cultural
              landscape report for Muir Woods, and successful public funding for
              environmental and community projects across the country.
            </p>
            <div className="overflow-hidden">
              <div className="flex gap-4 rounded-1 bg-intro/5 p-8 dark:bg-dark-suits/5 md:rounded-2">
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
            </div>
          </SubSectionContainer>
          <SubSectionContainer>
            <p>
              In 2023, I graduated from{" "}
              <StaticName
                name="University of Washington"
                bgColor={hexToRgba(introTheme.hex.primary, 0.05)}
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
            <div className="overflow-hidden">
              <div className="flex gap-4 rounded-1 bg-intro/5 p-8 dark:bg-dark-suits/5 md:rounded-2">
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
            </div>
          </SubSectionContainer>
          <SubSectionContainer>
            <p>
              I also hold a Master of Landscape Architecture from{" "}
              <StaticName
                name="SUNY ESF"
                bgColor={hexToRgba(introTheme.hex.primary, 0.05)}
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
            <div className="overflow-hidden">
              <div className="flex gap-4 rounded-1 bg-intro/5 p-8 dark:bg-dark-chinatown/5 md:rounded-2">
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
            </div>
          </SubSectionContainer>
          <SubSectionContainer>
            <p>
              My undergraduate training in Environmental Science at{" "}
              <StaticName
                name="Beijing Normal University"
                bgColor={hexToRgba(introTheme.hex.primary, 0.05)}
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
            <div className="overflow-hidden">
              {" "}
              <div className="flex gap-4 rounded-1 bg-intro/5 p-8 dark:bg-dark-chinatown/5 md:rounded-2">
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
            </div>
            {/*Subsection 4: Skills*/}
          </SubSectionContainer>
        </SectionContainer>
      </section>

      {/*Section 3: My Skills*/}
      <section id="section-3" className="w-full min-w-0 scroll-mt-24">
        <SectionContainer
          heading="My Skills"
          headingIcon={PaperPlaneTiltIcon}
          showBorder={false}
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
          showBorder={false}
        >
          <SubSectionContainer subSectionContainerClassName="gap-0">
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
          </div>{" "}
        </SectionContainer>
      </section>

      {/*Section 5: Let's Chat!*/}
      <section
        id="section-5"
        className="mb-16 w-full min-w-0 scroll-mt-24 md:mb-24"
      >
        <SectionContainer
          heading="Let's Chat!"
          headingIcon={PaperPlaneTiltIcon}
          showBorder={false}
        >
          <SubSectionContainer>
            <BioContactForm />
          </SubSectionContainer>
        </SectionContainer>
      </section>
    </article>
  );
}
