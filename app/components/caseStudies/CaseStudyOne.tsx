"use client";

import { useLighting, getShadows } from "../../context/LightingContext";
import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CaseStudyOne() {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useActiveProject();

  const { a, b, getLightColor, getTextColorClass } = useLighting();
  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );
  const lightColor = getLightColor(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );
  const themeShadows = getShadows(
    a,
    b,
    lightColor,
    resolvedTheme === "dark" ? "dark" : "light",
  );
  return (
    <article>
      {/*Section 1: Resume*/}
      <section id="section-1" className="scroll-mt-24">
        {/*Section Header*/}
        <div className="flex w-full items-center justify-between">
          {/*Section Title*/}
          <h2
            className={`font-sans text-3xl font-semibold ${textColorClass} leading-loose`}
          >
            My Resume
          </h2>
          {/*Download Button*/}
          <motion.button
            className="rounded-full px-4 py-2 font-semibold"
            animate={{ boxShadow: themeShadows.baseButton }}
            whileHover={{ boxShadow: themeShadows.hoverButton }}
          >
            Download a Copy
          </motion.button>
        </div>
        {/*Subsection 1: Experience*/}
        <div className="">
          {/*Subheader*/}
          <h3 className="mb-4 font-sans text-2xl font-semibold leading-loose">
            Experience
          </h3>
          {/*Entry 1*/}
          <div className="mb-4 flex gap-4">
            {/*Left: Image*/}
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
              <Image
                src="/images/logo-flux.png"
                fill
                alt="logo"
                className="object-cover"
              />
            </div>
            {/*Right: Description*/}
            <div className="flex w-full flex-col">
              {/*Header*/}
              <div className="flex justify-between font-sans text-xl">
                {/*Title Block*/}
                <div className="flex flex-col">
                  <p className="font-semibold">Co-founder</p>
                  <p>Flux</p>
                </div>
                {/*Years*/}
                <p>2023 - 2025</p>
              </div>
              {/*Description*/}
              <div className="mt-2 flex flex-col">
                <p>
                  Flux is a quantitative UX research platform with a mission to
                  democratize data-driven product design
                </p>
                <ul className="mt-2 list-inside list-disc">
                  <li>Design</li>
                  <li>Zero to One</li>
                  <li>Complex work flows</li>
                </ul>
              </div>
            </div>
          </div>
          {/*Entry 2*/}
          <div className="mb-4 flex gap-4">
            {/*Left: Image*/}
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded">
              <Image
                src="/images/logo-aslf.png"
                fill
                alt="logo"
                className="object-cover dark:invert"
              />
            </div>
            {/*Right: Description*/}
            <div className="flex w-full flex-col">
              {/*Header*/}
              <div className="flex justify-between font-sans text-xl">
                {/*Title Block*/}
                <div className="flex flex-col">
                  <p className="font-semibold">Design Director</p>
                  <p>ASLF, Inc.</p>
                </div>
                {/*Years*/}
                <p>2015 - 2022</p>
              </div>
              {/*Description*/}
              <div className="mt-2 flex flex-col">
                <p>
                  ASLF is a leading nonprofit with a decades-long track record
                  of shaping national environmental policy through strategic
                  litigation. In recent years, the organizatoin is refocusing
                  its efforts to
                </p>
                <ul className="mt-2 list-inside list-disc">
                  <li>Design</li>
                  <li>Project Management</li>
                  <li>Program Development</li>
                </ul>
              </div>
            </div>
          </div>
          {/*Entry 3*/}
          <div className="mb-4 flex gap-4">
            {/*Left: Image*/}
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded">
              <Image
                src="/images/logo-nps.png"
                fill
                alt="logo"
                className="object-cover"
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
        <div>
          {/*Subheader*/}
          <h3 className="mb-4 font-sans text-2xl font-semibold leading-loose">
            Education
          </h3>
          {/*Entry 1*/}
          <div className="mb-8 flex gap-4">
            {/*Left: Image*/}
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded">
              <Image
                src="/images/logo-uw.png"
                fill
                alt="logo"
                className="object-cover dark:hidden"
              />
              <Image
                src="/images/logo-uw-gold.png"
                fill
                alt="logo"
                className="hidden object-cover dark:block"
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
          <div className="mb-8 flex gap-4">
            {/*Left: Image*/}
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded">
              <Image
                src="/images/logo-esf.png"
                fill
                alt="logo"
                className="object-cover dark:hidden"
              />{" "}
              <Image
                src="/images/logo-esf-light.png"
                fill
                alt="logo"
                className="hidden object-cover dark:block"
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
          <div className="mb-8 flex gap-4">
            {/*Left: Image*/}
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded">
              <Image
                src="/images/logo-bnu.png"
                fill
                alt="logo"
                className="object-cover dark:brightness-[50] dark:saturate-0"
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
        <div>
          {/*Subheader*/}
          <h3 className="mb-4 font-sans text-2xl font-semibold leading-loose">
            Awards, Grants, and Funded Projects
          </h3>
          {/*List*/}
          <ul>
            {/*Entry 1*/}
            <li className="mb-4 flex justify-between gap-2 font-sans text-xl">
              {/*Left: Description*/}
              <div className="flex gap-2">
                {/*Image*/}
                <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src="/images/logo-nasa.png"
                    fill
                    alt="logo"
                    className="object-cover"
                  />
                </div>
                {/*Description*/}
                <p>
                  NASA SUITS,{" "}
                  <span className="font-serif text-lg italic">
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
                <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src="/images/logo-epa.png"
                    fill
                    alt="logo"
                    className="object-cover dark:brightness-[10]"
                  />
                </div>
                {/*Description*/}
                <p>
                  EPA Environmental Justice Small Grant Award,{" "}
                  <span className="font-serif text-lg italic">$65,094</span>
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
                <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src="/images/logo-wep.png"
                    fill
                    alt="logo"
                    className="object-cover"
                  />
                </div>
                {/*Description*/}
                <p>
                  Onondaga County Department of Water Environment Protection
                  Contract,{" "}
                  <span className="font-serif text-lg italic">$2,150,000</span>
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
                <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src="/images/logo-usda.png"
                    fill
                    alt="logo"
                    className="object-cover dark:brightness-200"
                  />
                </div>
                {/*Description*/}
                <p>
                  USDA Great Lakes Restoration Initiative Grant Award,{" "}
                  <span className="font-serif text-lg italic">$99,983</span>
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
                <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src="/images/logo-noaa.png"
                    fill
                    alt="logo"
                    className="object-cover"
                  />
                </div>
                {/*Description*/}
                <p>
                  NOAA Sea Grant Award,{" "}
                  <span className="font-serif text-lg italic">$24,964</span>
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
                <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src="/images/logo-nys.png"
                    fill
                    alt="logo"
                    className="object-cover dark:brightness-200 dark:saturate-0"
                  />
                </div>
                {/*Description*/}
                <p>
                  New York State Environmental Facilities Corporation Green
                  Innovation Grant,{" "}
                  <span className="font-serif text-lg italic">$1,100,000</span>
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
                <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src="/images/logo-usda.png"
                    fill
                    alt="logo"
                    className="object-cover dark:brightness-200"
                  />
                </div>
                {/*Description*/}
                <p>
                  USDA Great Lakes Restoration Initiative Grant Award,{" "}
                  <span className="font-serif text-lg italic">$186,950</span>
                </p>
              </div>
              {/*Right: Years*/}
              <p>2016</p>
            </li>
          </ul>
        </div>
        {/*Subsection 4: Skills*/}
        <h3 className="mb-4 font-sans text-2xl font-semibold leading-loose">
          Skills
        </h3>
        {/*Skills List*/}
        <ul className="text-xl">
          {/*1*/}
          <li>
            <p className="mb-2 font-sans text-xl">
              Design and Animation:{" "}
              <span className="font-serif text-lg italic">
                Figma, Illustrator, Photoshop, After Effect, LottieFiles, Framer
                Motion
              </span>
            </p>
          </li>
          {/*2*/}
          <li>
            <p className="mb-2 font-sans text-xl">
              Research and Analyses:{" "}
              <span className="font-serif text-lg italic">
                User Interview, Focus Groups, Survey Design, Statistical Methods
                (T-test, ANOVA, Linear Regression)
              </span>
            </p>
          </li>
          {/*3*/}
          <li>
            <p className="mb-2 font-sans text-xl">
              Front-End:{" "}
              <span className="font-serif text-lg italic">
                Javascript, React, Next.js, Tailwind CSS
              </span>
            </p>
          </li>
          {/*4*/}
          <li>
            <p className="mb-2 font-sans text-xl">
              Data Visualization:{" "}
              <span className="font-serif text-lg italic">D3.js, Tableau</span>
            </p>
          </li>
          {/*5*/}
          <li>
            <p className="mb-2 font-sans text-xl">
              Physical Prototyping:{" "}
              <span className="font-serif text-lg italic">
                Microcontrollers, 3D Modeling (Blender, Fusion 360, SolidWorks),
                Digital Fabrication (3D Printing, Laser Cutting, CNC Milling)
              </span>
            </p>
          </li>
        </ul>
      </section>
      {/*List 2: Story*/}
      <section id="section-2" className="scroll-mt-24">
        {/*Section Header*/}
        <h2
          className={`font-sans text-3xl font-semibold ${textColorClass} my-4 leading-loose`}
        >
          My Story
        </h2>
        <p>
          Design, for me, isn’t about just making things pretty. It’s about
          enabling people to do things better, feel supported, or see themselves
          reflected in a space or product. I’ve worked on tools for creative
          professionals, interfaces for astronauts, and public spaces for
          storytelling. I move fluidly between pixels and people, screens and
          systems.
        </p>
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
      </section>
      {/*Section 3: Interests*/}
      <section id="section-3" className="scroll-mt-24">
        {/*Section Header*/}
        <h2
          className={`font-sans text-3xl font-semibold ${textColorClass} my-4 leading-loose`}
        >
          My Interests
        </h2>
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
      </section>
    </article>
  );
}
