import React from 'react';
import { StoryFn } from '@storybook/react';
import { Sparkles as SparklesDrei } from '@react-three/drei';
import type { Meta } from '@storybook/react';
import { Avatar as AvatarWrapper, CAMERA } from 'src/components/Avatar';
import { getStoryAssetPath } from 'src/services';
import { AvatarProps } from './Avatar.component';

const Avatar = (args: AvatarProps) => <AvatarWrapper {...args} />;

const Sparkles: StoryFn<typeof SparklesDrei> = (args: any) => <SparklesDrei {...args} />;
const meta: Meta<typeof Avatar> = {
  component: Avatar,
  // @ts-ignore
  subcomponents: { Sparkles }
};

export default meta;

const disableTable = { table: { disable: true } };
const keysToIgnore = [
  'modelSrc',
  'animationSrc',
  'poseSrc',
  'halfBody',
  'shadows',
  'cameraTarget',
  'cameraInitialDistance',
  'style',
  'idleRotation',
  'emotion',
  'background',
  'capture',
  'loader',
  'dpr',
  'className',
  'headMovement',
  'cameraZoomTarget',
  'bloom',
  'onLoadedEffect',
  'onLoadedAnimation',
  'children'
];
const ignoreArgTypesOnExamples = keysToIgnore.reduce(
  (acc, key) => {
    acc[key] = disableTable;
    return acc;
  },
  {} as Record<string, typeof disableTable>
);

const Template: StoryFn<typeof Avatar> = (args) => <Avatar style={{ background: 'rgb(9,20,26)' }} {...args} />;

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

export const SpawnEffectAndAnimation: StoryFn<typeof Avatar> = Template.bind({});
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
  animationSrc: getStoryAssetPath('male-idle.glb')
};
SpawnEffectAndAnimation.argTypes = {
  ...ignoreArgTypesOnExamples,
  onLoadedEffect: { control: { disable: false } },
  onLoadedAnimation: { control: { disable: false } },
  modelSrc: { control: { disable: false } },
  animationSrc: { control: { disable: false } }
};
