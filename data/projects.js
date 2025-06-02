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
    title: "About Me",
    description:
      "I guess I'm a designer. I'm not sure anymore. What is design anyway? Questions such as this keep my brain busy. Not because it's a particularly hard question, but because my brain doesn't work very well. I'm typing a lot here just to see how it looks. I mean I know it would increase the size of the parent element because it's set to flex. But does the height grow in both direction or just below? I could probably just go check real quick. But I keep forgetting so I'll just do this instead. A second benefit of doing this is so that I could have a larger title card as a prop. So yeah I don't see any reason not to just type a lot of random words in here. Let's go!",
    glyph: ProjectOneLogo,
    slug: "case-study-one",
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
    description: "Helping independent filmmakers bring their story to life.",
    glyph: ProjectOneLogo,
    slug: "case-study-three",
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
