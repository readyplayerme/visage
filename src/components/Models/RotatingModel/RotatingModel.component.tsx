import React, { useRef, FC } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { CenteredModel } from 'src/components/Models/CenteredModel';
import { useGltfLoader } from 'src/services';
import { BaseModelProps } from 'src/types';

export interface RotatingModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  scale?: number;
  lockHorizontal?: boolean;
  lockVertical?: boolean;
  horizontalRotationStep?: number;
  verticalRotationStep?: number;
}

export const RotatingModel: FC<RotatingModelProps> = ({
  modelSrc,
  scale = 1.0,
  onLoaded,
  bloom,
  lockVertical,
  lockHorizontal,
  horizontalRotationStep,
  verticalRotationStep
}) => {
  const ref = useRef<Group>(null);
  const { scene } = useGltfLoader(modelSrc);

  useFrame((state) => {
    if (ref?.current) {
      ref.current.position.x = 0;
      ref.current.position.z = 0;
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <CenteredModel
      verticalRotationStep={verticalRotationStep}
      horizontalRotationStep={horizontalRotationStep}
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
