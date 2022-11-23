import React, { FC, Suspense, useEffect, useState } from 'react';
import { triggerCallback } from 'src/services';
import { FloatingModel, FloatingModelProps } from './FloatingModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const FloatingModelContainer: FC<FloatingModelProps> = (props) => {
  /* eslint-disable-next-line react/jsx-no-useless-fragment */
  const [fallback, setFallback] = useState<JSX.Element>(<></>);
  useEffect(() => triggerCallback(props.onLoading), [props.modelSrc, props.onLoading]);

  return (
    <Suspense fallback={fallback}>
      <FloatingModel {...props} setModelFallback={setFallback} />
    </Suspense>
  );
};
