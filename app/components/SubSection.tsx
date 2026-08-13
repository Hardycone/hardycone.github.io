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
        <h4 className="flex w-fit items-center gap-2 dark:bg-opacity-20">
          {number ? (
            <div className="flex size-5 items-center justify-center rounded-full bg-foreground dark:bg-dark-foreground md:size-6">
              <span className="font-sans text-sm font-bold text-background dark:text-dark-background md:text-base">
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
