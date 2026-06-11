"use client";

import CaseStudyFab from "./CaseStudyFab";
import MessageMe from "./MessageMe";

export default function BottomBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 m-auto w-full max-w-[1440px] px-1.5 md:px-4">
      <div className="flex w-full items-end">
        <div className="flex min-w-0 flex-1 justify-start">
          <CaseStudyFab />
        </div>
        <div className="flex min-w-0 flex-1 justify-end">
          <MessageMe />
        </div>
      </div>
    </div>
  );
}
