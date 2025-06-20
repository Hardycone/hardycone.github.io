"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Moon from "../icons/Moon"; // light icon
import Sun from "../icons/Sun"; // dark icon

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    // Set temporary theme, then revert to system on next reload
    setTheme(nextTheme);
    localStorage.removeItem("theme"); // Ensures system is used on refresh
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
