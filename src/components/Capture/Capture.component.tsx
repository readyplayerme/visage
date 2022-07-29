import React, { useEffect, FC } from "react";
import { useThree } from "@react-three/fiber";

type CaptureProps = {
  capture?: boolean;
}

const Capture: FC<CaptureProps> = ({ capture }) => {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    if (capture) {
      const link = document?.createElement('a')
      link.setAttribute('download', 'canvas.png')
      link.setAttribute('href', gl.domElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
      link.click();
    }
  }, [gl, capture]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export default Capture;
