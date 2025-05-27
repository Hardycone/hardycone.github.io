import projects from "@/data/projects";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params; // await the promise
  const { slug } = resolvedParams;

  // Validate slug
  const projectExists = projects.some((p) => p.slug === slug);

  if (!projectExists) {
    notFound();
  }

  return null;
}
