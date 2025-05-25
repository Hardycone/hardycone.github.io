// /types.ts

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  glyph: React.ComponentType;
  // Add more fields if needed, like image, tags, etc.
};
