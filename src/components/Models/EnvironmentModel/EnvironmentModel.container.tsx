import React, { FC, Suspense, useState } from 'react';
import { EnvironmentModel, EnvironmentModelProps } from './EnvironmentModel.component';
import { EnvironmentModels, environmentModels } from 'src/services/Environment.service';

/**
 * Contains model to handle suspense fallback.
 */
export const EnvironmentModelContainer: FC<EnvironmentModelProps> = (props) => {
  /* eslint-disable-next-line react/jsx-no-useless-fragment */
  const [fallback, setFallback] = useState<JSX.Element>(<></>);
  const { environment } = props;
  const isStaticPreset = environment in environmentModels;
  const environmentSrc = isStaticPreset ? environmentModels[environment as EnvironmentModels] : environment;

  return (
    <Suspense fallback={fallback}>
      <EnvironmentModel setModelFallback={setFallback} {...props} environment={environmentSrc} />
    </Suspense>
  );
};
