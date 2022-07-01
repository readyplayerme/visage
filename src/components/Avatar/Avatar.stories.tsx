import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { getStoryAssetPath } from 'src/services';
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
  cameraSpotLightPosition: new Vector3(12, 10, 7.5),
  cameraSpotLightColor: '#fff5b6',
  cameraSpotLightAngle: 0.314,
  cameraSpotLightDistance: 10,
  cameraTarget: CAMERA.TARGET.FULL_BODY,
  cameraInitialDistance: CAMERA.INITIAL_DISTANCE.FULL_BODY,
  controlsMaxDistance: 2.5,
  spotLight1Position: new Vector3(0, 5, 0),
  spotLight1Color: '#ff0000',
  spotLight1Angle: 0.314,
  spotLight1Distance: 10,
  showSpotLight1: true
};

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    backgroundColor: { control: 'color' },
    ambientLightColor: { control: 'color' },
    dirLightColor: { control: 'color' },
    cameraSpotLightColor: { control: 'color' },
    ambientLightIntensity: { control: { type: 'range', min: 0, max: 10, step: 0.1 } },
    cameraSpotLightAngle: { control: { type: 'range', min: 0, max: 1.57, step: 0.001 } },
    cameraTarget: { control: { type: 'range', min: 0, max: 10, step: 0.01 } },
    scale: { control: { type: 'range', min: 0.01, max: 10, step: 0.01 } },
    cameraInitialDistance: { control: { type: 'range', min: 0, max: 1.4, step: 0.001 } },
    controlsMaxDistance: { control: { type: 'range', min: 2.5, max: 20.0, step: 0.01 } },
    spotLight1Color: { control: 'color' },
    spotLight1Angle: { control: { type: 'range', min: 0, max: 1.57, step: 0.001 } },
    spotLight1Distance: { control: { type: 'range', min: 0, max: 1000, step: 0.01 } },
    cameraSpotLightDistance: { control: { type: 'range', min: 0, max: 1000, step: 0.01 } }
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
