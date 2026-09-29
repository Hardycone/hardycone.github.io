import type { ReactNode } from "react";

interface TextCardProps {
  children: ReactNode;
  title?: ReactNode;
  titleAs?: "h5" | "div" | "span" | "none";
  heading?: ReactNode;
  byline?: ReactNode;
  bodyAs?: "p" | "blockquote";
  className?: string;
  titleClassName?: string;
  mainClassName?: string;
  headingClassName?: string;
  bodyClassName?: string;
  bylineClassName?: string;
}

export function TextCardEmphasis({
  children,
  className = "text-[1.75rem] font-bold md:text-[2.25rem]",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <strong className={className}>{children}</strong>;
}

export default function TextCard({
  children,
  title,
  titleAs = "h5",
  heading,
  byline,
  bodyAs = "p",
  className = "flex flex-col font-serif",
  titleClassName = "font-serif",
  mainClassName = "",
  headingClassName = "text-pretty font-serif text-[1.875rem]",
  bodyClassName = "!font-serif",
  bylineClassName = "text-pretty text-end font-serif text-[1rem] leading-tight md:text-[1.25rem]",
}: TextCardProps) {
  const Title = titleAs === "none" ? null : titleAs;
  const Body = bodyAs;
  const main = (
    <>
      {heading != null ? <h5 className={headingClassName}>{heading}</h5> : null}
      <Body className={bodyClassName}>{children}</Body>
    </>
  );

  return (
    <div className={className}>
      {title != null ? (
        Title ? (
          <Title className={titleClassName}>{title}</Title>
        ) : (
          title
        )
      ) : null}
      {heading != null || mainClassName ? (
        <div className={mainClassName}>{main}</div>
      ) : (
        main
      )}
      {byline != null ? (
        <figcaption className={bylineClassName}>{byline}</figcaption>
      ) : null}
    </div>
  );
}
