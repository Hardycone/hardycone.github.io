// app/data/projects.js
import ProjectOneLogo from "../app/icons/ProjectOneLogo";
import SectionIconOne from "../app/icons/SectionIconOne";

const projects = [
  {
    id: "project-1",
    title: "About Me",
    description:
      "I guess I'm a designer. I'm not sure anymore. What is design anyway? Questions such as this keep my brain busy. Not because it's a particularly hard question, but because my brain doesn't work very well. I'm typing a lot here just to see how it looks. I mean I know it would increase the size of the parent element because it's set to flex. But does the height grow in both direction or just below? I could probably just go check real quick. But I keep forgetting so I'll just do this instead. A second benefit of doing this is so that I could have a larger title card as a prop. So yeah I don't see any reason not to just type a lot of random words in here. Let's go!",
    glyph: ProjectOneLogo,
    slug: "case-study-one",
    sections: [
      { id: "section-1", label: "Background1", icon: SectionIconOne },
      { id: "section-2", label: "Research1", icon: SectionIconOne },
      { id: "section-3", label: "Design1", icon: SectionIconOne },
      { id: "section-4", label: "Impact1", icon: SectionIconOne },
    ],
  },
  {
    id: "project-2",
    title: "Flux",
    description: "Democratizing quantitative UX research.",
    glyph: ProjectOneLogo,
    slug: "case-study-two",
    sections: [
      { id: "section-1", label: "Background2", icon: SectionIconOne },
      { id: "section-2", label: "Research2", icon: SectionIconOne },
      { id: "section-3", label: "Design2", icon: SectionIconOne },
      { id: "section-4", label: "Impact2", icon: SectionIconOne },
    ],
  },
  {
    id: "project-3",
    title: "Fantail",
    description: "Helping independent filmmakers bring their story to life.",
    glyph: ProjectOneLogo,
    slug: "case-study-three",
    sections: [
      { id: "section-1", label: "Background3", icon: SectionIconOne },
      { id: "section-2", label: "Research3", icon: SectionIconOne },
      { id: "section-3", label: "Design3", icon: SectionIconOne },
      { id: "section-4", label: "Impact3", icon: SectionIconOne },
    ],
  },
  {
    id: "project-4",
    title: "AR Stuff",
    description: "HoloLens",
    glyph: ProjectOneLogo,
    slug: "case-study-four",
    sections: [
      { id: "section-1", label: "Background4", icon: SectionIconOne },
      { id: "section-2", label: "Research4", icon: SectionIconOne },
      { id: "section-3", label: "Design4", icon: SectionIconOne },
      { id: "section-4", label: "Impact4", icon: SectionIconOne },
    ],
  },
  {
    id: "project-5",
    title: "Co-Design",
    description: "Community",
    glyph: ProjectOneLogo,
    slug: "case-study-five",
    sections: [
      { id: "section-1", label: "Background5", icon: SectionIconOne },
      { id: "section-2", label: "Research5", icon: SectionIconOne },
      { id: "section-3", label: "Design5", icon: SectionIconOne },
      { id: "section-4", label: "Impact5", icon: SectionIconOne },
    ],
  },
  {
    id: "project-6",
    title: "Boston",
    description: "Chinatown",
    glyph: ProjectOneLogo,
    slug: "case-study-six",
    sections: [
      { id: "section-1", label: "Background6", icon: SectionIconOne },
      { id: "section-2", label: "Research6", icon: SectionIconOne },
      { id: "section-3", label: "Design6", icon: SectionIconOne },
      { id: "section-4", label: "Impact6", icon: SectionIconOne },
    ],
  },
];

export default projects;
