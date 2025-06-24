"use client";

import { useLighting, getShadows } from "../../context/LightingContext";
import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { motion } from "framer-motion";

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
      <section id="section-1" className="scroll-mt-24">
        <motion.div className="flex w-full justify-between items-center py-4 rounded-xl">
          <h2
            className={`font-sans font-semibold text-3xl ${textColorClass} leading-loose`}
          >
            My Resume
          </h2>
          <div className="flex gap-2 items-center">
            <span>Get a Copy:</span>
            <motion.button
              className="font-semibold py-2 px-4 rounded-full"
              animate={{ boxShadow: themeShadows.baseButton }}
              whileHover={{ boxShadow: themeShadows.hoverButton }}
            >
              Download
            </motion.button>
          </div>
        </motion.div>
        <h3 className="font-sans text-xl leading-loose">Experience</h3>
        <p>Co-founder</p>
        <p>Flux</p>
        <p>Chicago, IL</p>

        <p>Co-founder</p>
        <p>Fantail</p>
        <p>Seattle, WA</p>

        <p>Design Director</p>
        <p>ASLF, inc.</p>
        <p>Syracuse, NY</p>
        <p>Cultural Landscape Researcher</p>
        <p>National Park Service</p>
        <p>Syracuse, NY | Boston, MA</p>

        <h3 className="font-sans text-xl leading-loose">Education</h3>
        <p>Master of Human-Computer Interaction and Design</p>
        <p>University of Washington</p>
        <p>Master of Landscape Architecture</p>
        <p>
          State University of New York College of Environmental Science and
          Forestry
        </p>
        <p>Bachelor of Environmental Science</p>
        <p>Beijing Normal University Beijing, China</p>
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
        </p>{" "}
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
