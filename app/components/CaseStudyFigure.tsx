import { ReactNode } from "react";

interface CaseStudyFigureProps {
  children: ReactNode;
  caption: string;
  className?: string;
}

export default function CaseStudyFigure({
  children,
  caption,
  className = "",
}: CaseStudyFigureProps) {
  return (
    <figure className="mb-12 overflow-hidden rounded-1 border border-foreground/10 bg-zinc-50 supports-[corner-shape:squircle]:rounded-2 supports-[corner-shape:squircle]:[corner-shape:squircle] dark:border-dark-foreground/15 dark:bg-zinc-800 md:rounded-2 supports-[corner-shape:squircle]:md:rounded-4">
      <div
        className={`flex min-h-72 w-full items-center justify-center p-6 md:min-h-96 md:p-10 ${className}`}
      >
        {children}
      </div>
      <figcaption className="border-t border-foreground/10 px-4 py-3 font-sans text-sm text-foreground/60 dark:border-dark-foreground/15 dark:text-dark-foreground/60">
        {caption}
      </figcaption>
    </figure>
  );
}
