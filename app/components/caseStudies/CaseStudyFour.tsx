/* eslint-disable react/no-unescaped-entities */
// case-studies/project-two.tsx
import projects from "@/data/projects";
import { useActiveProject } from "@/app/context/ActiveProjectContext";
import { useProjectTheme } from "@/hooks/useProjectTheme";

export default function CaseStudyFour() {
  const { activeIndex } = useActiveProject();

  const theme = useProjectTheme(projects[activeIndex].id);

  return (
    <article>
      <section id="section-1" className="scroll-mt-24">
        <h2
          className={`font-sans text-3xl font-semibold ${theme.textColorClass} leading-loose`}
        >
          My Resume
        </h2>{" "}
        <p>
          NASA challenged student teams to imagine how AR could augment
          spacesuits for lunar and Martian missions. Our team—a mix of
          engineers, designers, and scientists—tackled this frontier: what
          should astronauts see in their HUDs while exploring alien terrain?
        </p>{" "}
        <p>
          NASA challenged student teams to imagine how AR could augment
          spacesuits for lunar and Martian missions. Our team—a mix of
          engineers, designers, and scientists—tackled this frontier: what
          should astronauts see in their HUDs while exploring alien terrain?
        </p>{" "}
        <p>
          NASA challenged student teams to imagine how AR could augment
          spacesuits for lunar and Martian missions. Our team—a mix of
          engineers, designers, and scientists—tackled this frontier: what
          should astronauts see in their HUDs while exploring alien terrain?
        </p>{" "}
        <p>
          NASA challenged student teams to imagine how AR could augment
          spacesuits for lunar and Martian missions. Our team—a mix of
          engineers, designers, and scientists—tackled this frontier: what
          should astronauts see in their HUDs while exploring alien terrain?
        </p>{" "}
        <p>
          NASA challenged student teams to imagine how AR could augment
          spacesuits for lunar and Martian missions. Our team—a mix of
          engineers, designers, and scientists—tackled this frontier: what
          should astronauts see in their HUDs while exploring alien terrain?
        </p>{" "}
        <p>
          NASA challenged student teams to imagine how AR could augment
          spacesuits for lunar and Martian missions. Our team—a mix of
          engineers, designers, and scientists—tackled this frontier: what
          should astronauts see in their HUDs while exploring alien terrain?
        </p>{" "}
        <p>
          NASA challenged student teams to imagine how AR could augment
          spacesuits for lunar and Martian missions. Our team—a mix of
          engineers, designers, and scientists—tackled this frontier: what
          should astronauts see in their HUDs while exploring alien terrain?
        </p>
      </section>
      <section id="section-2" className="scroll-mt-24">
        <h2>Research</h2>
        <p>
          We started by studying existing EVA procedures, astronaut interviews,
          and NASA’s Artemis mission goals. Key pain points included situational
          awareness, memory load, and navigation. We also consulted AR usability
          studies in extreme environments. We ran low-fidelity field simulations
          using AR headsets in outdoor settings to replicate astronaut tasks
          like sample collection and terrain scanning.
        </p>{" "}
        <p>
          We started by studying existing EVA procedures, astronaut interviews,
          and NASA’s Artemis mission goals. Key pain points included situational
          awareness, memory load, and navigation. We also consulted AR usability
          studies in extreme environments. We ran low-fidelity field simulations
          using AR headsets in outdoor settings to replicate astronaut tasks
          like sample collection and terrain scanning.
        </p>{" "}
        <p>
          We started by studying existing EVA procedures, astronaut interviews,
          and NASA’s Artemis mission goals. Key pain points included situational
          awareness, memory load, and navigation. We also consulted AR usability
          studies in extreme environments. We ran low-fidelity field simulations
          using AR headsets in outdoor settings to replicate astronaut tasks
          like sample collection and terrain scanning.
        </p>{" "}
        <p>
          We started by studying existing EVA procedures, astronaut interviews,
          and NASA’s Artemis mission goals. Key pain points included situational
          awareness, memory load, and navigation. We also consulted AR usability
          studies in extreme environments. We ran low-fidelity field simulations
          using AR headsets in outdoor settings to replicate astronaut tasks
          like sample collection and terrain scanning.
        </p>{" "}
        <p>
          We started by studying existing EVA procedures, astronaut interviews,
          and NASA’s Artemis mission goals. Key pain points included situational
          awareness, memory load, and navigation. We also consulted AR usability
          studies in extreme environments. We ran low-fidelity field simulations
          using AR headsets in outdoor settings to replicate astronaut tasks
          like sample collection and terrain scanning.
        </p>{" "}
        <p>
          We started by studying existing EVA procedures, astronaut interviews,
          and NASA’s Artemis mission goals. Key pain points included situational
          awareness, memory load, and navigation. We also consulted AR usability
          studies in extreme environments. We ran low-fidelity field simulations
          using AR headsets in outdoor settings to replicate astronaut tasks
          like sample collection and terrain scanning.
        </p>
      </section>
      <section id="section-3" className="scroll-mt-24">
        <h2>Design</h2>
        <p>
          Our system focused on four key features: Geospatial Awareness:
          real-time path mapping and waypoint marking Task Guidance: visual
          instructions synced with mission protocols Environmental Alerts:
          on-HUD hazard cues (e.g. radiation zones) Team Comms: minimalist
          indicators of other astronauts' positions We used HoloLens 2 as a
          development platform. Design focused on minimizing cognitive load and
          ensuring info was glanceable. Voice and gesture controls were
          optimized for gloves and limited dexterity.
        </p>{" "}
        <p>
          Our system focused on four key features: Geospatial Awareness:
          real-time path mapping and waypoint marking Task Guidance: visual
          instructions synced with mission protocols Environmental Alerts:
          on-HUD hazard cues (e.g. radiation zones) Team Comms: minimalist
          indicators of other astronauts' positions We used HoloLens 2 as a
          development platform. Design focused on minimizing cognitive load and
          ensuring info was glanceable. Voice and gesture controls were
          optimized for gloves and limited dexterity.
        </p>{" "}
        <p>
          Our system focused on four key features: Geospatial Awareness:
          real-time path mapping and waypoint marking Task Guidance: visual
          instructions synced with mission protocols Environmental Alerts:
          on-HUD hazard cues (e.g. radiation zones) Team Comms: minimalist
          indicators of other astronauts' positions We used HoloLens 2 as a
          development platform. Design focused on minimizing cognitive load and
          ensuring info was glanceable. Voice and gesture controls were
          optimized for gloves and limited dexterity.
        </p>{" "}
        <p>
          Our system focused on four key features: Geospatial Awareness:
          real-time path mapping and waypoint marking Task Guidance: visual
          instructions synced with mission protocols Environmental Alerts:
          on-HUD hazard cues (e.g. radiation zones) Team Comms: minimalist
          indicators of other astronauts' positions We used HoloLens 2 as a
          development platform. Design focused on minimizing cognitive load and
          ensuring info was glanceable. Voice and gesture controls were
          optimized for gloves and limited dexterity.
        </p>{" "}
        <p>
          Our system focused on four key features: Geospatial Awareness:
          real-time path mapping and waypoint marking Task Guidance: visual
          instructions synced with mission protocols Environmental Alerts:
          on-HUD hazard cues (e.g. radiation zones) Team Comms: minimalist
          indicators of other astronauts' positions We used HoloLens 2 as a
          development platform. Design focused on minimizing cognitive load and
          ensuring info was glanceable. Voice and gesture controls were
          optimized for gloves and limited dexterity.
        </p>{" "}
        <p>
          Our system focused on four key features: Geospatial Awareness:
          real-time path mapping and waypoint marking Task Guidance: visual
          instructions synced with mission protocols Environmental Alerts:
          on-HUD hazard cues (e.g. radiation zones) Team Comms: minimalist
          indicators of other astronauts' positions We used HoloLens 2 as a
          development platform. Design focused on minimizing cognitive load and
          ensuring info was glanceable. Voice and gesture controls were
          optimized for gloves and limited dexterity.
        </p>
      </section>
      <section id="section-4" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
      </section>{" "}
      <section id="section-5" className="scroll-mt-24">
        <h2>Outcome</h2>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
        <p>
          Our concept placed in the top 5 nationally. NASA judges commended our
          integration of technical realism and UX detail. Our demo video and
          interface design were featured at a space tech symposium. Several
          elements informed ongoing HCI research in extreme environments.
        </p>
      </section>{" "}
    </article>
  );
}
