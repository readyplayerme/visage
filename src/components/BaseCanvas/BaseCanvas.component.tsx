import React, { ReactNode, FC, CSSProperties } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import { CameraProps } from 'src/types';
import styles from './BaseCanvas.module.scss';

interface BaseCanvasProps extends CameraProps {
  children?: ReactNode;
  background?: string;
  fov?: number;
  style?: CSSProperties;
}

export const BaseCanvas: FC<BaseCanvasProps> = ({
  children = undefined,
  background = '#0e0f1e',
  fov = 50,
  cameraPosition = new Vector3(0, 0, 5),
  style
}) => (
  <Canvas
    className={styles['base-canvas']}
    shadows
    dpr={[1, 4]}
    camera={{ fov, position: cameraPosition }}
    resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
    style={{ background, ...style }}
  >
    {children}
  </Canvas>
);
