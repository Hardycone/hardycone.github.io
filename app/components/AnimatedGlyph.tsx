"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import type { GlyphAnimationData } from "@/data/projects";

interface AnimatedGlyphProps {
  animationData: GlyphAnimationData;
  isActive: boolean;
}

export default function AnimatedGlyph({
  animationData,
  isActive,
}: AnimatedGlyphProps) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const wasActive = useRef(isActive);
  const isActiveRef = useRef(isActive);
  const hasInitialized = useRef(false);
  const isPlaying = useRef(false);
  const pendingReplay = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const animationDataClone = useMemo(
    () => JSON.parse(JSON.stringify(animationData)) as GlyphAnimationData,
    [animationData],
  );

  const getLastPlayableFrame = useCallback(() => {
    const duration = lottieRef.current?.getDuration(true);
    const outPoint = Math.floor(duration ?? animationData.op);
    return Math.max(0, outPoint - 1);
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
    lottieRef.current.playSegments([0, getLastPlayableFrame()], true);
  }, [getLastPlayableFrame]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    if (!isReady || !lottieRef.current) return;

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
  }, [isActive, isReady, playFromStart, resetToStatic]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationDataClone}
      loop={false}
      autoplay={false}
      onDOMLoaded={() => {
        hasInitialized.current = false;
        setIsReady(true);
      }}
      onComplete={() => {
        isPlaying.current = false;
        resetToStatic();

        if (pendingReplay.current && isActiveRef.current) {
          pendingReplay.current = false;
          requestAnimationFrame(playFromStart);
          return;
        }

        pendingReplay.current = false;
      }}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      className="h-full w-full"
    />
  );
}
