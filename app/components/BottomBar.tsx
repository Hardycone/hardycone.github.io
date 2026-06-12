"use client";

import CaseStudyFab from "./CaseStudyFab";
import MessageMe from "./MessageMe";

export default function BottomBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 m-auto w-full max-w-[2650px] p-3.5 md:p-[1.625rem]">
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
