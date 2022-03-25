import { create } from '@storybook/theming';
import rpmLogo from './ReadyPlayerMe.png';

export default create({
  base: 'light',
  brandImage: rpmLogo,
  brandUlr: 'https://readyplayer.me',
  appBg: '#fafafa'
});
