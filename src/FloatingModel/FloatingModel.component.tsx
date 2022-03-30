import React, { useRef, FC } from 'react';
import { GLTFLoader } from 'three-stdlib';
import { useFrame, useLoader } from '@react-three/fiber';
import type { Group } from 'three';

interface FloatingModelProps {
  glbUrl: string;
  scale?: number;
}

export const FloatingModel: FC<FloatingModelProps> = ({ glbUrl, scale = 1.0 }) => {
  const ref = useRef<Group>();
  const gltf = useLoader(GLTFLoader, glbUrl);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (ref?.current) {
      ref.current.rotation.y = Math.sin(t / 2) / 8;
      ref.current.position.y = (1 + Math.sin(t / 1.5)) / -9;
    }
  });

  return (
    <group ref={ref} dispose={null}>
      <primitive castShadow object={gltf.scene} scale={scale} />
    </group>
  );
};
