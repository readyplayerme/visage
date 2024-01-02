import React, { Suspense, FC, useMemo, CSSProperties, ReactNode, useEffect } from 'react';
import { Vector3 } from 'three';
import { CameraControls } from 'src/components/Scene/CameraControls.component';
import { Environment } from 'src/components/Scene/Environment.component';
import { BaseModelProps, EnvironmentProps, SpawnState, EffectConfiguration, LightingProps } from 'src/types';
import { BaseCanvas } from 'src/components/BaseCanvas';
import { AnimationModel, HalfBodyModel, StaticModel, PoseModel } from 'src/components/Models';
import { isValidFormat, triggerCallback } from 'src/services';
import { Dpr } from '@react-three/fiber';
import { EffectComposer, SSAO, Vignette } from '@react-three/postprocessing';
import { Provider, useSetAtom } from 'jotai';
import Capture, { CaptureType } from 'src/components/Capture/Capture.component';
import { Box, Background } from 'src/components/Background/Box/Box.component';
import { BackgroundColor } from 'src/components/Background';
import Shadow from 'src/components/Shadow/Shadow.component';
import Loader from 'src/components/Loader';
import Bloom from 'src/components/Bloom/Bloom.component';
import { BlendFunction } from 'postprocessing';
import Lights from 'src/components/Lights/Lights.component';
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
      MAX_DISTANCE: 3.2,
      ZOOM_TARGET: new Vector3(-0.11, 0, 3.2)
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
   * Note that background property can not be set via style prop, it will always be overridden to `transparent`.
   * Instead, use `background` prop for that purpose.
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
   * Allows adding a background image and background color to the scene.
   * Make sure that image is loadable to prevent bg errors.
   * background.src - Accepts URL string.
   * background.color - Accepts Hexadeximal, RGB, X11 color name, HSL string, doesn't support CSS gradients.
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
   * Spawn effect when model is loaded into scene.
   */
  onLoadedEffect?: SpawnState['onLoadedEffect'];
  /**
   * Spawn animation when model is loaded into scene.
   */
  onLoadedAnimation?: SpawnState['onLoadedAnimation'];
  /**
   * Field of view of the camera.
   */
  fov?: number;
  /**
   * Control some effects like post-processing effects
   */
  effects?: EffectConfiguration;
  /**
   * Use any three.js(fiber, post-processing) compatible components to render in the scene.
   */
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
  environment = 'soft',
  halfBody = false,
  shadows = false,
  scale = 1,
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
  onLoadedEffect,
  onLoadedAnimation,
  children,
  effects,
  keyLightIntensity,
  keyLightColor,
  fillLightIntensity,
  fillLightColor,
  fillLightPosition,
  backLightIntensity,
  backLightColor,
  backLightPosition,
  lightTarget,
  fov = 50
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
          emotion={emotion}
          modelSrc={modelSrc}
          animationSrc={animationSrc}
          scale={scale}
          idleRotation={idleRotation}
          onLoaded={onLoaded}
          headMovement={headMovement}
          bloom={effects?.bloom}
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
          bloom={effects?.bloom}
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
          bloom={effects?.bloom}
        />
      );
    }

    return (
      <StaticModel modelSrc={modelSrc} scale={scale} onLoaded={onLoaded} emotion={emotion} bloom={effects?.bloom} />
    );
  }, [halfBody, animationSrc, modelSrc, scale, poseSrc, idleRotation, emotion, onLoaded, headMovement, effects?.bloom]);

  useEffect(() => triggerCallback(onLoading), [modelSrc, animationSrc, onLoading]);

  return (
    <BaseCanvas position={new Vector3(0, 0, 3)} fov={fov} style={style} dpr={dpr} className={className}>
      <Environment environment={environment} />
      <CameraControls
        cameraTarget={cameraTarget}
        cameraInitialDistance={cameraInitialDistance}
        cameraZoomTarget={cameraZoomTarget}
        controlsMinDistance={halfBody ? CAMERA.CONTROLS.HALF_BODY.MIN_DISTANCE : CAMERA.CONTROLS.FULL_BODY.MIN_DISTANCE}
        controlsMaxDistance={halfBody ? CAMERA.CONTROLS.HALF_BODY.MAX_DISTANCE : CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
        updateCameraTargetOnZoom={!halfBody}
      />
      {AvatarModel}
      {children}
      {shadows && <Shadow />}
      {background?.src && <Box {...background} />}
      {capture && <Capture {...capture} />}
      {background?.color && <BackgroundColor color={background.color} />}
      {(effects?.ambientOcclusion || effects?.bloom || effects?.vignette) && (
        <EffectComposer autoClear multisampling={4}>
          <>
            {effects?.ambientOcclusion && (
              <SSAO
                blendFunction={BlendFunction.MULTIPLY}
                distanceScaling={false}
                radius={0.08}
                bias={0.01}
                intensity={3}
                samples={31}
                worldDistanceThreshold={24}
                worldDistanceFalloff={0}
                worldProximityThreshold={0}
                worldProximityFalloff={6}
                fade={0.02}
                rings={8}
              />
            )}
            {effects?.bloom && (
              <Bloom
                luminanceThreshold={effects?.bloom?.luminanceThreshold}
                luminanceSmoothing={effects?.bloom?.luminanceSmoothing}
                intensity={effects?.bloom?.intensity}
                kernelSize={effects?.bloom?.kernelSize}
                mipmapBlur={effects?.bloom?.mipmapBlur}
              />
            )}
            {effects?.vignette && <Vignette eskil={false} offset={0.5} darkness={0.5} />}
          </>
        </EffectComposer>
      )}
      <Lights
        keyLightIntensity={keyLightIntensity}
        keyLightColor={keyLightColor}
        fillLightIntensity={fillLightIntensity}
        fillLightColor={fillLightColor}
        fillLightPosition={fillLightPosition}
        backLightIntensity={backLightIntensity}
        backLightColor={backLightColor}
        backLightPosition={backLightPosition}
        lightTarget={lightTarget}
      />
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
