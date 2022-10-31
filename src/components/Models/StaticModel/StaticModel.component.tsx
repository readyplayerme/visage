import React, { FC, MutableRefObject } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Model } from 'src/components/Models/Model';
import { Group } from 'three';

interface StaticModelProps {
  modelSrc: string;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
}

export const StaticModel: FC<StaticModelProps> = ({ modelSrc, modelRef, scale = 1 }) => {
  const { scene } = useLoader(GLTFLoader, modelSrc);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
