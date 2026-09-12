"use client";

import { useEffect, useState } from "react";

function getSupportsSquircle() {
  return typeof CSS !== "undefined" && CSS.supports("corner-shape", "squircle");
}

export function useSupportsSquircle() {
  const [supportsSquircle, setSupportsSquircle] = useState(getSupportsSquircle);

  useEffect(() => {
    setSupportsSquircle(getSupportsSquircle());
  }, []);

  return supportsSquircle;
}
