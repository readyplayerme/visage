import React, { FC, MutableRefObject } from 'react';
import { Model } from 'src/components/Models/Model';
import { useFallback, useGltfLoader } from 'src/services';
import { Group } from 'three';
import { useGraph } from '@react-three/fiber';

interface StaticModelProps {
  modelSrc: string | Blob;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
  setModelFallback: (fallback: JSX.Element) => void;
}

export const StaticModel: FC<StaticModelProps> = ({ modelSrc, modelRef, scale = 1, setModelFallback }) => {
  const { scene } = useGltfLoader(modelSrc);
  const { nodes } = useGraph(scene);

  useFallback(setModelFallback, nodes);

  return <Model modelRef={modelRef} scene={scene} scale={scale} />;
};
