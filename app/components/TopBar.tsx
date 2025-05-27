"use client";

import { useViewMode } from "../context/ViewModeContext";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function TopBar() {
  const { viewMode } = useViewMode();
  const router = useRouter();

  return (
    <AnimatePresence>
      {viewMode !== "home" && (
        <motion.div
          key="topbar"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed flex w-full justify-between items-center h-[60px] px-[20px] bg-amber-700 shadow-sm z-50"
        >
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            ← Logo
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-600 hover:underline">
              LinkedIn
            </a>
            <a href="#" className="text-sm text-gray-600 hover:underline">
              GitHub
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
