import React, { FC } from 'react';
import { Bloom as BloomPostProcessing } from '@react-three/postprocessing';

export type BloomConfiguration = {
  /**
   * The luminance threshold. Raise this value to mask out darker elements in the scene. Range is [0, 1].
   */
  luminanceThreshold?: number;
  /**
   * Controls the smoothness of the luminance threshold. Range is [0, 1].
   */
  luminanceSmoothing?: number;
  /**
   * Enables or disables mipmap blur.
   */
  mipmapBlur?: boolean;
  /**
   * The intensity of the bloom.
   */
  intensity?: number;
  /**
   * The kernel size of the blur. Values are 0, 1, 2, 3, 4.
   */
  kernelSize?: number;
};

const Bloom: FC<BloomConfiguration> = ({
  luminanceThreshold = 1,
  luminanceSmoothing = 1,
  mipmapBlur = true,
  intensity = 0.1,
  kernelSize = 0
}) => (
  <BloomPostProcessing
    luminanceThreshold={luminanceThreshold}
    luminanceSmoothing={luminanceSmoothing}
    mipmapBlur={mipmapBlur}
    intensity={intensity}
    kernelSize={kernelSize}
  />
);

export default Bloom;
