"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import type { GlyphAnimationData } from "@/data/projects";
import { applyGlyphThreePalette } from "@/lib/glyphThreePalette";
import { applyGlyphSixPalette } from "@/lib/glyphSixPalette";

interface AnimatedGlyphProps {
  animationData: GlyphAnimationData;
  isActive: boolean;
  shouldAnimate?: boolean;
  colorPalette?: "glyph-three" | "glyph-six";
}

interface GlyphPlayerProps extends Omit<AnimatedGlyphProps, "colorPalette"> {
  className?: string;
}

function GlyphPlayer({
  animationData,
  isActive,
  shouldAnimate = true,
  className = "",
}: GlyphPlayerProps) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const wasActive = useRef(isActive);
  const isActiveRef = useRef(isActive);
  const hasInitialized = useRef(false);
  const isPlaying = useRef(false);
  const pendingReplay = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const getSegmentEndFrame = useCallback(() => {
    const duration = lottieRef.current?.getDuration(true);
    const outPoint = Math.floor(duration ?? animationData.op);
    return Math.max(1, outPoint);
  }, [animationData.op]);

  const resetToStatic = useCallback(() => {
    lottieRef.current?.setSpeed(1);
    lottieRef.current?.goToAndStop(0, true);
  }, []);

  const playFromStart = useCallback(() => {
    if (!lottieRef.current) return;

    isPlaying.current = true;
    lottieRef.current.setSpeed(1);
    lottieRef.current.goToAndStop(0, true);
    lottieRef.current.playSegments([0, getSegmentEndFrame()], true);
  }, [getSegmentEndFrame]);

  useEffect(() => {
    isActiveRef.current = isActive;
    if (isPlaying.current && shouldAnimate) {
      lottieRef.current?.setSpeed(isActive ? 1 : 2);
    }
  }, [isActive, shouldAnimate]);

  useEffect(() => {
    if (!isReady || !lottieRef.current) return;

    if (!shouldAnimate) {
      isPlaying.current = false;
      pendingReplay.current = false;
      hasInitialized.current = true;
      resetToStatic();
      wasActive.current = isActive;
      return;
    }

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      resetToStatic();
      if (isActive) playFromStart();
      wasActive.current = isActive;
      return;
    }

    if (isActive && !wasActive.current) {
      if (isPlaying.current) {
        pendingReplay.current = true;
      } else {
        playFromStart();
      }
    }

    wasActive.current = isActive;
  }, [
    isActive,
    isReady,
    playFromStart,
    resetToStatic,
    shouldAnimate,
  ]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={false}
      autoplay={false}
      onDOMLoaded={() => {
        hasInitialized.current = false;
        setIsReady(true);
      }}
      onComplete={() => {
        isPlaying.current = false;

        if (pendingReplay.current && isActiveRef.current) {
          pendingReplay.current = false;
          requestAnimationFrame(playFromStart);
          return;
        }

        pendingReplay.current = false;
      }}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      className={`glyph-lottie h-full w-full ${className}`}
    />
  );
}

function cloneAnimationData(animationData: GlyphAnimationData) {
  return JSON.parse(JSON.stringify(animationData)) as GlyphAnimationData;
}

export default function AnimatedGlyph({
  animationData,
  isActive,
  shouldAnimate = true,
  colorPalette,
}: AnimatedGlyphProps) {
  const lightAnimationData = useMemo(() => {
    const clone = cloneAnimationData(animationData);

    if (colorPalette === "glyph-three") {
      applyGlyphThreePalette(clone, "light");
    } else if (colorPalette === "glyph-six") {
      applyGlyphSixPalette(clone, "light");
    }

    return clone;
  }, [animationData, colorPalette]);

  const darkAnimationData = useMemo(() => {
    if (colorPalette !== "glyph-six") return null;

    const clone = cloneAnimationData(animationData);
    applyGlyphSixPalette(clone, "dark");
    return clone;
  }, [animationData, colorPalette]);

  if (darkAnimationData) {
    return (
      <div className="relative h-full w-full">
        <GlyphPlayer
          animationData={lightAnimationData}
          isActive={isActive}
          shouldAnimate={shouldAnimate}
          className="dark:hidden"
        />
        <GlyphPlayer
          animationData={darkAnimationData}
          isActive={isActive}
          shouldAnimate={shouldAnimate}
          className="absolute inset-0 hidden dark:block"
        />
      </div>
    );
  }

  return (
    <GlyphPlayer
      animationData={lightAnimationData}
      isActive={isActive}
      shouldAnimate={shouldAnimate}
    />
  );
}
