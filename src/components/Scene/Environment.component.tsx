import React, { FC, useMemo } from 'react';
import { Environment as DreiEnvironment } from '@react-three/drei';
import { environmentPresets, getPresetEnvironmentMap, EnvironmentPresets } from 'src/services/Environment.service';
import { LinearEncoding } from '@react-three/drei/helpers/deprecated';

export interface EnvironmentProps {
  environment: string | EnvironmentPresets;
}
// prettier-ignore
export const Environment: FC<EnvironmentProps> = ({ environment }) => {
  const config = useMemo<{ files: string }>(() => {
    const isStaticPreset = environment in environmentPresets;
    const files = isStaticPreset ? getPresetEnvironmentMap(environment as EnvironmentPresets) : environment;

    return {
      files
    };
  }, [environment]);

  return <DreiEnvironment files={config.files} encoding={LinearEncoding} environmentIntensity={10}/>;
};
