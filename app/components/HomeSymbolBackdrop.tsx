"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

type FlipMode = "idle" | "in" | "out" | "swap";

type CellState = {
  x: number;
  y: number;
  visible: boolean;
  flipProgress: number;
  flipMode: FlipMode;
  symbolSetIndex: number;
  nextSymbolSetIndex: number;
  symbolIndex: number;
  nextSymbolIndex: number;
};

const SYMBOL_SETS = [
  ["@", "H", "W", "01"],
  ["+", "%", "=", "fx"],
  ["*", "~", "AI", "◇"],
  ["◐", "HUD", "△", "⊕"],
  ["↘", "○", "W", "NY"],
  ["文", "街", "—", "▢"],
];

const BASE_ACTIVE_PROBABILITY = 0.1;
const HOVER_ACTIVE_PROBABILITY = 0.8;
const BEAT_MS = 2000;
const TARGET_FPS = 24;
const DESKTOP_CELL_SIZE = 36;
const MOBILE_CELL_SIZE = 26;
const FLIP_EASE = 0.25;
const MIN_SYMBOL_SCALE = 1;
const MAX_SYMBOL_SCALE = 2;

function getSymbolSet(activeIndex: number) {
  return SYMBOL_SETS[activeIndex % SYMBOL_SETS.length];
}

function getCanvasSize(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();

  return {
    width: Math.max(0, Math.round(rect.width || window.innerWidth)),
    height: Math.max(0, Math.round(rect.height || window.innerHeight)),
  };
}

function createCells(width: number, height: number, cellSize: number) {
  const columns = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;
  const offsetX = (width - (columns - 1) * cellSize) / 2;
  const offsetY = (height - (rows - 1) * cellSize) / 2;
  const cells: CellState[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      cells.push({
        x: offsetX + column * cellSize,
        y: offsetY + row * cellSize,
        visible: false,
        flipProgress: 1,
        flipMode: "idle",
        symbolSetIndex: 0,
        nextSymbolSetIndex: 0,
        symbolIndex: 0,
        nextSymbolIndex: 0,
      });
    }
  }

  return cells;
}

function getActivationProbability(
  cell: CellState,
  mouse: { x: number; y: number; active: boolean },
  radius: number,
) {
  if (!mouse.active) {
    return BASE_ACTIVE_PROBABILITY;
  }

  const distance = Math.hypot(cell.x - mouse.x, cell.y - mouse.y);

  if (distance >= radius) {
    return BASE_ACTIVE_PROBABILITY;
  }

  const influence = 1 - distance / radius;

  return (
    BASE_ACTIVE_PROBABILITY +
    (HOVER_ACTIVE_PROBABILITY - BASE_ACTIVE_PROBABILITY) * influence
  );
}

function getCursorScale(
  cell: CellState,
  mouse: { x: number; y: number; active: boolean },
  radius: number,
) {
  if (!mouse.active) {
    return MIN_SYMBOL_SCALE;
  }

  const distance = Math.hypot(cell.x - mouse.x, cell.y - mouse.y);

  if (distance >= radius) {
    return MIN_SYMBOL_SCALE;
  }

  const influence = 1 - distance / radius;

  return MIN_SYMBOL_SCALE + (MAX_SYMBOL_SCALE - MIN_SYMBOL_SCALE) * influence;
}

function getFlipScaleX(cell: CellState) {
  switch (cell.flipMode) {
    case "in":
      return cell.flipProgress;

    case "out":
      return 1 - cell.flipProgress;

    case "swap":
      return Math.abs(cell.flipProgress * 2 - 1);

    case "idle":
    default:
      return 1;
  }
}

function getDrawableSymbol(cell: CellState) {
  const shouldUseNextSymbol =
    cell.flipMode === "in" ||
    (cell.flipMode === "swap" && cell.flipProgress >= 0.5);

  const symbolSetIndex = shouldUseNextSymbol
    ? cell.nextSymbolSetIndex
    : cell.symbolSetIndex;

  const symbolIndex = shouldUseNextSymbol
    ? cell.nextSymbolIndex
    : cell.symbolIndex;

  const symbols = getSymbolSet(symbolSetIndex);

  return symbols[symbolIndex % symbols.length];
}

interface HomeSymbolBackdropProps {
  activeIndex: number;
}

export default function HomeSymbolBackdrop({
  activeIndex,
}: HomeSymbolBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", {
      alpha: true,
    });

    if (!context) return;

    const mouse = {
      x: 0,
      y: 0,
      active: false,
    };

    let cells: CellState[] = [];
    let cellSize = DESKTOP_CELL_SIZE;
    let frame = 0;
    let lastRenderAt = 0;
    let lastBeatAt = Number.NEGATIVE_INFINITY;
    let shouldRevealNearCursor = false;

    const revealCellsNearCursor = () => {
      if (!mouse.active) return;

      const symbolSetIndex = activeIndexRef.current;
      const symbols = getSymbolSet(symbolSetIndex);
      const hoverRadius = Math.max(cellSize * 3, 150);

      for (const cell of cells) {
        if (cell.visible) continue;

        const distance = Math.hypot(cell.x - mouse.x, cell.y - mouse.y);

        if (distance >= hoverRadius) {
          continue;
        }

        const influence = 1 - distance / hoverRadius;
        const revealProbability = HOVER_ACTIVE_PROBABILITY * influence;

        if (Math.random() >= revealProbability) {
          continue;
        }

        const nextSymbolIndex = Math.floor(Math.random() * symbols.length);

        cell.visible = true;
        cell.nextSymbolSetIndex = symbolSetIndex;
        cell.nextSymbolIndex = nextSymbolIndex;
        cell.flipProgress = 0;
        cell.flipMode = "in";
      }
    };

    const applyBeat = (settle = false) => {
      const nextSymbolSetIndex = activeIndexRef.current;
      const symbols = getSymbolSet(nextSymbolSetIndex);
      const hoverRadius = Math.max(cellSize * 3, 150);

      for (const cell of cells) {
        const probability = getActivationProbability(cell, mouse, hoverRadius);
        const nextVisible = Math.random() < probability;
        const nextSymbolIndex = Math.floor(Math.random() * symbols.length);

        if (settle) {
          cell.visible = nextVisible;
          cell.symbolSetIndex = nextSymbolSetIndex;
          cell.nextSymbolSetIndex = nextSymbolSetIndex;
          cell.symbolIndex = nextSymbolIndex;
          cell.nextSymbolIndex = nextSymbolIndex;
          cell.flipProgress = 1;
          cell.flipMode = "idle";
          continue;
        }

        if (!cell.visible && nextVisible) {
          cell.visible = true;
          cell.nextSymbolSetIndex = nextSymbolSetIndex;
          cell.nextSymbolIndex = nextSymbolIndex;
          cell.flipProgress = 0;
          cell.flipMode = "in";
          continue;
        }

        if (cell.visible && !nextVisible) {
          cell.nextSymbolSetIndex = cell.symbolSetIndex;
          cell.nextSymbolIndex = cell.symbolIndex;
          cell.flipProgress = 0;
          cell.flipMode = "out";
          continue;
        }

        if (cell.visible && nextVisible) {
          cell.nextSymbolSetIndex = nextSymbolSetIndex;
          cell.nextSymbolIndex = nextSymbolIndex;

          const didSymbolChange =
            cell.symbolSetIndex !== nextSymbolSetIndex ||
            cell.symbolIndex !== nextSymbolIndex;

          if (didSymbolChange) {
            cell.flipProgress = 0;
            cell.flipMode = "swap";
          }

          continue;
        }

        cell.flipMode = "idle";
      }
    };

    const resize = (settle = false, force = false) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = getCanvasSize(canvas);

      if (width === 0 || height === 0) {
        return false;
      }

      const nextCellSize = width < 768 ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
      const pixelWidth = Math.max(1, Math.floor(width * dpr));
      const pixelHeight = Math.max(1, Math.floor(height * dpr));
      const didResize =
        canvas.width !== pixelWidth ||
        canvas.height !== pixelHeight ||
        cellSize !== nextCellSize;

      if (!didResize && !force) {
        return true;
      }

      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      cellSize = nextCellSize;
      cells = createCells(width, height, cellSize);
      applyBeat(settle);
      return true;
    };

    const updateCells = () => {
      for (const cell of cells) {
        if (cell.flipMode === "idle") continue;

        cell.flipProgress += (1 - cell.flipProgress) * FLIP_EASE;

        if (cell.flipProgress > 0.98) {
          cell.flipProgress = 1;

          if (cell.flipMode === "out") {
            cell.visible = false;
          } else {
            cell.visible = true;
            cell.symbolSetIndex = cell.nextSymbolSetIndex;
            cell.symbolIndex = cell.nextSymbolIndex;
          }

          cell.flipMode = "idle";
        }
      }
    };

    const draw = () => {
      const { width, height } = getCanvasSize(canvas);
      const isDark = themeRef.current === "dark";
      const hoverRadius = Math.max(cellSize * 3, 150);

      if (width === 0 || height === 0) {
        return;
      }

      context.clearRect(0, 0, width, height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `600 ${Math.round(cellSize * 0.3)}px var(--font-jost), ui-sans-serif, system-ui, sans-serif`;

      for (const cell of cells) {
        if (!cell.visible) continue;

        const symbol = getDrawableSymbol(cell);
        const flipScaleX = getFlipScaleX(cell);

        if (flipScaleX <= 0.01) continue;

        const cursorScale = getCursorScale(cell, mouse, hoverRadius);
        const symbolOpacity = isDark ? 0.28 : 0.2;

        context.fillStyle = isDark
          ? `rgba(244, 244, 245, ${symbolOpacity})`
          : `rgba(39, 39, 42, ${symbolOpacity})`;

        context.save();
        context.translate(cell.x, cell.y);
        context.scale(cursorScale * flipScaleX, cursorScale);
        context.fillText(symbol, 0, 0);
        context.restore();
      }
    };

    const render = (now: number) => {
      frame = requestAnimationFrame(render);

      if (now - lastRenderAt < 1000 / TARGET_FPS) {
        return;
      }

      lastRenderAt = now;

      const hasSize = resize();

      if (!hasSize) {
        return;
      }

      const beatAt = Math.floor(now / BEAT_MS) * BEAT_MS;

      if (beatAt !== lastBeatAt) {
        lastBeatAt = beatAt;
        applyBeat();
      }

      if (shouldRevealNearCursor) {
        shouldRevealNearCursor = false;
        revealCellsNearCursor();
      }

      updateCells();
      draw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
      shouldRevealNearCursor = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      shouldRevealNearCursor = false;
    };

    const handleResize = () => {
      if (resize(true, true)) {
        draw();
        lastBeatAt = Math.floor(performance.now() / BEAT_MS) * BEAT_MS;
      }
    };

    const initialize = () => {
      if (!resize(true, true)) {
        initializeFrame = requestAnimationFrame(initialize);
        return;
      }

      draw();
      lastBeatAt = Math.floor(performance.now() / BEAT_MS) * BEAT_MS;
      frame = requestAnimationFrame(render);

      requestAnimationFrame(() => {
        if (resize(true, true)) {
          draw();
        }
      });

      document.fonts?.ready.then(() => {
        if (resize(true, true)) {
          draw();
        }
      });
    };

    let initializeFrame = requestAnimationFrame(initialize);

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(initializeFrame);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-[100svh] w-full"
    />
  );
}
