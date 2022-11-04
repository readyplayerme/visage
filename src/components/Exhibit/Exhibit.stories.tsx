import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { getStoryAssetPath } from 'src/services';
import { FileDropper } from 'src/components/FileDropper/FileDropper.component';
import { Vector3 } from 'three';
import { Exhibit } from './Exhibit.component';

const Template: ComponentStory<typeof Exhibit> = (args) => <Exhibit {...args} />;
const DropTemplate: ComponentStory<typeof Exhibit> = (args) => (
  <FileDropper>
    <Exhibit {...args} />
  </FileDropper>
);

export const Default = Template.bind({});
Default.args = {
  backgroundColor: '#f0f0f0',
  modelSrc: getStoryAssetPath('headwear.glb'),
  scale: 3,
  environment: 'city',
  position: new Vector3(0, 0, 5)
};

/* eslint-disable */
export const _BinaryInput = DropTemplate.bind({});
_BinaryInput.args = {
  backgroundColor: '#f0f0f0',
  scale: 3,
  environment: 'city',
  position: new Vector3(0, 0, 5)
};
_BinaryInput.argTypes = {
  modelSrc: { control: false }
};
/* eslint-enable */

export default {
  title: 'Components/Exhibit',
  component: Exhibit,
  argTypes: {
    backgroundColor: { control: 'color' },
    scale: { control: { type: 'range', min: 0.01, max: 10, step: 0.01 } }
  }
} as ComponentMeta<typeof Exhibit>;
