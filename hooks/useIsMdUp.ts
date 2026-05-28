"use client";

import { useEffect, useState } from "react";

export function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const updateIsMdUp = () => setIsMdUp(media.matches);

    updateIsMdUp();
    media.addEventListener("change", updateIsMdUp);

    return () => media.removeEventListener("change", updateIsMdUp);
  }, []);

  return isMdUp;
}
