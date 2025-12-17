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
    <h4
      className={`mb-10 flex w-fit items-center gap-2 pl-2 font-sans text-xl font-semibold dark:bg-opacity-20`}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground dark:bg-dark-foreground">
        <span className="translate-y-[1px] text-background dark:text-dark-background">
          {number}
        </span>
      </div>
      {heading}
    </h4>
  );
};

export default SubSectionHeading;
