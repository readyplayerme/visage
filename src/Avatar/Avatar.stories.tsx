import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { getStoryAssetPath } from 'src/helpers';
import { Vector3 } from 'three';
import { Avatar, CAMERA } from './Avatar.component';

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Static = Template.bind({});
Static.args = {
  backgroundColor: '#f0f0f0',
  modelUrl: getStoryAssetPath('female.glb'),
  scale: 1,
  environment: 'city',
  shadows: false,
  halfBody: false,
  ambientLightColor: '#fff5b6',
  ambientLightIntensity: 0.25,
  dirLightPosition: new Vector3(-3, 5, -5),
  dirLightColor: '#002aff',
  spotLightPosition: new Vector3(12, 10, 7.5),
  spotLightColor: '#fff5b6',
  spotLightAngle: 0.314,
  cameraTarget: CAMERA.TARGET.FULL_BODY,
  cameraInitialDistance: CAMERA.INITIAL_DISTANCE.FULL_BODY
};

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    backgroundColor: { control: 'color' },
    ambientLightColor: { control: 'color' },
    dirLightColor: { control: 'color' },
    spotLightColor: { control: 'color' },
    ambientLightIntensity: { control: { type: 'range', min: 0, max: 10, step: 0.1 } },
    spotLightAngle: { control: { type: 'range', min: 0, max: 10, step: 0.01 } },
    cameraTarget: { control: { type: 'range', min: 0, max: 10, step: 0.01 } },
    scale: { control: { type: 'range', min: 0.01, max: 10, step: 0.01 } },
    cameraInitialDistance: { control: { type: 'range', min: 0, max: 1.4, step: 0.01 } }
  }
} as ComponentMeta<typeof Avatar>;

export const Animated = Template.bind({});
Animated.args = {
  ...Static.args,
  modelUrl: getStoryAssetPath('male.glb'),
  animationUrl: getStoryAssetPath('maleIdle.glb'),
  cameraTarget: CAMERA.TARGET.FULL_BODY,
  cameraInitialDistance: CAMERA.INITIAL_DISTANCE.FULL_BODY
};

export const HalfBody = Template.bind({});
HalfBody.args = {
  ...Static.args,
  modelUrl: getStoryAssetPath('halfBody.glb'),
  halfBody: true,
  cameraTarget: CAMERA.TARGET.HALF_BODY,
  cameraInitialDistance: CAMERA.INITIAL_DISTANCE.HALF_BODY
};
