import React from 'react';
import { StoryFn } from '@storybook/react';
import { Sparkles as SparklesDrei, StatsGl } from '@react-three/drei';
import type { Meta } from '@storybook/react';
import { Avatar as AvatarWrapper, CAMERA } from 'src/components/Avatar';
import { getStoryAssetPath } from 'src/services';
import { ignoreArgTypesOnExamples, emotions, modelPresets, animationPresets } from 'src/services/Stories.service';
import { environmentModels, environmentPresets } from 'src/services/Environment.service';
import { EnvironmentModel as EnvironmentModelContainer } from 'src/components/Models';
import { FloorReflection, FloorReflectionProps } from 'src/components/FloorReflection';
import { AvatarProps } from './Avatar.component';
import { Static } from './Avatar.stories';
import { BloomConfiguration } from '../../types';

const Avatar = (args: AvatarProps) => <AvatarWrapper {...args} />;

const Sparkles: StoryFn<typeof SparklesDrei> = (args: any) => <SparklesDrei {...args} />;
const EnvironmentModel: StoryFn<typeof EnvironmentModelContainer> = (args: any) => (
  <EnvironmentModelContainer {...args} />
);
const meta: Meta<typeof Avatar> = {
  component: Avatar,
  // @ts-ignore
  subcomponents: { Sparkles, EnvironmentModel }
};

export default meta;

export const Bloom: StoryFn<BloomConfiguration> = (args: BloomConfiguration | undefined) => (
  <Avatar
    modelSrc={modelPresets.one}
    cameraTarget={CAMERA.TARGET.FULL_BODY.FEMALE}
    cameraInitialDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
    bloom={{ ...args }}
    ambientLightColor="#ffffff"
    dirLightColor="#ffffff"
    spotLightColor="#adbfe5"
    ambientLightIntensity={0}
    dirLightIntensity={2.2}
    spotLightIntensity={0.5}
    environment="apartment"
    background={{
      color: 'rgb(9,20,26)'
    }}
  />
);

Bloom.args = {
  luminanceThreshold: 1.0,
  luminanceSmoothing: 1.0,
  mipmapBlur: true,
  kernelSize: 1,
  intensity: 4,
  materialIntensity: 1
};

Bloom.argTypes = {
  luminanceThreshold: { control: { type: 'range', step: 0.01, min: 0, max: 1 } },
  luminanceSmoothing: { control: { type: 'range', step: 0.01, min: 0, max: 1 } },
  mipmapBlur: { control: { type: 'boolean' } },
  intensity: { control: { type: 'range', min: 0, max: 100 } },
  materialIntensity: { control: { type: 'range', step: 0.01, min: 0, max: 1 } },
  kernelSize: { control: { type: 'range', min: 0, max: 4 } },
  ...ignoreArgTypesOnExamples
};

export const FloatingSparkles: StoryFn<typeof SparklesDrei> = (args) => (
  <Avatar
    modelSrc={getStoryAssetPath('female.glb')}
    cameraTarget={CAMERA.TARGET.FULL_BODY.FEMALE}
    cameraInitialDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
  >
    <Sparkles {...args} />
  </Avatar>
);

FloatingSparkles.args = {
  count: 70,
  scale: 4,
  size: 5,
  speed: 0.25,
  opacity: 0.6,
  color: '#124cca'
};

FloatingSparkles.argTypes = {
  count: { control: { type: 'range', min: 0, max: 70 } },
  scale: { control: { type: 'number' } },
  size: { control: { type: 'range', min: 0, max: 10 } },
  speed: { control: { type: 'range', step: 0.01, min: 0, max: 20 } },
  opacity: { control: { type: 'range', step: 0.01, min: 0, max: 1.1 } },
  ...ignoreArgTypesOnExamples
};

export const SpawnEffectAndAnimation: StoryFn<typeof Avatar> = (args) => (
  <Avatar {...args}>
    <Sparkles color="white" count={50} opacity={0.9} scale={5} size={0.5} speed={0.35} />
  </Avatar>
);
SpawnEffectAndAnimation.args = {
  onLoadedEffect: {
    src: getStoryAssetPath('spawn-effect.glb'),
    loop: 12
  },
  onLoadedAnimation: {
    src: getStoryAssetPath('male-spawn-animation.fbx'),
    loop: 1
  },
  cameraTarget: CAMERA.TARGET.FULL_BODY.FEMALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  modelSrc: getStoryAssetPath('male-emissive.glb'),
  animationSrc: getStoryAssetPath('male-idle.glb'),
  background: { color: 'rgb(9,20,26)' }
};
SpawnEffectAndAnimation.argTypes = {
  ...ignoreArgTypesOnExamples,
  onLoadedEffect: { control: { disable: false } },
  onLoadedAnimation: { control: { disable: false } },
  modelSrc: { control: { disable: false } },
  animationSrc: { control: { disable: false } }
};

export const Posing: StoryFn<typeof Avatar> = (args) => <Avatar {...args} />;
Posing.args = {
  ...Static.args,
  modelSrc: getStoryAssetPath('male.glb'),
  poseSrc: getStoryAssetPath('male-pose-standing.glb'),
  cameraTarget: CAMERA.TARGET.FULL_BODY.MALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: posing avatar loaded'),
  onLoading: () => console.info('EVENT: loading posing avatar'),
  /* eslint-enable no-console */
  emotion: emotions.smile
};
Posing.argTypes = {
  headMovement: { control: false }
};

export const IdleBlinking: StoryFn<typeof Avatar> = (args) => <Avatar {...args} />;
IdleBlinking.args = {
  // @ts-ignore
  Comment: "Idle blinking works when avatar includes morph targets for 'ARKit' and 'Eyes Extra'.",
  ...Static.args,
  modelSrc: modelPresets.seven,
  animationSrc: animationPresets.three,
  cameraTarget: CAMERA.TARGET.FULL_BODY.MALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  headMovement: true,
  emotion: emotions.smile
};
IdleBlinking.argTypes = {
  ...ignoreArgTypesOnExamples,
  modelSrc: { options: Object.values({ seven: modelPresets.seven }), control: { type: 'select' } },
  animationSrc: { options: Object.values(animationPresets), control: { type: 'select' } }
};

// @ts-ignore
export const environmentModel: StoryFn<typeof Avatar> = (
  args: AvatarProps & { environmentModel: string; environmentScale: number }
) => (
  <Avatar {...args} effects={{ ambientOcclusion: true }}>
    <EnvironmentModel environment={args.environmentModel! as string} scale={args.environmentScale! as number} />
  </Avatar>
);
environmentModel.args = {
  environmentModel: 'spaceStation',
  ...Static.args,
  fov: 50,
  // @ts-ignore
  environmentScale: 1.0,
  shadows: true,
  modelSrc: modelPresets.one,
  animationSrc: animationPresets.one,
  environment: 'warehouse',
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: environment model loaded')
  /* eslint-enable no-console */
};
environmentModel.argTypes = {
  ...ignoreArgTypesOnExamples,
  onLoading: { table: { disable: true } },
  dirLightPosition: { table: { disable: true } },
  spotLightPosition: { table: { disable: true } },
  scale: { table: { disable: true } },
  // @ts-ignore
  environmentModel: { options: Object.keys(environmentModels), control: { type: 'select' } },
  fov: { control: { type: 'range', min: 30, max: 100, step: 1 } },
  // @ts-ignore
  environmentScale: { control: { type: 'range', min: 0.01, max: 10, step: 0.01 } },
  ambientLightIntensity: { control: { type: 'range', min: 0, max: 20, step: 0.1 } },
  dirLightIntensity: { control: { type: 'range', min: 0, max: 20, step: 0.1 } },
  spotLightIntensity: { control: { type: 'range', min: 0, max: 20, step: 0.1 } },
  environment: { options: Object.keys(environmentPresets), control: { type: 'select' } }
};
// @ts-ignore
export const ReflectiveFloor: StoryFn<typeof Avatar> = (
  args: AvatarProps & FloorReflectionProps & { debug: boolean }
) => (
  <Avatar {...args} effects={{ ambientOcclusion: true }} background={{ color: args?.color }}>
    <FloorReflection {...args} />
    {args?.debug && <StatsGl />}
  </Avatar>
);
ReflectiveFloor.args = {
  ...Static.args,
  fov: 50,
  // @ts-ignore
  shadows: false,
  modelSrc: modelPresets.one,
  animationSrc: animationPresets.three,
  environment: 'warehouse',
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: environment model loaded'),
  /* eslint-enable no-console */
  // @ts-ignore
  resolution: 512,
  mixBlur: 0.8,
  mixStrength: 80,
  metalness: 0.5,
  blur: [300, 200],
  mirror: 1,
  minDepthThreshold: 0.4,
  maxDepthThreshold: 1.4,
  depthScale: 1.2,
  depthToBlurRatioBias: 1,
  distortion: 0,
  mixContrast: 1,
  reflectorOffset: 0,
  roughness: 1,
  color: 'rgb(9,20,26)',
  debug: false
};

ReflectiveFloor.argTypes = {
  ...ignoreArgTypesOnExamples,
  // @ts-ignore
  fov: { control: { type: 'range', min: 30, max: 100, step: 1 } },
  // @ts-ignore
  environment: { options: Object.keys(environmentPresets), control: { type: 'select' } },
  // @ts-ignore
  resolution: { control: { type: 'range', min: 64, max: 2048, step: 64 } },
  mixBlur: { control: { type: 'range', min: 0, max: 10, step: 0.1 } },
  mixStrength: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  metalness: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  mirror: { control: { type: 'range', min: 0, max: 1, step: 1 } },
  minDepthThreshold: { control: { type: 'range', min: 0, max: 10, step: 0.01 } },
  maxDepthThreshold: { control: { type: 'range', min: 0, max: 10, step: 0.01 } },
  depthScale: { control: { type: 'range', min: 0, max: 20, step: 0.01 } },
  depthToBlurRatioBias: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  distortion: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  mixContrast: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  reflectorOffset: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  roughness: { control: { type: 'range', min: 0, max: 1, step: 0.01 } }
};
