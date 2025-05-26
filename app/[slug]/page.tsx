import projects from "../../data/projects";
import CaseStudyOne from "../components/caseStudies/CaseStudyOne";
import CaseStudyTwo from "../components/caseStudies/CaseStudyTwo";
import CaseStudyThree from "../components/caseStudies/CaseStudyThree";
import CaseStudyFour from "../components/caseStudies/CaseStudyFour";
import CaseStudyFive from "../components/caseStudies/CaseStudyFive";
import CaseStudySix from "../components/caseStudies/CaseStudySix";

// ... import all 6

type ProjectSlug =
  | "case-study-one"
  | "case-study-two"
  | "case-study-three"
  | "case-study-four"
  | "case-study-five"
  | "case-study-six";

const caseStudyComponents: Record<ProjectSlug, React.FC> = {
  "case-study-one": CaseStudyOne,
  "case-study-two": CaseStudyTwo,
  "case-study-three": CaseStudyThree,
  "case-study-four": CaseStudyFour,
  "case-study-five": CaseStudyFive,
  "case-study-six": CaseStudySix,

  // ... map all slugs to components
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return <p>Project not found</p>;
  }
  const slug = project.slug as ProjectSlug;
  const CaseStudyComponent = caseStudyComponents[slug];

  return (
    <main>
      {/* Optionally, you can render a common ProjectSummary here */}
      {CaseStudyComponent ? (
        <CaseStudyComponent />
      ) : (
        <p>No content for this project</p>
      )}
    </main>
  );
}
