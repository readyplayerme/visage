import React, { Suspense, FC, useMemo, CSSProperties } from 'react';
import { Environment } from '@react-three/drei';
import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { Vector3 } from 'three';
import { CameraLighting } from 'src/components/SceneControls/CameraLighting.component';
import { AnimationModel } from 'src/components/Models/AnimationModel/AnimationModel.component';
import { LightingProps } from 'src/types';
import { BaseCanvas } from 'src/components/BaseCanvas';
import { HalfBodyModel, StaticModel } from 'src/components/Models';
import { isValidGlbUrl } from 'src/services';

export const CAMERA = {
  TARGET: {
    FULL_BODY: 1.55,
    HALF_BODY: 0.55
  },
  INITIAL_DISTANCE: {
    FULL_BODY: 0.4,
    HALF_BODY: 0.5
  },
  CONTROLS: {
    FULL_BODY: {
      MIN_DISTANCE: 0.5,
      MAX_DISTANCE: 2.5,
      ZOOM_TARGET: new Vector3(-0.11, 0, 0.48)
    },
    HALF_BODY: {
      MIN_DISTANCE: 0.5,
      MAX_DISTANCE: 1.4,
      ZOOM_TARGET: new Vector3(-0.15, 0, 0.55)
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
   * Camera target on Y-axis.
   */
  cameraTarget?: number;
  /**
   * Initial distance from the object upon render.
   */
  cameraInitialDistance?: number;
  /**
   * Pass styling to canvas element.
   */
  style?: CSSProperties;
}

/**
 * Interactive avatar presentation with zooming and horizontal rotation controls.
 * Optimised for full-body and half-body avatars.
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
  cameraTarget = CAMERA.TARGET.FULL_BODY,
  cameraInitialDistance = CAMERA.INITIAL_DISTANCE.FULL_BODY,
  style
}) => {
  const AvatarModel = useMemo(() => {
    if (!isValidGlbUrl(modelUrl)) {
      return null;
    }

    if (!!animationUrl && !halfBody && isValidGlbUrl(animationUrl)) {
      return <AnimationModel modelUrl={modelUrl} animationUrl={animationUrl} scale={scale} />;
    }

    if (halfBody) {
      return <HalfBodyModel modelUrl={modelUrl} scale={scale} />;
    }

    return <StaticModel modelUrl={modelUrl} scale={scale} />;
  }, [halfBody, animationUrl, modelUrl, scale]);

  return (
    <BaseCanvas background={backgroundColor} cameraPosition={new Vector3(0, 0, 3)} fov={50} style={style}>
      <Suspense fallback={null}>
        <Environment preset={environment} />
        <CameraLighting
          cameraTarget={cameraTarget}
          cameraInitialDistance={cameraInitialDistance}
          cameraZoomTarget={halfBody ? CAMERA.CONTROLS.HALF_BODY.ZOOM_TARGET : CAMERA.CONTROLS.FULL_BODY.ZOOM_TARGET}
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
          updateCameraTargetOnZoom={!halfBody}
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
