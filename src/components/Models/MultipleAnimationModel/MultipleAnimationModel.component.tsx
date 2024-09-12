import React, { FC, useEffect, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { AnimationAction, AnimationClip, AnimationMixer, Group } from 'three';
import { GLTFLoader } from 'three-stdlib';

import { Model } from 'src/components/Models/Model';
import { BaseModelProps } from 'src/types';

export interface MultipleAnimationModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  animations: Record<string, string>;
  activeAnimation: string;
  scale?: number;
}

export const MultipleAnimationModel: FC<MultipleAnimationModelProps> = ({
  modelSrc,
  animations,
  activeAnimation,
  scale = 1,
  onLoaded,
  bloom
}) => {
  const groupRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const [loadedAnimations, setLoadedAnimations] = useState<Record<string, AnimationClip>>({});
  const [activeAction, setActiveAction] = useState<AnimationAction | null>(null);

  const { scene } = useLoader(GLTFLoader, String(modelSrc));

  useEffect(() => {
    if (scene && groupRef.current) {
      groupRef.current.add(scene);

      mixerRef.current = new AnimationMixer(scene);
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
    const newClip = loadedAnimations[activeAnimation];

    if (!newClip || !mixer) return;

    const newAction = mixer.clipAction(newClip);
    const prevAction = activeAction;

    if (prevAction) {
      newAction.reset();
      newAction.crossFadeFrom(prevAction, 0.5, true);
    }

    newAction.play();
    setActiveAction(newAction);
  }, [activeAnimation, loadedAnimations, activeAction]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
  });

  return <Model modelRef={groupRef} scene={scene} scale={scale} onLoaded={onLoaded} bloom={bloom} />;
};
