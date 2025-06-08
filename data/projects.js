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
    title: "Haichao Wang",
    description: "I am a designer with a diverse background.",
    glyph: ProjectOneLogo,
    slug: "case-study-one",
    image: "/images/project-1.jpg",
    button: "More About Me",
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
    description: "Democratizing quantitative UX research.",
    glyph: ProjectOneLogo,
    slug: "case-study-two",
    button: "Look Inside",
    image: "/images/project-1.jpg",
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
    description:
      "Helping independent filmmakers bring their story to life. Helping independent filmmakers bring their story to life. Helping independent filmmakers bring their story to life. Helping independent filmmakers bring their story to life. Helping independent filmmakers bring their story to life.",
    glyph: ProjectOneLogo,
    slug: "case-study-three",
    button: "Look Inside",
    image: "/images/project-1.jpg",
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
    description: "HoloLens",
    glyph: ProjectOneLogo,
    slug: "case-study-four",
    button: "Look Inside",
    image: "/images/project-1.jpg",
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
    description: "Community",
    glyph: ProjectOneLogo,
    slug: "case-study-five",
    button: "Look Inside",
    image: "/images/project-1.jpg",
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
    description: "Chinatown",
    glyph: ProjectOneLogo,
    slug: "case-study-six",
    button: "Look Inside",
    image: "/images/project-1.jpg",
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
