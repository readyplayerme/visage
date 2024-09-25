import React, { FC, useEffect, useRef, useState } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { AnimationAction, AnimationClip, AnimationMixer, Group } from 'three';
import { GLTFLoader } from 'three-stdlib';

import { Model } from 'src/components/Models/Model';
import { BaseModelProps } from 'src/types';
import { useEmotion, useFallback, useGltfCachedLoader, useIdleExpression } from 'src/services';
import { Emotion } from 'src/components/Avatar/Avatar.component';

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
  const groupRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const activeActionRef = useRef<AnimationAction | null>(null);
  const animationTimeRef = useRef<number>(0);

  const [loadedAnimations, setLoadedAnimations] = useState<Record<string, AnimationClip>>({});

  const { scene } = useGltfCachedLoader(modelSrc);
  const { nodes } = useGraph(scene);

  useEffect(() => {
    if (scene && groupRef.current) {
      const mixer = new AnimationMixer(scene);

      if (activeActionRef.current) {
        const newAction = mixer.clipAction(activeActionRef.current.getClip());

        newAction.play();
        mixer.update(animationTimeRef.current);

        activeActionRef.current = newAction;
      }

      mixerRef.current = mixer;
    }

    return () => {
      mixerRef.current?.stopAllAction();
    };
  }, [scene]);

  useEffect(() => {
    const loader = new GLTFLoader();
    Object.keys(animations).forEach((name) => {
      loader.load(animations[name], (gltf) => {
        const newClip = gltf.animations[0];
        setLoadedAnimations((prev) => ({
          ...prev,
          [name]: newClip
        }));
      });
    });
  }, [animations]);

  useEffect(() => {
    const mixer = mixerRef.current;
    const prevAction = activeActionRef.current;
    const newClip = loadedAnimations[activeAnimation];

    if (!newClip || !mixer) return;
    if (prevAction && prevAction.getClip().name === newClip.name) return;

    const newAction = mixer.clipAction(newClip);

    if (prevAction) {
      newAction.reset();
      newAction.crossFadeFrom(prevAction, 0.5, true);
    }

    newAction.play();
    activeActionRef.current = newAction;
  }, [activeAnimation, loadedAnimations]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
    animationTimeRef.current = activeActionRef.current?.time || 0;
  });

  useEmotion(nodes, emotion);
  useIdleExpression('blink', nodes);
  useFallback(nodes, setModelFallback);

  return <Model modelRef={groupRef} scene={scene} scale={scale} onLoaded={onLoaded} bloom={bloom} />;
};
