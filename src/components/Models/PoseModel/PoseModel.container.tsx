import React, { FC, Suspense, useEffect, useState } from 'react';
import { triggerCallback } from 'src/services';
import { PoseModel, PoseModelProps } from './PoseModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const PoseModelContainer: FC<PoseModelProps> = (props) => {
  /* eslint-disable-next-line react/jsx-no-useless-fragment */
  const [fallback, setFallback] = useState<JSX.Element>(<></>);
  useEffect(() => triggerCallback(props.onLoading), [props.modelSrc, props.poseSrc, props.onLoading]);

  return (
    <Suspense fallback={fallback}>
      <PoseModel {...props} setModelFallback={setFallback} />
    </Suspense>
  );
};
