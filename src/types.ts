import { Color, Vector3 } from 'three';

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export interface CameraProps {
  /**
   * A Vector3 representing the cameras position, default is (0, 0, 5)
   */
  position?: Vector3;
}

export interface LightingProps {
  ambientLightColor?: Color | string;
  ambientLightIntensity?: number;
  dirLightPosition?: Vector3;
  dirLightColor?: Color | string;
  spotLightPosition?: Vector3;
  spotLightColor?: string;
  spotLightAngle?: number;
}
