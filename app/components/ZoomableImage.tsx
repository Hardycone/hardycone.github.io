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
import { animate, motion, useMotionValue } from "framer-motion";
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
  const [roundImageSurface, setRoundImageSurface] = useState(true);
  const cardGroupContext = useCardGroupContext();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

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
    setRoundImageSurface(true);
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [scale, src, x, y]);

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
      canZoom: nextScale > 1.001,
    };
  }, [frameSize, imageSize, unzoomedContentSize]);

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
    let isCancelled = false;

    if (isZoomed) {
      Promise.all(animations).then(() => {
        if (!isCancelled) setRoundImageSurface(false);
      });
    }

    return () => {
      isCancelled = true;
      animations.forEach((animation) => animation.stop());
    };
  }, [isZoomed, scale, x, y, zoomGeometry]);

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
      className={`relative size-full overflow-hidden ${canUseZoom ? (isZoomed ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-zoom-in touch-pan-y") : ""} ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0"
        style={{ padding: unzoomedPadding }}
      >
        <div ref={unzoomedContentRef} className="size-full" />
      </div>
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
            className={
              roundImageSurface
                ? `${imageRoundedClassName} overflow-hidden`
                : ""
            }
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
