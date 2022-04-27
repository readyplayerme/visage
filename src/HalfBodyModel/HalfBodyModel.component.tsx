import React, { FC, useRef } from 'react';
import { useFrame, useGraph, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/Model';
import { Group } from 'three';
import { useHeadMovement } from 'src/helpers';

interface HalfBodyModelProps {
  modelUrl: string;
  rotation?: number;
  scale?: number;
}

let currentRotation = 0;

export const HalfBodyModel: FC<HalfBodyModelProps> = ({ modelUrl, scale = 1, rotation = 20 * (Math.PI / 180) }) => {
  const ref = useRef<Group>();
  const { scene } = useLoader(GLTFLoader, modelUrl);
  const { nodes } = useGraph(scene);

  scene.traverse((object) => {
    const node = object;
    if (node.name === 'Wolf3D_Hands') {
      node.visible = false;
    }

    if (node.name === 'RightHand') {
      node.position.set(0, -2, 0);
    }

    if (node.name === 'LeftHand') {
      node.position.set(0, -2, 0);
    }
  });

  useFrame((state, delta) => {
    if (ref?.current) {
      currentRotation += delta * 0.2;
      ref.current.rotation.y = rotation + Math.sin(currentRotation) / 3;
    }
  });

  useHeadMovement(nodes, true);

  return <Model modelRef={ref} scene={scene} scale={scale} />;
};
