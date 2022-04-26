import React, { FC, MutableRefObject } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/Model';
import { Group } from 'three';

interface HalfBodyModelProps {
  modelUrl: string;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
}

export const HalfBodyModel: FC<HalfBodyModelProps> = ({ modelUrl, modelRef, scale = 1 }) => {
  const { scene } = useLoader(GLTFLoader, modelUrl);

  scene.traverse((object) => {
    const node = object;
    if (node.name === 'Wolf3D_Hands') {
      node.visible = false;
    }

    if (node.name === 'RightHand') {
      node.position.set(0, -2, 0);
      node.visible = false;
    }

    if (node.name === 'LeftHand') {
      node.position.set(0, -2, 0);
      node.visible = false;
    }
  });

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
