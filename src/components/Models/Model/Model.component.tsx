import React, { FC, Ref, useEffect } from 'react';
import { Group, Mesh } from 'three';
import { normaliseMaterialsConfig, triggerCallback } from 'src/services';
import { useGraph } from '@react-three/fiber';
import { BaseModelProps } from 'src/types';
import { Spawn } from '../../Spawn/Spawn';

interface ModelProps extends BaseModelProps {
  scene: Group;
  modelRef?: Ref<Group>;
  scale?: number;
  onSpawnAnimationFinish?: () => void;
}

export const Model: FC<ModelProps> = ({ scene, scale = 1, modelRef, onLoaded, onSpawnAnimationFinish, bloom }) => {
  const { materials } = useGraph(scene);
  normaliseMaterialsConfig(materials, bloom);
  scene.traverse((object) => {
    const node = object;

    if ((node as Mesh).isMesh) {
      node.castShadow = true;
    }

    if (node.type === 'SkinnedMesh') {
      node.receiveShadow = true;
    }
  });

  useEffect(() => triggerCallback(onLoaded), [scene, materials, onLoaded]);

  return (
    <group ref={modelRef} dispose={null} rotation={[0, 0, 0]}>
      <primitive object={scene} scale={scale} />
      <Spawn avatar={scene} onSpawnFinish={onSpawnAnimationFinish} />
    </group>
  );
};
