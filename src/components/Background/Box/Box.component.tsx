import React, { FC, useRef } from 'react';
import { Mesh, TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { MeshProps } from '@react-three/fiber/dist/declarations/src/three-types';

export type Background = { src?: string } & MeshProps;

const Box: FC<Background> = ({ src = '', ...baseProps }) => {
  const ref = useRef<Mesh>();
  const texture = useLoader(TextureLoader, src);

  return (
    <mesh ref={ref} castShadow receiveShadow {...baseProps}>
      <boxBufferGeometry />
      <meshPhysicalMaterial map={texture} />
    </mesh>
  );
};

export default Box;