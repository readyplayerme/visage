import React, { FC, MutableRefObject } from 'react';
import { Group, Mesh } from 'three';
import { normaliseMaterialsConfig } from 'src/helpers';
import { useGraph } from '@react-three/fiber';

interface ModelProps {
  scene: Group;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
}

export const Model: FC<ModelProps> = ({ scene, scale = 1, modelRef }) => {
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

  return (
    <group ref={modelRef} dispose={null} rotation={[0, 0, 0]}>
      <primitive object={scene} scale={scale} />
    </group>
  );
};
