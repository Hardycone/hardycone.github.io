import { useState } from "react";

export default function SpecialButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer h-[12rem] w-[24rem]"
    >
      <div
        className={`



                  flex items-center
           justify-end border-black border-2
          duration-100 ease-easeInOut
          ${
            isHovered
              ? "w-[100px] h-[] rounded-[100px]"
              : "w-[200px] h-[] rounded-[15px]"
          }
        `}
      >
        <p
          className={`
            text-xl transition-all duration-100 mr-4
          `}
        >
          View
        </p>
      </div>
    </button>
  );
}
