import { ReactNode } from "react";

interface SubHeadingBaseProps {
  children: ReactNode;
  className?: string;
}

type SubHeadingProps = SubHeadingBaseProps &
  (
    | {
        showNumber: true;
        number: string;
      }
    | {
        showNumber?: false;
        number?: never;
      }
  );

export default function SubHeading({
  children,
  className = "",
  showNumber = false,
  number,
}: SubHeadingProps) {
  return (
    <h4 className={`flex w-fit items-start gap-1.5 ${className}`}>
      {showNumber ? (
        <div className="flex h-[1.875rem] w-[1.5rem] shrink-0 items-center justify-center">
          <span className="flex size-[1.5rem] items-center justify-center rounded-full bg-zinc-700 font-sans text-[1rem] font-black text-background dark:bg-zinc-300 dark:text-dark-background">
            {number}
          </span>
        </div>
      ) : null}
      {children}
    </h4>
  );
}
