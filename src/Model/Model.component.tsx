import React, { FC, MutableRefObject } from 'react';
import { Group } from 'three';

interface ModelProps {
  scene: Group;
  scale?: number;
  modelRef: MutableRefObject<Group | undefined>;
}

export const Model: FC<ModelProps> = ({ scene, scale = 1, modelRef }) => (
  <group ref={modelRef} dispose={null} rotation={[0, 0, 0]}>
    <primitive receiveShadow castShadow object={scene} scale={scale} />
  </group>
);
