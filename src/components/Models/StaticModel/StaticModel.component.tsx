import React, { FC, Ref } from 'react';
import { Model } from 'src/components/Models/Model';
import { useEmotion, useFallback, useGltfLoader } from 'src/services';
import { Group } from 'three';

import { BaseModelProps } from 'src/types';
import { Emotion } from '../../Avatar/Avatar.component';

export interface StaticModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  modelRef?: Ref<Group>;
  scale?: number;
  emotion?: Emotion;
}

export const StaticModel: FC<StaticModelProps> = ({
  modelSrc,
  modelRef,
  scale = 1,
  setModelFallback,
  onLoaded,
  emotion,
  bloom,
  materialConfig
}) => {
  const { scene } = useGltfLoader(modelSrc);
  useEmotion(scene, emotion);
  useFallback(scene, setModelFallback);

  return (
    <Model
      modelRef={modelRef}
      scene={scene}
      scale={scale}
      onLoaded={onLoaded}
      bloom={bloom}
      materialConfig={materialConfig}
    />
  );
};
