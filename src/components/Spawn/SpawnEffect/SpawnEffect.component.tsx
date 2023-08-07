import React, { FC, useEffect, useMemo, useRef } from 'react';
import { AnimationMixer, Group, LoopRepeat } from 'three';
import { useFrame, useGraph } from '@react-three/fiber';
import { triggerCallback, useGltfLoader } from '../../../services';
import { loadAnimationClip } from '../../../services/Animation.service';

interface SpawnEffectProps {
  onLoadedEffectFinish: () => void;
  onLoadedEffect: { src: string; animationSrc?: string; loop?: number };
}
export const SpawnEffect: FC<SpawnEffectProps> = ({ onLoadedEffect, onLoadedEffectFinish }) => {
  const ref = useRef<Group>(null);

  const [effectRunning, setEffectRunning] = React.useState(true);

  const { scene: mountEffectScene } = useGltfLoader(onLoadedEffect.src);
  const { nodes: mountEffectNode } = useGraph(mountEffectScene);

  useEffect(() => {
    if (!effectRunning) {
      triggerCallback(onLoadedEffectFinish);
    }
  }, [onLoadedEffectFinish, effectRunning]);

  const spawnEffectMixer = useMemo(async () => {
    const animationLoadedEffect = await loadAnimationClip(onLoadedEffect?.animationSrc || onLoadedEffect.src);
    const mixer = new AnimationMixer(mountEffectNode.Scene);

    if (!animationLoadedEffect) {
      setEffectRunning(false);
      return mixer;
    }

    const animation = mixer.clipAction(animationLoadedEffect);

    animation.setLoop(LoopRepeat, onLoadedEffect?.loop || 1);
    animation.clampWhenFinished = true;

    animation.play();

    mixer.addEventListener('finished', () => {
      animation.fadeOut(0.5);
      setEffectRunning(false);
    });

    return mixer;
  }, [mountEffectNode.Scene, onLoadedEffect?.animationSrc, onLoadedEffect?.loop, onLoadedEffect.src]);

  useFrame(async (state, delta) => {
    (await spawnEffectMixer)?.update(delta);
  });

  return <>{effectRunning && <primitive modelRef={ref} object={mountEffectScene} />}</>;
};
