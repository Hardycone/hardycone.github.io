"use client";

import {
  ImgHTMLAttributes,
  SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
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
  unzoomedPadding?: string | number;
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
  unzoomedPadding = 0,
  onLoad,
  onZoomChange,
  ...imageProps
}: ZoomableImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const unzoomedContentRef = useRef<HTMLDivElement>(null);
  const onZoomChangeRef = useRef(onZoomChange);
  const [frameSize, setFrameSize] = useState<ImageSize | null>(null);
  const [unzoomedContentSize, setUnzoomedContentSize] =
    useState<ImageSize | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomAnimating, setIsZoomAnimating] = useState(false);
  const [roundImageSurface, setRoundImageSurface] = useState(true);
  const cardGroupContext = useCardGroupContext();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const zoomProgress = useMotionValue(0);

  useEffect(() => {
    onZoomChangeRef.current = onZoomChange;
  }, [onZoomChange]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const unzoomedContent = unzoomedContentRef.current;
    if (!frame || !unzoomedContent) return;

    const updateImageGeometry = () => {
      const nextFrameSize = {
        width: frame.clientWidth,
        height: frame.clientHeight,
      };
      const nextUnzoomedContentSize = {
        width: unzoomedContent.clientWidth,
        height: unzoomedContent.clientHeight,
      };

      setFrameSize((currentSize) =>
        currentSize?.width === nextFrameSize.width &&
        currentSize.height === nextFrameSize.height
          ? currentSize
          : nextFrameSize,
      );
      setUnzoomedContentSize((currentSize) =>
        currentSize?.width === nextUnzoomedContentSize.width &&
        currentSize.height === nextUnzoomedContentSize.height
          ? currentSize
          : nextUnzoomedContentSize,
      );
    };

    updateImageGeometry();

    const resizeObserver = new ResizeObserver(updateImageGeometry);
    resizeObserver.observe(frame);
    resizeObserver.observe(unzoomedContent);

    return () => resizeObserver.disconnect();
  }, [unzoomedPadding]);

  useEffect(() => {
    setImageSize(null);
    setIsZoomed(false);
    setIsZoomAnimating(false);
    setRoundImageSurface(true);
    x.set(0);
    y.set(0);
    zoomProgress.set(0);
  }, [src, x, y, zoomProgress]);

  const zoomGeometry = useMemo(() => {
    if (
      !frameSize ||
      !unzoomedContentSize ||
      !imageSize ||
      frameSize.width <= 0 ||
      frameSize.height <= 0 ||
      unzoomedContentSize.width <= 0 ||
      unzoomedContentSize.height <= 0 ||
      imageSize.width <= 0 ||
      imageSize.height <= 0
    ) {
      return {
        scale: 1,
        maxX: 0,
        maxY: 0,
        containWidth: 0,
        containHeight: 0,
        zoomedWidth: 0,
        zoomedHeight: 0,
        canZoom: false,
      };
    }

    const containScale = Math.min(
      unzoomedContentSize.width / imageSize.width,
      unzoomedContentSize.height / imageSize.height,
    );
    const containWidth = imageSize.width * containScale;
    const containHeight = imageSize.height * containScale;
    const nextScale = Math.max(
      1,
      frameSize.width / containWidth,
      frameSize.height / containHeight,
    );
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
      zoomedWidth,
      zoomedHeight,
      canZoom: nextScale > 1.001,
    };
  }, [frameSize, imageSize, unzoomedContentSize]);

  const surfaceWidth = useTransform(
    zoomProgress,
    [0, 1],
    [zoomGeometry.containWidth, zoomGeometry.zoomedWidth],
  );
  const surfaceHeight = useTransform(
    zoomProgress,
    [0, 1],
    [zoomGeometry.containHeight, zoomGeometry.zoomedHeight],
  );
  // Paint at the final media size and scale down for the preview, never up.
  // At full zoom the bitmap is untransformed, rather than an enlarged thumbnail.
  const mediaScale = useTransform(
    zoomProgress,
    [0, 1],
    [1 / zoomGeometry.scale, 1],
  );

  const canUseZoom =
    zoomGeometry.canZoom && !cardGroupContext?.prioritizeCardClick;

  useEffect(() => {
    if (!canUseZoom && isZoomed) {
      setRoundImageSurface(true);
      setIsZoomed(false);
      onZoomChangeRef.current?.(false);
    }
  }, [canUseZoom, isZoomed]);

  useEffect(() => {
    if (!zoomGeometry.canZoom && isZoomed) {
      setRoundImageSurface(true);
      setIsZoomed(false);
      onZoomChangeRef.current?.(false);
    }

    const nextProgress = isZoomed ? 1 : 0;
    const nextX = isZoomed
      ? clamp(x.get(), -zoomGeometry.maxX, zoomGeometry.maxX)
      : 0;
    const nextY = isZoomed
      ? clamp(y.get(), -zoomGeometry.maxY, zoomGeometry.maxY)
      : 0;

    // Mounting or measuring an unzoomed image needs no animation work.
    if (
      zoomProgress.get() === nextProgress &&
      x.get() === nextX &&
      y.get() === nextY
    ) {
      setIsZoomAnimating(false);
      if (isZoomed) setRoundImageSurface(false);
      return;
    }

    setIsZoomAnimating(true);
    const animations = [
      animate(zoomProgress, nextProgress, ZOOM_TRANSITION),
      animate(x, nextX, ZOOM_TRANSITION),
      animate(y, nextY, ZOOM_TRANSITION),
    ];
    let isCancelled = false;

    Promise.all(animations).then(() => {
      if (isCancelled) return;
      setIsZoomAnimating(false);
      if (isZoomed) setRoundImageSurface(false);
    });

    return () => {
      isCancelled = true;
      animations.forEach((animation) => animation.stop());
    };
  }, [isZoomed, x, y, zoomGeometry, zoomProgress]);

  const toggleZoom = () => {
    if (!canUseZoom) return;

    const nextIsZoomed = !isZoomed;
    if (!nextIsZoomed) setRoundImageSurface(true);
    setIsZoomed(nextIsZoomed);
    onZoomChangeRef.current?.(nextIsZoomed);
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
      data-card-group-interactive={canUseZoom ? "true" : undefined}
      className={`relative size-full overflow-hidden ${canUseZoom ? (isZoomed ? "cursor-grab touch-pan-y active:cursor-grabbing" : "cursor-zoom-in touch-pan-y") : ""} ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0"
        style={{ padding: unzoomedPadding }}
      >
        <div ref={unzoomedContentRef} className="size-full" />
      </div>
      <motion.div
        className="size-full"
        style={{ x, y }}
        drag={isZoomed ? "x" : false}
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
          <motion.div
            className={`relative shrink-0 ${
              roundImageSurface
                ? `${imageRoundedClassName} overflow-hidden`
                : ""
            }`}
            style={
              zoomGeometry.containWidth > 0 && zoomGeometry.containHeight > 0
                ? {
                    width: surfaceWidth,
                    height: surfaceHeight,
                  }
                : { width: "100%", height: "100%" }
            }
          >
            <motion.div
              className="absolute origin-center"
              style={{
                width: zoomGeometry.zoomedWidth || "100%",
                height: zoomGeometry.zoomedHeight || "100%",
                left: zoomGeometry.zoomedWidth > 0 ? "50%" : 0,
                top: zoomGeometry.zoomedHeight > 0 ? "50%" : 0,
                marginLeft: -zoomGeometry.zoomedWidth / 2,
                marginTop: -zoomGeometry.zoomedHeight / 2,
                scale: mediaScale,
                willChange: isZoomAnimating ? "transform" : undefined,
              }}
            >
              <img
                {...imageProps}
                src={src}
                alt={alt}
                draggable={false}
                onLoad={handleLoad}
                className={`pointer-events-none block size-full max-w-none select-none object-contain ${imageClassName}`}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
