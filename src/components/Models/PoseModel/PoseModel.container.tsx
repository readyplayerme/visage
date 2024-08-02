import React, { FC, Suspense } from 'react';
import { PoseModel, PoseModelProps } from './PoseModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const PoseModelContainer: FC<PoseModelProps> = (props) => (
    <Suspense>
      <PoseModel {...props} />
    </Suspense>
  );
