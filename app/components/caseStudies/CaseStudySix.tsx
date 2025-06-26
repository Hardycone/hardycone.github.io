// case-studies/project-two.tsx
import { useLighting } from "../../context/LightingContext";
import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";

export default function CaseStudySix() {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useActiveProject();

  const { getTextColorClass } = useLighting();
  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );
  return (
    <article>
      {" "}
      <section id="section-1" className="scroll-mt-24">
        <h2
          className={`font-sans text-3xl font-semibold ${textColorClass} leading-loose`}
        >
          My Resume
        </h2>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>{" "}
        <p>
          Boston’s Chinatown is rich with history—but under threat from
          development and erasure. We joined a public design initiative to
          reimagine its streetscapes in ways that honored cultural heritage
          while creating modern, inclusive public space.
        </p>
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
      <section id="section-6" className="scroll-mt-24">
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
      </section>
    </article>
  );
}
