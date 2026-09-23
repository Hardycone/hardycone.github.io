import { ReactNode } from "react";

interface HorizontalScrollStripProps {
  children: ReactNode;
  ariaLabel: string;
  contentClassName?: string;
  body?: ReactNode;
  bodyClassName?: string;
}

export default function HorizontalScrollStrip({
  children,
  ariaLabel,
  contentClassName = "flex w-max gap-4",
  body,
  bodyClassName = "",
}: HorizontalScrollStripProps) {
  return (
    <div className="relative flex flex-col">
      {body ? (
        <div className={`relative z-10 mb-4 ${bodyClassName}`}>{body}</div>
      ) : null}
      <div className="relative w-full [container-type:inline-size]">
        <div
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
          className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="w-max px-[max(0px,calc((100vw-100cqw)/2))]">
            <div className={contentClassName}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
