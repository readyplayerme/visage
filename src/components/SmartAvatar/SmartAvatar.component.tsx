import React, { FC, useMemo } from 'react';
import { useDeviceDetector, DeviceDetectorHookProps } from 'src/hooks/useDeviceDetector/use-device-detector.hook';
import qs from 'qs';
import { Avatar, AvatarProps } from '../Avatar';

export interface SmartAvatarProps extends AvatarProps, DeviceDetectorHookProps {}

/**
 * Detects the device performance and adjusts the avatar props accordingly
 */

const SmartAvatar: FC<SmartAvatarProps> = (props) => {
  const deviceDetector = useDeviceDetector(props);

  const updatedProps: AvatarProps = useMemo(() => {
    if (props.modelSrc instanceof Blob) {
      return props;
    }
    const [modelUrl, originalQueryParams] = props.modelSrc.split('?');

    const queryStringParams = {
      ...qs.parse(originalQueryParams),
      ...qs.parse(deviceDetector?.toQueryString() || '')
    };

    return {
      ...props,
      modelSrc: `${modelUrl}?${qs.stringify(queryStringParams)}`
    };
  }, [props, deviceDetector]);

  return <Avatar {...updatedProps} />;
};

export default SmartAvatar;
