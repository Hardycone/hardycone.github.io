import type { GlyphAnimationData } from "@/data/projects";

const GLYPH_THREE_BASE_COLORS = {
  eye: "#5E390E",
  beak: "#ad8a66",
  belly: "#e2cda3",
  tailNeutral: "#e2cda3",
  yellow: "#f7b511",
  orange: "#ea5911",
  red: "#F61E1E",
  lime: "#A6FF00",
  green: "#26FF00",
  springGreen: "#00FF59",
  aqua: "#00FFD9",
  sky: "#00A6FF",
  blue: "#0026FF",
  violet: "#5900FF",
  magenta: "#D900FF",
  pink: "#FF00A6",
  vermilion: "#FF5E00",
  goldenYellow: "#FFEA00",
  chartreuse: "#8BFF00",
  emerald: "#00FF9D",
  cyan: "#00E5FF",
  azure: "#0070FF",
  purple: "#7A00FF",
  electricPurple: "#C400FF",
  rose: "#FF007A",
};

export const GLYPH_THREE_PALETTE = {
  light: {
    ...GLYPH_THREE_BASE_COLORS,
    outline: "#f4f4f5",
  },
  dark: {
    ...GLYPH_THREE_BASE_COLORS,
    outline: "#27272a",
  },
};

type GlyphThreePalette = (typeof GLYPH_THREE_PALETTE)["light"];
type PaletteKey = keyof GlyphThreePalette;
type JsonObject = Record<string, unknown>;

const GRADIENT_COLOR_KEYS: Record<string, PaletteKey> = {
  "#FFE130": "yellow",
  "#F6921E": "orange",
  "#F61E1E": "red",
  "#A6FF00": "lime",
  "#26FF00": "green",
  "#00FF59": "springGreen",
  "#00FFD9": "aqua",
  "#00A6FF": "sky",
  "#0026FF": "blue",
  "#5900FF": "violet",
  "#D900FF": "magenta",
  "#FF00A6": "pink",
  "#FF5E00": "vermilion",
  "#FFEA00": "goldenYellow",
  "#8BFF00": "chartreuse",
  "#00FF9D": "emerald",
  "#00E5FF": "cyan",
  "#0070FF": "azure",
  "#7A00FF": "purple",
  "#C400FF": "electricPurple",
  "#FF007A": "rose",
  "#E7E7E7": "tailNeutral",
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
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}

function setSolidColor(shape: JsonObject, color: string) {
  const colorProperty = shape.c as JsonObject | undefined;
  if (!colorProperty || !Array.isArray(colorProperty.k)) return;

  colorProperty.k = [...hexToLottieColor(color), colorProperty.k[3] ?? 1];
}

function recolorGradientArray(
  values: unknown,
  stopCount: number,
  palette: GlyphThreePalette,
) {
  if (!Array.isArray(values)) return;

  for (let stop = 0; stop < stopCount; stop += 1) {
    const colorIndex = stop * 4 + 1;
    const currentColor = values.slice(colorIndex, colorIndex + 3);
    if (!currentColor.every((channel) => typeof channel === "number")) continue;

    const paletteKey =
      GRADIENT_COLOR_KEYS[lottieColorToHex(currentColor as number[])];
    if (!paletteKey) continue;

    values.splice(colorIndex, 3, ...hexToLottieColor(palette[paletteKey]));
  }
}

function setGradientColors(shape: JsonObject, palette: GlyphThreePalette) {
  const gradient = shape.g as JsonObject | undefined;
  const colorProperty = gradient?.k as JsonObject | undefined;
  if (typeof gradient?.p !== "number" || !colorProperty) return;

  const keyframes = colorProperty.k;
  if (!Array.isArray(keyframes)) return;

  if (keyframes.every((value) => typeof value === "number")) {
    recolorGradientArray(keyframes, gradient.p, palette);
    return;
  }

  for (const value of keyframes) {
    if (!value || typeof value !== "object") continue;
    const keyframe = value as JsonObject;
    recolorGradientArray(keyframe.s, gradient.p, palette);
    recolorGradientArray(keyframe.e, gradient.p, palette);
  }
}

function recolorShapes(
  shapes: unknown,
  layerName: string,
  palette: GlyphThreePalette,
) {
  if (!Array.isArray(shapes)) return;

  for (const value of shapes) {
    if (!value || typeof value !== "object") continue;
    const shape = value as JsonObject;

    if (shape.ty === "st") setSolidColor(shape, palette.outline);
    if (shape.ty === "fl" && layerName === "Eye") {
      setSolidColor(shape, palette.eye);
    }
    if (shape.ty === "fl" && layerName === "Belly") {
      setSolidColor(shape, palette.belly);
    }
    if (shape.ty === "fl" && layerName === "Beak") {
      setSolidColor(shape, palette.beak);
    }
    if (shape.ty === "gf" || shape.ty === "gs") {
      setGradientColors(shape, palette);
    }

    recolorShapes(shape.it, layerName, palette);
  }
}

function recolorLayers(layers: unknown, palette: GlyphThreePalette) {
  if (!Array.isArray(layers)) return;

  for (const value of layers) {
    if (!value || typeof value !== "object") continue;
    const layer = value as JsonObject;
    recolorShapes(layer.shapes, String(layer.nm ?? ""), palette);
  }
}

export function applyGlyphThreePalette(
  animationData: GlyphAnimationData,
  theme: "light" | "dark",
) {
  const data = animationData as JsonObject;
  const palette = GLYPH_THREE_PALETTE[theme];

  recolorLayers(data.layers, palette);
  if (!Array.isArray(data.assets)) return;

  for (const value of data.assets) {
    if (!value || typeof value !== "object") continue;
    recolorLayers((value as JsonObject).layers, palette);
  }
}
