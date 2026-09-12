"use client";

import { useEffect, useState } from "react";

const MD_QUERY = "(min-width: 768px)";

function getIsMdUp() {
  return typeof window !== "undefined" && window.matchMedia(MD_QUERY).matches;
}

export function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(getIsMdUp);

  useEffect(() => {
    const media = window.matchMedia(MD_QUERY);
    const updateIsMdUp = () => setIsMdUp(media.matches);

    updateIsMdUp();
    media.addEventListener("change", updateIsMdUp);

    return () => media.removeEventListener("change", updateIsMdUp);
  }, []);

  return isMdUp;
}
