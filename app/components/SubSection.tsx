import { ReactNode } from "react";

interface SubSectionBaseProps {
  children: ReactNode;
  className?: string;
  spacing?: "default" | "none";
}

type SubSectionProps = SubSectionBaseProps &
  (
    | {
        heading: string;
        number?: string;
      }
    | {
        heading?: never;
        number?: never;
      }
  );

export default function SubSection({
  heading,
  number,
  children,
  className = "",
  spacing = "default",
}: SubSectionProps) {
  const content = (
    <>
      {heading ? (
        <h4 className="flex w-fit items-start gap-1.5">
          {number ? (
            <div className="flex h-[1.875rem] w-[1.5rem] shrink-0 items-center justify-center">
              <span className="flex size-[1.5rem] items-center justify-center rounded-full bg-zinc-700 font-sans text-[1rem] font-black text-background dark:bg-zinc-300 dark:text-dark-background">
                {number}
              </span>
            </div>
          ) : null}
          {heading}
        </h4>
      ) : null}
      {children}
    </>
  );

  return (
    <div
      className={`flex flex-col ${spacing === "none" ? "gap-0" : "gap-4"} ${className}`}
    >
      {content}
    </div>
  );
}
