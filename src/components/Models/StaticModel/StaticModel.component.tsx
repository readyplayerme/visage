import React, { FC, MutableRefObject } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib/loaders/GLTFLoader';
import { Model } from 'src/components/Models/Model';
import { Group } from 'three';

interface StaticModelProps {
  modelUrl: string;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
}

export const StaticModel: FC<StaticModelProps> = ({ modelUrl, modelRef, scale = 1 }) => {
  const { scene } = useLoader(GLTFLoader, modelUrl);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
