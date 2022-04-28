import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { getStoryAssetPath } from 'src/helpers';
import { Exhibit } from './Exhibit.component';

const Template: ComponentStory<typeof Exhibit> = (args) => <Exhibit {...args} />;

export const Default = Template.bind({});
Default.args = {
  backgroundColor: '#f0f0f0',
  modelUrl: getStoryAssetPath('headwear.glb'),
  scale: 3,
  environment: 'city'
};

export default {
  title: 'Components/Exhibit',
  component: Exhibit,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Exhibit>;
