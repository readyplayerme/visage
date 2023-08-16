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
  animationSrc: getStoryAssetPath('male-idle.glb')
};
SpawnEffectAndAnimation.argTypes = {
  ...ignoreArgTypesOnExamples,
  onLoadedEffect: { control: { disable: false } },
  onLoadedAnimation: { control: { disable: false } },
  modelSrc: { control: { disable: false } },
  animationSrc: { control: { disable: false } }
};

/**
 * https://models.readyplayer.me/64d61e9e17883fd73ebe5eb7.glb
 * https://models.readyplayer.me/64d61f67f0367d07504924be.glb
 * https://models.readyplayer.me/64d62255f0367d0750492913.glb
 * https://models.readyplayer.me/64d622ce17883fd73ebe64cd.glb
 * https://models.readyplayer.me/64d6235e2d3bea6e4267b01d.glb
 * https://models.readyplayer.me/64d5d4eb651a0d350005c672.glb
 */

export const modelPresets = {
  one: 'https://models.readyplayer.me/64d61e9e17883fd73ebe5eb7.glb?morphTargets=Default,ARKit&lod=0',
  two: 'https://models.readyplayer.me/64d61f67f0367d07504924be.glb',
  three: 'https://models.readyplayer.me/64d62255f0367d0750492913.glb',
  four: 'https://models.readyplayer.me/64d622ce17883fd73ebe64cd.glb',
  five: 'https://models.readyplayer.me/64d6235e2d3bea6e4267b01d.glb',
  six: 'https://models.readyplayer.me/64d5d4eb651a0d350005c672.glb'
};
export const Showcase: StoryFn<typeof Avatar> = (args) => (
  <Avatar {...args}>
    <Sparkles color="white" count={50} opacity={0.9} scale={5} size={0.5} speed={0.35} />
  </Avatar>
);
Showcase.args = {
  onLoadedAnimation: {
    src: getStoryAssetPath('M_Standing_Idle_Variations_002.fbx'),
    loop: 1
  },
  cameraTarget: CAMERA.TARGET.FULL_BODY.FEMALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  modelSrc: 'https://models.readyplayer.me/64d61e9e17883fd73ebe5eb7.glb?morphTargets=Default,ARKit&lod=0',
  animationSrc: getStoryAssetPath('M_Standing_Idle_001.fbx'),
  bloom: {
    luminanceThreshold: 1.0,
    luminanceSmoothing: 1.0,
    mipmapBlur: true,
    kernelSize: 1,
    intensity: 1,
    materialIntensity: 6
  },
  style: { background: '#282038' },
  dpr: 2,
  ambientLightColor: '#ffffff',
  dirLightColor: '#ffffff',
  spotLightColor: '#adbfe5',
  ambientLightIntensity: 0,
  dirLightIntensity: 2.2,
  spotLightIntensity: 0.5,
  environment: 'apartment',
  shadows: true,
  emotion: {
    jawOpen: 0.1,
    mouthSmileLeft: 0.2,
    mouthSmileRight: 0.1,
    mouthPressLeft: 0.1,
    cheekSquintLeft: 0.3,
    eyeLookOutLeft: 0.6,
    eyeLookInRight: 0.6,
    mouthDimpleLeft: 0.3
  }
};
Showcase.argTypes = {
  onLoadedAnimation: { control: { disable: false } },
  animationSrc: { control: { disable: false } },
  modelSrc: { options: Object.values(modelPresets), control: { type: 'select' } }
};
