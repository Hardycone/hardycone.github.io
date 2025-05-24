// app/components/ProjectSummary.tsx
"use client";

import { useActiveProject } from "../context/ActiveProjectContext";
import projects from "../../data/projects";
import { useRouter } from "next/navigation";

export default function ProjectSummary() {
  const { activeIndex } = useActiveProject();
  const project = projects[activeIndex];
  const router = useRouter();

  const handleClick = () => {
    router.push(`/case-studies/${project.slug}`);
  };

  if (!project) {
    return null; // or a loading state
  }

  return (
    <div className="absolute left-1/4 top-1/2 w-1/2 justify-center items-center bg-white p-6 rounded-2xl shadow-xl text-center z-50">
      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
      >
        View Case Study
      </button>
    </div>
  );
}
