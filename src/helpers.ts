import { LinearFilter, MeshStandardMaterial, Material, Vector2, Object3D } from 'three';
import { useFrame } from '@react-three/fiber';

export const getStoryAssetPath = (publicAsset: string) =>
  `${process.env.NODE_ENV === 'production' ? '/visage' : ''}/${publicAsset}`;

export const isValidGlbUrl = (url: string | string[] | undefined): boolean => {
  if (Array.isArray(url)) {
    return url.filter((url) => !isValidGlbUrl(url)).length === 0;
  }

  if (typeof url === 'string') {
    const expression = new RegExp(/(.glb|.glb[?].*)$/g);
    return expression.test(url);
  }

  return false;
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

/**
 * Avatar head movement relative to cursor.
 */
export const useHeadMovement = (
  objects: Record<string, Object3D>,
  isHalfBody: boolean = false,
  distance = 2,
  activeRotation = 0.2,
  rotationMargin: Vector2 = new Vector2(5, 10)
) => {
  const rad = Math.PI / 180;
  const currentPos = new Vector2(0, 0);
  const targetPos = new Vector2(0, 0);
  const activeDistance = distance - (isHalfBody ? 1 : 0);
  const eyeRotationOffsetX = isHalfBody ? 90 * rad : 0;
  const neckBoneRotationOffsetX = (isHalfBody ? -5 : 10) * rad;
  const nodes = objects;

  const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
    ((clamp(value, inMin, inMax) - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

  useFrame((state) => {
    const cameraToHeadDistance = state.camera.position.distanceTo(nodes.Head.position);
    const cameraRotation = Math.abs(state.camera.rotation.z);

    if (cameraToHeadDistance < activeDistance && cameraRotation < activeRotation) {
      targetPos.x = mapRange(state.mouse.y, -0.5, 1, rotationMargin.x * rad, -rotationMargin.x * rad);
      targetPos.y = mapRange(state.mouse.x, -0.5, 0.5, -rotationMargin.y * rad, rotationMargin.y * rad);
    } else {
      targetPos.set(0, 0);
    }

    currentPos.x = lerp(currentPos.x, targetPos.x);
    currentPos.y = lerp(currentPos.y, targetPos.y);

    nodes.Neck.rotation.x = currentPos.x + neckBoneRotationOffsetX;
    nodes.Neck.rotation.y = currentPos.y;

    nodes.Head.rotation.x = currentPos.x;
    nodes.Head.rotation.y = currentPos.y;

    nodes.RightEye.rotation.x = currentPos.x - eyeRotationOffsetX;
    nodes.LeftEye.rotation.x = currentPos.x - eyeRotationOffsetX;

    if (isHalfBody) {
      nodes.RightEye.rotation.z = currentPos.y * 2 + Math.PI;
      nodes.LeftEye.rotation.z = currentPos.y * 2 + Math.PI;
    } else {
      nodes.RightEye.rotation.y = currentPos.y * 2;
      nodes.LeftEye.rotation.y = currentPos.y * 2;
    }
  });
};
