import React, { ReactNode, FC } from 'react';
import { Canvas } from '@react-three/fiber';
import styles from './BaseCanvas.module.css';

interface BaseCanvasProps {
  children?: ReactNode;
  background?: string;
  fov?: number;
}

const BaseCanvas: FC<BaseCanvasProps> = ({ children = undefined, background = '#0e0f1e', fov = 50 }) => (
  <Canvas
    className={styles['base-canvas']}
    shadows
    dpr={[1, 2]}
    camera={{ fov }}
    resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
    style={{ background }}
  >
    {children}
  </Canvas>
);

export default BaseCanvas;
