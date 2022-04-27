import React, { Suspense, FC, useMemo } from 'react';
import { Environment } from '@react-three/drei';
import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { Vector3 } from 'three';
import { CameraLighting } from 'src/SceneControls/CameraLighting.component';
import { AnimationModel } from 'src/AnimationModel/AnimationModel.component';
import { isValidGlbUrl } from 'src/helpers';
import { LightingProps } from 'src/types';
import { BaseCanvas } from 'src/BaseCanvas';
import { HalfBodyModel } from '../HalfBodyModel';
import { StaticModel } from '../StaticModel';

export const CAMERA = {
  TARGET: {
    FULL_BODY: 1.55,
    HALF_BODY: 0.55
  },
  INITIAL_DISTANCE: {
    FULL_BODY: 0.5,
    HALF_BODY: 0.4
  },
  CONTROLS: {
    FULL_BODY: {
      MIN_DISTANCE: 0.5,
      MAX_DISTANCE: 2.5
    },
    HALF_BODY: {
      MIN_DISTANCE: 0.5,
      MAX_DISTANCE: 1.4
    }
  }
};

export interface AvatarProps extends LightingProps {
  /**
   * Path to `.glb` file of the 3D model.
   */
  modelUrl: string;
  /**
   * Path to `.glb` animation file of the 3D model.
   */
  animationUrl?: string;
  /**
   * Canvas background color. Supports all CSS color value types.
   */
  backgroundColor?: string;
  /**
   * Brightness, color hue, shadow contrast, reflection details change according to the selected environment.
   */
  environment?: PresetsType;
  /**
   * Adjust camera zoom for half-body avatars.
   */
  halfBody?: boolean;
  /**
   * Enable rendering shadows on ground.
   */
  shadows?: boolean;
  /**
   * Size of the rendered GLB model.
   */
  scale?: number;
  /**
   *
   */
  camTarget?: number;
  camInitialDistance?: number;
}

/**
 * Interactive presentation of Ready Player Me avatar.
 * Supports full-body and half-body.
 */
export const Avatar: FC<AvatarProps> = ({
  modelUrl,
  animationUrl = undefined,
  backgroundColor = '#f0f0f0',
  environment = 'city',
  halfBody = false,
  shadows = false,
  scale = 1,
  ambientLightColor = '#fff5b6',
  ambientLightIntensity = 0.25,
  dirLightPosition = new Vector3(-3, 5, -5),
  dirLightColor = '#002aff',
  spotLightPosition = new Vector3(12, 10, 7.5),
  spotLightColor = '#fff5b6',
  spotLightAngle = 0.314,
  camTarget = CAMERA.TARGET.FULL_BODY,
  camInitialDistance = CAMERA.INITIAL_DISTANCE.FULL_BODY
}) => {
  const AvatarModel = useMemo(() => {
    if (!!animationUrl && !halfBody && isValidGlbUrl([modelUrl, animationUrl])) {
      return <AnimationModel modelUrl={modelUrl} animationUrl={animationUrl} scale={scale} />;
    }

    if (halfBody && isValidGlbUrl(modelUrl)) {
      return <HalfBodyModel modelUrl={modelUrl} scale={scale} />;
    }

    if (isValidGlbUrl(modelUrl)) {
      return <StaticModel modelUrl={modelUrl} scale={scale} />;
    }

    return null;
  }, [halfBody, animationUrl, modelUrl, scale]);

  return (
    <BaseCanvas background={backgroundColor} cameraPosition={new Vector3(0, 0, 3)} fov={50}>
      <Suspense fallback={null}>
        <Environment preset={environment} />
        <CameraLighting
          camTarget={camTarget}
          camInitialDistance={camInitialDistance}
          ambientLightColor={ambientLightColor}
          ambientLightIntensity={ambientLightIntensity}
          dirLightPosition={dirLightPosition}
          dirLightColor={dirLightColor}
          spotLightPosition={spotLightPosition}
          spotLightColor={spotLightColor}
          spotLightAngle={spotLightAngle}
          controlsMinDistance={
            halfBody ? CAMERA.CONTROLS.HALF_BODY.MIN_DISTANCE : CAMERA.CONTROLS.FULL_BODY.MIN_DISTANCE
          }
          controlsMaxDistance={
            halfBody ? CAMERA.CONTROLS.HALF_BODY.MAX_DISTANCE : CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE
          }
        />
        {AvatarModel}
        {shadows && (
          <group position={[0, 0, 0]}>
            <mesh key="shadow-catcher" receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
              <planeBufferGeometry attach="geometry" args={[5, 5]} />
              <shadowMaterial attach="material" transparent opacity={0.2} />
            </mesh>
          </group>
        )}
      </Suspense>
    </BaseCanvas>
  );
};
