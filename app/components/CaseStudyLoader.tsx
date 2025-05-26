// components/CaseStudyLoader.tsx
import { useEffect, useState } from "react";
import projects from "../../data/projects";

type CaseStudyLoaderProps = {
  projectId: string;
};

export default function CaseStudyLoader({ projectId }: CaseStudyLoaderProps) {
  const project = projects.find((p) => p.id === projectId)!;
  const [CaseStudyComponent, setCaseStudyComponent] = useState<React.FC | null>(
    null
  );

  useEffect(() => {
    import(`../case-studies/${project.slug}`).then((mod) => {
      const Component = mod.default;
      Component.displayName = project.slug;
      setCaseStudyComponent(() => Component);
    });
  }, [project.slug]);

  if (!CaseStudyComponent) return null;

  return (
    <article className="prose max-w-3xl">
      <h1>{project.title}</h1>
      <CaseStudyComponent />
    </article>
  );
}
