import React from 'react';
import { StoryFn } from '@storybook/react';
import { getStoryAssetPath } from 'src/services';
import { Vector3 } from 'three';
import { FileDropper } from 'src/components/FileDropper/FileDropper.component';
import { environmentPresets } from 'src/services/EnvironmentMap.service';
import { Avatar as AvatarWrapper, CAMERA } from './index';
import { AvatarProps } from './Avatar.component';

const Avatar = (args: AvatarProps) => <AvatarWrapper {...args}>{args.children}</AvatarWrapper>;

const emotions = {
  smile: {
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.2,
    mouthSmileLeft: 0.37,
    mouthSmileRight: 0.36,
    mouthShrugUpper: 0.27,
    browInnerUp: 0.3,
    browOuterUpLeft: 0.37,
    browOuterUpRight: 0.49
  }
};
const Template: StoryFn<typeof Avatar> = (args) => <Avatar {...args} />;
const DropTemplate: StoryFn<typeof Avatar> = (args) => (
  <FileDropper>
    <Avatar {...args} />
  </FileDropper>
);

export const Static: StoryFn<typeof Avatar> = Template.bind({});
Static.args = {
  modelSrc: getStoryAssetPath('female.glb'),
  animationSrc: undefined,
  poseSrc: undefined,
  environment: 'hub',
  scale: 1,
  shadows: true,
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
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  cameraTarget: CAMERA.TARGET.FULL_BODY.FEMALE,
  bloom: {
    luminanceThreshold: 1.0,
    luminanceSmoothing: 1.0,
    mipmapBlur: true,
    kernelSize: 1,
    intensity: 0.1,
    materialIntensity: 3.3
  },
  emotion: emotions.smile,
  style: { background: 'rgb(9,20,26)' },
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: static avatar loaded'),
  onLoading: () => console.info('EVENT: loading static avatar')
  /* eslint-enable no-console */
};
Static.argTypes = {
  headMovement: { control: false },
  halfBody: { control: false },
  animationSrc: { control: false },
  poseSrc: { control: false }
};

export const Animated: StoryFn<typeof Avatar> = Template.bind({});
Animated.args = {
  ...Static.args,
  emotion: undefined,
  modelSrc: getStoryAssetPath('male-emissive.glb'),
  animationSrc: getStoryAssetPath('male-idle.glb'),
  cameraTarget: CAMERA.TARGET.FULL_BODY.MALE,
  cameraInitialDistance: CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE,
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: animated avatar loaded'),
  onLoading: () => console.info('EVENT: loading animated avatar')
  /* eslint-enable no-console */
};
Animated.argTypes = {
  poseSrc: { control: false },
  emotion: { control: false }
};

export const HalfBody: StoryFn<typeof Avatar> = Template.bind({});
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

export const Posing: StoryFn<typeof Avatar> = Template.bind({});
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

/* eslint-disable */
export const _DragNDrop: StoryFn<typeof Avatar> = DropTemplate.bind({});
_DragNDrop.args = {
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
_DragNDrop.argTypes = {
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
    environment: { options: Object.keys(environmentPresets), control: { type: 'select' } }
  }
};
