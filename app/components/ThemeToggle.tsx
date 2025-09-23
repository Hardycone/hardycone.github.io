"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Moon from "../icons/Moon"; // light icon
import Sun from "../icons/Sun"; // dark icon

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure client-only rendering to avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      className="p-2"
    >
      {isDark ? <Moon /> : <Sun />}
    </button>
  );
}
