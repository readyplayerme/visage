import React, { useEffect, useCallback, useRef } from 'react';
import {
  LinearFilter,
  MeshStandardMaterial,
  Material,
  Vector2,
  Object3D,
  SkinnedMesh,
  Euler,
  Vector3,
  BufferGeometry,
  Skeleton,
  Group
} from 'three';
import { useFrame } from '@react-three/fiber';
import type { ObjectMap, SkinnedMeshProps } from '@react-three/fiber';
import { GLTF, GLTFLoader, DRACOLoader } from 'three-stdlib';
import { suspend } from 'suspend-react';
import { Emotion } from 'src/components/Avatar/Avatar.component';
import { BloomConfiguration } from 'src/types';

export interface CustomNode extends Object3D {
  geometry: BufferGeometry;
  material: Material;
  skeleton: Skeleton;
  isMesh: boolean;
  morphTargetInfluences?: number[];
}

export interface Nodes {
  [node: string]: Object3D;
}

type Source = string | string[] | Blob | undefined | null;

export const getStoryAssetPath = (publicAsset: string) =>
  `${process.env.NODE_ENV === 'production' ? '/visage' : ''}/${publicAsset}`;

const validateSource = (source: Source): boolean => {
  if (Array.isArray(source)) {
    return source.length > 0 && source.every(validateSource);
  }

  if (typeof source === 'string') {
    const fileEndExpression = new RegExp(/(.glb|.fbx|.fbx[?].*|.glb[?].*)$/g);
    const uploadFileExpression = new RegExp(/^data:application\/octet-stream;base64,/g);
    const gltfModelExpression = new RegExp(/^data:model\/gltf-binary;base64,/g);
    return fileEndExpression.test(source) || uploadFileExpression.test(source) || gltfModelExpression.test(source);
  }

  if (source instanceof Blob) {
    return source.type === 'model/gltf-binary';
  }

  return false;
};

export const isValidFormat = (source: Source): source is Blob | string => {
  const isValid = validateSource(source);

  if (source && !isValid) {
    console.warn(
      'Provided GLB/FBX is invalid. Check docs for supported formats: https://github.com/readyplayerme/visage'
    );
  }

  return isValid;
};

export const clamp = (value: number, max: number, min: number): number => Math.min(Math.max(min, value), max);

export const lerp = (start: number, end: number, time = 0.05): number => start * (1 - time) + end * time;

/**
 * Avoid texture pixelation and add depth effect.
 */
export const normaliseMaterialsConfig = (materials: Record<string, Material>, bloomConfig?: BloomConfiguration) => {
  Object.values(materials).forEach((material) => {
    const mat = material as MeshStandardMaterial;
    if (mat.map) {
      mat.map.minFilter = LinearFilter;
      mat.depthWrite = true;
    }

    if (mat.name.toLowerCase().includes('hair')) {
      mat.roughness = 0.9;
    }

    if (mat.emissiveMap) {
      mat.emissiveIntensity = bloomConfig?.materialIntensity || 3.3;
      mat.toneMapped = false;
    }
  });
};

interface UseHeadMovement {
  nodes: Nodes;
  isHalfBody?: boolean;
  distance?: number;
  activeRotation?: number;
  rotationMargin?: Vector2;
  enabled?: boolean;
}
/**
 * Avatar head movement relative to cursor.
 * When the model isn't a standard Ready Player Me avatar, the head movement won't take effect.
 */
export const useHeadMovement = ({
  nodes,
  isHalfBody = false,
  distance = 2,
  activeRotation = 0.2,
  rotationMargin = new Vector2(5, 10),
  enabled = false
}: UseHeadMovement) => {
  const rad = Math.PI / 180;
  const currentPos = new Vector2(0, 0);
  const targetPos = new Vector2(0, 0);
  const activeDistance = distance - (isHalfBody ? 1 : 0);
  const eyeRotationOffsetX = isHalfBody ? 90 * rad : 0;
  const neckBoneRotationOffsetX = (isHalfBody ? -5 : 10) * rad;
  const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
    ((clamp(value, inMax, inMin) - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

  useFrame((state) => {
    if (!enabled || !nodes.Neck || !nodes.Head || !nodes.RightEye || !nodes.LeftEye) {
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

export const useEmotion = (nodes: ObjectMap['nodes'], emotion?: Emotion) => {
  // @ts-ignore
  const meshes = Object.values(nodes).filter((item: SkinnedMesh) => item?.morphTargetInfluences) as SkinnedMesh[];

  const resetEmotions = (resetMeshes: Array<SkinnedMesh>) => {
    resetMeshes.forEach((mesh) => {
      mesh?.morphTargetInfluences?.forEach((_, index) => {
        mesh!.morphTargetInfluences![index] = 0;
      });
    });
  };

  useFrame(() => {
    if (emotion) {
      resetEmotions(meshes);

      meshes.forEach((mesh) => {
        Object.entries(emotion).forEach(([shape, value]) => {
          const shapeId = mesh?.morphTargetDictionary?.[shape];

          if (shapeId) {
            mesh!.morphTargetInfluences![shapeId] = value;
          }
        });
      });
    } else {
      resetEmotions(meshes);
    }
  });
};

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
loader.setDRACOLoader(dracoLoader);

export const useGltfLoader = (source: Blob | string): GLTF =>
  suspend(
    async () => {
      if (source instanceof Blob) {
        const buffer = await source.arrayBuffer();
        return (await loader.parseAsync(buffer, '')) as unknown as GLTF;
      }

      return loader.loadAsync(source);
    },
    [source],
    { lifespan: 100 }
  );

export function usePersistantRotation(scene: Group) {
  const refToPreviousScene = useRef(scene);

  useEffect(() => {
    if (refToPreviousScene.current !== scene) {
      // eslint-disable-next-line no-param-reassign
      scene.rotation.y = refToPreviousScene.current.rotation.y;
      refToPreviousScene.current = scene;
    }
  }, [scene]);
}

export class Transform {
  constructor() {
    this.scale = new Vector3(1, 1, 1);
    this.rotation = new Euler(0, 0, 0);
    this.position = new Vector3(0, 0, 0);
  }

  scale: Vector3;

  rotation: Euler;

  position: Vector3;
}

/**
 * Builds a fallback model for given nodes.
 * Useful for displaying as the suspense fallback object.
 */
function buildFallback(nodes: Nodes, transform: Transform = new Transform()): JSX.Element {
  return (
    <group>
      {Object.keys(nodes).map((key) => {
        const node = nodes[key] as CustomNode;
        if (node.type === 'SkinnedMesh') {
          return (
            <skinnedMesh
              castShadow
              receiveShadow
              key={node.name}
              scale={transform.scale}
              position={transform.position}
              rotation={transform.rotation}
              geometry={node.geometry}
              material={node.material}
              skeleton={node.skeleton}
              morphTargetInfluences={node.morphTargetInfluences || []}
            />
          );
        }

        if (node.type === 'Mesh') {
          return (
            <mesh
              castShadow
              receiveShadow
              key={node.name}
              scale={transform.scale}
              position={transform.position}
              rotation={transform.rotation}
              geometry={node.geometry}
              material={node.material}
              morphTargetInfluences={node.morphTargetInfluences || []}
            />
          );
        }

        return null;
      })}
    </group>
  );
}

export const useFallback = (nodes: Nodes, setter?: (fallback: JSX.Element) => void) =>
  useEffect(() => {
    if (typeof setter === 'function') {
      setter(buildFallback(nodes));
    }
  }, [setter, nodes]);

export const triggerCallback = (callback?: () => void) => {
  if (typeof callback === 'function') {
    callback();
  }
};

export const expressions = {
  blink: [
    {
      morphTarget: 'eyesClosed',
      morphTargetIndex: -1,
      offset: 0,
      duration: 0.2
    },
    {
      morphTarget: 'eyeSquintLeft',
      morphTargetIndex: -1,
      offset: 0,
      duration: 0.2
    },
    {
      morphTarget: 'eyeSquintRight',
      morphTargetIndex: -1,
      offset: 0,
      duration: 0.2
    }
  ]
};

/**
 * Animates avatars facial expressions when morphTargets=ARKit,Eyes Extra is provided with the avatar.
 */
export const useIdleExpression = (expression: keyof typeof expressions, nodes: Nodes) => {
  const headMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar) as unknown as SkinnedMeshProps;
  const selectedExpression = expression in expressions ? expressions[expression] : undefined;
  const timeout = useRef<NodeJS.Timeout>();
  const duration = useRef<number>(Number.POSITIVE_INFINITY);

  useEffect(() => {
    if (headMesh?.morphTargetDictionary && selectedExpression) {
      for (let i = 0; i < selectedExpression.length; i++) {
        selectedExpression[i].morphTargetIndex = headMesh.morphTargetDictionary[selectedExpression[i].morphTarget];
      }
    }
  }, [selectedExpression?.length]);

  const animateExpression = useCallback(
    (delta: number) => {
      if (headMesh?.morphTargetInfluences && selectedExpression) {
        duration.current += delta;

        for (let i = 0; i < selectedExpression.length; i++) {
          const section = selectedExpression[i];

          if (duration.current < section.duration + section.offset) {
            if (duration.current > section.offset) {
              const pivot = ((duration.current - section.offset) / section.duration) * Math.PI;
              const morphInfluence = Math.sin(pivot);
              headMesh.morphTargetInfluences[section.morphTargetIndex] = morphInfluence;
            }
          } else {
            headMesh.morphTargetInfluences[section.morphTargetIndex] = 0;
          }
        }
      }
    },
    [headMesh?.morphTargetInfluences, selectedExpression, duration.current, timeout.current]
  );

  const setNextInterval = () => {
    duration.current = 0;
    const delay = Math.random() * 3000 + 3000;

    clearTimeout(timeout.current);
    timeout.current = setTimeout(setNextInterval, delay);
  };

  useEffect(() => {
    if (selectedExpression) {
      timeout.current = setTimeout(setNextInterval, 3000);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [selectedExpression]);

  useFrame((_, delta) => {
    if (headMesh && selectedExpression) {
      animateExpression(delta);
    }
  });
};
