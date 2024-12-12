import React, { FC, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AnimationAction, AnimationMixer, LoopOnce, LoopRepeat } from 'three';

import { Model } from 'src/components/Models/Model';
import { AnimationsT, BaseModelProps } from 'src/types';
import { useEmotion, useFallbackScene, useGltfCachedLoader, useIdleExpression } from 'src/services';
import { Emotion } from 'src/components/Avatar/Avatar.component';
import { useAnimations } from 'src/services/Animation.service';

export interface MultipleAnimationModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  animations: AnimationsT;
  activeAnimation: string;
  scale?: number;
  emotion?: Emotion;
  onAnimationEnd?: (action: AnimationAction) => void;
}

export const MultipleAnimationModel: FC<MultipleAnimationModelProps> = ({
  modelSrc,
  animations,
  activeAnimation,
  scale = 1,
  setModelFallback,
  onLoaded,
  emotion,
  bloom,
  materialConfig,
  onAnimationEnd
}) => {
  const mixerRef = useRef<AnimationMixer | null>(null);
  const activeActionRef = useRef<AnimationAction | null>(null);
  const animationTimeRef = useRef<number>(0);

  const loadedAnimations = useAnimations(animations);
  const { scene } = useGltfCachedLoader(modelSrc);

  useEffect(() => {
    if (scene) {
      const mixer = new AnimationMixer(scene);
      mixerRef.current = mixer;

      if (activeActionRef.current) {
        const newAction = mixer.clipAction(activeActionRef.current.getClip());
        newAction.play();
        mixer.update(animationTimeRef.current);

        activeActionRef.current = newAction;
      }
    }

    return () => {
      mixerRef.current?.stopAllAction();
      mixerRef.current?.uncacheRoot(scene);
      mixerRef.current = null;
    };
  }, [scene]);

  useEffect(() => {
    const mixer = mixerRef.current;
    const prevAction = activeActionRef.current;
    const newClip = loadedAnimations[activeAnimation];
    const animationConfig = animations[activeAnimation];

    if (!newClip || !mixer || !animationConfig) return;
    if (prevAction && prevAction.getClip().name === newClip.name) return;

    const newAction = mixer.clipAction(newClip);
    const loopCount = animationConfig.repeat ?? Infinity;
    const fadeTime = animationConfig.fadeTime ?? 0.5;

    newAction.setLoop(loopCount === Infinity ? LoopRepeat : LoopOnce, loopCount);

    const handleAnimationEnd = (event: { action: AnimationAction }) => {
      if (event.action === newAction) {
        onAnimationEnd?.(newAction);
      }
    };

    mixer.addEventListener('finished', handleAnimationEnd);

    if (prevAction) {
      prevAction.fadeOut(fadeTime);
      newAction.reset().fadeIn(fadeTime);
    } else {
      newAction.reset();
    }

    newAction.play();
    activeActionRef.current = newAction;

    // eslint-disable-next-line consistent-return
    return () => {
      mixer.removeEventListener('finished', handleAnimationEnd);
    };
  }, [activeAnimation, animations, loadedAnimations, onAnimationEnd]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
    animationTimeRef.current = activeActionRef.current?.time || 0;
  });

  useEmotion(scene, emotion);
  useIdleExpression('blink', scene);
  useFallbackScene(scene, setModelFallback);

  return <Model scene={scene} scale={scale} onLoaded={onLoaded} bloom={bloom} materialConfig={materialConfig} />;
};
