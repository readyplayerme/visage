import React, { FC, MutableRefObject } from 'react';
import { Model } from 'src/components/Models/Model';
import { triggerCallback, useFallback, useGltfLoader } from 'src/services';
import { Group } from 'three';
import { useGraph } from '@react-three/fiber';
import { BaseModelProps } from 'src/types';

export interface StaticModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
}

export const StaticModel: FC<StaticModelProps> = ({
  modelSrc,
  modelRef,
  scale = 1,
  setModelFallback,
  onLoading,
  onLoaded
}) => {
  triggerCallback(onLoading);
  const { scene } = useGltfLoader(modelSrc);
  const { nodes } = useGraph(scene);

  useFallback(nodes, setModelFallback);

  return <Model modelRef={modelRef} scene={scene} scale={scale} onLoaded={onLoaded} />;
};
