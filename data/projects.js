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
    title: "I'm Haichao Wang",
    tagline: "Human-Centered Designer",
    description:
      "Thank you for visiting! I have 10 years of experience across design, research, and leadership. My work spans from public initiatives deeply rooted in community stakeholder engagement to enterprise software aiding complex workflows.",
    glyph: ProjectOneLogo,
    image: "/images/project-1.jpg",
    button: "More About Me",
    textColor: "intro",
    bgColor: "introBackground",
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
    id: "project-2",
    title: "Flux",
    tagline: "Democratizing quantitative UX research",
    description: "Unlocking the rigor of quantitative insights for everyone.",
    glyph: ProjectOneLogo,
    slug: "case-study-two",
    button: "Look Inside",
    image: "/images/project-1.jpg",
    textColor: "flux",
    bgColor: "fluxBackground",
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
    title: "Fantail",
    tagline: "Empowering filmmakers to bring their stories to life",
    description:
      "Helping independent filmmakers bring their story to life. Helping independent filmmakers bring their story to life. Helping independent filmmakers bring their story to life. Helping independent filmmakers bring their story to life. Helping independent filmmakers bring their story to life.",
    glyph: ProjectOneLogo,
    slug: "case-study-three",
    button: "Look Inside",
    image: "/images/project-1.jpg",
    textColor: "fantail",
    bgColor: "fantailBackground",
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
    title: "AR Stuff",
    tagline: "",
    description: "HoloLens",
    glyph: ProjectOneLogo,
    slug: "case-study-four",
    button: "Look Inside",
    image: "/images/project-1.jpg",
    textColor: "suits",
    bgColor: "suitsBackground",
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
    title: "Co-Design",
    tagline: "",
    description: "Community",
    glyph: ProjectOneLogo,
    slug: "case-study-five",
    button: "Look Inside",
    image: "/images/project-1.jpg",
    textColor: "wolcott",
    bgColor: "wolcottBackground",
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
    title: "Boston",
    tagline: "",
    description: "Chinatown",
    glyph: ProjectOneLogo,
    slug: "case-study-six",
    button: "Look Inside",
    image: "/images/project-1.jpg",
    textColor: "chinatown",
    bgColor: "chinatownBackground",
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
