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
    projects[activeIndex].textColor
  );
  const lightColor = getLightColor(
    resolvedTheme || "light",
    projects[activeIndex].textColor
  );
  const themeShadows = getShadows(
    a,
    b,
    lightColor,
    resolvedTheme === "dark" ? "dark" : "light"
  );
  return (
    <article>
      {/*Section 1: Resume*/}
      <section id="section-1" className="scroll-mt-24">
        {/*Section Header*/}
        <div className="flex w-full justify-between items-center py-4 rounded-xl">
          {/*Section Title*/}
          <h2
            className={`font-sans font-semibold text-3xl ${textColorClass} leading-loose`}
          >
            My Resume
          </h2>
          {/*Download Button*/}
          <motion.button
            className="font-semibold py-2 px-4 rounded-full"
            animate={{ boxShadow: themeShadows.baseButton }}
            whileHover={{ boxShadow: themeShadows.hoverButton }}
          >
            Download a Copy
          </motion.button>
        </div>
        {/*Subsection 1: Experience*/}
        <h3 className="font-sans font-semibold text-2xl leading-loose mb-4">
          Experience
        </h3>
        {/*Entry 1*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-flux.png"
              fill
              alt="logo"
              className="object-cover"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">Co-founder</p>
                <p>Flux</p>
              </div>
              {/*Years*/}
              <p>2023 - 2025</p>
            </div>
            {/*Description*/}
            <div className="flex flex-col mt-2">
              <p>
                Flux is a quantitative UX research platform with a mission to
                democratize data-driven product design
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Design</li>
                <li>Zero to One</li>
                <li>Complex work flows</li>
              </ul>
            </div>
          </div>
        </div>
        {/*Entry 2*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-aslf.png"
              fill
              alt="logo"
              className="object-cover dark:invert"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">Design Director</p>
                <p>ASLF, Inc.</p>
              </div>
              {/*Years*/}
              <p>2015 - 2022</p>
            </div>
            {/*Description*/}
            <div className="flex flex-col mt-2">
              <p>
                ASLF is a leading nonprofit with a long history of advancing the
                nation's environmental policies through litigation. I joined as
                a designer admist a period of transition where the organization
                saught to define itself.
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Design</li>
                <li>Project Management</li>
                <li>Program Development</li>
              </ul>
            </div>
          </div>
        </div>
        {/*Entry 3*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-nps.png"
              fill
              alt="logo"
              className="object-cover"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">Researcher</p>
                <p>National Park Service</p>
              </div>
              {/*Years*/}
              <p>2014 - 2015</p>
            </div>
            {/*Description*/}
            <div className="flex flex-col mt-2">
              <p>Olmsted Center for Cultural Landscape Preservation</p>
              <ul className="list-disc list-inside mt-2">
                <li>Design</li>
                <li>Zero to One</li>
                <li>Complex work flows</li>
              </ul>
            </div>
          </div>
        </div>
        {/*Subsection 2: Education*/}
        <h3 className="font-sans font-semibold text-2xl leading-loose mb-4">
          Education
        </h3>
        {/*Entry 1*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-uw.png"
              fill
              alt="logo"
              className="object-cover dark:hidden"
            />{" "}
            <Image
              src="/images/logo-uw-gold.png"
              fill
              alt="logo"
              className="hidden dark:block object-cover"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
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
            {/*Description*/}
            <div className="flex flex-col mt-2">
              <p>
                Flux is a quantitative UX research platform with a mission to
                democratize data-driven product design
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Design</li>
                <li>Zero to One</li>
                <li>Complex work flows</li>
              </ul>
            </div>
          </div>
        </div>
        {/*Entry 2*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
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
              className="object-cover hidden dark:block"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">
                  Master's in Landscape Architecture
                </p>
                <p>State University of New York</p>
              </div>
              {/*Years*/}
              <p>2015</p>
            </div>
            {/*Description*/}
            <div className="flex flex-col mt-2">
              <p>
                ASLF is a leading nonprofit with a long history of advancing the
                nation's environmental policies through litigation. I joined as
                a designer admist a period of transition where the organization
                saught to define itself.
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Design</li>
                <li>Project Management</li>
                <li>Program Development</li>
              </ul>
            </div>
          </div>
        </div>
        {/*Entry 3*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-bnu.png"
              fill
              alt="logo"
              className="object-cover dark:brightness-[50] dark:saturate-0"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
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
            {/*Description*/}
            <div className="flex flex-col mt-2">
              <p>Olmsted Center for Cultural Landscape Preservation</p>
              <ul className="list-disc list-inside mt-2">
                <li>Design</li>
                <li>Zero to One</li>
                <li>Complex work flows</li>
              </ul>
            </div>
          </div>
        </div>

        {/*Subsection 3: Grants and Awards*/}
        <h3 className="font-sans font-semibold text-2xl leading-loose mb-4">
          Grants, Awards, and Funded Projects
        </h3>
        {/*Entry 1*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-nasa.png"
              fill
              alt="logo"
              className="object-cover"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">
                  NASA SUITS User Interface Design Challenge
                </p>
                <p>Finalist</p>
              </div>
              {/*Years*/}
              <p>2023</p>
            </div>
          </div>
        </div>
        {/*Entry 2*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-epa.png"
              fill
              alt="logo"
              className="object-cover dark:invert"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">
                  EPA Environmental Justice Grant Award
                </p>
                <p>Funding: $65,094</p>
              </div>
              {/*Years*/}
              <p>2021</p>
            </div>
          </div>
        </div>
        {/*Entry 3*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-wep.png"
              fill
              alt="logo"
              className="object-cover"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">
                  Funding from Onondaga County Department of Water Environment
                  Protection
                </p>
                <p>Funding: $2,150,000</p>
              </div>
              {/*Years*/}
              <p>2020</p>
            </div>
          </div>
        </div>
        {/*Entry 4*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-epa.png"
              fill
              alt="logo"
              className="object-cover dark:invert"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">
                  EPA Great Lakes Restoration Initiative Grant Award
                </p>
                <p>Funding: $99,983</p>
              </div>
              {/*Years*/}
              <p>2019</p>
            </div>
          </div>
        </div>
        {/*Entry 5*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0 flex-shrink-0">
            <Image
              src="/images/logo-noaa.png"
              fill
              alt="logo"
              className="object-cover"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">NOAA Sea Grant Award </p>
                <p>Funding: $24,964</p>
              </div>
              {/*Years*/}
              <p>2018</p>
            </div>
          </div>
        </div>
        {/*Entry 6*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-nys.png"
              fill
              alt="logo"
              className="object-cover"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">
                  New York State Environmental Facilities Corporation Green
                  Innovation Grant
                </p>
                <p>Funding: $1,100,000</p>
              </div>
              {/*Years*/}
              <p>2017</p>
            </div>
          </div>
        </div>
        {/*Entry 7*/}
        <div className="flex gap-4 mb-8">
          {/*Left: Image*/}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-epa.png"
              fill
              alt="logo"
              className="object-cover dark:invert"
            />
          </div>
          {/*Right: Description*/}
          <div className="flex flex-col w-full">
            {/*Header*/}
            <div className="font-sans text-xl flex justify-between">
              {/*Title Block*/}
              <div className="flex flex-col">
                <p className="font-semibold">
                  EPA Great Lakes Restoration Initiative Grant Award
                </p>
                <p>Funding: $186,950</p>
              </div>
              {/*Years*/}
              <p>2016</p>
            </div>
          </div>
        </div>
      </section>
      <section id="section-2" className="scroll-mt-24">
        <h2
          className={`font-sans font-semibold text-3xl ${textColorClass} leading-loose`}
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
      <section id="section-3" className="scroll-mt-24">
        <h2
          className={`font-sans font-semibold text-3xl ${textColorClass} leading-loose`}
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
      <section id="section-4" className="scroll-mt-24">
        <h2 className="text-2xl leading-loose">Section 4</h2>
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
      <section id="section-5" className="scroll-mt-24">
        <h2 className="text-2xl leading-loose">Section 4</h2>
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
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
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

      <section id="section-6" className="scroll-mt-24">
        <h2 className="text-2xl leading-loose">Section 4</h2>
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
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
        <p>
          Whether I’m prototyping UX flows in Figma, guiding product direction
          with founders, or co-designing with local communities, I bring a
          principled but curious approach. This portfolio shares six
          representative projects—from startups to NASA to grassroots urbanism.
          Thanks for exploring.
        </p>{" "}
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
