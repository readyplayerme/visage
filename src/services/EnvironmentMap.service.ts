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
  lobby: 'lobby'
};
export type EnvironmentPresets = keyof typeof environmentPresets;

export const getPresetEnvironmentMap = (preset: EnvironmentPresets) =>
  `https://readyplayerme-assets.s3.amazonaws.com/environment/${preset}.hdr`;
