import { Color, Vector3 } from 'three';
import { PresetsType } from '@react-three/drei/helpers/environment-assets';

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export interface CameraProps {
  /**
   * A Vector3 representing the cameras position, default is (0, 0, 5)
   */
  position?: Vector3;
}

export interface EnvironmentProps {
  /**
   * Brightness, color hue, shadow contrast, reflection details change according to the selected environment.
   * Possible to provide a custom `.hdr` file path (URL) as environment background.
   */
  environment?: PresetsType | string;
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

export interface BaseModelProps {
  /**
   * Detect when model is loaded and trigger custom logic.
   */
  onLoaded?: () => void;
  /**
   * Detect when model is being loaded and trigger custom logic.
   */
  onLoading?: () => void;
  setModelFallback?: (fallback: JSX.Element) => void;
}

export type HeadBlendShapeType =
  | 'browDownLeft'
  | 'browDownRight'
  | 'browInnerUp'
  | 'browOuterUpLeft'
  | 'browOuterUpRight'
  | 'cheekPuff'
  | 'cheekSquintLeft'
  | 'cheekSquintRight'
  | 'eyeBlinkLeft'
  | 'eyeBlinkRight'
  | 'eyeSquintLeft'
  | 'eyeSquintRight'
  | 'eyeWideLeft'
  | 'eyeWideRight'
  | 'eyesClosed'
  | 'eyesLookDown'
  | 'eyesLookUp'
  | 'jawForward'
  | 'jawLeft'
  | 'jawOpen'
  | 'jawRight'
  | 'mouthClose'
  | 'mouthDimpleLeft'
  | 'mouthDimpleRight'
  | 'mouthFrownLeft'
  | 'mouthFrownRight'
  | 'mouthFunnel'
  | 'mouthLeft'
  | 'mouthLowerDownLeft'
  | 'mouthLowerDownRight'
  | 'mouthOpen'
  | 'mouthPressLeft'
  | 'mouthPressRight'
  | 'mouthPucker'
  | 'mouthRight'
  | 'mouthRollLower'
  | 'mouthRollUpper'
  | 'mouthShrugLower'
  | 'mouthShrugUpper'
  | 'mouthSmile'
  | 'mouthSmileLeft'
  | 'mouthSmileRight'
  | 'mouthStretchLeft'
  | 'mouthStretchRight'
  | 'mouthUpperUpLeft'
  | 'mouthUpperUpRight'
  | 'noseSneerLeft'
  | 'noseSneerRight'
  | 'viseme_CH'
  | 'viseme_DD'
  | 'viseme_E'
  | 'viseme_FF'
  | 'viseme_I'
  | 'viseme_O'
  | 'viseme_PP'
  | 'viseme_RR'
  | 'viseme_SS'
  | 'viseme_TH'
  | 'viseme_U'
  | 'viseme_aa'
  | 'viseme_kk'
  | 'viseme_nn'
  | 'viseme_sil';
