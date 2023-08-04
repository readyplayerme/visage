import { useFrame, useGraph } from '@react-three/fiber';
import React, { useMemo, useEffect, FC } from 'react';
import { AnimationMixer, Group, LoopRepeat } from 'three';
import { triggerCallback } from '../../services';
import { SpawnState } from '../../types';
import { loadAnimationClip } from '../../services/Animation.service';

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

  const animationMixerAvatar = useMemo(async () => {
    if (onLoadedAnimation?.src === '') {
      return null;
    }
    const mixer = new AnimationMixer(avatarNode.Armature);
    if (!avatarNode.Armature) {
      return mixer;
    }
    const animationClip = await loadAnimationClip(onLoadedAnimation?.src || '');

    const animation = mixer.clipAction(animationClip);

    animation.setLoop(LoopRepeat, onLoadedAnimation?.loop || 1);
    animation.clampWhenFinished = true;

    animation.play();

    mixer.addEventListener('finished', () => {
      animation.fadeOut(0.5);
      setAnimationRunning(false);
    });

    return mixer;
  }, [avatarNode.Armature, onLoadedAnimation?.loop, onLoadedAnimation?.src]);

  useFrame(async (state, delta) => {
    (await animationMixerAvatar)?.update(delta);
  });

  return <></>;
};
