import React, { FC, MutableRefObject, useContext } from 'react';
import { Group, Mesh } from 'three';
import { normaliseMaterialsConfig } from 'src/services';
import { useGraph } from '@react-three/fiber';
import { ModelContext } from './Model.context';

interface ModelProps {
  scene: Group;
  modelRef?: MutableRefObject<Group | undefined>;
  scale?: number;
}

export const Model: FC<ModelProps> = ({ scene, scale = 1, modelRef }) => {
  const { materials } = useGraph(scene);
  const { setModelContext } = useContext(ModelContext);
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

  setModelContext({
    isLoaded: true,
    isLoading: false
  });

  return (
    <group ref={modelRef} dispose={null} rotation={[0, 0, 0]}>
      <primitive object={scene} scale={scale} />
    </group>
  );
};
