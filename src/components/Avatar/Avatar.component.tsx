import React, { Suspense, FC, useMemo, CSSProperties } from 'react';
import { Environment } from '@react-three/drei';
import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { Vector3 } from 'three';
import { CameraLighting } from 'src/components/SceneControls/CameraLighting.component';
import { AnimationModel } from 'src/components/Models/AnimationModel/AnimationModel.component';
import { LightingProps } from 'src/types';
import { BaseCanvas } from 'src/components/BaseCanvas';
import { HalfBodyModel, StaticModel, PoseModel } from 'src/components/Models';
import { isValidGlbUrl } from 'src/services';
import Capture, { CaptureType } from '../Capture/Capture.component';
import Box, { Background } from '../Background/Box/Box.component';
import Shadow from '../Shadow/Shadow.components';

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

export type Emotion = Record<string, number>;

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
   * Path to `.glb` file which will be used to map Bone placements onto the underlying 3D model.
   * Applied when not specifying an animation.
   */
  poseUrl?: string;
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
  /**
   * Applies an idle rotation to the animated and half-body models.
   */
  idleRotation?: boolean;
  /**
   * Applies a face emotion of the model.
   */
  emotion?: Emotion;
  /**
   * Applies Box background for canvas, make sure that image is loadable to prevent bg errors.
   */
  background?: Background;
  /**
   * Return base64 image after making screenshot of the canvas.
   */
  capture?: CaptureType;
}

/**
 * Interactive avatar presentation with zooming and horizontal rotation controls.
 * Optimised for full-body and half-body avatars.
 */
export const Avatar: FC<AvatarProps> = ({
  modelUrl,
  animationUrl = undefined,
  poseUrl = undefined,
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
  style,
  emotion,
  idleRotation = false,
  capture,
  background
}) => {
  const AvatarModel = useMemo(() => {
    if (!isValidGlbUrl(modelUrl)) {
      return null;
    }

    if (!!animationUrl && !halfBody && isValidGlbUrl(animationUrl)) {
      return (
        <AnimationModel modelUrl={modelUrl} animationUrl={animationUrl} scale={scale} idleRotation={idleRotation} />
      );
    }

    if (halfBody) {
      return <HalfBodyModel emotion={emotion} modelUrl={modelUrl} scale={scale} idleRotation={idleRotation} />;
    }

    if (isValidGlbUrl(poseUrl)) {
      return <PoseModel emotion={emotion} modelUrl={modelUrl} scale={scale} poseUrl={poseUrl!} />;
    }

    return <StaticModel modelUrl={modelUrl} scale={scale} />;
  }, [halfBody, animationUrl, modelUrl, scale, poseUrl, idleRotation, emotion]);

  return (
    <BaseCanvas background={backgroundColor} position={new Vector3(0, 0, 3)} fov={50} style={style}>
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
        {shadows && <Shadow />}
        {background?.src && <Box {...background} />}
        {capture && <Capture {...capture} />}
      </Suspense>
    </BaseCanvas>
  );
};
