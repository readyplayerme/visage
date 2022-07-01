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

export interface LightingPropsCamera {
  ambientLightColor?: Color | string;
  ambientLightIntensity?: number;
  dirLightPosition?: Vector3;
  dirLightColor?: Color | string;
  cameraSpotLightPosition?: Vector3;
  cameraSpotLightColor?: string;
  cameraSpotLightAngle?: number;
  cameraSpotLightDistance?: number;
}

export interface LightingPropsScene {
  spotLight1Position?: Vector3;
  spotLight1Color?: string;
  spotLight1Angle?: number;
  spotLight1Distance?: number;
  showSpotLight1?: boolean;
}
