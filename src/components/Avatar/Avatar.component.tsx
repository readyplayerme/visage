import React, { Suspense, FC, useMemo, CSSProperties, ReactNode } from 'react';
import { Environment } from '@react-three/drei';
import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { Vector3 } from 'three';
import { CameraLighting } from 'src/components/SceneControls/CameraLighting.component';
import { LightingProps, BaseModelProps } from 'src/types';
import { BaseCanvas } from 'src/components/BaseCanvas';
import { AnimationModel, HalfBodyModel, StaticModel, PoseModel } from 'src/components/Models';
import { isValidGlbFormat } from 'src/services';
import { Dpr } from '@react-three/fiber';
import Capture, { CaptureType } from '../Capture/Capture.component';
import Box, { Background } from '../Background/Box/Box.component';
import Shadow from '../Shadow/Shadow.components';
import Loader from '../Loader';

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

export interface AvatarProps extends LightingProps, Omit<BaseModelProps, 'setModelFallback'> {
  /**
   * Arbitrary binary data (base64 string, Blob) of a `.glb` file or path (URL) to a `.glb` resource.
   */
  modelSrc: string | Blob;
  /**
   * Arbitrary binary data (base64 string, Blob) of a `.glb` file or path (URL) to a `.glb` resource.
   * The animation will be run for the 3D model provided in `modelSrc`.
   */
  animationSrc?: string | Blob;
  /**
   * Arbitrary binary data (base64 string, Blob) or a path (URL) to `.glb` file which will be used to map Bone placements onto the underlying 3D model.
   * Applied when not specifying an animation.
   */
  poseSrc?: string | Blob;
  /**
   * Brightness, color hue, shadow contrast, reflection details change according to the selected environment.
   */
  environment?: PresetsType;
  /**
   * Adjusts camera and model for half-body avatars.
   * Enable only when using Ready Player Me half-body avatars.
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
   * Initial Z-axis distance from the object upon render.
   */
  cameraInitialDistance?: number;
  /**
   * Pass styling to canvas.
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
  /**
   * Pass custom fallback component.
   */
  loader?: ReactNode;
  /**
   * Device Pixel Ratio.
   */
  dpr?: Dpr;
  /**
   * Custom style classes for canvas.
   */
  className?: string;
}

/**
 * Interactive avatar presentation with zooming and horizontal rotation controls.
 * Optimised for full-body and half-body avatars.
 */
export const Avatar: FC<AvatarProps> = ({
  modelSrc,
  animationSrc = undefined,
  poseSrc = undefined,
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
  background,
  loader,
  onLoaded,
  onLoading,
  dpr,
  className
}) => {
  const AvatarModel = useMemo(() => {
    if (!isValidGlbFormat(modelSrc)) {
      return null;
    }

    if (!!animationSrc && !halfBody && isValidGlbFormat(animationSrc)) {
      return (
        <AnimationModel
          modelSrc={modelSrc}
          animationSrc={animationSrc}
          scale={scale}
          idleRotation={idleRotation}
          onLoaded={onLoaded}
          onLoading={onLoading}
        />
      );
    }

    if (halfBody) {
      return (
        <HalfBodyModel
          emotion={emotion}
          modelSrc={modelSrc}
          scale={scale}
          idleRotation={idleRotation}
          onLoaded={onLoaded}
          onLoading={onLoading}
        />
      );
    }

    if (isValidGlbFormat(poseSrc)) {
      return (
        <PoseModel
          emotion={emotion}
          modelSrc={modelSrc}
          scale={scale}
          poseSrc={poseSrc!}
          onLoaded={onLoaded}
          onLoading={onLoading}
        />
      );
    }

    return <StaticModel modelSrc={modelSrc} scale={scale} onLoaded={onLoaded} onLoading={onLoading} />;
  }, [halfBody, animationSrc, modelSrc, scale, poseSrc, idleRotation, emotion, onLoaded, onLoading]);

  return (
    <Suspense fallback={loader ?? <Loader />}>
      <BaseCanvas position={new Vector3(0, 0, 3)} fov={50} style={style} dpr={dpr} className={className}>
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
      </BaseCanvas>
    </Suspense>
  );
};
