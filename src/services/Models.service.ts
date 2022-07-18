import { LinearFilter, MeshStandardMaterial, Material, Vector2, Object3D, SkinnedMesh } from 'three';
import { useFrame } from '@react-three/fiber';
import type { ObjectMap } from '@react-three/fiber';
import { useMemo } from 'react';
import { Emotions } from '../types';
import { Emotion } from '../components/Avatar/Avatar.component';

export const getStoryAssetPath = (publicAsset: string) =>
  `${process.env.NODE_ENV === 'production' ? '/visage' : ''}/${publicAsset}`;

export const isValidGlbUrl = (url: string | string[] | undefined): boolean => {
  if (Array.isArray(url)) {
    return url.length > 0 && url.every(isValidGlbUrl);
  }

  if (typeof url === 'string') {
    const expression = new RegExp(/(.glb|.glb[?].*)$/g);
    return expression.test(url);
  }

  return false;
};

export const clamp = (value: number, max: number, min: number): number => Math.min(Math.max(min, value), max);

export const lerp = (start: number, end: number, time = 0.05): number => start * (1 - time) + end * time;

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
 * When the model isn't a standard Ready Player Me avatar, the head movement won't take effect.
 */
export const useHeadMovement = (
  nodes: Record<string, Object3D>,
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
  const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
    ((clamp(value, inMax, inMin) - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

  useFrame((state) => {
    if (!nodes.Neck || !nodes.Head || !nodes.RightEye || !nodes.LeftEye) {
      return;
    }

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
    /* eslint-disable no-param-reassign */
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

/**
 * Transfers Bone positions from source to target.
 * @param targetNodes {object} - object that will be mutated
 * @param sourceNodes {object} - object that will be used as reference
 */
export const mutatePose = (targetNodes?: ObjectMap['nodes'], sourceNodes?: ObjectMap['nodes']) => {
  if (targetNodes && sourceNodes) {
    Object.keys(targetNodes).forEach((key) => {
      if (targetNodes[key].type === 'Bone' && sourceNodes[key]) {
        /* eslint-disable no-param-reassign */
        const pos = sourceNodes[key].position;
        targetNodes[key].position.set(pos.x, pos.y, pos.z);

        const rot = sourceNodes[key].rotation;
        targetNodes[key].rotation.set(rot.x, rot.y, rot.z);
      }
    });
  }
};

const emotions: Emotions = {
  idle: {},
  impressed: {
    mouthOpen: 0.7,
    mouthSmile: 0.3,
    mouthDimpleLeft: 0.4,
    mouthDimpleRight: 0.4,
    eyeWideLeft: 0.75,
    eyeWideRight: 0.75,
    browInnerUp: 0.3
  },
  sad: {
    mouthSmile: -0.35,
    browDownLeft: -0.45,
    browDownRight: -0.45,
    noseSneerLeft: -0.35,
    noseSneerRight: -0.35
  },
  angry: {
    browDownLeft: 0.95,
    browDownRight: 0.95,
    mouthDimpleLeft: -0.5,
    mouthDimpleRight: -0.5,
    mouthLowerDownRight: -0.3,
    mouthLowerDownLeft: -0.3,
    noseSneerLeft: 0.35,
    noseSneerRight: 0.35,
    eyeBlinkLeft: 0.15,
    eyeBlinkRight: 0.15
  },
  happy: {
    mouthSmile: 0.6,
    mouthOpen: 0.3,
    browDownRight: -0.5,
    browDownLeft: -0.5,
    mouthDimpleLeft: 0.7,
    mouthDimpleRight: 0.7,
    noseSneerLeft: 0.45,
    noseSneerRight: 0.45
  }
};

export const useEmotion = (nodes: ObjectMap['nodes'], emotion: Emotion) => {
  const headMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar) as SkinnedMesh;
  const selectedEmotion = useMemo(() => emotions[emotion], [emotion]);

  const resetEmotions = () =>
    headMesh?.morphTargetInfluences?.forEach((_, index) => {
      headMesh!.morphTargetInfluences![index] = 0;
    });

  useFrame(() => {
    if (!headMesh) {
      return;
    }

    if (emotion !== 'idle') {
      resetEmotions();

      Object.entries(selectedEmotion).forEach(([shape, value]) => {
        const shapeId = headMesh!.morphTargetDictionary?.[shape];

        if (shapeId) {
          headMesh!.morphTargetInfluences![shapeId] = value;
        }
      });
    } else {
      resetEmotions();
    }
  });
};
