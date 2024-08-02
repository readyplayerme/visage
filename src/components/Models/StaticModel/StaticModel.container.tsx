import React, { FC } from 'react';
import { StaticModel, StaticModelProps } from './StaticModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const StaticModelContainer: FC<StaticModelProps> = (props) => (
      <StaticModel {...props} />
  );
