import { useFrame, useGraph } from '@react-three/fiber';
import React, { useMemo, useEffect, FC } from 'react';
import { AnimationMixer, Group, LoopRepeat } from 'three';
import { triggerCallback, useGltfLoader } from '../../services';
import { SpawnState } from '../Avatar/Avatar.component';

interface SpawnAnimationProps {
  avatar: Group;
  onSpawnAnimationFinish?: () => void;
  onMountAnimation: SpawnState['onMountAnimation'];
}

export const SpawnAnimation: FC<SpawnAnimationProps> = ({ avatar, onSpawnAnimationFinish, onMountAnimation }) => {
  const [animationRunning, setAnimationRunning] = React.useState(true);

  useEffect(() => {
    if (!animationRunning) {
      triggerCallback(onSpawnAnimationFinish);
    }
  }, [onSpawnAnimationFinish, animationRunning]);

  const { nodes: avatarNode } = useGraph(avatar);
  const animationAvatar = useGltfLoader(onMountAnimation?.src || '');

  const animationMixerAvatar = useMemo(() => {
    if (onMountAnimation?.src === '') {
      return null;
    }
    const mixer = new AnimationMixer(avatarNode.Armature);
    if (!avatarNode.Armature) {
      return mixer;
    }
    const animation = mixer.clipAction(animationAvatar.animations[0]);

    animation.setLoop(LoopRepeat, onMountAnimation?.loop || 1);
    animation.clampWhenFinished = true;

    animation.play();

    mixer.addEventListener('finished', () => {
      animation.fadeOut(0.5);
      setAnimationRunning(false);
    });

    return mixer;
  }, [animationAvatar.animations, avatarNode.Armature, onMountAnimation?.loop, onMountAnimation?.src]);

  useFrame((state, delta) => {
    animationMixerAvatar?.update(delta);
  });

  return <></>;
};
