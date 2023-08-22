import React, { FC, useMemo } from 'react';
import { Environment as DreiEnvironment } from '@react-three/drei';
import { environmentPresets, getPresetEnvironmentMap, EnvironmentPresets } from 'src/services/Environment.service';

export interface EnvironmentProps {
  environment: string | EnvironmentPresets;
}

export const Environment: FC<EnvironmentProps> = ({ environment }) => {
  const config = useMemo<{ files: string }>(() => {
    const isStaticPreset = environment in environmentPresets;
    const files = isStaticPreset ? getPresetEnvironmentMap(environment as EnvironmentPresets) : environment;

    return {
      files
    };
  }, [environment]);

  return <DreiEnvironment files={config.files} />;
};
