import React, { Suspense, FC, useMemo, CSSProperties, ReactNode, useEffect } from 'react';
import { Vector3 } from 'three';
import { CameraLighting } from 'src/components/Scene/CameraLighting.component';
import { Environment } from 'src/components/Scene/Environment.component';
import { LightingProps, BaseModelProps, EnvironmentProps, BloomConfiguration, SpawnState } from 'src/types';
import { BaseCanvas } from 'src/components/BaseCanvas';
import { AnimationModel, HalfBodyModel, StaticModel, PoseModel } from 'src/components/Models';
import { isValidFormat, triggerCallback } from 'src/services';
import { Dpr } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Provider, useSetAtom } from 'jotai';
import Capture, { CaptureType } from 'src/components/Capture/Capture.component';
import { Box, Background } from 'src/components/Background/Box/Box.component';
import { BackgroundColor } from 'src/components/Background';
import Shadow from 'src/components/Shadow/Shadow.component';
import Loader from 'src/components/Loader';
import Bloom from 'src/components/Bloom/Bloom.component';
import { spawnState } from '../../state/spawnAtom';

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

export type Emotion = Record<string, number>;

export interface AvatarProps extends LightingProps, EnvironmentProps, Omit<BaseModelProps, 'setModelFallback'> {
  /**
   * Arbitrary binary data (base64 string, Blob) of a `.glb` file or path (URL) to a `.glb` resource.
   */
  modelSrc: string | Blob;
  /**
   * Arbitrary binary data (base64 string, Blob) of a `.glb|.fbx` file or path (URL) to a `.glb|.fbx` resource.
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
   * Apply styling to canvas DOM element.
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
   * Applies Box background in the scene with a provided image.
   * Make sure that image is loadable to prevent bg errors.
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
   * Spawn effect when model is loaded into scene.
   */
  onLoadedEffect?: SpawnState['onLoadedEffect'];
  /**
   * Spawn animation when model is loaded into scene.
   */
  onLoadedAnimation?: SpawnState['onLoadedAnimation'];

  children?: ReactNode;
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
  onLoadedEffect,
  onLoadedAnimation,
  children
}) => {
  const setSpawnState = useSetAtom(spawnState);

  useEffect(() => {
    setSpawnState({ onLoadedEffect, onLoadedAnimation });
  }, [onLoadedAnimation, onLoadedEffect, setSpawnState]);

  const AvatarModel = useMemo(() => {
    if (!isValidFormat(modelSrc)) {
      return null;
    }

    if (!!animationSrc && !halfBody && isValidFormat(animationSrc)) {
      return (
        <AnimationModel
          modelSrc={modelSrc}
          animationSrc={animationSrc}
          scale={scale}
          idleRotation={idleRotation}
          onLoaded={onLoaded}
          headMovement={headMovement}
          bloom={bloom}
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
          bloom={bloom}
        />
      );
    }

    if (isValidFormat(poseSrc)) {
      return (
        <PoseModel
          emotion={emotion}
          modelSrc={modelSrc}
          scale={scale}
          poseSrc={poseSrc!}
          onLoaded={onLoaded}
          bloom={bloom}
        />
      );
    }

    return <StaticModel modelSrc={modelSrc} scale={scale} onLoaded={onLoaded} emotion={emotion} bloom={bloom} />;
  }, [halfBody, animationSrc, modelSrc, scale, poseSrc, idleRotation, emotion, onLoaded, headMovement, bloom]);

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
      {children}
      {shadows && <Shadow />}
      {background?.src && <Box {...background} />}
      {capture && <Capture {...capture} />}
      {style?.background && <BackgroundColor color={style.background as string} />}
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
