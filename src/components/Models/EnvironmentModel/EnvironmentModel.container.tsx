import React, { FC, Suspense, useState } from 'react';
import { EnvironmentModel, EnvironmentModelProps } from './EnvironmentModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const EnvironmentModelContainer: FC<EnvironmentModelProps> = (props) => {
  /* eslint-disable-next-line react/jsx-no-useless-fragment */
  const [fallback, setFallback] = useState<JSX.Element>(<></>);

  return (
    <Suspense fallback={fallback}>
      <EnvironmentModel setModelFallback={setFallback} {...props} />
    </Suspense>
  );
};
