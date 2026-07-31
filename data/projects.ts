// app/data/projects.js
import glyphOneAnimation from "../public/animations/glyph-one.json";
import glyphTwoAnimation from "../public/animations/glyph-two.json";
import glyphThreeAnimation from "../public/animations/glyph-three.json";
import glyphFourAnimation from "../public/animations/glyph-four.json";
import glyphFiveAnimation from "../public/animations/glyph-five.json";

export type GlyphAnimationData = {
  op: number;
  [key: string]: unknown;
};

export interface ProjectSection {
  id: string;
  label: string;
  icon: string;
}

export interface Tag {
  label: string;
  icon: string;
}

export interface ExternalLink {
  label: string;
  url: string;
  icon: string;
}

export interface Project {
  id: string;
  slug: string;
  role?: string;
  title: string;
  tagline?: string;
  tags?: Tag[];
  description?: string;
  bullets?: string[];
  image: string;
  button: string;
  textColor: string;
  bgColor: string;
  glyphAnimation: GlyphAnimationData;
  sections: ProjectSection[];
  externalLinks: ExternalLink[];
}

const projects: Project[] = [
  {
    id: "intro",
    slug: "about-me",
    role: "to empower.",
    title: "About Me",
    tagline: "Human-Centered Product Designer with 10 Years of Experience",
    tags: [
      { label: "Designer", icon: "PenNibIcon" },
      { label: "Builder", icon: "WrenchIcon" },
      { label: "Researcher", icon: "MagnifyingGlassIcon" },
    ],
    description:
      " I turn complex problems into usable systems. Across shipped B2B software, mixed reality interfaces, and public-sector design, I’ve led work from research and problem framing through stakeholder alignment, product strategy, and execution.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    image: "/images/project-1.jpg",
    button: "More About Me",
    textColor: "intro",
    bgColor: "introBackground",
    glyphAnimation: glyphOneAnimation as GlyphAnimationData,
    sections: [
      { id: "section-1", label: "My Work", icon: "PathIcon" },
      { id: "section-2", label: "My Qualifications", icon: "CertificateIcon" },
      { id: "section-3", label: "My Interests", icon: "CameraIcon" },
      {
        id: "section-4",
        label: "Let's Chat!",
        icon: "PaperPlaneTiltIcon",
      },
    ],
    externalLinks: [
      {
        label: "Github",
        url: "https://github.com/Hardycone",
        icon: "GithubLogoIcon",
      },
      {
        label: "Finalists in NASA SUITS 2023",
        url: "https://www.linkedin.com/posts/university-of-washington-master-of-human-computer-interaction-design_finalists-in-the-nasa-suits-challenge-activity-7102818439043452928-cooL",
        icon: "FileTextIcon",
      },
      {
        label: "Cultural Landscape Report for Muir Woods National Monument",
        url: "https://www.google.ca/books/edition/Cultural_Landscape_Report_for_Muir_Woods/quMVwkWT9McC?hl=en&gbpv=0",
        icon: "FileTextIcon",
      },
    ],
  },
  {
    id: "flux",
    slug: "flux",
    title: "Flux",
    role: "from 0 to 1.",
    tagline: "Democratizing quantitative UX research",
    tags: [
      { label: "AI", icon: "SparkleIcon" },
      { label: "Startup", icon: "RocketIcon" },
      { label: "Quant UX", icon: "ChartBarIcon" },
      { label: "Data Vis", icon: "ChartLineIcon" },
    ],
    description:
      "I co-founded a company on a mission to demystify and democratize rigorous quantitative UX insights for all product teams. This case study recounts how we went from 0 to 1 with a design-forward approach.",
    bullets: ["Duration: 2 year", "Role: Co-founder"],
    image: "/images/hero-flux.jpg",
    button: "Look Inside",
    textColor: "flux",
    bgColor: "fluxBackground",
    glyphAnimation: glyphTwoAnimation as GlyphAnimationData,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      { id: "section-2", label: 'The "0"', icon: "SealQuestionIcon" },
      {
        id: "section-3",
        label: "The Messy Middle",
        icon: "PuzzlePieceIcon",
      },
      {
        id: "section-4",
        label: 'The "1"',
        icon: "RocketLaunchIcon",
      },
      {
        id: "section-5",
        label: "Outcome & Impact",
        icon: "PresentationChartIcon",
      },
      {
        id: "section-6",
        label: "Reflection",
        icon: "BrainIcon",
      },
    ],
    externalLinks: [
      {
        label: "GitHub",
        url: "https://github.com/Hardycone",
        icon: "GithubLogoIcon",
      },
      { label: "Figma", url: "https://google.com", icon: "FigmaLogoIcon" },
      { label: "Figma", url: "https://google.com", icon: "FigmaLogoIcon" },
      { label: "Figma", url: "https://google.com", icon: "FigmaLogoIcon" },
      { label: "Figma", url: "https://google.com", icon: "FigmaLogoIcon" },
    ],
  },
  {
    id: "fantail",
    slug: "fantail",
    role: "human-centered AI.",
    title: "Fantail",
    tagline: "Empowering filmmakers to bring their stories to life",
    tags: [
      { label: "AI", icon: "SparkleIcon" },
      { label: "Startup", icon: "RocketIcon" },
      { label: "Filmmaking", icon: "FilmSlateIcon" },
    ],
    description:
      "Incubated during my time at University of Washington, Fantail is an AI-powered story development platform that helps filmmakers brainstorm, organize, storyboard, and pitch their projects.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/hero-fantail.png",
    textColor: "fantail",
    bgColor: "fantailBackground",
    glyphAnimation: glyphThreeAnimation as GlyphAnimationData,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      {
        id: "section-2",
        label: 'The "0": Where We Started',
        icon: "SealQuestionIcon",
      },
      { id: "section-3", label: "The Messy Middle", icon: "PuzzlePieceIcon" },
      {
        id: "section-4",
        label: 'The "1": What We Shipped',
        icon: "RocketLaunchIcon",
      },
      {
        id: "section-5",
        label: "Outcome and Impact",
        icon: "PresentationChartIcon",
      },
      { id: "section-6", label: "Reflection", icon: "BrainIcon" },
    ],
    externalLinks: [
      { label: "GitHub", url: "https://google.com", icon: "GithubLogoIcon" },
      { label: "Figma", url: "https://google.com", icon: "FigmaLogoIcon" },
    ],
  },
  {
    id: "suits",
    slug: "nasa-suits",
    role: "next-gen interfaces.",
    title: "Astrohuskies",
    tagline: "Building AR interfaces for next gen NASA missions",
    tags: [
      { label: "XR", icon: "VisorIcon" },
      { label: "Artemis", icon: "PlanetIcon" },
    ],
    description:
      "The next generation of lunar and Mars missions call for interfaces that can effectively relay information and aid extra-vehicular missions on alien terrains. Our team went on to become a finalist in NASA's 2023 SUITS challenge and tested our prototype with NASA engineers at the Johnson Space Center.",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/hero-astrohuskies.jpg",
    textColor: "suits",
    bgColor: "suitsBackground",
    glyphAnimation: glyphFourAnimation as GlyphAnimationData,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      { id: "section-2", label: "Mission", icon: "TargetIcon" },
      { id: "section-3", label: "Research", icon: "MagnifyingGlassIcon" },
      {
        id: "section-4",
        label: "Human-In-The-Loop",
        icon: "PersonSimpleCircleIcon",
      },
      {
        id: "section-5",
        label: "Outcome and Impact",
        icon: "PresentationChartIcon",
      },
      { id: "section-6", label: "Reflection", icon: "BrainIcon" },
    ],
    externalLinks: [
      { label: "GitHub", url: "https://google.com", icon: "GithubLogoIcon" },
      { label: "Figma", url: "https://google.com", icon: "FigmaLogoIcon" },
    ],
  },
  {
    id: "wolcott",
    slug: "wolcott",
    role: "alongside communities.",
    title: "Wolcott Falls",
    tagline: "Co-designing a community space for a rural New York town",
    tags: [
      { label: "Co-Design", icon: "UsersThreeIcon" },
      { label: "Stakeholders", icon: "HandshakeIcon" },
      { label: "Environmental Justice", icon: "FlowerTulipIcon" },
    ],
    description:
      "I implemented a community-driven project that laid out a vision for the urban core of Wolcott, NY that promoted local pride, urban design, and watershed protection. Funded by the National Oceanic and Atmospheric Administration (NOAA).",
    bullets: ["Duration: 1 year", "Collaborators: Team of 12", "Role: Boss"],
    button: "Look Inside",
    image: "/images/hero-wolcott.jpg",
    textColor: "wolcott",
    bgColor: "wolcottBackground",
    glyphAnimation: glyphFiveAnimation as GlyphAnimationData,
    sections: [
      { id: "section-1", label: "Quick Take", icon: "ScrollIcon" },
      { id: "section-2", label: "Problem", icon: "SealQuestionIcon" },
      { id: "section-3", label: "Research", icon: "MagnifyingGlassIcon" },
      { id: "section-4", label: "Exploration", icon: "CompassRoseIcon" },
      {
        id: "section-5",
        label: "Outcome & Impact",
        icon: "PresentationChartIcon",
      },
      { id: "section-6", label: "Reflection", icon: "BrainIcon" },
    ],
    externalLinks: [
      { label: "GitHub", url: "https://google.com", icon: "GithubLogoIcon" },
      { label: "Figma", url: "https://google.com", icon: "FigmaLogoIcon" },
    ],
  },
];

export default projects;
