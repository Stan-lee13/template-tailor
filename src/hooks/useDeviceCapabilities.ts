import { useEffect, useState } from 'react';

export type DeviceCapabilities = {
  reducedMotion: boolean;
  coarsePointer: boolean;
  lowPower: boolean;
};

export function useDeviceCapabilities(): DeviceCapabilities {
  const [caps, setCaps] = useState<DeviceCapabilities>({
    reducedMotion: false,
    coarsePointer: false,
    lowPower: false,
  });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency || 8;
    const lowPower = (typeof memory === 'number' && memory <= 4) || cores <= 4;
    setCaps({ reducedMotion: reduced, coarsePointer: coarse, lowPower });
  }, []);

  return caps;
}
