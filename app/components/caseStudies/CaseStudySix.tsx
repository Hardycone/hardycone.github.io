/* eslint-disable react/no-unescaped-entities */
import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";
import SectionContainer from "../SectionContainer";
import {
  ScrollIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  PresentationChartIcon,
  SealQuestionIcon,
  LightbulbFilamentIcon,
} from "@phosphor-icons/react";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface CaseStudySixProps {
  scrollY: MotionValue<number>;
}

export default function CaseStudySix({ scrollY }: CaseStudySixProps) {
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
    (o) => `rgba(255,255,255,${o})`,
  );

  return (
    <article>
      <section id="section-1" className="scroll-mt-24">
        <SectionContainer
          title="Quick Take"
          icon={ScrollIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={borderColor}
        >
          <p className="mb-6 text-lg">
            Our team set out to solve a common but underexplored problem: how do
            product teams know which design works best—really know, with data?
            While qualitative methods dominate early design, we noticed a gap in
            quant UX tooling, particularly for live prototype testing. We wanted
            to bring statistical rigor to the kinds of questions teams already
            ask in Figma: which variant performs better? Where do users
            hesitate?
          </p>
          <div
            className={`relative aspect-[16/9] w-full overflow-hidden rounded-xl`}
          ></div>
        </SectionContainer>
      </section>
      <section id="section-2" className="scroll-mt-24">
        <SectionContainer
          title="Quick Take"
          icon={ScrollIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={borderColor}
        >
          <h2>Research</h2>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
          <p>
            We worked with historians, artists, and Chinatown residents. Key
            themes included resistance to gentrification, pride in immigrant
            stories, and a desire for visibility. We documented visual motifs
            from signage, murals, and family shrines. We hosted walking tours
            and oral history sessions that informed the site’s narrative
            anchors.
          </p>
        </SectionContainer>
      </section>
      <section id="section-3" className="scroll-mt-24">
        <SectionContainer
          title="Quick Take"
          icon={ScrollIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={borderColor}
        >
          <h2>Design</h2>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
          <p>
            The design included: A public plaza with inlaid poetry in multiple
            Chinese dialects An interactive light sculpture referencing
            traditional paper lanterns Ground murals co-designed with local
            youth centers QR-linked stories embedded in public furniture
            Accessibility, maintenance, and placemaking were central. We
            balanced visual richness with practical durability.
          </p>
        </SectionContainer>
      </section>
      <section id="section-4" className="scroll-mt-24">
        <SectionContainer
          title="Quick Take"
          icon={ScrollIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={borderColor}
        >
          <h2>Design</h2>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
        </SectionContainer>
      </section>
      <section id="section-5" className="scroll-mt-24">
        <SectionContainer
          title="Quick Take"
          icon={ScrollIcon}
          textColorClass={theme.textColorClass}
          bgColorClass={theme.bgColorClass}
          borderColor={borderColor}
        >
          <h2>Design</h2>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
          <p>
            The project became a cultural landmark. Tourists and residents alike
            engaged with the stories woven into the space. A local newspaper
            called it “a love letter in bricks and light.” It also sparked
            policy conversations around heritage zoning and community-led
            urbanism.
          </p>
        </SectionContainer>
      </section>
    </article>
  );
}
