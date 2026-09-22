"use client";

import { useEffect, useState } from "react";

const HOVER_QUERY = "(any-hover: hover) and (any-pointer: fine)";

export function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(HOVER_QUERY);
    const updateCanHover = () => setCanHover(media.matches);

    updateCanHover();
    media.addEventListener("change", updateCanHover);

    return () => media.removeEventListener("change", updateCanHover);
  }, []);

  return canHover;
}
