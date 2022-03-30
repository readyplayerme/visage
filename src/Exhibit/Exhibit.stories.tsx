import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Exhibit } from './Exhibit.component';

const Template: ComponentStory<typeof Exhibit> = (args) => <Exhibit {...args} />;

export const Default = Template.bind({});
Default.args = {
  backgroundColor: '#fffffff',
  glbUrl: `${process.env.NODE_ENV === 'production' ? '/visage' : ''}/headwear.glb`,
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
