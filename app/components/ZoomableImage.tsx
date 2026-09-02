"use client";

import {
  ImgHTMLAttributes,
  KeyboardEvent,
  SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { ROUNDED_SQUIRCLE_01, ROUNDED_SQUIRCLE_02_MD } from "@/lib/styleTokens";
import { useCardGroupContext } from "@/app/context/CardGroupContext";

interface ImageSize {
  width: number;
  height: number;
}

export interface ZoomableImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "alt" | "className" | "draggable" | "src"
  > {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  imageRoundedClassName?: string;
  roundedClassName?: string;
  onZoomChange?: (isZoomed: boolean) => void;
}

const ZOOM_TRANSITION = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ZoomableImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  imageRoundedClassName = "",
  roundedClassName = `${ROUNDED_SQUIRCLE_01} ${ROUNDED_SQUIRCLE_02_MD}`,
  onLoad,
  onZoomChange,
  ...imageProps
}: ZoomableImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const onZoomChangeRef = useRef(onZoomChange);
  const [frameSize, setFrameSize] = useState<ImageSize | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const cardGroupContext = useCardGroupContext();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    onZoomChangeRef.current = onZoomChange;
  }, [onZoomChange]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateFrameSize = () => {
      const { width, height } = frame.getBoundingClientRect();
      setFrameSize({ width, height });
    };

    updateFrameSize();

    const resizeObserver = new ResizeObserver(updateFrameSize);
    resizeObserver.observe(frame);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setImageSize(null);
    setIsZoomed(false);
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [scale, src, x, y]);

  const zoomGeometry = useMemo(() => {
    if (
      !frameSize ||
      !imageSize ||
      frameSize.width <= 0 ||
      frameSize.height <= 0 ||
      imageSize.width <= 0 ||
      imageSize.height <= 0
    ) {
      return {
        scale: 1,
        maxX: 0,
        maxY: 0,
        containWidth: 0,
        containHeight: 0,
        canZoom: false,
      };
    }

    const containScale = Math.min(
      frameSize.width / imageSize.width,
      frameSize.height / imageSize.height,
    );
    const coverScale = Math.max(
      frameSize.width / imageSize.width,
      frameSize.height / imageSize.height,
    );
    const nextScale = Math.max(1, coverScale / containScale);
    const containWidth = imageSize.width * containScale;
    const containHeight = imageSize.height * containScale;
    const zoomedWidth = containWidth * nextScale;
    const zoomedHeight = containHeight * nextScale;
    const maxX = Math.max(0, (zoomedWidth - frameSize.width) / 2);
    const maxY = Math.max(0, (zoomedHeight - frameSize.height) / 2);

    return {
      scale: nextScale,
      maxX,
      maxY,
      containWidth,
      containHeight,
      canZoom: nextScale > 1.001,
    };
  }, [frameSize, imageSize]);

  const canUseZoom =
    zoomGeometry.canZoom && !cardGroupContext?.prioritizeCardClick;

  useEffect(() => {
    if (!canUseZoom && isZoomed) {
      setIsZoomed(false);
      onZoomChangeRef.current?.(false);
    }
  }, [canUseZoom, isZoomed]);

  useEffect(() => {
    if (!zoomGeometry.canZoom && isZoomed) {
      setIsZoomed(false);
      onZoomChangeRef.current?.(false);
    }

    const nextScale = isZoomed ? zoomGeometry.scale : 1;
    const nextX = isZoomed
      ? clamp(x.get(), -zoomGeometry.maxX, zoomGeometry.maxX)
      : 0;
    const nextY = isZoomed
      ? clamp(y.get(), -zoomGeometry.maxY, zoomGeometry.maxY)
      : 0;
    const animations = [
      animate(scale, nextScale, ZOOM_TRANSITION),
      animate(x, nextX, ZOOM_TRANSITION),
      animate(y, nextY, ZOOM_TRANSITION),
    ];

    return () => animations.forEach((animation) => animation.stop());
  }, [isZoomed, scale, x, y, zoomGeometry]);

  const toggleZoom = () => {
    if (!canUseZoom) return;

    const nextIsZoomed = !isZoomed;
    setIsZoomed(nextIsZoomed);
    onZoomChangeRef.current?.(nextIsZoomed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleZoom();
  };

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    setImageSize({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
    onLoad?.(event);
  };

  return (
    <div
      ref={frameRef}
      role={canUseZoom ? "button" : undefined}
      tabIndex={canUseZoom ? 0 : undefined}
      aria-pressed={canUseZoom ? isZoomed : undefined}
      aria-label={
        canUseZoom
          ? `${isZoomed ? "Zoom out" : "Zoom in"}: ${alt || "image"}`
          : undefined
      }
      onKeyDown={handleKeyDown}
      className={`${roundedClassName} relative size-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 dark:focus-visible:ring-dark-foreground/60 ${canUseZoom ? (isZoomed ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-zoom-in touch-pan-y") : ""} ${className}`}
    >
      <motion.div
        className={`size-full origin-center ${isZoomed ? "will-change-transform" : ""}`}
        style={{ x, y, scale }}
        drag={isZoomed}
        dragConstraints={{
          left: -zoomGeometry.maxX,
          right: zoomGeometry.maxX,
          top: -zoomGeometry.maxY,
          bottom: zoomGeometry.maxY,
        }}
        dragElastic={0}
        dragMomentum={false}
        onTap={toggleZoom}
      >
        <div className="flex size-full items-center justify-center">
          <div
            className={`${imageRoundedClassName} overflow-hidden`}
            style={
              zoomGeometry.containWidth > 0 && zoomGeometry.containHeight > 0
                ? {
                    width: zoomGeometry.containWidth,
                    height: zoomGeometry.containHeight,
                  }
                : { width: "100%", height: "100%" }
            }
          >
            <img
              {...imageProps}
              src={src}
              alt={alt}
              draggable={false}
              onLoad={handleLoad}
              className={`pointer-events-none block size-full max-w-none select-none object-contain ${imageClassName}`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
