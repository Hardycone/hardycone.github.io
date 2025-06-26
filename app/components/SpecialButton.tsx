import { useState } from "react";

export default function SpecialButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-[12rem] w-[24rem] cursor-pointer"
    >
      <div
        className={`ease-easeInOut flex items-center justify-end border-2 border-black duration-100 ${
          isHovered
            ? "h-[] w-[100px] rounded-[100px]"
            : "h-[] w-[200px] rounded-[15px]"
        } `}
      >
        <p className={`mr-4 text-xl transition-all duration-100`}>View</p>
      </div>
    </button>
  );
}
