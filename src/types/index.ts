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
  dirLightIntensity?: number;
  spotLightPosition?: Vector3;
  spotLightColor?: string;
  spotLightAngle?: number;
  spotLightIntensity?: number;
}

export interface BaseModelProps {
  /**
   * Detect when model is loaded (doesn't take into account animations and effects) and trigger custom logic.
   */
  onLoaded?: () => void;
  /**
   * Detect when model is being loaded and trigger custom logic.
   */
  onLoading?: () => void;
  setModelFallback?: (fallback: JSX.Element) => void;
  bloom?: BloomConfiguration;
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

export type BloomConfiguration = {
  /**
   * The luminance threshold. Raise this value to mask out darker elements in the scene. Range is [0, 1].
   */
  luminanceThreshold?: number;
  /**
   * Controls the smoothness of the luminance threshold. Range is [0, 1].
   */
  luminanceSmoothing?: number;
  /**
   * Enables or disables mipmap blur.
   */
  mipmapBlur?: boolean;
  /**
   * The intensity of global bloom.
   */
  intensity?: number;
  /**
   * The kernel size of the blur. Values are 0, 1, 2, 3, 4.
   */
  kernelSize?: number;
  /**
   * Emissive material intensity.
   */
  materialIntensity?: number;
};

export interface SpawnState {
  /**
   * Add a custom loaded effect like particles when avatar is loaded, animate them with a custom animation.
   */
  onLoadedEffect?: {
    src: string | null;
    animationSrc?: string | null;
    loop?: number | null;
  } | null;
  /**
   * Add a custom loaded animation when avatar is loaded.
   * Supports `.fbx` and `.glb` files.
   */
  onLoadedAnimation?: {
    src: string | null;
    loop?: number | null;
  } | null;
}
