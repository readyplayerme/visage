import React, { FC } from 'react';

import './Loader.scss';

export type LoaderType = {
  color?: string;
  text?: string;
};

const Loader: FC<LoaderType> = ({ text, color }) => (
  <div className="loader">
    {text && (
      <p className="text" style={{ color }}>
        {text}
      </p>
    )}
    <div className="dots">
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
    </div>
  </div>
);

export { Loader };
