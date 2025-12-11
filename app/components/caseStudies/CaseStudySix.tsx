// case-studies/project-two.tsx
import { useLighting } from "../../context/LightingContext";
import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import {
  ScrollIcon,
  PuzzlePieceIcon,
  TargetIcon,
  PersonSimpleRunIcon,
  PresentationChartIcon,
} from "@phosphor-icons/react";
import {
  MotionValue,
  useTransform,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface CaseStudySixProps {
  scrollY: MotionValue<number>;
}
export default function CaseStudySix({ scrollY }: CaseStudySixProps) {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useActiveProject();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });
  const x = useTransform(smoothScrollYProgress, [0, 1], ["0vw", "-200vw"]);

  const { getTextColorClass } = useLighting();
  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );

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
        <motion.div
          className="mb-24 flex flex-col rounded-[44px] border bg-background/20 p-6 text-foreground backdrop-blur-xl dark:bg-dark-background/10 dark:text-dark-foreground"
          style={{ borderColor }}
        >
          <div className="mb-6 flex items-center gap-2">
            <ScrollIcon
              size={32}
              weight="duotone"
              className={`${textColorClass}`}
            />
            <h2
              className={`font-sans text-4xl font-semibold ${textColorClass}`}
            >
              Quick Take
            </h2>
          </div>
          <div className="mb-6 h-[1px] w-full rounded-full bg-chinatown/50 dark:bg-dark-chinatown/50" />
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
          >
            <Image
              src="/images/S-Boston-025.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </section>
      <section id="section-2" className="scroll-mt-24">
        <h2>Research</h2>
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>{" "}
        <p>
          We worked with historians, artists, and Chinatown residents. Key
          themes included resistance to gentrification, pride in immigrant
          stories, and a desire for visibility. We documented visual motifs from
          signage, murals, and family shrines. We hosted walking tours and oral
          history sessions that informed the site’s narrative anchors.
        </p>
      </section>
      <section id="section-3" className="scroll-mt-24">
        <h2>Design</h2>
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>{" "}
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>{" "}
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>{" "}
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>{" "}
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>{" "}
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>{" "}
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>{" "}
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>{" "}
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>{" "}
        <p>
          The design included: A public plaza with inlaid poetry in multiple
          Chinese dialects An interactive light sculpture referencing
          traditional paper lanterns Ground murals co-designed with local youth
          centers QR-linked stories embedded in public furniture Accessibility,
          maintenance, and placemaking were central. We balanced visual richness
          with practical durability.
        </p>
      </section>
      <section id="section-4" className="scroll-mt-24">
        <h2>Design</h2>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
      </section>{" "}
      <section id="section-5" className="scroll-mt-24">
        <h2>Design</h2>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
        <p>
          The project became a cultural landmark. Tourists and residents alike
          engaged with the stories woven into the space. A local newspaper
          called it “a love letter in bricks and light.” It also sparked policy
          conversations around heritage zoning and community-led urbanism.
        </p>
      </section>{" "}
    </article>
  );
}
