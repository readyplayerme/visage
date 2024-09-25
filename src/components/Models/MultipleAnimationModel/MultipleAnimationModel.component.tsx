import React, { FC, useEffect, useRef, useState } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { AnimationAction, AnimationClip, AnimationMixer } from 'three';

import { Model } from 'src/components/Models/Model';
import { BaseModelProps } from 'src/types';
import { useEmotion, useFallback, useGltfCachedLoader, useIdleExpression } from 'src/services';
import { Emotion } from 'src/components/Avatar/Avatar.component';
import { loadAnimationClip } from 'src/services/Animation.service';

export interface MultipleAnimationModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  animations: Record<string, string>;
  activeAnimation: string;
  scale?: number;
  emotion?: Emotion;
}

export const MultipleAnimationModel: FC<MultipleAnimationModelProps> = ({
  modelSrc,
  animations,
  activeAnimation,
  scale = 1,
  setModelFallback,
  onLoaded,
  emotion,
  bloom
}) => {
  const mixerRef = useRef<AnimationMixer | null>(null);
  const activeActionRef = useRef<AnimationAction | null>(null);
  const animationTimeRef = useRef<number>(0);

  const [loadedAnimations, setLoadedAnimations] = useState<Record<string, AnimationClip>>({});

  const { scene } = useGltfCachedLoader(modelSrc);
  const { nodes } = useGraph(scene);

  useEffect(() => {
    const loadAllAnimations = async () => {
      const clips: Record<string, AnimationClip> = {};

      await Promise.all(
        Object.keys(animations).map(async (name) => {
          const newClip = await loadAnimationClip(animations[name]);
          clips[name] = newClip;
        })
      );

      setLoadedAnimations(clips);
    };

    loadAllAnimations();
  }, [animations]);

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
    };
  }, [scene]);

  useEffect(() => {
    const mixer = mixerRef.current;
    const prevAction = activeActionRef.current;
    const newClip = loadedAnimations[activeAnimation];

    if (!newClip || !mixer) return;
    if (prevAction && prevAction.getClip().name === newClip.name) return;

    const newAction = mixer.clipAction(newClip);
    activeActionRef.current = newAction;

    if (prevAction) {
      newAction.reset();
      newAction.crossFadeFrom(prevAction, 0.5, true);
    }

    newAction.play();
  }, [activeAnimation, loadedAnimations]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
    animationTimeRef.current = activeActionRef.current?.time || 0;
  });

  useEmotion(nodes, emotion);
  useIdleExpression('blink', nodes);
  useFallback(nodes, setModelFallback);

  return <Model scene={scene} scale={scale} onLoaded={onLoaded} bloom={bloom} />;
};
