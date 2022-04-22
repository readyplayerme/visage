import React, { ReactNode, FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import styles from './BaseCanvas.module.css';

interface BaseCanvasProps {
  children?: ReactNode;
  background?: string;
  fov?: number;
  cameraPosition?: Vector3;
}

export const BaseCanvas: FC<BaseCanvasProps> = ({
  children = undefined,
  background = '#0e0f1e',
  fov = 50,
  cameraPosition = new Vector3(0, 0, 5)
}) => (
  <Canvas
    className={styles['base-canvas']}
    shadows
    dpr={[1, 2]}
    camera={{ fov, position: cameraPosition }}
    resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
    style={{ background }}
  >
    {children}
  </Canvas>
);
