// case-studies/project-two.tsx
import { useLighting } from "../../context/LightingContext";
import { useTheme } from "next-themes";
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";

export default function CaseStudyFive() {
  const { resolvedTheme } = useTheme();
  const { activeIndex } = useActiveProject();

  const { getTextColorClass } = useLighting();
  const textColorClass = getTextColorClass(
    resolvedTheme || "light",
    projects[activeIndex].textColor,
  );
  return (
    <article>
      <section id="section-1" className="scroll-mt-24">
        <h2
          className={`font-sans text-3xl font-semibold ${textColorClass} leading-loose`}
        >
          My Resume
        </h2>
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>{" "}
        <p>
          In a rural village facing economic decline, residents rallied around a
          local natural site—a small but beautiful waterfall—as a symbol of
          renewal. We partnered with community leaders to redesign the
          surrounding public space, making it accessible, inviting, and deeply
          local.
        </p>
      </section>
      <section id="section-2" className="scroll-mt-24">
        <h2>Research</h2>
        <p>
          We conducted participatory workshops with residents, elders, and
          students. Themes emerged: pride in the landscape, memories of
          childhood visits, and a desire for public space to foster
          intergenerational connection. We mapped informal paths, usage
          patterns, and seasonal changes. Environmental concerns around erosion
          and runoff were also key.
        </p>{" "}
        <p>
          We conducted participatory workshops with residents, elders, and
          students. Themes emerged: pride in the landscape, memories of
          childhood visits, and a desire for public space to foster
          intergenerational connection. We mapped informal paths, usage
          patterns, and seasonal changes. Environmental concerns around erosion
          and runoff were also key.
        </p>{" "}
        <p>
          We conducted participatory workshops with residents, elders, and
          students. Themes emerged: pride in the landscape, memories of
          childhood visits, and a desire for public space to foster
          intergenerational connection. We mapped informal paths, usage
          patterns, and seasonal changes. Environmental concerns around erosion
          and runoff were also key.
        </p>{" "}
        <p>
          We conducted participatory workshops with residents, elders, and
          students. Themes emerged: pride in the landscape, memories of
          childhood visits, and a desire for public space to foster
          intergenerational connection. We mapped informal paths, usage
          patterns, and seasonal changes. Environmental concerns around erosion
          and runoff were also key.
        </p>{" "}
        <p>
          We conducted participatory workshops with residents, elders, and
          students. Themes emerged: pride in the landscape, memories of
          childhood visits, and a desire for public space to foster
          intergenerational connection. We mapped informal paths, usage
          patterns, and seasonal changes. Environmental concerns around erosion
          and runoff were also key.
        </p>{" "}
        <p>
          We conducted participatory workshops with residents, elders, and
          students. Themes emerged: pride in the landscape, memories of
          childhood visits, and a desire for public space to foster
          intergenerational connection. We mapped informal paths, usage
          patterns, and seasonal changes. Environmental concerns around erosion
          and runoff were also key.
        </p>{" "}
        <p>
          We conducted participatory workshops with residents, elders, and
          students. Themes emerged: pride in the landscape, memories of
          childhood visits, and a desire for public space to foster
          intergenerational connection. We mapped informal paths, usage
          patterns, and seasonal changes. Environmental concerns around erosion
          and runoff were also key.
        </p>{" "}
        <p>
          We conducted participatory workshops with residents, elders, and
          students. Themes emerged: pride in the landscape, memories of
          childhood visits, and a desire for public space to foster
          intergenerational connection. We mapped informal paths, usage
          patterns, and seasonal changes. Environmental concerns around erosion
          and runoff were also key.
        </p>{" "}
        <p>
          We conducted participatory workshops with residents, elders, and
          students. Themes emerged: pride in the landscape, memories of
          childhood visits, and a desire for public space to foster
          intergenerational connection. We mapped informal paths, usage
          patterns, and seasonal changes. Environmental concerns around erosion
          and runoff were also key.
        </p>
      </section>
      <section id="section-3" className="scroll-mt-24">
        <h2>Design</h2>
        <p>
          The final design included: A low-impact trail with storytelling signs
          written by locals A small amphitheater for events and gatherings Stone
          seating and wooden bridges made by local artisans Plantings of native
          species co-designed with schoolchildren We avoided imposing “outside”
          aesthetics. Every element was co-designed and approved through
          community review.
        </p>{" "}
        <p>
          The final design included: A low-impact trail with storytelling signs
          written by locals A small amphitheater for events and gatherings Stone
          seating and wooden bridges made by local artisans Plantings of native
          species co-designed with schoolchildren We avoided imposing “outside”
          aesthetics. Every element was co-designed and approved through
          community review.
        </p>{" "}
        <p>
          The final design included: A low-impact trail with storytelling signs
          written by locals A small amphitheater for events and gatherings Stone
          seating and wooden bridges made by local artisans Plantings of native
          species co-designed with schoolchildren We avoided imposing “outside”
          aesthetics. Every element was co-designed and approved through
          community review.
        </p>{" "}
        <p>
          The final design included: A low-impact trail with storytelling signs
          written by locals A small amphitheater for events and gatherings Stone
          seating and wooden bridges made by local artisans Plantings of native
          species co-designed with schoolchildren We avoided imposing “outside”
          aesthetics. Every element was co-designed and approved through
          community review.
        </p>{" "}
        <p>
          The final design included: A low-impact trail with storytelling signs
          written by locals A small amphitheater for events and gatherings Stone
          seating and wooden bridges made by local artisans Plantings of native
          species co-designed with schoolchildren We avoided imposing “outside”
          aesthetics. Every element was co-designed and approved through
          community review.
        </p>{" "}
        <p>
          The final design included: A low-impact trail with storytelling signs
          written by locals A small amphitheater for events and gatherings Stone
          seating and wooden bridges made by local artisans Plantings of native
          species co-designed with schoolchildren We avoided imposing “outside”
          aesthetics. Every element was co-designed and approved through
          community review.
        </p>{" "}
        <p>
          The final design included: A low-impact trail with storytelling signs
          written by locals A small amphitheater for events and gatherings Stone
          seating and wooden bridges made by local artisans Plantings of native
          species co-designed with schoolchildren We avoided imposing “outside”
          aesthetics. Every element was co-designed and approved through
          community review.
        </p>{" "}
        <p>
          The final design included: A low-impact trail with storytelling signs
          written by locals A small amphitheater for events and gatherings Stone
          seating and wooden bridges made by local artisans Plantings of native
          species co-designed with schoolchildren We avoided imposing “outside”
          aesthetics. Every element was co-designed and approved through
          community review.
        </p>{" "}
        <p>
          The final design included: A low-impact trail with storytelling signs
          written by locals A small amphitheater for events and gatherings Stone
          seating and wooden bridges made by local artisans Plantings of native
          species co-designed with schoolchildren We avoided imposing “outside”
          aesthetics. Every element was co-designed and approved through
          community review.
        </p>{" "}
      </section>{" "}
      <section id="section-4" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
      </section>{" "}
      <section id="section-5" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
      </section>{" "}
      <section id="section-6" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
        <p>
          The space reopened with a village celebration. Foot traffic increased,
          and a nearby cafe reopened to serve visitors. The project was
          highlighted in a regional planning journal as a model for
          participatory design. Most importantly, locals described the space as
          “ours”—a small but powerful shift.
        </p>
      </section>
    </article>
  );
}
