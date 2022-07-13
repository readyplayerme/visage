import React, { useRef, FC } from 'react';
import { useFrame, useGraph, useLoader } from '@react-three/fiber';
import { AnimationMixer, Group } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/components/Models/Model';
import { useHeadMovement } from 'src/services';

interface AnimationModelProps {
  modelUrl: string;
  animationUrl: string;
  rotation?: number;
  scale?: number;
  idleRotation?: boolean;
}

let currentRotation = 0;

export const AnimationModel: FC<AnimationModelProps> = ({
  modelUrl,
  animationUrl,
  rotation = 20 * (Math.PI / 180),
  scale = 1,
  idleRotation = false
}) => {
  const ref = useRef<Group>();
  const { scene } = useLoader(GLTFLoader, modelUrl);
  const { nodes } = useGraph(scene);

  const animationSource = useLoader(GLTFLoader, animationUrl);
  const mixer = new AnimationMixer(nodes.Armature);
  mixer.clipAction(animationSource.animations[0]).play();
  mixer.update(0);

  useFrame((state, delta) => {
    mixer?.update(delta);

    if (!idleRotation) {
      return;
    }

    if (ref?.current) {
      currentRotation += delta * 0.2;
      ref.current.rotation.y = rotation + Math.sin(currentRotation) / 3;
    }
  });

  useHeadMovement(nodes);

  return <Model modelRef={ref} scene={scene} scale={scale} />;
};
