import { LinearFilter, MeshStandardMaterial, Material } from 'three';

export const isValidGlbUrl = (url: string | string[]): boolean => {
  if (Array.isArray(url)) {
    return url.filter((url) => !isValidGlbUrl(url)).length === 0;
  }
  const expression = new RegExp(/(.glb|.glb[?].*)$/g);
  return expression.test(url);
};

export const clamp = (value: number, max: number, min: number): number => Math.min(Math.max(min, value), max);

export const lerp = (start: number, end: number, time = 0.1): number => start * (1 - time) + end * time;

/**
 * Avoid texture pixelation and add depth effect.
 */
export const normaliseMaterialsConfig = (materials: Record<string, Material>) => {
  Object.values(materials).forEach((material) => {
    const mat = material as MeshStandardMaterial;
    if (mat.map) {
      mat.map.minFilter = LinearFilter;
      mat.depthWrite = true;
    }
  });
};
