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
  gpuTierResults: TierResult;
  tierPresets?: TierPresets;
};

class DeviceDetectorService {
  private tierPresets: TierPresets = TIER_PRESETS;

  private gpuTierResults: TierResult;

  constructor(props: DeviceDetectorServiceProps) {
    this.gpuTierResults = props.gpuTierResults;
    if (props.tierPresets) {
      this.tierPresets = props.tierPresets;
    }
  }

  toQueryString() {
    return stringify(this.tierPresets[this.gpuTierResults.tier]);
  }
}

export type DeviceDetectorHookProps = {
  tierPresets?: TierPresets;
};

export function useDeviceDetector(options?: DeviceDetectorHookProps) {
  const [deviceDetector, setDeviceDetector] = useState<DeviceDetectorService>();

  useEffect(() => {
    const fetchDeviceDetector = async () => {
      const gpuTier = await getGPUTier();

      if (gpuTier.type !== 'BENCHMARK') {
        gpuTier.tier = 3;
      }

      setDeviceDetector(new DeviceDetectorService({ gpuTierResults: gpuTier, tierPresets: options?.tierPresets }));
    };
    fetchDeviceDetector();
  }, []);

  return deviceDetector;
}
