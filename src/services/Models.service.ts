import { LinearFilter, MeshStandardMaterial, Material, Vector2, Object3D, SkinnedMesh } from 'three';
import { useFrame } from '@react-three/fiber';
import type { ObjectMap } from '@react-three/fiber';
import { EmotionType, EmotionVariantsType } from '../types';

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

const emotions: Record<EmotionVariantsType, Array<EmotionType>> = {
  idle: [],
  impressed: [
    {
      id: 0,
      value: 0.7,
      name: 'mouthOpen'
    },
    {
      id: 1,
      value: 0.3,
      name: 'mouthSmile'
    },
    {
      id: 24,
      value: 0.4,
      name: 'mouthDimpleLeft'
    },
    {
      id: 25,
      value: 0.4,
      name: 'mouthDimpleRight'
    },
    {
      id: 7,
      value: 0.75,
      name: 'eyeWideLeft'
    },
    {
      id: 10,
      value: 0.75,
      name: 'eyeWideRight'
    },
    {
      id: 40,
      value: 0.3,
      name: 'browInnerUp'
    }
  ],
  sad: [
    {
      id: 1,
      value: -0.35,
      name: 'mouthSmile'
    },
    {
      id: 38,
      value: -0.45,
      name: 'browDownLeft'
    },
    {
      id: 39,
      value: -0.45,
      name: 'browDownRight'
    },
    {
      id: 30,
      value: 0.3,
      name: 'browDownRight'
    },
    {
      id: 46,
      value: -0.35,
      name: 'noseSneerLeft'
    },
    {
      id: 47,
      value: -0.35,
      name: 'noseSneerRight'
    }
  ],
  angry: [
    {
      id: 38,
      value: 0.95,
      name: 'browDownLeft'
    },
    {
      id: 39,
      value: 0.95,
      name: 'browDownRight'
    },
    {
      id: 24,
      value: -0.5,
      name: 'mouthDimpleLeft'
    },
    {
      id: 25,
      value: -0.5,
      name: 'mouthDimpleRight'
    },
    {
      id: 35,
      value: -0.3,
      name: 'mouthLowerDownRight'
    },
    {
      id: 34,
      value: -0.3,
      name: 'mouthLowerDownLeft'
    },
    {
      id: 46,
      value: 0.35,
      name: 'noseSneerLeft'
    },
    {
      id: 47,
      value: 0.35,
      name: 'noseSneerRight'
    },
    {
      id: 5,
      value: 0.15,
      name: 'eyeBlinkLeft'
    },
    {
      id: 8,
      value: 0.15,
      name: 'eyeBlinkRight'
    }
  ],
  happy: [
    {
      id: 1,
      value: 0.6,
      name: 'mouthSmile'
    },
    {
      id: 0,
      value: 0.3,
      name: 'mouthOpen'
    },
    {
      id: 39,
      value: -0.5,
      name: 'browDownRight'
    },
    {
      id: 38,
      value: -0.5,
      name: 'browDownLeft'
    },
    {
      id: 24,
      value: 0.7,
      name: 'mouthDimpleLeft'
    },
    {
      id: 25,
      value: 0.7,
      name: 'mouthDimpleRight'
    },
    {
      id: 46,
      value: 0.45,
      name: 'noseSneerLeft'
    },
    {
      id: 47,
      value: 0.45,
      name: 'noseSneerRight'
    }
  ]
};

export const useEmotion = (nodes: ObjectMap['nodes'], emotion: EmotionVariantsType) => {
  const headMesh = nodes.Wolf3D_Head as SkinnedMesh;

  useFrame(() => {
    if (!headMesh) {
      return;
    }

    if (emotion !== 'idle') {
      emotions[emotion].forEach((item) => {
        headMesh!.morphTargetInfluences![item.id] = item.value;
      });
    }
  });
};
