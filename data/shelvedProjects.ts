import glyphSixAnimation from "../public/animations/glyph-six.json";
import type { GlyphAnimationData, Project } from "./projects";

const shelvedProjects: Project[] = [
  {
    id: "chinatown",
    slug: "case-study-six",
    role: "with deep research.",
    title: "The Ribbon",
    tagline:
      "Telling the story of an ethnic enclave through narrative landscape architecture",
    tags: [
      { label: "Architecture", icon: "BuildingsIcon" },
      { label: "Stakeholders", icon: "HandshakeIcon" },
    ],
    description:
      "I studied Boston's Chinatown and delievered a suite of design recommendations to key stakeholders that aimed at promoting the neighorhood's cultural identity. Several of my proposals were later partially implemented.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/hero-ribbon.png",
    textColor: "chinatown",
    bgColor: "chinatownBackground",
    glyphAnimation: glyphSixAnimation as GlyphAnimationData,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      { id: "section-2", label: "Problem", icon: "PuzzlePieceIcon" },
      { id: "section-3", label: "Goal", icon: "TargetIcon" },
      { id: "section-4", label: "Action", icon: "PersonSimpleRunIcon" },
      { id: "section-5", label: "Result", icon: "PresentationChartIcon" },
      { id: "section-6", label: "Reflection", icon: "BrainIcon" },
    ],
    externalLinks: [
      { label: "GitHub", url: "https://google.com", icon: "GithubLogoIcon" },
      { label: "Figma", url: "https://google.com", icon: "FigmaLogoIcon" },
    ],
  },
];

export default shelvedProjects;
