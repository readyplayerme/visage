import { useAtomValue } from 'jotai/index';
import React, { FC, useEffect } from 'react';
import { Group } from 'three';
import { SpawnEffect } from './SpawnEffect.component';
import { SpawnAnimation } from './SpawnAnimation.component';
import { triggerCallback } from '../../services';
import { spawnState } from '../Avatar/Avatar.component';

interface SpawnProps {
  avatar: Group;
  onSpawnFinish?: () => void;
}
export const Spawn: FC<SpawnProps> = ({ avatar, onSpawnFinish }) => {
  const animationProps = useAtomValue(spawnState);

  const usesMountEffect = Boolean(animationProps?.onMountEffect?.src);
  const usesMountAnimation = Boolean(animationProps?.onMountAnimation?.src);

  const [effectRunning, setEffectRunning] = React.useState(usesMountEffect);
  const [animationRunning, setAnimationRunning] = React.useState(usesMountAnimation);

  useEffect(() => {
    if (!animationRunning && !effectRunning) {
      triggerCallback(onSpawnFinish);
    }
  }, [onSpawnFinish, effectRunning, animationRunning]);

  const onSpawnAnimationFinish = () => {
    setAnimationRunning(false);
  };

  const onSpawnEffectFinish = () => {
    setEffectRunning(false);
  };

  return (
    <>
      {usesMountEffect && (
        <SpawnEffect onMountEffect={animationProps.onMountEffect} onSpawnEffectFinish={onSpawnEffectFinish} />
      )}
      {usesMountAnimation && (
        <SpawnAnimation
          onMountAnimation={animationProps.onMountAnimation}
          avatar={avatar}
          onSpawnAnimationFinish={onSpawnAnimationFinish}
        />
      )}
    </>
  );
};
