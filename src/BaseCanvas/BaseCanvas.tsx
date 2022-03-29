import React, { ReactNode, FC } from 'react';
import { Canvas } from '@react-three/fiber';
import styles from './BaseCanvas.module.css';

interface BaseCanvasProps {
  children?: ReactNode;
  background?: string;
  fov?: number;
}

const BaseCanvas: FC<BaseCanvasProps> = ({ children, background, fov }) => (
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

BaseCanvas.defaultProps = {
  background: '#0e0f1e',
  children: undefined,
  fov: 50
};

export default BaseCanvas;
