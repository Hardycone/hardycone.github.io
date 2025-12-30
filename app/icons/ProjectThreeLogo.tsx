// app/icons/ProjectThreeLogo.tsx
"use client";

import Lottie from "lottie-react";
// 👇 Import your JSON file here
import animationData from "../../public/assets/data.json";

export default function ProjectThreeLogo() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        className="h-full w-full" // Ensures it fills the carousel bubble
      />
    </div>
  );
}
