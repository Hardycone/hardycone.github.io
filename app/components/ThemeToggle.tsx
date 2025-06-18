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
      className="flex w-10 h-10 p-2 z-50 rounded-full bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground shadow-[8px_8px_16px_rgba(0,0,0,0.1)] transition-transform hover:shadow-[12px_12px_24px_rgba(0,0,0,0.1)] dark:shadow-[0px_0px_8px_4px_rgba(255,255,255,0.2)] dark:hover:shadow-[0px_0px_12px_6px_rgba(255,255,255,0.2)] hover:scale-110"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      {isDark ? <Moon /> : <Sun />}
    </button>
  );
}
