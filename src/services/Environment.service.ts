export const environmentPresets = {
  hub: 'hub',
  sunset: 'sunset',
  dawn: 'dawn',
  night: 'night',
  warehouse: 'warehouse',
  forest: 'forest',
  apartment: 'apartment',
  studio: 'studio',
  city: 'city',
  park: 'park',
  lobby: 'lobby',
  soft: 'soft'
};
export type EnvironmentPresets = keyof typeof environmentPresets;

export const getPresetEnvironmentMap = (preset: EnvironmentPresets) =>
  `https://readyplayerme-assets.s3.amazonaws.com/environment/${preset}.hdr`;

export const environmentModels = {
  spaceStation: 'https://readyplayerme-assets.s3.amazonaws.com/props/environment-space-station.glb',
  platformDark: 'https://readyplayerme-assets.s3.amazonaws.com/props/simple-platform-dark.glb',
  platformGreen: 'https://readyplayerme-assets.s3.amazonaws.com/props/simple-platform-green.glb',
  platformBlue: 'https://readyplayerme-assets.s3.amazonaws.com/props/simple-platform-blue.glb'
};

export type EnvironmentModels = keyof typeof environmentModels;
