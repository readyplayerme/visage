import React, { FC, ReactNode, useEffect, useState, cloneElement, useMemo, ReactElement } from 'react';
import { useBounds } from '@react-three/drei';
import { BaseModelProps } from 'src/types';

export interface BoundsModelContainerProps extends BaseModelProps {
  modelSrc: string | Blob;
  children?: ReactNode | ReactNode[];
  fit?: boolean;
}

export const BoundsModelContainer: FC<BoundsModelContainerProps> = ({ modelSrc, children, fit }) => {
  const bounds = useBounds();
  const [fallback, setFallback] = useState<JSX.Element>(<></>);

  const childModel = useMemo(
    () =>
      React.Children.map(children, (child) => cloneElement(child as ReactElement, { setModelFallback: setFallback })),
    [modelSrc, children]
  );

  useEffect(() => {
    if (fit) {
      bounds.refresh().clip().fit();
    }
  }, [modelSrc, fit, fallback]);

  return <>{childModel}</>;
};
