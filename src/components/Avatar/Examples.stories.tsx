import { StoryFn } from '@storybook/react';
import { Sparkles as SparklesDrei } from '@react-three/drei';
import type { Meta } from '@storybook/react';
import React from 'react';
import { Avatar as AvatarWrapper, CAMERA } from 'src/components/Avatar';
import { getStoryAssetPath } from '../../services';
import { AvatarProps } from './Avatar.component';

const Avatar = (args: AvatarProps) => <AvatarWrapper {...args} />;
// @ts-ignore
const Sparkles: FC<typeof SparklesDrei> = (args) => <SparklesDrei {...args} />;
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

const Template: StoryFn<typeof Avatar> = (args) => <Avatar {...args} />;

export const Sparkless: StoryFn<typeof SparklesDrei> = (args) => (
  <Avatar
    modelSrc="/female.glb"
    style={{ background: '#000' }}
    cameraTarget={CAMERA.TARGET.FULL_BODY.FEMALE}
    cameraInitialDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
  >
    <Sparkles {...args} />
  </Avatar>
);

Sparkless.args = {
  count: 70,
  scale: 4,
  size: 3,
  speed: 1.0,
  opacity: 0.5,
  color: '#ccff00'
};

Sparkless.argTypes = {
  count: { control: { type: 'range', min: 0, max: 70 } },
  scale: { control: { type: 'number' } },
  size: { control: { type: 'range', min: 0, max: 10 } },
  speed: { control: { type: 'range', step: 0.01, min: 0, max: 20 } },
  opacity: { control: { type: 'range', step: 0.01, min: 0, max: 1.1 } },
  ...ignoreArgTypesOnExamples
};

/* eslint-disable */
export const SpawnEffectAndAnimation: StoryFn<typeof Avatar> = Template.bind({});
SpawnEffectAndAnimation.args = {
  onLoadedEffect: {
    src: '/spawn-effect.glb',
    loop: 13
  },
  onLoadedAnimation: {
    src: '/female-animation-chicken.glb',
    loop: 1
  },
  cameraTarget: CAMERA.TARGET.FULL_BODY.FEMALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  modelSrc: getStoryAssetPath('male.glb'),
  animationSrc: getStoryAssetPath('male-idle.glb')
};
