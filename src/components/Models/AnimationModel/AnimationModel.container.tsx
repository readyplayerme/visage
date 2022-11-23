import React, { FC, Suspense, useEffect, useState } from 'react';
import { triggerCallback } from 'src/services';
import { AnimationModel, AnimationModelProps } from './AnimationModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const AnimationModelContainer: FC<AnimationModelProps> = (props) => {
  /* eslint-disable-next-line react/jsx-no-useless-fragment */
  const [fallback, setFallback] = useState<JSX.Element>(<></>);
  useEffect(() => triggerCallback(props.onLoading), [props.modelSrc, props.animationSrc, props.onLoading]);

  return (
    <Suspense fallback={fallback}>
      <AnimationModel {...props} setModelFallback={setFallback} />
    </Suspense>
  );
};
