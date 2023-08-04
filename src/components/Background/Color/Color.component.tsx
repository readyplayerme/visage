import React, { FC } from 'react';

export type BackgroundColorProps = {
  /**
   * CSS-style string. For example: '#000' or 'red'.
   */
  color: string;
};

export const BackgroundColor: FC<BackgroundColorProps> = ({ color }) => <color attach="background" args={[color]} />;
