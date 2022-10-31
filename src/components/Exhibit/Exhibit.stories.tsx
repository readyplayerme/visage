import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { getStoryAssetPath } from 'src/services';
import { Exhibit } from './Exhibit.component';

const Template: ComponentStory<typeof Exhibit> = (args) => <Exhibit {...args} />;

export const Default = Template.bind({});
Default.args = {
  backgroundColor: '#f0f0f0',
  modelSrc: getStoryAssetPath('headwear.glb'),
  scale: 3,
  environment: 'city'
};

export default {
  title: 'Components/Exhibit',
  component: Exhibit,
  argTypes: {
    backgroundColor: { control: 'color' },
    scale: { control: { type: 'range', min: 0.01, max: 10, step: 0.01 } }
  }
} as ComponentMeta<typeof Exhibit>;
