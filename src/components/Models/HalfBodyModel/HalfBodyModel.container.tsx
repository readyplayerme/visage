import React, { FC, Suspense, useEffect, useState } from 'react';
import { triggerCallback } from 'src/services';
import { HalfBodyModel, HalfBodyModelProps } from './HalfBodyModel.component';

/**
 * Contains model to handle suspense fallback.
 */
export const HalfBodyModelContainer: FC<HalfBodyModelProps> = (props) => {
  /* eslint-disable-next-line react/jsx-no-useless-fragment */
  const [fallback, setFallback] = useState<JSX.Element>(<></>);
  useEffect(() => triggerCallback(props.onLoading), [props.modelSrc, props.onLoading]);

  return (
    <Suspense fallback={fallback}>
      <HalfBodyModel {...props} setModelFallback={setFallback} />
    </Suspense>
  );
};
