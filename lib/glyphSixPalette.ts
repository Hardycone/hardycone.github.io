import type { GlyphAnimationData } from "@/data/projects";

export const GLYPH_SIX_PALETTE = {
  light: {
    coldGray: "#091F2F",
    coldGrayDark: "#04141F",
    coldGrayLight: "#738A9B",
    detailStroke: "#FFFFFF",
  },
  dark: {
    coldGray: "#E6EDF2",
    coldGrayDark: "#C2D0DA",
    coldGrayLight: "#FFFFFF",
    detailStroke: "#091F2F",
  },
};

type GlyphSixPalette = (typeof GLYPH_SIX_PALETTE)["light"];
type PaletteKey = keyof GlyphSixPalette;
type JsonObject = Record<string, unknown>;

const FILL_COLOR_KEYS: Record<string, PaletteKey> = {
  "#091F2F": "coldGray",
  "#04141F": "coldGrayDark",
  "#738A9B": "coldGrayLight",
};

function hexToLottieColor(hex: string): number[] {
  return [1, 3, 5].map(
    (start) => parseInt(hex.slice(start, start + 2), 16) / 255,
  );
}

function lottieColorToHex(color: number[]): string {
  return `#${color
    .slice(0, 3)
    .map((channel) =>
      Math.round(channel * 255).toString(16).padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}

function recolorValue(
  value: unknown,
  palette: GlyphSixPalette,
  stroke: boolean,
) {
  if (!Array.isArray(value) || value.length < 3) return;

  const paletteKey = stroke
    ? lottieColorToHex(value as number[]) === "#FFFFFF"
      ? "detailStroke"
      : undefined
    : FILL_COLOR_KEYS[lottieColorToHex(value as number[])];

  if (!paletteKey) return;
  const alpha = value[3] ?? 1;
  value.splice(0, 4, ...hexToLottieColor(palette[paletteKey]), alpha);
}

function recolorProperty(
  property: JsonObject | undefined,
  palette: GlyphSixPalette,
  stroke: boolean,
) {
  if (!property || !Array.isArray(property.k)) return;

  if (property.k.every((value) => typeof value === "number")) {
    recolorValue(property.k, palette, stroke);
    return;
  }

  for (const value of property.k) {
    if (!value || typeof value !== "object") continue;
    const keyframe = value as JsonObject;
    recolorValue(keyframe.s, palette, stroke);
    recolorValue(keyframe.e, palette, stroke);
  }
}

function recolorShapes(shapes: unknown, palette: GlyphSixPalette) {
  if (!Array.isArray(shapes)) return;

  for (const value of shapes) {
    if (!value || typeof value !== "object") continue;
    const shape = value as JsonObject;

    if (shape.ty === "fl") {
      recolorProperty(shape.c as JsonObject | undefined, palette, false);
    } else if (shape.ty === "st") {
      recolorProperty(shape.c as JsonObject | undefined, palette, true);
    }

    recolorShapes(shape.it, palette);
  }
}

function recolorLayers(layers: unknown, palette: GlyphSixPalette) {
  if (!Array.isArray(layers)) return;

  for (const value of layers) {
    if (!value || typeof value !== "object") continue;
    recolorShapes((value as JsonObject).shapes, palette);
  }
}

export function applyGlyphSixPalette(
  animationData: GlyphAnimationData,
  theme: "light" | "dark",
) {
  const data = animationData as JsonObject;
  const palette = GLYPH_SIX_PALETTE[theme];

  recolorLayers(data.layers, palette);
  if (!Array.isArray(data.assets)) return;

  for (const value of data.assets) {
    if (!value || typeof value !== "object") continue;
    recolorLayers((value as JsonObject).layers, palette);
  }
}
