import React, { FC, MutableRefObject } from 'react';
import { Model } from 'src/components/Models/Model';
import { useGltfLoader } from 'src/services';
import { Group } from 'three';

interface StaticModelProps {
  modelSrc: string | Blob;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
}

export const StaticModel: FC<StaticModelProps> = ({ modelSrc, modelRef, scale = 1 }) => {
  const { scene } = useGltfLoader(modelSrc);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
