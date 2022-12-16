import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { getStoryAssetPath } from 'src/services';
import { Vector3 } from 'three';
import { FileDropper } from 'src/components/FileDropper/FileDropper.component';
import { allowedPresets } from 'src/components/Scene/Environment.component';
import { Avatar, CAMERA } from './Avatar.component';

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;
const DropTemplate: ComponentStory<typeof Avatar> = (args) => (
  <FileDropper>
    <Avatar {...args} />
  </FileDropper>
);

export const Static = Template.bind({});
Static.args = {
  modelSrc: getStoryAssetPath('female.glb'),
  animationSrc: undefined,
  poseSrc: undefined,
  environment: 'city',
  scale: 1,
  shadows: false,
  halfBody: false,
  idleRotation: false,
  headMovement: false,
  ambientLightColor: '#fff5b6',
  dirLightColor: '#002aff',
  spotLightColor: '#fff5b6',
  ambientLightIntensity: 0.25,
  dirLightIntensity: 5,
  spotLightIntensity: 1,
  dirLightPosition: new Vector3(-3, 5, -5),
  spotLightPosition: new Vector3(12, 10, 7.5),
  spotLightAngle: 0.314,
  cameraZoomTarget: CAMERA.CONTROLS.FULL_BODY.ZOOM_TARGET,
  cameraTarget: CAMERA.TARGET.FULL_BODY.FEMALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  style: { background: 'transparent' },
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: static avatar loaded'),
  onLoading: () => console.info('EVENT: loading static avatar')
  /* eslint-enable no-console */
};
Static.argTypes = {
  headMovement: { control: false },
  animationSrc: { control: false },
  poseSrc: { control: false }
};

export const Animated = Template.bind({});
Animated.args = {
  ...Static.args,
  modelSrc: getStoryAssetPath('male.glb'),
  animationSrc: getStoryAssetPath('male-idle.glb'),
  cameraTarget: CAMERA.TARGET.FULL_BODY.MALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: animated avatar loaded'),
  onLoading: () => console.info('EVENT: loading animated avatar')
  /* eslint-enable no-console */
};
Animated.argTypes = {
  poseSrc: { control: false }
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
  cameraTarget: CAMERA.TARGET.FULL_BODY.MALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: posing avatar loaded'),
  onLoading: () => console.info('EVENT: loading posing avatar')
  /* eslint-enable no-console */
};
Posing.argTypes = {
  headMovement: { control: false }
};

/* eslint-disable */
export const _BinaryInput = DropTemplate.bind({});
_BinaryInput.args = {
  ...Static.args,
  modelSrc: undefined,
  animationSrc: undefined,
  poseSrc: '',
  environment: 'city',
  cameraTarget: CAMERA.TARGET.FULL_BODY.FEMALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: binary file loaded'),
  onLoading: () => console.info('EVENT: loading avatar from binary file')
  /* eslint-enable no-console */
};
_BinaryInput.argTypes = {
  modelSrc: { control: false },
  animationSrc: { control: false },
  headMovement: { control: false },
  environment: { control: { type: 'text' } }
};
/* eslint-enable */

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    ambientLightColor: { control: 'color' },
    dirLightColor: { control: 'color' },
    spotLightColor: { control: 'color' },
    ambientLightIntensity: { control: { type: 'range', min: 0, max: 20, step: 0.1 } },
    dirLightIntensity: { control: { type: 'range', min: 0, max: 20, step: 0.1 } },
    spotLightIntensity: { control: { type: 'range', min: 0, max: 20, step: 0.1 } },
    spotLightAngle: { control: { type: 'range', min: 0, max: 10, step: 0.01 } },
    cameraTarget: { control: { type: 'range', min: 0, max: 10, step: 0.01 } },
    scale: { control: { type: 'range', min: 0.01, max: 10, step: 0.01 } },
    cameraInitialDistance: { control: { type: 'range', min: 0, max: 2.5, step: 0.01 } },
    onLoaded: { control: false },
    environment: { options: Object.keys(allowedPresets), control: { type: 'select' } }
  }
} as ComponentMeta<typeof Avatar>;
