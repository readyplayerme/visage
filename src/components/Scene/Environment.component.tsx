import React, { FC, useMemo } from 'react';
import { Environment as DreiEnvironment } from '@react-three/drei';
import { PresetsType } from '@react-three/drei/helpers/environment-assets';

const allowedPresets = {
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

export interface EnvironmentProps {
  environment: string;
}

export const Environment: FC<EnvironmentProps> = ({ environment }) => {
  const config = useMemo<{ preset: PresetsType | undefined; files: string | undefined }>(() => {
    const isStaticPreset = environment in allowedPresets;
    const preset = isStaticPreset ? (environment as PresetsType) : undefined;
    const files = isStaticPreset ? undefined : environment;

    return {
      preset,
      files
    };
  }, [environment]);

  return <DreiEnvironment preset={config.preset} files={config.files} />;
};
