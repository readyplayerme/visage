import React, { FC, useRef } from 'react';
import { Mesh, TextureLoader } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { MeshProps } from '@react-three/fiber/dist/declarations/src/three-types';

export type Background = { src?: string } & MeshProps;

const Box: FC<Background> = ({ src = '', ...baseProps }) => {
  const ref = useRef<Mesh>();
  const texture = useLoader(TextureLoader, src);

  useFrame(() => {
    if (ref.current?.rotation.y) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref} castShadow receiveShadow {...baseProps}>
      <boxBufferGeometry />
      <meshPhysicalMaterial map={texture} />
      <axesHelper />
    </mesh>
  );
};

export default Box;
