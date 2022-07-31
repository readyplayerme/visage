import React, { FC } from 'react';
import { useThree } from '@react-three/fiber';

export type CaptureType = (image?: string) => void;

type CaptureProps = {
  onCapture?: CaptureType;
};

const Capture: FC<CaptureProps> = ({ onCapture }) => {
  const gl = useThree((state) => state.gl);

  if (onCapture) {
    onCapture(gl.domElement.toDataURL('image/png', 0.1));
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export default Capture;
