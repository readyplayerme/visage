import React, { useRef, FC, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { AnimationMixer, Group } from 'three';
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
  const mixerRef = useRef<AnimationMixer>();
  const { scene, animations } = useGltfLoader(modelSrc);

  useEffect(() => {
    if (animations.length && ref.current) {
      mixerRef.current = new AnimationMixer(scene);
      const action = mixerRef.current.clipAction(animations[0]);
      action.play();
    }
    return () => {
      mixerRef.current?.stopAllAction();
      mixerRef.current?.uncacheRoot(scene);
    };
  }, [animations, scene]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.x = 0;
      ref.current.position.z = 0;
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
    mixerRef.current?.update(delta);
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
