// app/data/projects.js
import ProjectOneLogo from "../app/icons/ProjectOneLogo";
import ArcheryTarget from "../app/icons/ArcheryTarget";

import TiedScroll from "../app/icons/TiedScroll";
import Spyglass from "../app/icons/Spyglass";
import Enlightenment from "../app/icons/Enlightenment";
import OnTarget from "../app/icons/OnTarget";
import PocketBow from "../app/icons/PocketBow";

const projects = [
  {
    id: "project-1",
    slug: "case-study-one",
    title: "Haichao Wang",
    tagline: "Human-Centered Designer with 10 Years of Experience",
    tags: ["Designer", "Researcher", "Builder"],
    description:
      "My expertise ranges across design, research, and project management. I have worked on everything from public initiatives deeply rooted in stakeholder engagement, to enterprise software aiding complex workflows. The throughline of all my work is a commitment to solving real problems for real people.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    image: "/images/project-1.jpg",
    button: "More About Me",
    textColor: "intro",
    bgColor: "introBackground",
    glyph: ProjectOneLogo,
    sections: [
      { id: "section-1", label: "My Resume", icon: TiedScroll },
      { id: "section-2", label: "Problem", icon: Spyglass },
      { id: "section-3", label: "Goal", icon: ArcheryTarget },
      { id: "section-4", label: "Action", icon: PocketBow },
      { id: "section-5", label: "Result", icon: OnTarget },
      { id: "section-6", label: "Reflection", icon: Enlightenment },
    ],
  },
  {
    id: "project-2",
    slug: "case-study-two",
    title: "Flux",
    tagline: "Democratizing quantitative UX research",
    tags: ["Quantitative UX", "B2B SaaS", "Startup", "Data Visualization"],
    description:
      "I co-founded a company with a mission to unlock rigorous quantitative insights for every product team. Our products enables everyone, not just data scientists and quantitative researchers, to test and analyze their design prototypes and obtain actionable data-driven insights.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    image: "/images/project-1.jpg",
    button: "Look Inside",
    textColor: "flux",
    bgColor: "fluxBackground",
    glyph: ProjectOneLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: TiedScroll },
      { id: "section-2", label: "Problem", icon: Spyglass },
      { id: "section-3", label: "Goal", icon: ArcheryTarget },
      { id: "section-4", label: "Action", icon: PocketBow },
      { id: "section-5", label: "Result", icon: OnTarget },
      { id: "section-6", label: "Reflection", icon: Enlightenment },
    ],
  },
  {
    id: "project-3",
    slug: "case-study-three",
    title: "Fantail",
    tagline: "Empowering filmmakers to bring their stories to life",
    tags: ["Generative AI", "Empowering Creatives", "Startup"],
    description:
      "Incubated during my time at University of Washington, Fantail is an AI-powered story development platform that helps filmmakers brainstorm, organize, storyboard, and pitch their projects.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/project-1.jpg",
    textColor: "fantail",
    bgColor: "fantailBackground",
    glyph: ProjectOneLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: TiedScroll },
      { id: "section-2", label: "Problem", icon: Spyglass },
      { id: "section-3", label: "Goal", icon: ArcheryTarget },
      { id: "section-4", label: "Action", icon: PocketBow },
      { id: "section-5", label: "Result", icon: OnTarget },
      { id: "section-6", label: "Reflection", icon: Enlightenment },
    ],
  },
  {
    id: "project-4",
    slug: "case-study-four",
    title: "Astrohuskies",
    tagline: "Building AR interfaces for next gen NASA missions",
    tags: ["Augmented Reality", "Next Gen NASA Spacesuits", "Artemis Program"],
    description:
      "The next generation of lunar and Mars missions call for interfaces that can effectively relay information and aid extra-vehicular missions on alien terrains. Our team went on to become a finalist in NASA's 2023 SUITS challenge and tested our prototype with astronauts and engineers at the Johnson Space Center.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/project-1.jpg",
    textColor: "suits",
    bgColor: "suitsBackground",
    glyph: ProjectOneLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: TiedScroll },
      { id: "section-2", label: "Problem", icon: Spyglass },
      { id: "section-3", label: "Goal", icon: ArcheryTarget },
      { id: "section-4", label: "Action", icon: PocketBow },
      { id: "section-5", label: "Result", icon: OnTarget },
      { id: "section-6", label: "Reflection", icon: Enlightenment },
    ],
  },
  {
    id: "project-5",
    slug: "case-study-five",
    title: "Wolcott Falls",
    tagline: "Co-designing a community space for a small rural New York town",
    tags: ["Co-Design", "Stakeholder Management", "Environmental Justice"],
    description:
      "I implemented a community-driven project that laid out a vision for the urban core of Wolcott, NY that promoted local pride, urban design, and watershed protection. Funded by the National Oceanic and Atmospheric Administration (NOAA).",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/project-1.jpg",
    textColor: "wolcott",
    bgColor: "wolcottBackground",
    glyph: ProjectOneLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: TiedScroll },
      { id: "section-2", label: "Problem", icon: Spyglass },
      { id: "section-3", label: "Goal", icon: ArcheryTarget },
      { id: "section-4", label: "Action", icon: PocketBow },
      { id: "section-5", label: "Result", icon: OnTarget },
      { id: "section-6", label: "Reflection", icon: Enlightenment },
    ],
  },
  {
    id: "project-6",
    slug: "case-study-six",
    title: "The Ribbon",
    tagline:
      "Telling the story of an ethnic enclave through narrative landscape architecture",
    tags: ["Designer", "Researcher", "Entrepreneur"],
    description:
      "This year-long project was a collaboration with Massuetts Institute of Technology, the Boston Parks and Recreation Department, and the Boston Chinatown Neighborhood Association. I conducted extensive research and created a series of design proposals which were partially implemented.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/project-1.jpg",
    textColor: "chinatown",
    bgColor: "chinatownBackground",
    glyph: ProjectOneLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: TiedScroll },
      { id: "section-2", label: "Problem", icon: Spyglass },
      { id: "section-3", label: "Goal", icon: ArcheryTarget },
      { id: "section-4", label: "Action", icon: PocketBow },
      { id: "section-5", label: "Result", icon: OnTarget },
      { id: "section-6", label: "Reflection", icon: Enlightenment },
    ],
  },
];

export default projects;
