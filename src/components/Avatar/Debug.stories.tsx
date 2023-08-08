import { StoryFn } from '@storybook/react';
import { StatsGl } from '@react-three/drei';
import type { Meta } from '@storybook/react';
import React from 'react';
import { Vector3 } from 'three';
import { Avatar as AvatarWrapper } from './index';
import { getStoryAssetPath } from '../../services';
import { AvatarProps } from './Avatar.component';

const Avatar = (args: AvatarProps) => (
  <AvatarWrapper {...args}>
    <StatsGl />
  </AvatarWrapper>
);

const meta: Meta<typeof Avatar> = {
  component: Avatar
};

export default meta;

const Template: StoryFn<typeof Avatar> = (args) => <Avatar style={{ background: 'rgb(9,20,26)' }} {...args} />;
/* eslint-disable */
export const Debug: StoryFn<typeof Avatar> = Template.bind({});
Debug.args = {
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
  /* eslint-disable no-console */
  onLoaded: () => console.info('EVENT: static avatar loaded'),
  onLoading: () => console.info('EVENT: loading static avatar')
  /* eslint-enable no-console */
};
