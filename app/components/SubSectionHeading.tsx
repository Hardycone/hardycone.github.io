import React from "react";

// You must import all the necessary icons from your library (e.g., 'phosphor-react')
import {
  CircleIcon,
  NumberCircleOneIcon,
  NumberCircleTwoIcon,
  NumberCircleThreeIcon,
  NumberCircleFourIcon,
  NumberCircleFiveIcon,
  NumberCircleSixIcon,
  NumberCircleSevenIcon,
  NumberCircleEightIcon,
  NumberCircleNineIcon,
  IconProps, // Assuming your icon library provides standard icon props
} from "@phosphor-icons/react";

// --- Icon Mapping ---
// Map the number to the corresponding icon component
const IconMap = {
  0: CircleIcon,
  1: NumberCircleOneIcon,
  2: NumberCircleTwoIcon,
  3: NumberCircleThreeIcon,
  4: NumberCircleFourIcon,
  5: NumberCircleFiveIcon,
  6: NumberCircleSixIcon,
  7: NumberCircleSevenIcon,
  8: NumberCircleEightIcon,
  9: NumberCircleNineIcon,
};

// --- Component Props Interface ---
interface SubSectionHeadingProps {
  // Use a number (1-9) to select the correct icon
  iconNumber: keyof typeof IconMap;
  // Icon styling props
  iconSize?: number;
  iconWeight?: IconProps["weight"];
  // Heading content
  headingText: string;
  // Tailwind color classes for background and text
  bgColorClass?: string;
  textColorClass?: string;
}

// --- The Component ---
const SubSectionHeading: React.FC<SubSectionHeadingProps> = ({
  iconNumber,
  iconSize = 28, // Default size
  iconWeight = "fill", // Default weight
  headingText,
  // Ensure these props are passed for coloring
  bgColorClass,
  textColorClass,
}) => {
  const IconComponent = IconMap[iconNumber];

  // Fallback if an invalid number is passed, though TypeScript should prevent this.
  if (!IconComponent) {
    return null;
  }

  return (
    <h4
      className={`mb-6 flex h-[36px] w-fit items-center rounded-[20px] text-lg dark:bg-opacity-20 ${bgColorClass} gap-2 bg-opacity-20 p-1 pr-4 font-sans font-semibold ${textColorClass}`}
    >
      {/* Render the selected Icon Component */}
      <IconComponent size={iconSize} weight={iconWeight} />
      {headingText}
    </h4>
  );
};

export default SubSectionHeading;
