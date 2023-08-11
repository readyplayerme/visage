import React, { useRef, FC, useMemo } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { AnimationMixer, Group } from 'three';
import { Model } from 'src/components/Models/Model';
import { useHeadMovement, useGltfLoader, useFallback } from 'src/services';
import { BaseModelProps } from 'src/types';
import { loadAnimationClip } from '../../../services/Animation.service';

export interface AnimationModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  animationSrc: string | Blob;
  rotation?: number;
  scale?: number;
  idleRotation?: boolean;
  headMovement?: boolean;
}

let currentRotation = 0;

export const AnimationModel: FC<AnimationModelProps> = ({
  modelSrc,
  animationSrc,
  rotation = 20 * (Math.PI / 180),
  scale = 1,
  idleRotation = false,
  setModelFallback,
  onLoaded,
  headMovement = false,
  bloom
}) => {
  const ref = useRef<Group>(null);
  const [animationRunning, setAnimationRunning] = React.useState(true);
  const onSpawnAnimationFinish = () => {
    setAnimationRunning(false);
  };

  const { scene } = useGltfLoader(modelSrc);
  const { nodes } = useGraph(scene);

  const animationMixer = useMemo(async () => {
    const mixer = new AnimationMixer(nodes.Armature);
    if (animationRunning) {
      return mixer;
    }

    const animationClip = await loadAnimationClip(animationSrc);

    const animation = mixer.clipAction(animationClip);
    animation.fadeIn(0.5);
    animation.play();

    mixer.update(0);

    return mixer;
  }, [animationRunning, animationSrc, nodes.Armature]);

  useFrame(async (state, delta) => {
    (await animationMixer)?.update(delta);

    if (!idleRotation) {
      return;
    }

    if (ref?.current) {
      currentRotation += delta * 0.2;
      ref.current.rotation.y = rotation + Math.sin(currentRotation) / 3;
    }
  });

  useHeadMovement({ nodes, enabled: headMovement });
  useFallback(nodes, setModelFallback);

  return (
    <Model
      modelRef={ref}
      scene={scene}
      scale={scale}
      onLoaded={onLoaded}
      onSpawnAnimationFinish={onSpawnAnimationFinish}
      bloom={bloom}
    />
  );
};
