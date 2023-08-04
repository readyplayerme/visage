import React, { FC, useEffect, useMemo, useRef } from 'react';
import { AnimationMixer, Group, LoopRepeat } from 'three';
import { useFrame, useGraph } from '@react-three/fiber';
import { triggerCallback, useGltfLoader } from '../../services';
import { SpawnState } from '../../types';

interface SpawnEffectProps {
  onLoadedEffectFinish: () => void;
  onLoadedEffect: SpawnState['onLoadedEffect'];
}
export const SpawnEffect: FC<SpawnEffectProps> = ({ onLoadedEffect, onLoadedEffectFinish }) => {
  const ref = useRef<Group>(null);

  const [effectRunning, setEffectRunning] = React.useState(true);

  const { scene: mountEffectScene } = useGltfLoader(onLoadedEffect?.src || '');
  const { nodes: mountEffectNode } = useGraph(mountEffectScene);

  const animationLoadedEffect = useGltfLoader(onLoadedEffect?.animationSrc || onLoadedEffect?.src || '');

  useEffect(() => {
    if (!effectRunning) {
      triggerCallback(onLoadedEffectFinish);
    }
  }, [onLoadedEffectFinish, effectRunning]);

  const spawnEffectMixer = useMemo(() => {
    const mixer = new AnimationMixer(mountEffectNode.Scene);
    const animation = mixer.clipAction(animationLoadedEffect.animations[0]);

    animation.setLoop(LoopRepeat, onLoadedEffect?.loop || 1);
    animation.clampWhenFinished = true;

    animation.play();

    mixer.addEventListener('finished', () => {
      animation.fadeOut(0.5);
      setEffectRunning(false);
    });

    return mixer;
  }, [animationLoadedEffect.animations, mountEffectNode.Scene, onLoadedEffect?.loop]);

  useFrame((state, delta) => {
    spawnEffectMixer?.update(delta);
  });

  return <>{effectRunning && <primitive modelRef={ref} object={mountEffectScene} />}</>;
};
