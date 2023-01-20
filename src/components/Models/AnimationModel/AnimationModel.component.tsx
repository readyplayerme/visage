import React, { useRef, FC, useMemo } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { AnimationMixer, Group } from 'three';
import { Model } from 'src/components/Models/Model';
import { useHeadMovement, useGltfLoader, useFallback } from 'src/services';
import { BaseModelProps } from 'src/types';

export interface AnimationModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  animationSrc: string | Blob;
  rotation?: number;
  scale?: number;
  idleRotation?: boolean;
  headMovement?: boolean;
}

let currentRotation = 0;

export const AnimationModel: FC<AnimationModelProps> = ({
  modelSrc,
  animationSrc,
  rotation = 20 * (Math.PI / 180),
  scale = 1,
  idleRotation = false,
  setModelFallback,
  onLoaded,
  headMovement = false
}) => {
  const ref = useRef<Group>();
  const { scene } = useGltfLoader(modelSrc);
  const { nodes } = useGraph(scene);

  const animationSource = useGltfLoader(animationSrc);

  const animationMixer = useMemo(() => {
    const mixer = new AnimationMixer(nodes.Armature);

    mixer.clipAction(animationSource.animations[0]).play();
    mixer.update(0);

    return mixer;
  }, [animationSource.animations, nodes.Armature]);

  useFrame((state, delta) => {
    animationMixer?.update(delta);

    if (!idleRotation) {
      return;
    }

    if (ref?.current) {
      currentRotation += delta * 0.2;
      ref.current.rotation.y = rotation + Math.sin(currentRotation) / 3;
    }
  });

  useHeadMovement({ nodes, enabled: headMovement });
  useFallback(nodes, setModelFallback);

  return <Model modelRef={ref} scene={scene} scale={scale} onLoaded={onLoaded} />;
};
