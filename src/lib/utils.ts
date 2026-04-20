/** Simple numeric utility used throughout the simulation engine */
export const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

export const round1 = (v: number): number => Math.round(v * 10) / 10;
