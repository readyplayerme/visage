import React, { FC, MutableRefObject } from 'react';
import { Group, Mesh } from 'three';
import { normaliseMaterialsConfig, triggerCallback } from 'src/services';
import { useGraph } from '@react-three/fiber';
import { BaseModelProps } from 'src/types';

interface ModelProps extends BaseModelProps {
  scene: Group;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
}

export const Model: FC<ModelProps> = ({ scene, scale = 1, modelRef, onLoaded }) => {
  const { materials } = useGraph(scene);
  normaliseMaterialsConfig(materials);
  scene.traverse((object) => {
    const node = object;

    if ((node as Mesh).isMesh) {
      node.castShadow = true;
    }

    if (node.type === 'SkinnedMesh') {
      node.receiveShadow = true;
    }
  });
  triggerCallback(onLoaded);

  return (
    <group ref={modelRef} dispose={null} rotation={[0, 0, 0]}>
      <primitive object={scene} scale={scale} />
    </group>
  );
};
