import React, { ReactNode, FC, CSSProperties } from 'react';
import { Canvas, Dpr } from '@react-three/fiber';
import { Vector3 } from 'three';
import { CameraProps } from 'src/types';
import styles from './BaseCanvas.module.scss';

interface BaseCanvasProps extends CameraProps {
  children?: ReactNode;
  fov?: number;
  style?: CSSProperties;
  dpr?: Dpr;
  className?: string;
}

export const BaseCanvas: FC<BaseCanvasProps> = ({
  children = undefined,
  fov = 50,
  position = new Vector3(0, 0, 5),
  style,
  dpr = [window.devicePixelRatio * 0.5, 2],
  className
}) => (
  <Canvas
    key={fov}
    className={`${styles['base-canvas']} ${className ?? ''}`}
    shadows="soft"
    gl={{ preserveDrawingBuffer: true, toneMappingExposure: 0.5, alpha: true }}
    dpr={dpr}
    camera={{ fov, position }}
    resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
    style={{ ...style, background: 'transparent' }}
  >
    {children}
  </Canvas>
);
