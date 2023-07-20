import React, { FC } from 'react';
import { Bloom as BloomPostProcessing } from '@react-three/postprocessing';

export type BloomTypes = {
  luminanceThreshold?: number;
  luminanceSmoothing?: number;
  mipmapBlur?: boolean;
};

const Bloom: FC<BloomTypes> = ({ luminanceThreshold = 0.8, luminanceSmoothing = 0.05, mipmapBlur = false }) => (
  <BloomPostProcessing
    luminanceThreshold={luminanceThreshold}
    luminanceSmoothing={luminanceSmoothing}
    mipmapBlur={mipmapBlur}
  />
);

export default Bloom;
