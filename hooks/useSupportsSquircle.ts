"use client";

import { useEffect, useState } from "react";

export function useSupportsSquircle() {
  const [supportsSquircle, setSupportsSquircle] = useState(false);

  useEffect(() => {
    setSupportsSquircle(
      typeof CSS !== "undefined" && CSS.supports("corner-shape", "squircle"),
    );
  }, []);

  return supportsSquircle;
}
