import React, { FC } from 'react';
import { MeshReflectorMaterial } from '@react-three/drei';

export interface FloorReflectionProps {
  resolution?: number;
  mixBlur?: number;
  mixStrength?: number;
  metalness?: number;
  blur?: [number, number] | number;
  mirror: number;
  minDepthThreshold?: number;
  maxDepthThreshold?: number;
  depthScale?: number;
  depthToBlurRatioBias?: number;
  distortion?: number;
  mixContrast?: number;
  reflectorOffset?: number;
  roughness?: number;
  color?: string;
}
export const FloorReflection: FC<FloorReflectionProps> = (props) => (
  <group position={[0, -0.01, 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 5]} />
      <MeshReflectorMaterial {...props} />
    </mesh>
  </group>
);
