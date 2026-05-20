"use client";

import { useEffect, useRef, useState } from "react";
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
  ["\uf000", "\uf001", "\uf002", "\uf003", "\uf004", "\uf005"],
  ["\uf00f", "\uf00e", "\uf00d", "\uf010", "\uf011"],
  ["\uf012", "\uf013", "\uf014", "\uf016", "\uf017", "\uf015"],
  ["\uf019", "\uf01a", "\uf01b", "\uf01c"],
  ["\uf01d", "\uf022", "\uf021", "\uf020", "\uf01f"],
  ["\uf00a", "\uf00c", "\uf009", "\uf018", "\uf006", "\uf023"],
];

const BASE_ACTIVE_PROBABILITY = 0.05;
const HOVER_ACTIVE_PROBABILITY = 0.8;
const BEAT_MS = 2000;
const TARGET_FPS = 24;
const MD_BREAKPOINT = 768;
const CELL_SIZE = 36;
const FLIP_EASE = 0.25;
const MIN_SYMBOL_SCALE = 1;
const MAX_SYMBOL_SCALE = 1.6;
const SYMBOL_FONT_FAMILY = "HomeSymbols";
const SYMBOL_FONT_SCALE = 0.4;

function getSymbolFont(cellSize: number) {
  return `${Math.round(cellSize * SYMBOL_FONT_SCALE)}px "${SYMBOL_FONT_FAMILY}"`;
}

async function waitForSymbolFont() {
  if (!document.fonts?.load) {
    return;
  }

  await document.fonts.load(`16px "${SYMBOL_FONT_FAMILY}"`, "\uf009");
}

function getSymbolSet(activeIndex: number) {
  return SYMBOL_SETS[activeIndex % SYMBOL_SETS.length];
}

function getGridSize(width: number, height: number) {
  if (width < MD_BREAKPOINT) {
    return { columns: 0, rows: 0 };
  }

  return {
    columns: Math.ceil(width / CELL_SIZE),
    rows: Math.ceil(height / CELL_SIZE),
  };
}

function getCanvasSize(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const width =
    window.innerWidth >= MD_BREAKPOINT
      ? window.innerWidth
      : Math.round(rect.width);
  const height =
    window.innerWidth >= MD_BREAKPOINT
      ? window.innerHeight
      : Math.round(rect.height);

  return {
    width: Math.max(0, width),
    height: Math.max(0, height),
  };
}

function createCells(
  columns: number,
  rows: number,
  previousCells: CellState[] = [],
) {
  const previousCellsByPosition = new Map(
    previousCells.map((cell) => [`${cell.x}:${cell.y}`, cell]),
  );
  const cells: CellState[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = column * CELL_SIZE + CELL_SIZE / 2;
      const y = row * CELL_SIZE + CELL_SIZE / 2;
      const existingCell = previousCellsByPosition.get(`${x}:${y}`);

      if (existingCell) {
        cells.push(existingCell);
        continue;
      }

      cells.push({
        x,
        y,
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

function getFlipScale(cell: CellState) {
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
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (activeIndexRef.current === activeIndex) {
      return;
    }

    activeIndexRef.current = activeIndex;
    window.dispatchEvent(new CustomEvent("home-symbols-index-change"));
  }, [activeIndex]);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const updateCanRender = () => setCanRender(media.matches);

    updateCanRender();
    media.addEventListener("change", updateCanRender);

    return () => media.removeEventListener("change", updateCanRender);
  }, []);

  useEffect(() => {
    if (!canRender) return;

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
    let gridColumns = 0;
    let gridRows = 0;
    let frame = 0;
    let lastRenderAt = 0;
    let lastBeatAt = Number.NEGATIVE_INFINITY;
    let shouldRevealNearCursor = false;
    let shouldWaitForNextBeat = false;
    let isFontReady = false;
    let isCancelled = false;

    const hideVisibleCells = () => {
      for (const cell of cells) {
        if (!cell.visible || cell.flipMode === "out") continue;

        cell.nextSymbolSetIndex = cell.symbolSetIndex;
        cell.nextSymbolIndex = cell.symbolIndex;
        cell.flipProgress = 0;
        cell.flipMode = "out";
      }
    };

    const revealCellsNearCursor = () => {
      if (!mouse.active) return;

      const symbolSetIndex = activeIndexRef.current;
      const symbols = getSymbolSet(symbolSetIndex);
      const hoverRadius = Math.max(CELL_SIZE * 3, 150);

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
      const hoverRadius = Math.max(CELL_SIZE * 3, 150);

      for (const cell of cells) {
        if (!settle && cell.flipMode === "out") {
          continue;
        }

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
      const { columns, rows } = getGridSize(width, height);

      if (width === 0 || height === 0 || columns === 0 || rows === 0) {
        return false;
      }

      const pixelWidth = Math.max(1, Math.floor(width * dpr));
      const pixelHeight = Math.max(1, Math.floor(height * dpr));
      const didCanvasResize =
        canvas.width !== pixelWidth || canvas.height !== pixelHeight;
      const didGridResize = gridColumns !== columns || gridRows !== rows;

      if (!didCanvasResize && !didGridResize && !force) {
        return true;
      }

      if (didCanvasResize || force) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      if (didGridResize || cells.length === 0 || force) {
        const hadCells = cells.length > 0;
        gridColumns = columns;
        gridRows = rows;
        cells = createCells(columns, rows, cells);

        if (!hadCells || settle) {
          applyBeat(settle);
        }
      }

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
      const hoverRadius = Math.max(CELL_SIZE * 3, 150);

      if (width === 0 || height === 0) {
        return;
      }

      context.clearRect(0, 0, width, height);

      if (!isFontReady) {
        return;
      }

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = getSymbolFont(CELL_SIZE);

      for (const cell of cells) {
        if (!cell.visible) continue;

        const symbol = getDrawableSymbol(cell);
        const flipScale = getFlipScale(cell);

        if (flipScale <= 0.01) continue;

        const cursorScale = getCursorScale(cell, mouse, hoverRadius);
        const symbolOpacity = isDark ? 0.15 : 0.1;

        context.fillStyle = isDark
          ? `rgba(244, 244, 245, ${symbolOpacity})`
          : `rgba(39, 39, 42, ${symbolOpacity})`;

        context.save();
        context.translate(cell.x, cell.y);
        context.scale(cursorScale * flipScale, cursorScale * flipScale);
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
        shouldWaitForNextBeat = false;
      }

      if (shouldRevealNearCursor && !shouldWaitForNextBeat) {
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
      if (resize()) {
        draw();
      }
    };

    const handleActiveIndexChange = () => {
      shouldWaitForNextBeat = true;
      shouldRevealNearCursor = false;
      hideVisibleCells();
    };

    const initialize = () => {
      if (isCancelled) {
        return;
      }

      if (!resize(true, true)) {
        initializeFrame = requestAnimationFrame(initialize);
        return;
      }

      draw();
      lastBeatAt = Math.floor(performance.now() / BEAT_MS) * BEAT_MS;
      frame = requestAnimationFrame(render);

      requestAnimationFrame(() => {
        if (isCancelled) {
          return;
        }

        if (resize()) {
          draw();
        }
      });
    };

    let initializeFrame = 0;

    waitForSymbolFont().finally(() => {
      if (isCancelled) {
        return;
      }

      isFontReady = true;
      initializeFrame = requestAnimationFrame(initialize);
    });

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);
    window.addEventListener(
      "home-symbols-index-change",
      handleActiveIndexChange,
    );

    return () => {
      isCancelled = true;
      cancelAnimationFrame(initializeFrame);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener(
        "home-symbols-index-change",
        handleActiveIndexChange,
      );
    };
  }, [canRender]);

  if (!canRender) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
