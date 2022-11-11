import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { getStoryAssetPath } from 'src/services';
import { Vector3 } from 'three';
import { FileDropper } from 'src/components/FileDropper/FileDropper.component';
import { Avatar, CAMERA } from './Avatar.component';

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;
const DropTemplate: ComponentStory<typeof Avatar> = (args) => (
  <FileDropper>
    <Avatar {...args} />
  </FileDropper>
);

export const Static = Template.bind({});
Static.args = {
  backgroundColor: '#f0f0f0',
  modelSrc: getStoryAssetPath('female.glb'),
  scale: 1,
  environment: 'city',
  shadows: false,
  halfBody: false,
  idleRotation: false,
  ambientLightColor: '#fff5b6',
  ambientLightIntensity: 0.25,
  dirLightPosition: new Vector3(-3, 5, -5),
  dirLightColor: '#002aff',
  spotLightPosition: new Vector3(12, 10, 7.5),
  spotLightColor: '#fff5b6',
  spotLightAngle: 0.314,
  cameraTarget: CAMERA.TARGET.FULL_BODY,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: static avatar loaded'),
  onLoading: () => console.info('EVENT: loading static avatar')
  /* eslint-enable no-console */
};

export const Animated = Template.bind({});
Animated.args = {
  ...Static.args,
  modelSrc: getStoryAssetPath('male.glb'),
  animationSrc: getStoryAssetPath('male-idle.glb'),
  cameraTarget: CAMERA.TARGET.FULL_BODY,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: animated avatar loaded'),
  onLoading: () => console.info('EVENT: loading animated avatar')
  /* eslint-enable no-console */
};

export const HalfBody = Template.bind({});
HalfBody.args = {
  ...Static.args,
  modelSrc: getStoryAssetPath('half-body.glb'),
  halfBody: true,
  cameraTarget: CAMERA.TARGET.HALF_BODY,
  cameraInitialDistance: CAMERA.INITIAL_DISTANCE.HALF_BODY,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: half body avatar loaded'),
  onLoading: () => console.info('EVENT: loading half body avatar')
  /* eslint-enable no-console */
};

export const Posing = Template.bind({});
Posing.args = {
  ...Static.args,
  modelSrc: getStoryAssetPath('male.glb'),
  poseSrc: getStoryAssetPath('male-pose-standing.glb'),
  cameraTarget: CAMERA.TARGET.FULL_BODY,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: posing avatar loaded'),
  onLoading: () => console.info('EVENT: loading posing avatar')
  /* eslint-enable no-console */
};

/* eslint-disable */
export const _BinaryInput = DropTemplate.bind({});
_BinaryInput.args = {
  ...Static.args,
  modelSrc: '',
  cameraTarget: CAMERA.TARGET.FULL_BODY,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: binary file loaded'),
  onLoading: () => console.info('EVENT: loading avatar from binary file')
  /* eslint-enable no-console */
};
_BinaryInput.argTypes = {
  modelSrc: { control: false }
};
/* eslint-enable */

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
    cameraInitialDistance: { control: { type: 'range', min: 0, max: 2.5, step: 0.01 } },
    onLoaded: { control: false }
  }
} as ComponentMeta<typeof Avatar>;
