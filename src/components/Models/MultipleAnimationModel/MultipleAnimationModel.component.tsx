import React, { FC, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AnimationAction, AnimationMixer, LoopOnce, LoopRepeat } from 'three';

import { Model } from 'src/components/Models/Model';
import { AnimationConfiguration, BaseModelProps } from 'src/types';
import { useEmotion, useFallbackScene, useGltfCachedLoader, useIdleExpression } from 'src/services';
import { Emotion } from 'src/components/Avatar/Avatar.component';
import { useAnimations } from 'src/services/Animation.service';

export interface MultipleAnimationModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  animations: Record<string, string>;
  activeAnimation: string;
  scale?: number;
  emotion?: Emotion;
  animationConfig?: AnimationConfiguration;
  onAnimationEnd?: (action: AnimationAction) => void;
  idleAnimation?: string;
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
  animationConfig,
  materialConfig,
  onAnimationEnd,
  idleAnimation = 'idle'
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

    if (!newClip || !mixer) return;
    if (prevAction && prevAction.getClip().name === newClip.name && activeAnimation !== idleAnimation) return;

    const newAction = mixer.clipAction(newClip);
    if (activeAnimation === idleAnimation) {
      newAction.setLoop(LoopRepeat, Infinity);
    } else {
      newAction.setLoop(LoopOnce, 1);
      newAction.clampWhenFinished = true;
    }

    const handleAnimationEnd = (event: { action: AnimationAction }) => {
      if (event.action === newAction) {
        onAnimationEnd?.(newAction);
        if (activeAnimation !== idleAnimation) {
          const idleClip = loadedAnimations[idleAnimation];
          if (idleClip) {
            const idleAction = mixer.clipAction(idleClip);
            idleAction.reset().setLoop(LoopRepeat, Infinity).fadeIn(0.5).play();
            activeActionRef.current = idleAction;
          }
        }
      }
    };

    mixer.addEventListener('finished', handleAnimationEnd);

    if (prevAction) {
      prevAction.fadeOut(0.5);
      newAction.reset().fadeIn(0.5);
    } else {
      newAction.reset();
    }

    newAction.play();
    activeActionRef.current = newAction;

    // eslint-disable-next-line consistent-return
    return () => {
      mixer.removeEventListener('finished', handleAnimationEnd);
    };
  }, [activeAnimation, loadedAnimations, animationConfig, onAnimationEnd, idleAnimation]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
    animationTimeRef.current = activeActionRef.current?.time || 0;
  });

  useEmotion(scene, emotion);
  useIdleExpression('blink', scene);
  useFallbackScene(scene, setModelFallback);

  return <Model scene={scene} scale={scale} onLoaded={onLoaded} bloom={bloom} materialConfig={materialConfig} />;
};
