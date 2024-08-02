import React, { FC, Suspense } from 'react';
import { FloatingModel, FloatingModelProps } from './FloatingModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const FloatingModelContainer: FC<FloatingModelProps> = (props) => (
    <Suspense>
      <FloatingModel {...props} />
    </Suspense>
  );
