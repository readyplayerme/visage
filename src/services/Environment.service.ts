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
  `https://files.readyplayer.me/visage/environment/${preset}.hdr`;

export const environmentModels = {
  spaceStation: 'https://files.readyplayer.me/visage/props/environment-space-station.glb',
  platformDark: 'https://files.readyplayer.me/visage/props/simple-platform-dark.glb',
  platformGreen: 'https://files.readyplayer.me/visage/props/simple-platform-green.glb',
  platformBlue: 'https://files.readyplayer.me/visage/props/simple-platform-blue.glb'
};

export type EnvironmentModels = keyof typeof environmentModels;
