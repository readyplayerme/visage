import React, { FC, Suspense, useState, useEffect } from 'react';
import { triggerCallback } from 'src/services';
import { StaticModel, StaticModelProps } from './StaticModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const StaticModelContainer: FC<StaticModelProps> = (props) => {
  /* eslint-disable-next-line react/jsx-no-useless-fragment */
  const [fallback, setFallback] = useState<JSX.Element>(<></>);
  useEffect(() => triggerCallback(props.onLoading), [props.modelSrc, props.onLoading]);

  return (
    <Suspense fallback={fallback}>
      <StaticModel {...props} setModelFallback={setFallback} />
    </Suspense>
  );
};
