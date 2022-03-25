module.exports = {
  staticDirs: ['../public'],
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/preset-create-react-app'],
  typescript: {
    check: true
  },
  framework: '@storybook/react',
  core: {
    builder: 'webpack5'
  }
};
