import React, { FC, useEffect, useRef, useState } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { AnimationAction, AnimationClip, AnimationMixer, Group } from 'three';
import { GLTFLoader } from 'three-stdlib';

import { Model } from 'src/components/Models/Model';
import { BaseModelProps } from 'src/types';
import { useEmotion, useGltfCachedLoader, useIdleExpression } from 'src/services';
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
  onLoaded,
  emotion,
  bloom,
  materialConfig
}) => {
  const groupRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const [loadedAnimations, setLoadedAnimations] = useState<Record<string, AnimationClip>>({});
  const [activeAction, setActiveAction] = useState<AnimationAction | null>(null);

  const { scene } = useGltfCachedLoader(modelSrc);
  const { nodes } = useGraph(scene);

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
  }, [activeAnimation, loadedAnimations, activeAction, nodes.Armature]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
  });

  useEmotion(nodes, emotion);
  useIdleExpression('blink', nodes);

  return (
    <Model
      modelRef={groupRef}
      scene={scene}
      scale={scale}
      onLoaded={onLoaded}
      bloom={bloom}
      materialConfig={materialConfig}
    />
  );
};
