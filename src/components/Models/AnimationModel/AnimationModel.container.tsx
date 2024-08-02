import React, { FC } from 'react';
import { AnimationModel, AnimationModelProps } from './AnimationModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const AnimationModelContainer: FC<AnimationModelProps> = (props) => (    
      <AnimationModel {...props} />
  );
