import React from "react";

interface SubSectionHeadingProps {
  number: string;
  heading: string;
}

const SubSectionHeading: React.FC<SubSectionHeadingProps> = ({
  number,
  heading,
}) => {
  return (
    <h4 className={`mb-10 flex w-fit items-center gap-2 dark:bg-opacity-20`}>
      <div className="flex size-5 items-center justify-center rounded-full bg-foreground dark:bg-dark-foreground md:size-6">
        <span className="font-sans text-sm font-bold text-background dark:text-dark-background md:text-base">
          {number}
        </span>
      </div>
      {heading}
    </h4>
  );
};

export default SubSectionHeading;
