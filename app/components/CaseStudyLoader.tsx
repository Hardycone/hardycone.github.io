// components/CaseStudyLoader.tsx
import React, { useEffect, useState } from "react";
import projects from "../../data/projects";

type CaseStudyLoaderProps = {
  projectId: string;
};

export default function CaseStudyLoader({ projectId }: CaseStudyLoaderProps) {
  const project = projects.find((p) => p.id === projectId);
  const [CaseStudyComponent, setCaseStudyComponent] = useState<React.FC | null>(
    null
  );

  useEffect(() => {
    if (!project) return;

    import(`../case-studies/${project.caseStudySlug}`)
      .then((mod) => setCaseStudyComponent(() => mod.default))
      .catch(() =>
        setCaseStudyComponent(() => () => <p>Case study not found.</p>)
      );
  }, [project]);

  if (!project) return <p>Project not found</p>;
  if (!CaseStudyComponent) return <p>Loading case study...</p>;

  return (
    <article className="prose max-w-3xl">
      <h1>{project.title}</h1>
      <CaseStudyComponent />
    </article>
  );
}
