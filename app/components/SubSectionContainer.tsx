import { ReactNode } from "react";

interface SubSectionContainerProps {
  children: ReactNode;
  className?: string;
}

export default function SubSectionContainer({
  children,
  className = "gap-4",
}: SubSectionContainerProps) {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
}
