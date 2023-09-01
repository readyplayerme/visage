import React from 'react';
import { StoryFn } from '@storybook/react';
import { Sparkles as SparklesDrei } from '@react-three/drei';
import type { Meta } from '@storybook/react';
import { Avatar as AvatarWrapper, CAMERA } from 'src/components/Avatar';
import { getStoryAssetPath } from 'src/services';
import { ignoreArgTypesOnExamples, emotions, modelPresets, animationPresets } from 'src/services/Stories.service';
import { environmentModels, environmentPresets } from 'src/services/Environment.service';
import { EnvironmentModel as EnvironmentModelContainer } from 'src/components/Models';
import { AvatarProps } from './Avatar.component';
import { Static } from './Avatar.stories';

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
  style: { background: 'rgb(9,20,26)' }
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
