import React, { useRef, FC } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Model } from 'src/components/Models/Model';
import { useGltfLoader } from 'src/services';
import { BaseModelProps } from 'src/types';

export interface RotatingModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  scale?: number;
  lockHorizontal?: boolean;
  lockVertical?: boolean;
}

export const RotatingModel: FC<RotatingModelProps> = ({
  modelSrc,
  scale = 1.0,
  onLoaded,
  bloom,
  lockVertical,
  lockHorizontal
}) => {
  const ref = useRef<Group>(null);
  const { scene } = useGltfLoader(modelSrc);

  useFrame((_, delta) => {
    if (ref?.current) {
      ref.current.position.x = 0;
      ref.current.position.z = 0;
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Model
      lockHorizontal={lockHorizontal}
      lockVertical={lockVertical}
      modelRef={ref}
      scale={scale}
      scene={scene}
      onLoaded={onLoaded}
      bloom={bloom}
    />
  );
};
