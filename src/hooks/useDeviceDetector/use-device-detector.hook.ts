import { useEffect, useState } from 'react';
import { getGPUTier, TierResult } from 'detect-gpu';
import { stringify } from 'qs';

type TierPresets = { [key: number]: Record<string, any> };

const TIER_PRESETS: TierPresets = {
  1: {
    quality: 'low'
  },
  2: {
    quality: 'medium'
  },
  3: {
    quality: 'high'
  }
};

type DeviceDetectorServiceProps = {
  gpuTierResult: TierResult;
  tierPresets?: TierPresets;
};

class DeviceDetectorService {
  private tierPresets: TierPresets = TIER_PRESETS;

  private gpuTierResult: TierResult;

  constructor(props: DeviceDetectorServiceProps) {
    this.gpuTierResult = props.gpuTierResult;
    if (props.tierPresets) {
      this.tierPresets = props.tierPresets;
    }
  }

  toQueryString() {
    return stringify(this.tierPresets[this.gpuTierResult.tier]);
  }
}

export type DeviceDetectorHookProps = {
  tierPresets?: TierPresets;
};

export function useDeviceDetector(options?: DeviceDetectorHookProps) {
  const [deviceDetector, setDeviceDetector] = useState<DeviceDetectorService>();

  useEffect(() => {
    const fetchDeviceDetector = async () => {
      const gpuTierResult = await getGPUTier();

      if (gpuTierResult.type !== 'BENCHMARK') {
        gpuTierResult.tier = 3;
      }

      setDeviceDetector(new DeviceDetectorService({ gpuTierResult, ...options }));
    };
    fetchDeviceDetector();
  }, []);

  return deviceDetector;
}
