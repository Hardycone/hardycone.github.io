/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
// import projects from "@/data/projects";
// import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useTransform, MotionValue } from "framer-motion";
import { CertificateIcon, PathIcon, CameraIcon } from "@phosphor-icons/react";
import { hexToRgba } from "@/lib/palette";
// import { useProjectTheme } from "@/hooks/useProjectTheme";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import SectionContainer from "../SectionContainer";
import FlourishName from "../FlourishName";
import NarrativeAccordion from "../NarrativeAccordion";

interface CaseStudyOneProps {
  scrollY: MotionValue<number>;
}

export default function CaseStudyOne({ scrollY }: CaseStudyOneProps) {
  const { resolvedTheme } = useTheme();
  const [isFluxOpen, setIsFluxOpen] = useState(false);
  const [isFantailOpen, setIsFantailOpen] = useState(false);
  const [isAslfOpen, setIsAslfOpen] = useState(false);
  const [isUwOpen, setIsUwOpen] = useState(false);
  const [isSyracuseOpen, setIsSyracuseOpen] = useState(false);
  const fluxTheme = useProjectTheme("flux");
  const fantailTheme = useProjectTheme("fantail");
  const wolcottTheme = useProjectTheme("wolcott");
  const suitsTheme = useProjectTheme("suits");
  const chinatownTheme = useProjectTheme("chinatown");

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
    <article className="mx-auto w-full min-w-0 max-w-5xl">
      {/*Section 1: Resume*/}
      <section id="section-1" className="mb-16 w-full min-w-0 scroll-mt-24">
        {/*Section Header Block*/}
        <SectionContainer
          title="My Journey"
          icon={PathIcon}
          textColorClass={"text-foreground dark:text-dark-foreground"}
          bgColorClass={"bg-foreground dark:bg-dark-foreground"}
          borderColor={borderColor}
          revealOnScroll={false}
        >
          <p>
            A throughline of my career has been empowerment. I enjoy building
            things that enable people to do more. This passion hasn’t changed
            through my transition from a design director in the nonprofit sector
            into tech. It may seem like a big jump, but in reality I’ve always
            been the same designer speaking the same language.
          </p>
          <p className="mt-8">
            I’m currently working on{" "}
            <FlourishName
              name="Flux"
              bgColor={hexToRgba(fluxTheme.hex.primary, 0.05)}
              gradientCenterColor={hexToRgba(fluxTheme.hex.soft, 1)}
              gradientMiddleColor={hexToRgba(fluxTheme.hex.soft, 1)}
              isActive={isFluxOpen}
              onToggle={() => setIsFluxOpen((prev) => !prev)}
              onFlourish={() => setIsFluxOpen(true)}
              logoSrc="/images/logo-flux.png"
            />
            , a platform that makes quantitative UX research accessible to
            designers, researchers, and product managers. As AI makes it easier
            for teams to prototype and iterate quickly, research is often
            compressed, skipped, or reduced to directional feedback. Flux helps
            teams test prototypes with statistical rigor in hours, without
            needing a background in statistics. My work focuses on turning a
            traditionally intimidating research process into something
            approachable, guided, and genuinely useful.
          </p>
          <NarrativeAccordion isOpen={isFluxOpen}>
            <div className="rounded-1 md:rounded-2 mb-4 mt-4 flex gap-4 bg-flux/5 p-8 dark:bg-dark-flux/5">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo-flux.png"
                  alt="Flux logo"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex w-full flex-col">
                <div className="flex justify-between font-sans text-xl">
                  <div className="flex flex-col">
                    <p className="font-semibold">Co-founder</p>
                    <p>Flux</p>
                  </div>
                  <p>2023 - 2025</p>
                </div>
                <div className="mt-2 flex flex-col">
                  <p>
                    Flux is a quantitative UX research platform with a mission
                    to democratize data-driven product design. Flux is a
                    quantitative UX research platform with a mission to
                    democratize data-driven product design. Design. Zero to One.
                    Complex work flows .Design. Zero to One. Complex work flows
                  </p>
                  <ul className="mt-2 list-inside list-disc">
                    <li>
                      Led product design from concept to launch, defining the UX
                      strategy, interaction patterns, and visual language
                    </li>
                    <li>
                      Built and managed a design system spanning web
                      application, marketing site, and data visualization
                      components
                    </li>
                    <li>
                      Conducted user research with designers, PMs, and
                      researchers to validate product direction
                    </li>
                    <li>
                      Designed and implemented quantitative UX testing workflows
                      including statistical result visualizations
                    </li>
                    <li>
                      Collaborated with engineers to ship a working MVP that
                      users described as "intuitive" and "surprisingly powerful"
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </NarrativeAccordion>
          <p className="mt-8">
            Before that, I started and failed launching another idea —{" "}
            <FlourishName
              name="Fantail"
              bgColor={hexToRgba(fantailTheme.hex.primary, 0.05)}
              gradientCenterColor={hexToRgba(fantailTheme.hex.soft, 1)}
              gradientMiddleColor={hexToRgba(fantailTheme.hex.soft, 1)}
              isActive={isFantailOpen}
              onToggle={() => setIsFantailOpen((prev) => !prev)}
              onFlourish={() => setIsFantailOpen(true)}
              logoSrc="/images/logo-fantail.png"
            />
            . Our vision – which we still believe to this day – is that AI
            should serve the creative mind, not replace it. Fantail brought AI
            into the early stages of filmmaking. It’s not “prompt the AI to make
            your film”, it’s “let AI help you bring what’s in your mind onto the
            paper”. In Fantail, filmmakers could write, gather reference
            materials, create storyboards, hear dialogues. I worked on this with
            another 2 cofounders for 6 months. Together we built a prototype and
            pursued funding, but we were ultimately unable to continue. Lesson
            learned: founder-market fit matters. We were naïve going into this
            with nothing but a burning passion. We did textbook discovery and
            design research, identified a real problem, and delivered a
            solution. But we didn’t have to the industry knowhow. Investors saw
            that and turned us down.
          </p>
          <NarrativeAccordion isOpen={isFantailOpen}>
            <div className="rounded-1 md:rounded-2 mb-4 mt-4 flex gap-4 bg-fantail/5 p-8 dark:bg-dark-fantail/5">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo-fantail.png"
                  alt="Fantail logo"
                  className="absolute inset-0 h-full w-full object-cover"
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
                  <p>
                    Fantail was an AI-powered pre-production tool for
                    filmmakers. The idea was to help creatives bring their
                    vision to paper — storyboarding, reference gathering, script
                    development — without replacing the human creative process.
                  </p>
                  <ul className="mt-2 list-inside list-disc">
                    <li>
                      Led product design and user research from concept to
                      prototype
                    </li>
                    <li>
                      Built and tested workflows for storyboarding and script
                      visualization
                    </li>
                    <li>Pitched to investors alongside 2 cofounders</li>
                  </ul>
                </div>
              </div>
            </div>
          </NarrativeAccordion>
          <p className="mt-8">
            <FlourishName
              name="ASLF, Inc."
              bgColor={hexToRgba(wolcottTheme.hex.primary, 0.05)}
              gradientCenterColor={hexToRgba(wolcottTheme.hex.soft, 1)}
              gradientMiddleColor={hexToRgba(wolcottTheme.hex.soft, 1)}
              isActive={isAslfOpen}
              onToggle={() => setIsAslfOpen((prev) => !prev)}
              onFlourish={() => setIsAslfOpen(true)}
              logoSrc={{
                light: "/images/logo-aslf.png",
                dark: "/images/logo-aslf-inverted.png",
              }}
            />{" "}
            is where I spent seven years as a landscape designer and later
            Design Director. The work sat at the intersection of environmental
            justice, community engagement, and physical design. I led over a
            dozen green infrastructure projects — community gardens, rain
            gardens, park redesigns — in underserved neighborhoods across the
            country. Each project was a lesson in listening: to the community,
            to the land, and to the policy constraints that shape what gets
            built.
          </p>
          <NarrativeAccordion isOpen={isAslfOpen}>
            <div className="rounded-1 md:rounded-2 mb-4 mt-4 flex gap-4 bg-wolcott/5 p-8 dark:bg-dark-wolcott/5">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo-aslf.png"
                  alt="ASLF logo"
                  className="absolute inset-0 h-full w-full object-cover dark:invert"
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
                  <p>
                    ASLF is a nonprofit that shapes US environmental policy
                    through strategic litigation and community-based projects.
                    ASLF is a leading nonprofit with a decades-long track record
                    of shaping US environmental policy through strategic
                    litigation. I joined as a landscape designer as the
                    organizatoin refocused its efforts to implementing impactful
                    green projects in local communities. Design and
                    Implementation: I designed and oversaw the implementation of
                    over a dozen green projects. Project Management: I managed
                    several federal and local grants amassing a total budget of
                    over $3 million. Program Development: I built partnerships
                    and secured grants. Stakeholder Management: I heavily
                    involved the local community in all my projects in the form
                    of interviews and workshops.
                  </p>
                  <ul className="mt-2 list-inside list-disc">
                    <li>
                      Designed and oversaw implementation of over a dozen green
                      infrastructure projects
                    </li>
                    <li>
                      Managed federal and local grants totaling over $3 million
                    </li>
                    <li>
                      Built partnerships and secured funding through grant
                      writing
                    </li>
                    <li>
                      Led community workshops and interviews to co-design public
                      spaces
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </NarrativeAccordion>

          {/*Subsection 1: Experience*/}
        </SectionContainer>
      </section>

      <section id="section-2" className="mb-16 w-full min-w-0 scroll-mt-24">
        <SectionContainer
          title="My Qualifications"
          icon={CertificateIcon}
          textColorClass={"text-foreground dark:text-dark-foreground"}
          bgColorClass={"bg-foreground dark:bg-dark-foreground"}
          borderColor={borderColor}
        >
          <p>
            I went back to school for my{" "}
            <FlourishName
              name="Master's in HCI at UW"
              bgColor={hexToRgba(suitsTheme.hex.primary, 0.05)}
              gradientCenterColor={hexToRgba(suitsTheme.hex.soft, 1)}
              gradientMiddleColor={hexToRgba(suitsTheme.hex.soft, 1)}
              isActive={isUwOpen}
              onToggle={() => setIsUwOpen((prev) => !prev)}
              onFlourish={() => setIsUwOpen(true)}
              logoSrc={{
                light: "/images/logo-uw.png",
                dark: "/images/logo-uw-gold.png",
              }}
            />
            , where I dove headfirst into human-computer interaction research.
            My focus was on making data-driven design tools accessible to
            non-statisticians — a thread that eventually led me to co-found
            Flux. At UW, I studied research methods, statistical analysis, and
            prototyping, and applied them to projects ranging from NASA
            spacesuit interfaces to quantitative UX testing tools.
          </p>
          <NarrativeAccordion isOpen={isUwOpen}>
            <div className="rounded-1 md:rounded-2 mb-4 mt-4 flex gap-4 bg-suits/5 p-8 dark:bg-dark-suits/5">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo-uw.png"
                  alt="UW logo"
                  className="absolute inset-0 h-full w-full object-cover dark:hidden"
                />
                <img
                  src="/images/logo-uw-gold.png"
                  alt="UW logo"
                  className="absolute inset-0 hidden h-full w-full object-cover dark:block"
                />
              </div>
              <div className="flex w-full flex-col">
                <div className="flex justify-between font-sans text-xl">
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      Master's in Human-Computer Interaction
                    </p>
                    <p>University of Washington - Seattle</p>
                  </div>
                  <p>2023</p>
                </div>
                <div className="mt-2 flex flex-col">
                  <ul className="list-inside list-disc">
                    <li>
                      Researched quantitative UX methods and statistical
                      workflows for designers
                    </li>
                    <li>
                      Finalist in NASA SUITS — designed and tested AR interfaces
                      at Johnson Space Center
                    </li>
                    <li>
                      Built prototypes exploring AI-assisted research
                      interpretation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </NarrativeAccordion>
          <p className="mt-8">
            Before UW, I earned my{" "}
            <FlourishName
              name="Master's in Landscape Architecture at SUNY-ESF"
              bgColor={hexToRgba(chinatownTheme.hex.primary, 0.05)}
              gradientCenterColor={hexToRgba(chinatownTheme.hex.soft, 1)}
              gradientMiddleColor={hexToRgba(chinatownTheme.hex.soft, 1)}
              isActive={isSyracuseOpen}
              onToggle={() => setIsSyracuseOpen((prev) => !prev)}
              onFlourish={() => setIsSyracuseOpen(true)}
              logoSrc={{
                light: "/images/logo-esf.png",
                dark: "/images/logo-esf-light.png",
              }}
            />
            , in Syracuse. This is where I first encountered environmental
            justice as a design practice. I studied how landscape architecture
            could repair — not just decorate — communities that had been
            systematically underserved. My work included community-based design
            studios, ecological restoration planning, and a thesis on equitable
            access to green space. The throughline from Syracuse to Flux is
            surprisingly direct: design is a tool for empowerment, whether the
            medium is a park or a prototype.
          </p>
          <NarrativeAccordion isOpen={isSyracuseOpen}>
            <div className="rounded-1 md:rounded-2 mb-4 mt-4 flex gap-4 bg-chinatown/5 p-8 dark:bg-dark-chinatown/5">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo-esf.png"
                  alt="SUNY-ESF logo"
                  className="absolute inset-0 h-full w-full object-cover dark:hidden"
                />
                <img
                  src="/images/logo-esf-light.png"
                  alt="SUNY-ESF logo"
                  className="absolute inset-0 hidden h-full w-full object-cover dark:block"
                />
              </div>
              <div className="flex w-full flex-col">
                <div className="flex justify-between font-sans text-xl">
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      Master's in Landscape Architecture
                    </p>
                    <p>State University of New York - Syracuse</p>
                  </div>
                  <p>2015</p>
                </div>
                <div className="mt-2 flex flex-col">
                  <ul className="list-inside list-disc">
                    <li>
                      Focused on environmental justice and community-based
                      design
                    </li>
                    <li>
                      Ecological restoration and green infrastructure planning
                    </li>
                    <li>
                      Thesis on equitable access to recreational green space
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </NarrativeAccordion>
          <p className="mt-8">
            In another life, I was a landscape architecture. I was in a very
            specific niche – environmental justice. It’s social justice
            manifested in the landscape. Socioeconomically disadvantaged
            communities are setup to fail. They quite literally don’t even
            breath the same air. They have less access to recreational green
            spaces. As a
          </p>
          <div className="mb-8">
            {/*Subheader*/}
            <h3 className="mb-4 font-sans text-2xl font-semibold">
              Experience
            </h3>

            {/*Entry 3*/}
            <div className="mb-4 flex gap-4">
              {/*Left: Image*/}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo-nps.png"
                  alt="logo"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              {/*Right: Description*/}
              <div className="flex w-full flex-col">
                {/*Header*/}
                <div className="flex justify-between font-sans text-xl">
                  {/*Title Block*/}
                  <div className="flex flex-col">
                    <p className="font-semibold">Researcher</p>
                    <p>National Park Service</p>
                  </div>
                  {/*Years*/}
                  <p>2014 - 2015</p>
                </div>
                {/*Description*/}
                <div className="mt-2 flex flex-col">
                  <p>Olmsted Center for Cultural Landscape Preservation </p>
                  <ul className="mt-2 list-disc pl-8">
                    <li>Design</li>
                    <li>Zero to One</li>
                    <li>
                      My work was published as a technical report:{" "}
                      <span className="italic">
                        Auwaerter, John E., Haichao Wang, and George W. Curry.
                        Cultural Landscape Report for Muir Woods National
                        Monument. National Park Service, 2021.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/*Subsection 2: Education*/}
          <div className="mb-8">
            {/*Subheader*/}
            <h3 className="mb-4 font-sans text-2xl font-semibold">Education</h3>
            {/*Entry 1*/}
            <div className="mb-4 flex gap-4">
              {/*Left: Image*/}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo-uw.png"
                  alt="logo"
                  className="absolute inset-0 h-full w-full object-cover dark:hidden"
                />
                <img
                  src="/images/logo-uw-gold.png"
                  alt="logo"
                  className="absolute inset-0 hidden h-full w-full object-cover dark:block"
                />
              </div>
              {/*Right: Description*/}
              <div className="flex w-full flex-col">
                {/*Header*/}
                <div className="flex justify-between font-sans text-xl">
                  {/*Title Block*/}
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      Master's in Human-Computer Interaction
                    </p>
                    <p>University of Washington - Seattle</p>
                  </div>
                  {/*Years*/}
                  <p>2023</p>
                </div>
              </div>
            </div>
            {/*Entry 2*/}
            <div className="mb-4 flex gap-4">
              {/*Left: Image*/}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo-esf.png"
                  alt="logo"
                  className="absolute inset-0 h-full w-full object-cover dark:hidden"
                />{" "}
                <img
                  src="/images/logo-esf-light.png"
                  alt="logo"
                  className="absolute inset-0 hidden h-full w-full object-cover dark:block"
                />
              </div>
              {/*Right: Description*/}
              <div className="flex w-full flex-col">
                {/*Header*/}
                <div className="flex justify-between font-sans text-xl">
                  {/*Title Block*/}
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      Master's in Landscape Architecture
                    </p>
                    <p>State University of New York - Syracuse</p>
                  </div>
                  {/*Years*/}
                  <p>2015</p>
                </div>
              </div>
            </div>
            {/*Entry 3*/}
            <div className="mb-4 flex gap-4">
              {/*Left: Image*/}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo-bnu.png"
                  alt="logo"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[50] dark:saturate-0"
                />
              </div>
              {/*Right: Description*/}
              <div className="flex w-full flex-col">
                {/*Header*/}
                <div className="flex justify-between font-sans text-xl">
                  {/*Title Block*/}
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      Bachelor's in Environmental Science
                    </p>
                    <p>Beijing Normal University</p>
                  </div>
                  {/*Years*/}
                  <p>2011</p>
                </div>
              </div>
            </div>
          </div>
          {/*Subsection 3: Grants and Awards*/}
          <div className="mb-8">
            {/*Subheader*/}
            <h3 className="mb-4 font-sans text-2xl font-semibold">
              Awards, Grants, and Funded Projects
            </h3>
            {/*List*/}
            <ul>
              {/*Entry 1*/}
              <li className="mb-4 flex justify-between gap-2 font-sans text-xl">
                {/*Left: Description*/}
                <div className="flex gap-2">
                  {/*Image*/}
                  <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden">
                    <img
                      src="/images/logo-nasa.png"
                      alt="logo"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  {/*Description*/}
                  <p>
                    NASA SUITS,{" "}
                    <span className="text-lg italic">
                      Finalist (Selected for testing and presentation at Johnson
                      Space Center with 9 other teams)
                    </span>
                  </p>
                </div>
                {/*Right: Years*/}
                <p>2023</p>
              </li>
              {/*Entry 2*/}
              <li className="mb-4 flex justify-between gap-2 font-sans text-xl">
                {/*Left: Description*/}
                <div className="flex gap-2">
                  {/*Image*/}
                  <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden">
                    <img
                      src="/images/logo-epa.png"
                      alt="logo"
                      className="absolute inset-0 h-full w-full object-cover dark:brightness-[10]"
                    />
                  </div>
                  {/*Description*/}
                  <p>
                    EPA Environmental Justice Small Grant Award,{" "}
                    <span className="text-lg italic">$65,094</span>
                  </p>
                </div>
                {/*Right: Years*/}
                <p>2021</p>
              </li>
              {/*Entry 3*/}
              <li className="mb-4 flex justify-between gap-2 font-sans text-xl">
                {/*Left: Description*/}
                <div className="flex gap-2">
                  {/*Image*/}
                  <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden">
                    <img
                      src="/images/logo-wep.png"
                      alt="logo"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  {/*Description*/}
                  <p>
                    Onondaga County Department of Water Environment Protection
                    Contract, <span className="text-lg italic">$2,150,000</span>
                  </p>
                </div>
                {/*Right: Years*/}
                <p>2020</p>
              </li>
              {/*Entry 4*/}
              <li className="mb-4 flex justify-between gap-2 font-sans text-xl">
                {/*Left: Description*/}
                <div className="flex gap-2">
                  {/*Image*/}
                  <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden">
                    <img
                      src="/images/logo-usda.png"
                      alt="logo"
                      className="absolute inset-0 h-full w-full object-cover dark:brightness-200"
                    />
                  </div>
                  {/*Description*/}
                  <p>
                    USDA Great Lakes Restoration Initiative Grant Award,{" "}
                    <span className="text-lg italic">$99,983</span>
                  </p>
                </div>
                {/*Right: Years*/}
                <p>2019</p>
              </li>
              {/*Entry 5*/}
              <li className="mb-4 flex justify-between gap-2 font-sans text-xl">
                {/*Left: Description*/}
                <div className="flex gap-2">
                  {/*Image*/}
                  <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden">
                    <img
                      src="/images/logo-noaa.png"
                      alt="logo"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  {/*Description*/}
                  <p>
                    NOAA Sea Grant Award,{" "}
                    <span className="text-lg italic">$24,964</span>
                  </p>
                </div>
                {/*Right: Years*/}
                <p>2018</p>
              </li>
              {/*Entry 6*/}
              <li className="mb-4 flex justify-between gap-2 font-sans text-xl">
                {/*Left: Description*/}
                <div className="flex gap-2">
                  {/*Image*/}
                  <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden">
                    <img
                      src="/images/logo-nys.png"
                      alt="logo"
                      className="absolute inset-0 h-full w-full object-cover dark:brightness-200 dark:saturate-0"
                    />
                  </div>
                  {/*Description*/}
                  <p>
                    New York State Green Innovation Grant,{" "}
                    <span className="text-lg italic">$1,100,000</span>
                  </p>
                </div>
                {/*Right: Years*/}
                <p>2017</p>
              </li>
              {/*Entry 7*/}
              <li className="mb-4 flex justify-between gap-2 font-sans text-xl">
                {/*Left: Description*/}
                <div className="flex gap-2">
                  {/*Image*/}
                  <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden">
                    <img
                      src="/images/logo-usda.png"
                      alt="logo"
                      className="absolute inset-0 h-full w-full object-cover dark:brightness-200"
                    />
                  </div>
                  {/*Description*/}
                  <p>
                    USDA Great Lakes Restoration Initiative Grant Award,{" "}
                    <span className="text-lg italic">$186,950</span>
                  </p>
                </div>
                {/*Right: Years*/}
                <p>2016</p>
              </li>
            </ul>
          </div>
          {/*Subsection 4: Skills*/}
          <div className="mb-8">
            <h3 className="mb-4 font-sans text-2xl font-semibold">Skills</h3>
            {/*Skills List*/}
            <ul className="text-xl">
              {/*1*/}
              <li>
                <p className="mb-2 font-sans text-xl">
                  Design and Animation:{" "}
                  <span className="text-lg italic">
                    Figma, Illustrator, Photoshop, After Effect, LottieFiles,
                    Framer Motion
                  </span>
                </p>
              </li>
              {/*2*/}
              <li>
                <p className="mb-2 font-sans text-xl">
                  Research and Analyses:{" "}
                  <span className="text-lg italic">
                    User Interview, Focus Groups, Survey Design, Statistical
                    Methods (T-test, ANOVA, Linear Regression)
                  </span>
                </p>
              </li>
              {/*3*/}
              <li>
                <p className="mb-2 font-sans text-xl">
                  Front-End:{" "}
                  <span className="text-lg italic">
                    Javascript, React, Next.js, Tailwind CSS
                  </span>
                </p>
              </li>
              {/*4*/}
              <li>
                <p className="mb-2 font-sans text-xl">
                  Data Visualization:{" "}
                  <span className="text-lg italic">D3.js, Tableau</span>
                </p>
              </li>
              {/*5*/}
              <li>
                <p className="mb-2 font-sans text-xl">
                  Physical Prototyping:{" "}
                  <span className="text-lg italic">
                    Microcontrollers, 3D Modeling (Blender, Fusion 360,
                    SolidWorks), Digital Fabrication (3D Printing, Laser
                    Cutting, CNC Milling)
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </SectionContainer>
      </section>

      {/*Section 3: Interests*/}
      <section id="section-3" className="w-full min-w-0 scroll-mt-24">
        <SectionContainer
          title="My Interests"
          icon={CameraIcon}
          textColorClass={"text-foreground dark:text-dark-foreground"}
          bgColorClass={"bg-foreground dark:bg-dark-foreground"}
          borderColor={borderColor}
        >
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring. In my spare time, I enjoy hiking,
            running, practicing barre chords on my acoustic guitar, and taking
            pictures with a mirrorless camera. I also enjoy making physical
            things.
          </p>

          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
        </SectionContainer>
        <div className="relative left-1/2 mx-auto mb-8 w-[calc(100svw-2rem)] max-w-[1440px] -translate-x-1/2">
          {/*Image Grid*/}
          <div className="grid grid-cols-4 grid-rows-4 gap-2">
            {/* Image 1 - 4 cells horizontally */}
            <div className="relative col-span-4 row-span-1">
              <img
                src="/images/20230624-HWP00734-Edit.jpg"
                alt="Dummy Image 1"
                className="rounded-1 md:rounded-2 absolute inset-0 h-full w-full object-cover"
              />
            </div>
            {/* Image 2 - 2x2 square */}
            <div className="relative col-span-2 row-span-2 aspect-[1/1]">
              <img
                src="/images/20230624-HWP00734-Edit.jpg"
                alt="Dummy Image 2"
                className="rounded-1 md:rounded-2 absolute inset-0 h-full w-full object-cover"
              />
            </div>
            {/* Image 3 - 2 cells vertically adjacent */}
            <div className="relative col-span-1 row-span-2">
              <img
                src="/images/20230624-HWP00734-Edit.jpg"
                alt="Dummy Image 3"
                className="rounded-1 md:rounded-2 absolute inset-0 h-full w-full object-cover"
              />
            </div>
            {/* Remaining cells */}
            <div className="relative">
              <img
                src="/images/20230624-HWP00734-Edit.jpg"
                alt="Dummy Image 4"
                className="rounded-1 md:rounded-2 absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative">
              <img
                src="/images/20230624-HWP00734-Edit.jpg"
                alt="Dummy Image 5"
                className="rounded-1 md:rounded-2 absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative">
              <img
                src="/images/20230624-HWP00734-Edit.jpg"
                alt="Dummy Image 7"
                className="rounded-1 md:rounded-2 absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative col-span-3 row-span-1">
              <img
                src="/images/20240704-HWP03580-Edit.jpg"
                alt="Dummy Image 6"
                className="rounded-1 md:rounded-2 absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
        <SectionContainer
          showHeading={false}
          borderColor={borderColor}
          revealOnScroll={false}
          cardClass="mb-0"
        >
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring. In my spare time, I enjoy hiking,
            running, practicing barre chords on my acoustic guitar, and taking
            pictures with a mirrorless camera. I also enjoy making physical
            things.
          </p>
          {/*Image Grid Container*/}

          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
          <p>
            Whether I’m prototyping UX flows in Figma, guiding product direction
            with founders, or co-designing with local communities, I bring a
            principled but curious approach. This portfolio shares six
            representative projects—from startups to NASA to grassroots
            urbanism. Thanks for exploring.
          </p>
        </SectionContainer>
      </section>
    </article>
  );
}
