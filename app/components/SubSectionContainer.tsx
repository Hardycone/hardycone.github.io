import { ReactNode } from "react";

interface SubSectionContainerProps {
  children: ReactNode;
  subSectionContainerClassName?: string;
}

export default function SubSectionContainer({
  children,
  subSectionContainerClassName = "gap-4 md:gap-6 px-2 md:px-6",
}: SubSectionContainerProps) {
  return (
    <div className={`flex flex-col ${subSectionContainerClassName}`}>
      {children}
    </div>
  );
}
