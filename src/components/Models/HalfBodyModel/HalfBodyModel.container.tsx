import React, { FC, Suspense } from 'react';
import { HalfBodyModel, HalfBodyModelProps } from './HalfBodyModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const HalfBodyModelContainer: FC<HalfBodyModelProps> = (props) => (
    <Suspense>
      <HalfBodyModel {...props} />
    </Suspense>
  );
