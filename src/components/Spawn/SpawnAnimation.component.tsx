import { useFrame, useGraph } from '@react-three/fiber';
import React, { useMemo, useEffect, FC } from 'react';
import { AnimationMixer, Group, LoopRepeat } from 'three';
import { triggerCallback, useGltfLoader } from '../../services';
import { SpawnState } from '../../types';

interface SpawnAnimationProps {
  avatar: Group;
  onLoadedAnimationFinish?: () => void;
  onLoadedAnimation: SpawnState['onLoadedAnimation'];
}

export const SpawnAnimation: FC<SpawnAnimationProps> = ({ avatar, onLoadedAnimationFinish, onLoadedAnimation }) => {
  const [animationRunning, setAnimationRunning] = React.useState(true);

  useEffect(() => {
    if (!animationRunning) {
      triggerCallback(onLoadedAnimationFinish);
    }
  }, [onLoadedAnimationFinish, animationRunning]);

  const { nodes: avatarNode } = useGraph(avatar);
  const animationAvatar = useGltfLoader(onLoadedAnimation?.src || '');

  const animationMixerAvatar = useMemo(() => {
    if (onLoadedAnimation?.src === '') {
      return null;
    }
    const mixer = new AnimationMixer(avatarNode.Armature);
    if (!avatarNode.Armature) {
      return mixer;
    }
    const animation = mixer.clipAction(animationAvatar.animations[0]);

    animation.setLoop(LoopRepeat, onLoadedAnimation?.loop || 1);
    animation.clampWhenFinished = true;

    animation.play();

    mixer.addEventListener('finished', () => {
      animation.fadeOut(0.5);
      setAnimationRunning(false);
    });

    return mixer;
  }, [animationAvatar.animations, avatarNode.Armature, onLoadedAnimation?.loop, onLoadedAnimation?.src]);

  useFrame((state, delta) => {
    animationMixerAvatar?.update(delta);
  });

  return <></>;
};
