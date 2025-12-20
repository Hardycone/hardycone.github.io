// app/data/projects.js
import React from "react";
import ProjectOneLogo from "../app/icons/ProjectOneLogo";
import ProjectTwoLogo from "../app/icons/ProjectTwoLogo";
import ProjectFourLogo from "../app/icons/ProjectFourLogo";
import ProjectFiveLogo from "../app/icons/ProjectFiveLogo";

export interface ProjectSection {
  id: string;
  label: string;
  icon: string;
}

export interface Project {
  id: string;
  slug: string;
  role?: string;
  title: string;
  tagline?: string;
  tags?: string[];
  description?: string;
  bullets?: string[];
  image: string;
  button: string;
  textColor: string;
  bgColor: string;
  glyph: React.ElementType | Record<string, unknown>;
  sections: ProjectSection[];
}

const projects: Project[] = [
  {
    id: "intro",
    slug: "case-study-one",
    role: "human-centered designer",
    title: "About Me",
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
      { id: "section-1", label: "My Resume", icon: "ScrollIcon" },
      { id: "section-2", label: "Problem", icon: "PuzzlePieceIcon" },
      { id: "section-3", label: "Goal", icon: "TargetIcon" },
      { id: "section-4", label: "Action", icon: "PersonSimpleRunIcon" },
      { id: "section-5", label: "Result", icon: "PresentationChartIcon" },
      { id: "section-6", label: "Reflection", icon: "BrainIcon" },
    ],
  },
  {
    id: "flux",
    slug: "case-study-two",
    title: "Flux",
    role: "product builder",
    tagline: "Democratizing quantitative UX research",
    tags: ["Quantitative UX", "B2B SaaS", "Startup", "Data Visualization"],
    description:
      "I co-founded a company on a mission to demystify and democratize rigorous quantitative UX insights for all product teams. This case study recounts how we went from 0 to 1 with a design-forward approach.",
    bullets: ["Duration: 2 year", "Role: Co-founder"],
    image: "/images/hero-flux.jpg",
    button: "Look Inside",
    textColor: "flux",
    bgColor: "fluxBackground",
    glyph: ProjectTwoLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      { id: "section-2", label: 'The "Zero"', icon: "SealQuestionIcon" },
      {
        id: "section-3",
        label: "Research & Discovery",
        icon: "MagnifyingGlassIcon",
      },
      {
        id: "section-4",
        label: "Ideation & Exploration",
        icon: "LightbulbFilamentIcon",
      },
      { id: "section-5", label: 'The "One"', icon: "RocketLaunchIcon" },
      {
        id: "section-6",
        label: "Impact & Reflection",
        icon: "PresentationChartIcon",
      },
    ],
  },
  {
    id: "fantail",
    slug: "case-study-three",
    role: "creative ally",
    title: "Fantail",
    tagline: "Empowering filmmakers to bring their stories to life",
    tags: ["Generative AI", "Empowering Creatives", "Startup"],
    description:
      "Incubated during my time at University of Washington, Fantail is an AI-powered story development platform that helps filmmakers brainstorm, organize, storyboard, and pitch their projects.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/hero-fantail.png",
    textColor: "fantail",
    bgColor: "fantailBackground",
    glyph: ProjectOneLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      { id: "section-2", label: "Problem", icon: "PuzzlePieceIcon" },
      { id: "section-3", label: "Goal", icon: "TargetIcon" },
      { id: "section-4", label: "Action", icon: "PersonSimpleRunIcon" },
      { id: "section-5", label: "Result", icon: "PresentationChartIcon" },
      { id: "section-6", label: "Reflection", icon: "BrainIcon" },
    ],
  },
  {
    id: "suits",
    slug: "case-study-four",
    role: "tech enthusiast",
    title: "Astrohuskies",
    tagline: "Building AR interfaces for next gen NASA missions",
    tags: ["Augmented Reality", "Next Gen NASA Spacesuits", "Artemis Program"],
    description:
      "The next generation of lunar and Mars missions call for interfaces that can effectively relay information and aid extra-vehicular missions on alien terrains. Our team went on to become a finalist in NASA's 2023 SUITS challenge and tested our prototype with astronauts and engineers at the Johnson Space Center.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/hero-fantail.png",
    textColor: "suits",
    bgColor: "suitsBackground",
    glyph: ProjectFourLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      { id: "section-2", label: "Problem", icon: "PuzzlePieceIcon" },
      { id: "section-3", label: "Goal", icon: "TargetIcon" },
      { id: "section-4", label: "Action", icon: "PersonSimpleRunIcon" },
      { id: "section-5", label: "Result", icon: "PresentationChartIcon" },
      { id: "section-6", label: "Reflection", icon: "BrainIcon" },
    ],
  },
  {
    id: "wolcott",
    slug: "case-study-five",
    role: "stakeholder manager",
    title: "Wolcott Falls",
    tagline: "Co-designing a community space for a small rural New York town",
    tags: ["Co-Design", "Stakeholder Management", "Environmental Justice"],
    description:
      "I implemented a community-driven project that laid out a vision for the urban core of Wolcott, NY that promoted local pride, urban design, and watershed protection. Funded by the National Oceanic and Atmospheric Administration (NOAA).",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/hero-wolcott.jpg",
    textColor: "wolcott",
    bgColor: "wolcottBackground",
    glyph: ProjectFiveLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      { id: "section-2", label: "Problem", icon: "PuzzlePieceIcon" },
      { id: "section-3", label: "Goal", icon: "TargetIcon" },
      { id: "section-4", label: "Action", icon: "PersonSimpleRunIcon" },
      { id: "section-5", label: "Result", icon: "PresentationChartIcon" },
      { id: "section-6", label: "Reflection", icon: "BrainIcon" },
    ],
  },
  {
    id: "chinatown",
    slug: "case-study-six",
    role: "community builder",
    title: "The Ribbon",
    tagline:
      "Telling the story of an ethnic enclave through narrative landscape architecture",
    tags: ["Designer", "Researcher", "Entrepreneur"],
    description:
      "I studied Boston's Chinatown and delievered a suite of design recommendations to key stakeholders that aimed at promoting the neighorhood's cultural identity. Several of my proposals were later partially implemented.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/hero-ribbon.png",
    textColor: "chinatown",
    bgColor: "chinatownBackground",
    glyph: ProjectOneLogo,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      { id: "section-2", label: "Problem", icon: "PuzzlePieceIcon" },
      { id: "section-3", label: "Goal", icon: "TargetIcon" },
      { id: "section-4", label: "Action", icon: "PersonSimpleRunIcon" },
      { id: "section-5", label: "Result", icon: "PresentationChartIcon" },
      { id: "section-6", label: "Reflection", icon: "BrainIcon" },
    ],
  },
];

export default projects;
