import React, { Suspense, FC, useMemo, CSSProperties, ReactNode, useEffect } from 'react';
import { Vector3 } from 'three';
import { CameraLighting } from 'src/components/Scene/CameraLighting.component';
import { Environment } from 'src/components/Scene/Environment.component';
import { LightingProps, BaseModelProps, EnvironmentProps } from 'src/types';
import { BaseCanvas } from 'src/components/BaseCanvas';
import { AnimationModel, HalfBodyModel, StaticModel, PoseModel } from 'src/components/Models';
import { isValidGlbFormat, triggerCallback } from 'src/services';
import { Dpr } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { atom, Provider, useSetAtom } from 'jotai';
import Capture, { CaptureType } from 'src/components/Capture/Capture.component';
import Box, { Background } from 'src/components/Background/Box/Box.component';
import Shadow from 'src/components/Shadow/Shadow.component';
import Loader from 'src/components/Loader';
import Bloom, { BloomConfiguration } from 'src/components/Bloom/Bloom.component';

export const CAMERA = {
  TARGET: {
    FULL_BODY: {
      MALE: 1.65,
      FEMALE: 1.55
    },
    HALF_BODY: 0.6
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
      MIN_DISTANCE: 0.4,
      MAX_DISTANCE: 1.4,
      ZOOM_TARGET: new Vector3(-0.15, 0, 0.55)
    }
  }
};
export interface SpawnState {
  onMountEffect?: {
    src: string | null;
    animationSrc?: string | null;
    loop?: number | null;
  } | null;
  onMountAnimation?: {
    src: string | null;
    loop?: number | null;
  } | null;
}

const initialSpawnState: SpawnState = {
  onMountEffect: null,
  onMountAnimation: null
};

export const spawnState = atom(initialSpawnState);

export type Emotion = Record<string, number>;

export interface AvatarProps extends LightingProps, EnvironmentProps, Omit<BaseModelProps, 'setModelFallback'> {
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
  /**
   * Enable head tracking cursor movements.
   */
  headMovement?: boolean;
  /**
   * Initialise and update camera movement on Z-Axis.
   * Defaults to full-body zoom distance.
   */
  cameraZoomTarget?: Vector3;
  /**
   * Bloom post-processing effect.
   */
  bloom?: BloomConfiguration;
  /**
   * Spawn effect on mount.
   */
  onMountEffect?: SpawnState['onMountEffect'];
  /**
   * Spawn animation on mount.
   */
  onMountAnimation?: SpawnState['onMountAnimation'];
}

/**
 * Interactive avatar presentation with zooming and horizontal rotation controls.
 * Optimised for full-body and half-body avatars.
 */
const Avatar: FC<AvatarProps> = ({
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
  dirLightIntensity = 5,
  spotLightPosition = new Vector3(12, 10, 7.5),
  spotLightColor = '#fff5b6',
  spotLightAngle = 0.314,
  spotLightIntensity = 1,
  cameraTarget = CAMERA.TARGET.FULL_BODY.MALE,
  cameraInitialDistance = CAMERA.INITIAL_DISTANCE.FULL_BODY,
  style,
  emotion,
  idleRotation = false,
  capture,
  background,
  onLoaded,
  onLoading,
  dpr,
  className,
  headMovement = false,
  cameraZoomTarget = CAMERA.CONTROLS.FULL_BODY.ZOOM_TARGET,
  bloom,
  onMountEffect,
  onMountAnimation
}) => {
  const setSpawnState = useSetAtom(spawnState);

  useEffect(() => {
    setSpawnState({ onMountEffect, onMountAnimation });
  }, [onMountAnimation, onMountEffect, setSpawnState]);

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
          headMovement={headMovement}
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
          headMovement={headMovement}
        />
      );
    }

    if (isValidGlbFormat(poseSrc)) {
      return <PoseModel emotion={emotion} modelSrc={modelSrc} scale={scale} poseSrc={poseSrc!} onLoaded={onLoaded} />;
    }

    return <StaticModel modelSrc={modelSrc} scale={scale} onLoaded={onLoaded} emotion={emotion} />;
  }, [halfBody, animationSrc, modelSrc, scale, poseSrc, idleRotation, emotion, onLoaded, headMovement]);

  useEffect(() => triggerCallback(onLoading), [modelSrc, animationSrc, onLoading]);

  return (
    <BaseCanvas position={new Vector3(0, 0, 3)} fov={50} style={style} dpr={dpr} className={className}>
      <Environment environment={environment} />
      <CameraLighting
        cameraTarget={cameraTarget}
        cameraInitialDistance={cameraInitialDistance}
        cameraZoomTarget={cameraZoomTarget}
        ambientLightColor={ambientLightColor}
        ambientLightIntensity={ambientLightIntensity}
        dirLightPosition={dirLightPosition}
        dirLightColor={dirLightColor}
        dirLightIntensity={dirLightIntensity}
        spotLightPosition={spotLightPosition}
        spotLightColor={spotLightColor}
        spotLightAngle={spotLightAngle}
        spotLightIntensity={spotLightIntensity}
        controlsMinDistance={halfBody ? CAMERA.CONTROLS.HALF_BODY.MIN_DISTANCE : CAMERA.CONTROLS.FULL_BODY.MIN_DISTANCE}
        controlsMaxDistance={halfBody ? CAMERA.CONTROLS.HALF_BODY.MAX_DISTANCE : CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
        updateCameraTargetOnZoom={!halfBody}
      />
      {AvatarModel}
      {shadows && <Shadow />}
      {background?.src && <Box {...background} />}
      {capture && <Capture {...capture} />}
      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={bloom?.luminanceThreshold}
          luminanceSmoothing={bloom?.luminanceSmoothing}
          intensity={bloom?.intensity}
          kernelSize={bloom?.kernelSize}
          mipmapBlur={bloom?.mipmapBlur}
        />
      </EffectComposer>
    </BaseCanvas>
  );
};

const AvatarWrapper = (props: AvatarProps) => (
  <Suspense fallback={props.loader ?? <Loader />}>
    <Provider>
      <Avatar {...props} />
    </Provider>
  </Suspense>
);

export default AvatarWrapper;
