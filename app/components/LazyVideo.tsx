"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type VideoHTMLAttributes,
} from "react";

interface LazyVideoProps
  extends Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    "children" | "className" | "preload" | "src"
  > {
  src: string;
  type?: string;
  aspectRatio?: string | number;
  width?: number;
  height?: number;
  rootMargin?: string;
  className?: string;
  videoClassName?: string;
  fallbackText?: string;
  playButtonLabel?: string;
  pauseWhenOutOfView?: boolean;
  pauseRootMargin?: string;
  pauseThreshold?: number;
}

function getAspectRatio({
  aspectRatio,
  width,
  height,
}: Pick<LazyVideoProps, "aspectRatio" | "width" | "height">) {
  if (width && height) return `${width} / ${height}`;
  if (aspectRatio) return aspectRatio;
  return "16 / 9";
}

export default function LazyVideo({
  src,
  type = "video/mp4",
  aspectRatio,
  width,
  height,
  rootMargin = "600px 0px",
  className = "",
  videoClassName = "",
  fallbackText = "Your browser does not support the video tag.",
  playButtonLabel = "Play video",
  controlsList = "nodownload noremoteplayback",
  disablePictureInPicture = true,
  disableRemotePlayback = true,
  pauseWhenOutOfView = true,
  pauseRootMargin = "0px",
  pauseThreshold = 0.1,
  ...videoProps
}: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const resolvedAspectRatio = getAspectRatio({ aspectRatio, width, height });

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  useEffect(() => {
    if (shouldLoad) {
      videoRef.current?.load();
    }
  }, [shouldLoad]);

  const handlePlay = async () => {
    setShouldLoad(true);
    setHasStarted(true);

    requestAnimationFrame(() => {
      void videoRef.current?.play();
    });
  };

  useEffect(() => {
    const node = containerRef.current;
    const video = videoRef.current;
    if (!pauseWhenOutOfView || !node || !video) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { rootMargin: pauseRootMargin, threshold: pauseThreshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [pauseRootMargin, pauseThreshold, pauseWhenOutOfView]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: resolvedAspectRatio } as CSSProperties}
    >
      <video
        ref={videoRef}
        {...videoProps}
        controls={hasStarted}
        controlsList={controlsList}
        disablePictureInPicture={disablePictureInPicture}
        disableRemotePlayback={disableRemotePlayback}
        preload="none"
        className={`h-full w-full ${videoClassName}`}
      >
        {shouldLoad && <source src={src} type={type} />}
        {fallbackText}
      </video>
      {!hasStarted && (
        <button
          type="button"
          aria-label={playButtonLabel}
          onClick={handlePlay}
          className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-xl backdrop-blur transition hover:scale-105 hover:bg-background focus:outline-none focus-visible:ring-4 focus-visible:ring-foreground/40 dark:bg-dark-background/90 dark:text-dark-foreground dark:hover:bg-dark-background md:h-24 md:w-24"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="ml-1 h-9 w-9 fill-current md:h-11 md:w-11"
          >
            <path d="M8 5.14v13.72L18.5 12 8 5.14Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
