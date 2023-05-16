import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { getStoryAssetPath } from 'src/services';
import { FileDropper } from 'src/components/FileDropper/FileDropper.component';
import { Vector3 } from 'three';
import { Exhibit } from './Exhibit.component';
import { allowedPresets } from '../Scene/Environment.component';

const Template: ComponentStory<typeof Exhibit> = (args) => <Exhibit {...args} />;
const DropTemplate: ComponentStory<typeof Exhibit> = (args) => (
  <FileDropper placeholder="Drag n' Drop a .glb model here">
    <Exhibit {...args} />
  </FileDropper>
);

export const Default = Template.bind({});
Default.args = {
  modelSrc: getStoryAssetPath('headwear.glb'),
  scale: 3,
  environment: 'city',
  position: new Vector3(0, 1, 5),
  fit: true,
  float: true,
  shadows: true
};
Default.argTypes = {
  environment: { options: Object.keys(allowedPresets), control: { type: 'select' } }
};

/* eslint-disable */
export const _DragNDrop = DropTemplate.bind({});
_DragNDrop.args = {
  scale: 3,
  environment: 'city',
  position: new Vector3(0, 0, 5),
  fit: true,
  float: true,
  shadows: true
};
_DragNDrop.argTypes = {
  modelSrc: { control: false }
};
/* eslint-enable */

export default {
  title: 'Components/Exhibit',
  component: Exhibit,
  argTypes: {
    scale: { control: { type: 'range', min: 0.01, max: 10, step: 0.01 } }
  }
} as ComponentMeta<typeof Exhibit>;
